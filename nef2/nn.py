import math
import random

from .tensor import Tensor


class Parameter(Tensor):
    def __init__(self, data):
        super().__init__(data, requires_grad=True)


class Module:
    def __call__(self, *args, **kwargs):
        return self.forward(*args, **kwargs)

    def forward(self, *args, **kwargs):
        raise NotImplementedError

    def parameters(self):
        params = []
        for value in self.__dict__.values():
            params.extend(_collect_parameters(value))
        return params

    def named_parameters(self):
        params = []
        for name, value in self.__dict__.items():
            params.extend(_collect_named_parameters(value, name))
        return params

    def train(self):
        self.training = True
        for child in self.children():
            child.train()

    def eval(self):
        self.training = False
        for child in self.children():
            child.eval()

    def children(self):
        out = []
        for value in self.__dict__.values():
            out.extend(_collect_modules(value))
        return out

    def zero_grad(self):
        for param in self.parameters():
            param.grad = [0.0 for _ in param.data]


def _collect_parameters(value):
    if isinstance(value, Parameter):
        return [value]
    if isinstance(value, Module):
        return value.parameters()
    if isinstance(value, dict):
        out = []
        for item in value.values():
            out.extend(_collect_parameters(item))
        return out
    if isinstance(value, (list, tuple)):
        out = []
        for item in value:
            out.extend(_collect_parameters(item))
        return out
    return []


def _collect_named_parameters(value, prefix):
    if isinstance(value, Parameter):
        return [(prefix, value)]
    if isinstance(value, Module):
        out = []
        for name, item in value.__dict__.items():
            out.extend(_collect_named_parameters(item, prefix + "." + name))
        return out
    if isinstance(value, dict):
        out = []
        for name, item in value.items():
            out.extend(_collect_named_parameters(item, prefix + "." + str(name)))
        return out
    if isinstance(value, (list, tuple)):
        out = []
        for i, item in enumerate(value):
            out.extend(_collect_named_parameters(item, prefix + "." + str(i)))
        return out
    return []


def _collect_modules(value):
    if isinstance(value, Module):
        return [value]
    if isinstance(value, dict):
        out = []
        for item in value.values():
            out.extend(_collect_modules(item))
        return out
    if isinstance(value, (list, tuple)):
        out = []
        for item in value:
            out.extend(_collect_modules(item))
        return out
    return []


class Linear(Module):
    def __init__(self, in_features, out_features, bias=True):
        limit = 1.0 / math.sqrt(in_features)
        self.weight = Parameter(
            [[random.uniform(-limit, limit) for _ in range(out_features)] for _ in range(in_features)]
        )
        self.bias = Parameter([0.0 for _ in range(out_features)]) if bias else None

    def forward(self, x):
        y = x @ self.weight
        return y + self.bias if self.bias is not None else y


class Embedding(Module):
    def __init__(self, num_embeddings, embedding_dim):
        scale = 1.0 / math.sqrt(embedding_dim)
        self.weight = Parameter(
            [[random.gauss(0.0, scale) for _ in range(embedding_dim)] for _ in range(num_embeddings)]
        )

    def forward(self, token_ids):
        shape = tuple(token_ids.shape) + (self.weight.shape[1],)
        data = []
        for token in token_ids.data:
            start = int(token) * self.weight.shape[1]
            data.extend(self.weight.data[start : start + self.weight.shape[1]])
        out = Tensor(_nest(data, shape), self.weight.requires_grad, (self.weight,), "embedding")

        def backward():
            if self.weight.requires_grad:
                width = self.weight.shape[1]
                for i, token in enumerate(token_ids.data):
                    start = int(token) * width
                    grad_start = i * width
                    for j in range(width):
                        self.weight.grad[start + j] += out.grad[grad_start + j]

        out._backward = backward
        return out


def _nest(values, shape):
    values = list(values)

    def build(offset, dims):
        if not dims:
            return values[offset], offset + 1
        arr = []
        for _ in range(dims[0]):
            item, offset = build(offset, dims[1:])
            arr.append(item)
        return arr, offset

    data, _ = build(0, shape)
    return data


class LayerNorm(Module):
    def __init__(self, normalized_shape, eps=1e-5):
        self.weight = Parameter([1.0 for _ in range(normalized_shape)])
        self.bias = Parameter([0.0 for _ in range(normalized_shape)])
        self.eps = eps

    def forward(self, x):
        mean = x.mean(axis=-1, keepdims=True)
        centered = x - mean
        var = (centered * centered).mean(axis=-1, keepdims=True)
        return centered / ((var + self.eps) ** 0.5) * self.weight + self.bias


class Dropout(Module):
    def __init__(self, p=0.0):
        self.p = p
        self.training = True

    def forward(self, x):
        if not self.training or self.p <= 0.0:
            return x
        keep = 1.0 - self.p
        mask = [1.0 / keep if random.random() < keep else 0.0 for _ in x.data]
        return x * Tensor(_nest(mask, x.shape))


class Sequential(Module):
    def __init__(self, *layers):
        self.layers = list(layers)

    def forward(self, x):
        for layer in self.layers:
            x = layer(x)
        return x


def cross_entropy(logits, targets):
    if logits.shape[:-1] != targets.shape:
        raise ValueError("logits shape must be targets shape plus classes")
    classes = logits.shape[-1]
    flat_rows = len(logits.data) // classes
    total = Tensor(0.0)
    log_probs = logits.log_softmax(axis=-1)
    for row in range(flat_rows):
        target = int(targets.data[row])
        p = log_probs.select(_flat_index(row, targets.shape) + (target,))
        total = total - p
    return total / float(flat_rows)


def _flat_index(pos, shape):
    if not shape:
        return ()
    strides = []
    stride = 1
    for size in reversed(shape):
        strides.append(stride)
        stride *= size
    strides = tuple(reversed(strides))
    return tuple((pos // stride) % size for stride, size in zip(strides, shape))
