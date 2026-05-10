import random

from .tensor import Tensor


def make_lm_batch(tokens, batch_size, block_size):
    if len(tokens) <= block_size + 1:
        raise ValueError("need more tokens than block_size + 1")
    xs = []
    ys = []
    for _ in range(batch_size):
        start = random.randint(0, len(tokens) - block_size - 1)
        xs.append(tokens[start : start + block_size])
        ys.append(tokens[start + 1 : start + block_size + 1])
    return Tensor(xs), Tensor(ys)
