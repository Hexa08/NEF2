import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from nef2.tensor import Tensor
from nef2.nn import Linear, Module, cross_entropy
from nef2.models.gpt import GPT, GPTConfig
from nef2 import serialization


def test_tensor_copy_shape():
    a = Tensor([[1.0, 2.0], [3.0, 4.0]])
    b = Tensor(a)
    assert b.shape == (2, 2), f"expected (2, 2), got {b.shape}"
    assert b.data == [1.0, 2.0, 3.0, 4.0]
    print("PASS: tensor copy shape")


def test_gelu():
    x = Tensor([0.0, 1.0, -1.0])
    y = x.gelu()
    assert y.shape == (3,)
    # GELU(0) = 0
    assert abs(y.data[0]) < 1e-6
    print("PASS: gelu")


def test_log_softmax():
    x = Tensor([[1.0, 2.0, 3.0]])
    log_probs = x.log_softmax(axis=-1)
    probs = x.softmax(axis=-1)
    import math
    for i in range(3):
        expected = math.log(probs.data[i])
        assert abs(log_probs.data[i] - expected) < 1e-5, f"log_softmax mismatch at {i}"
    print("PASS: log_softmax")


def test_cross_entropy_stable():
    logits = Tensor([[100.0, 0.0, 0.0]])
    targets = Tensor([0])
    loss = cross_entropy(logits, targets)
    assert loss.item() == loss.item()  # not nan
    assert loss.item() < 0.1  # should be near 0 for confident correct class
    print("PASS: cross_entropy stable")


def test_matmul_forward():
    a = Tensor([[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]])  # (3, 2)
    b = Tensor([[7.0, 8.0, 9.0], [10.0, 11.0, 12.0]])  # (2, 3)
    c = a @ b
    assert c.shape == (3, 3), f"expected (3, 3), got {c.shape}"
    expected = [
        [27.0, 30.0, 33.0],
        [61.0, 68.0, 75.0],
        [95.0, 106.0, 117.0],
    ]
    assert c.tolist() == expected
    print("PASS: matmul forward")


def test_matmul_backward():
    a = Tensor([[1.0, 2.0], [3.0, 4.0]], requires_grad=True)
    b = Tensor([[5.0, 6.0], [7.0, 8.0]], requires_grad=True)
    c = a @ b
    c.sum().backward()
    assert a.grad is not None
    assert b.grad is not None
    # dA = dC @ B^T where dC is all 1s
    # dC is (2,2) of 1s, B^T is [[5,7],[6,8]]
    # dA = [[1,1],[1,1]] @ [[5,7],[6,8]] = [[11,15],[11,15]]
    assert a.grad == [11.0, 15.0, 11.0, 15.0]
    # dB = A^T @ dC where A^T is [[1,3],[2,4]]
    # dB = [[1,3],[2,4]] @ [[1,1],[1,1]] = [[4,4],[6,6]]
    assert b.grad == [4.0, 4.0, 6.0, 6.0]
    print("PASS: matmul backward")


def test_batched_matmul():
    a = Tensor([[[1.0, 2.0], [3.0, 4.0]], [[5.0, 6.0], [7.0, 8.0]]])  # (2, 2, 2)
    b = Tensor([[[1.0, 0.0], [0.0, 1.0]], [[2.0, 0.0], [0.0, 2.0]]])  # (2, 2, 2)
    c = a @ b
    assert c.shape == (2, 2, 2)
    expected = [
        [[1.0, 2.0], [3.0, 4.0]],
        [[10.0, 12.0], [14.0, 16.0]],
    ]
    assert c.tolist() == expected
    print("PASS: batched matmul")


def test_gpt_forward():
    config = GPTConfig(vocab_size=10, block_size=4, n_embd=16, n_layer=1, n_head=2)
    model = GPT(config)
    idx = Tensor([[0, 1, 2, 3]])
    logits = model(idx)
    assert logits.shape == (1, 4, 10)
    print("PASS: gpt forward")


def test_gpt_backward():
    config = GPTConfig(vocab_size=10, block_size=4, n_embd=16, n_layer=1, n_head=2)
    model = GPT(config)
    idx = Tensor([[0, 1, 2, 3]])
    logits = model(idx)
    targets = Tensor([[1, 2, 3, 4]])
    loss = cross_entropy(logits, targets)
    model.zero_grad()
    loss.backward()
    # Check at least one parameter got a non-zero gradient
    has_grad = False
    for _, p in model.named_parameters():
        if any(g != 0.0 for g in p.grad):
            has_grad = True
            break
    assert has_grad, "no gradients computed"
    print("PASS: gpt backward")


def test_gpt_kv_cache_generation():
    config = GPTConfig(vocab_size=10, block_size=8, n_embd=16, n_layer=2, n_head=2)
    model = GPT(config)
    idx = Tensor([[0, 1, 2]])
    out = model.generate(idx, max_new_tokens=4)
    assert out.shape == (1, 7), f"expected (1, 7), got {out.shape}"  # 3 prompt + 4 new
    print("PASS: gpt kv cache generation")


def test_gpt_kv_cache_reuse():
    """Verify that caches are actually populated and reused during generation."""
    config = GPTConfig(vocab_size=10, block_size=8, n_embd=16, n_layer=2, n_head=2)
    model = GPT(config)
    model.clear_caches()
    for block in model.blocks:
        assert block.attn.k_cache is None
        assert block.attn.v_cache is None

    # First call populates caches
    idx = Tensor([[0, 1, 2, 3]])
    _ = model(idx, use_cache=True)
    for block in model.blocks:
        assert block.attn.k_cache is not None
        assert block.attn.v_cache is not None
        assert block.attn.k_cache.shape[1] == 4  # seq dim = 4

    # Second call with 1 new token appends to cache
    _ = model(Tensor([[4]]), use_cache=True, start_pos=4)
    for block in model.blocks:
        assert block.attn.k_cache.shape[1] == 5  # seq dim grew to 5
    print("PASS: gpt kv cache reuse")


def test_serialization_roundtrip():
    class DummyModel(Module):
        def __init__(self):
            self.w = Tensor([[1.0, 2.0], [3.0, 4.0]], requires_grad=True)
        def forward(self, x):
            return x
        def named_parameters(self):
            return [("w", self.w)]

    model = DummyModel()
    path = "/tmp/test_model.nef"
    serialization.save_model(model, path)
    model.w.data = [0.0, 0.0, 0.0, 0.0]
    serialization.load_model(model, path)
    assert model.w.data == [1.0, 2.0, 3.0, 4.0]
    print("PASS: serialization roundtrip")


def test_gpu_import():
    try:
        from nef2 import gpu
        print("PASS: gpu module imports")
    except Exception as e:
        print(f"SKIP: gpu import failed ({e})")


def test_gpu_backends():
    try:
        from nef2 import gpu
        backends = gpu.available_backends()
        pref = gpu.preferred_backend()
        print(f"PASS: gpu backends detected = {backends}, preferred = {pref}")
    except Exception as e:
        print(f"SKIP: gpu backend detection failed ({e})")


if __name__ == "__main__":
    test_tensor_copy_shape()
    test_gelu()
    test_log_softmax()
    test_cross_entropy_stable()
    test_matmul_forward()
    test_matmul_backward()
    test_batched_matmul()
    test_gpt_forward()
    test_gpt_backward()
    test_gpt_kv_cache_generation()
    test_gpt_kv_cache_reuse()
    test_serialization_roundtrip()
    test_gpu_import()
    test_gpu_backends()
    print("\nAll smoke tests passed.")
