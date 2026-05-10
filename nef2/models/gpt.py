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

    def forward(self, x):
        bsz, seq, emb = x.shape
        head_dim = emb // self.config.n_head
        q = self.q(x)
        k = self.k(x)
        v = self.v(x)
        values = []
        # Explicit attention loops keep this dependency-free and easy to inspect.
        for b in range(bsz):
            for t in range(seq):
                for h in range(self.config.n_head):
                    offset = h * head_dim
                    scores = []
                    for s in range(seq):
                        if s > t:
                            scores.append(Tensor(-1e9))
                            continue
                        dot = Tensor(0.0)
                        for d in range(head_dim):
                            dot = dot + q.select((b, t, offset + d)) * k.select((b, s, offset + d))
                        scores.append(dot / math.sqrt(head_dim))
                    weights = Tensor.stack(scores, (seq,)).softmax(axis=0)
                    for d in range(head_dim):
                        value = Tensor(0.0)
                        for s in range(seq):
                            value = value + weights.select((s,)) * v.select((b, s, offset + d))
                        values.append(value)
        out = Tensor.stack(values, (bsz, seq, emb))
        return self.proj(self.dropout(out))


class MLP(Module):
    def __init__(self, config):
        self.fc = Linear(config.n_embd, 4 * config.n_embd)
        self.proj = Linear(4 * config.n_embd, config.n_embd)
        self.dropout = Dropout(config.dropout)

    def forward(self, x):
        return self.dropout(self.proj(self.fc(x).tanh()))


class Block(Module):
    def __init__(self, config):
        self.ln1 = LayerNorm(config.n_embd)
        self.attn = CausalSelfAttention(config)
        self.ln2 = LayerNorm(config.n_embd)
        self.mlp = MLP(config)

    def forward(self, x):
        x = x + self.attn(self.ln1(x))
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

    def forward(self, idx):
        bsz, seq = idx.shape
        if seq > self.config.block_size:
            raise ValueError("sequence length exceeds block_size")
        positions = Tensor([[i for i in range(seq)] for _ in range(bsz)])
        x = self.token_embedding(idx) + self.position_embedding(positions)
        for block in self.blocks:
            x = block(x)
        return self.head(self.ln_f(x))

    def generate(self, idx, max_new_tokens):
        for _ in range(max_new_tokens):
            context = [row[-self.config.block_size :] for row in idx.tolist()]
            logits = self(Tensor(context)).tolist()
            next_ids = []
            for row in logits:
                probs = _softmax(row[-1])
                next_ids.append(_sample(probs))
            current = idx.tolist()
            for row, next_id in zip(current, next_ids):
                row.append(next_id)
            idx = Tensor(current)
        return idx


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
