from nef2 import AdamW, Linear, Tensor, cross_entropy
from nef2.models import GPT, GPTConfig


def test_linear_backward():
    x = Tensor([[1.0, 2.0]], requires_grad=True)
    layer = Linear(2, 3)
    loss = layer(x).sum()
    loss.backward()
    assert len(x.grad) == 2
    assert any(abs(g) > 0 for g in x.grad)


def test_gpt_forward_backward_step():
    model = GPT(GPTConfig(vocab_size=8, block_size=4, n_embd=8, n_layer=1, n_head=2))
    opt = AdamW(model.parameters(), lr=0.001)
    x = Tensor([[1, 2, 3, 4]])
    y = Tensor([[2, 3, 4, 5]])
    loss = cross_entropy(model(x), y)
    opt.zero_grad()
    loss.backward()
    opt.step()
    assert loss.item() > 0
