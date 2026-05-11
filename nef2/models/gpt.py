import math
import random

from ..nn import Dropout, Embedding, LayerNorm, Linear, Module
from ..tensor import Tensor


class GPTConfig:
    def __init__(
        self,
        vocab_size,
        block_size=16,
        n_embd=32,
        n_layer=2,
        n_head=2,
        dropout=0.0,
    ):
        if n_embd % n_head != 0:
            raise ValueError("n_embd must be divisible by n_head")
        self.vocab_size = vocab_size
        self.block_size = block_size
        self.n_embd = n_embd
        self.n_layer = n_layer
        self.n_head = n_head
        self.dropout = dropout


class CausalSelfAttention(Module):
    def __init__(self, config):
        self.config = config
        self.q = Linear(config.n_embd, config.n_embd, bias=False)
        self.k = Linear(config.n_embd, config.n_embd, bias=False)
        self.v = Linear(config.n_embd, config.n_embd, bias=False)
        self.proj = Linear(config.n_embd, config.n_embd)
        self.dropout = Dropout(config.dropout)
        self.k_cache = None
        self.v_cache = None

    def forward(self, x, use_cache=False):
        bsz, seq, emb = x.shape
        head_dim = emb // self.config.n_head
        q = self.q(x)
        k_new = self.k(x)
        v_new = self.v(x)

        cache_existed = self.k_cache is not None

        if use_cache:
            if cache_existed:
                k_list = self.k_cache.tolist()
                v_list = self.v_cache.tolist()
                k_new_list = k_new.tolist()
                v_new_list = v_new.tolist()
                k = Tensor([k_list[b] + k_new_list[b] for b in range(bsz)])
                v = Tensor([v_list[b] + v_new_list[b] for b in range(bsz)])
            else:
                k, v = k_new, v_new
            self.k_cache = k
            self.v_cache = v
        else:
            k, v = k_new, v_new
            self.k_cache = None
            self.v_cache = None

        total_seq = k.shape[1]

        # Reshape for multi-head: (bsz, total_seq, n_head, head_dim) -> (bsz, n_head, total_seq, head_dim)
        q = q.reshape((bsz, seq, self.config.n_head, head_dim)).transpose(1, 2)
        k = k.reshape((bsz, total_seq, self.config.n_head, head_dim)).transpose(1, 2)
        v = v.reshape((bsz, total_seq, self.config.n_head, head_dim)).transpose(1, 2)

        # Attention scores: (bsz, n_head, seq, head_dim) @ (bsz, n_head, head_dim, total_seq) -> (bsz, n_head, seq, total_seq)
        scores = q @ k.transpose(-2, -1) / math.sqrt(head_dim)

        # Causal mask
        if use_cache and cache_existed:
            # New tokens can attend to all cached positions (all are before current)
            mask = Tensor([[[[0.0 for _ in range(total_seq)] for _ in range(seq)]]])
        else:
            mask = Tensor([[[[0.0 if j <= i else -1e9 for j in range(total_seq)] for i in range(seq)]]])
        scores = scores + mask

        weights = scores.softmax(axis=-1)
        out = weights @ v  # (bsz, n_head, seq, total_seq) @ (bsz, n_head, total_seq, head_dim) -> (bsz, n_head, seq, head_dim)

        # Reshape back: (bsz, n_head, seq, head_dim) -> (bsz, seq, n_head, head_dim) -> (bsz, seq, emb)
        out = out.transpose(1, 2).reshape((bsz, seq, emb))
        return self.proj(self.dropout(out))


class MLP(Module):
    def __init__(self, config):
        self.fc = Linear(config.n_embd, 4 * config.n_embd)
        self.proj = Linear(4 * config.n_embd, config.n_embd)
        self.dropout = Dropout(config.dropout)

    def forward(self, x):
        return self.dropout(self.proj(self.fc(x).gelu()))


class Block(Module):
    def __init__(self, config):
        self.ln1 = LayerNorm(config.n_embd)
        self.attn = CausalSelfAttention(config)
        self.ln2 = LayerNorm(config.n_embd)
        self.mlp = MLP(config)

    def forward(self, x, use_cache=False):
        x = x + self.attn(self.ln1(x), use_cache=use_cache)
        x = x + self.mlp(self.ln2(x))
        return x


class GPT(Module):
    def __init__(self, config):
        self.config = config
        self.token_embedding = Embedding(config.vocab_size, config.n_embd)
        self.position_embedding = Embedding(config.block_size, config.n_embd)
        self.blocks = [Block(config) for _ in range(config.n_layer)]
        self.ln_f = LayerNorm(config.n_embd)
        self.head = Linear(config.n_embd, config.vocab_size, bias=False)

    def forward(self, idx, use_cache=False, start_pos=0):
        bsz, seq = idx.shape
        if start_pos + seq > self.config.block_size:
            raise ValueError("sequence length exceeds block_size")
        positions = Tensor([[start_pos + i for i in range(seq)] for _ in range(bsz)])
        x = self.token_embedding(idx) + self.position_embedding(positions)
        for block in self.blocks:
            x = block(x, use_cache=use_cache)
        return self.head(self.ln_f(x))

    def clear_caches(self):
        for block in self.blocks:
            block.attn.k_cache = None
            block.attn.v_cache = None

    def generate(self, idx, max_new_tokens):
        self.clear_caches()
        bsz, prompt_len = idx.shape

        # Process full prompt once, populating KV caches
        logits = self(idx, use_cache=True).tolist()
        next_ids = []
        for row in logits:
            probs = _softmax(row[-1])
            next_ids.append(_sample(probs))

        current = idx.tolist()
        for row, next_id in zip(current, next_ids):
            row.append(next_id)

        # Generate remaining tokens one at a time, reusing caches
        for _ in range(max_new_tokens - 1):
            next_idx = Tensor([[row[-1]] for row in current])
            logits = self(next_idx, use_cache=True, start_pos=len(current[0]) - 1).tolist()
            for b, row in enumerate(current):
                probs = _softmax(logits[b][-1])
                row.append(_sample(probs))

        return Tensor(current)


def _softmax(values):
    best = max(values)
    exps = [math.exp(v - best) for v in values]
    denom = sum(exps)
    return [v / denom for v in exps]


def _sample(probs):
    r = random.random()
    total = 0.0
    for i, p in enumerate(probs):
        total += p
        if r <= total:
            return i
    return len(probs) - 1
