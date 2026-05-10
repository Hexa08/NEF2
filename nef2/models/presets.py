from .gpt import GPT, GPTConfig


def estimate_gpt_parameters(config):
    d = config.n_embd
    layers = config.n_layer
    vocab = config.vocab_size
    block = config.block_size
    token_pos = vocab * d + block * d
    attention = layers * ((3 * d * d) + (d * d) + d)
    mlp = layers * ((d * 4 * d) + (4 * d) + (4 * d * d) + d)
    norms = layers * (4 * d) + (2 * d)
    head = d * vocab
    return token_pos + attention + mlp + norms + head


def gpt_200m_config(vocab_size=256, block_size=1024):
    return GPTConfig(
        vocab_size=vocab_size,
        block_size=block_size,
        n_embd=1024,
        n_layer=16,
        n_head=16,
        dropout=0.0,
    )


def build_gpt_200m(vocab_size=256, block_size=1024, allow_large_allocation=False):
    config = gpt_200m_config(vocab_size=vocab_size, block_size=block_size)
    params = estimate_gpt_parameters(config)
    if not allow_large_allocation:
        raise MemoryError(
            "GPT-200M has about %d parameters. The current pure-Python model stores "
            "parameters as Python floats, so construction is intentionally guarded. "
            "Pass allow_large_allocation=True only if you really want to allocate it."
            % params
        )
    return GPT(config)
