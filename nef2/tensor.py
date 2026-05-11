import math
import random


_GRAD_ENABLED = True


class no_grad:
    def __enter__(self):
        global _GRAD_ENABLED
        self.prev = _GRAD_ENABLED
        _GRAD_ENABLED = False

    def __exit__(self, exc_type, exc, tb):
        global _GRAD_ENABLED
        _GRAD_ENABLED = self.prev


def _shape(data):
    if not isinstance(data, list):
        return ()
    if not data:
        return (0,)
    return (len(data),) + _shape(data[0])


def _flatten(data):
    if not isinstance(data, list):
        return [float(data)]
    out = []
    for item in data:
        out.extend(_flatten(item))
    return out


def _prod(values):
    out = 1
    for value in values:
        out *= value
    return out


def _unflatten(values, shape):
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


def _strides(shape):
    stride = 1
    out = []
    for size in reversed(shape):
        out.append(stride)
        stride *= size
    return tuple(reversed(out))


def _index_to_flat(index, shape):
    return sum(i * s for i, s in zip(index, _strides(shape)))


def _flat_to_index(pos, shape):
    idx = []
    for stride, size in zip(_strides(shape), shape):
        idx.append((pos // stride) % size)
    return tuple(idx)


def _broadcast_shape(a, b):
    out = []
    for da, db in zip(reversed(a), reversed(b)):
        if da == db:
            out.append(da)
        elif da == 1:
            out.append(db)
        elif db == 1:
            out.append(da)
        else:
            raise ValueError("shapes are not broadcastable: %s and %s" % (a, b))
    longer = a if len(a) > len(b) else b
    out.extend(reversed(longer[: abs(len(a) - len(b))]))
    return tuple(reversed(out))


def _broadcast_pos(index, src_shape, out_shape):
    if src_shape == out_shape:
        return _index_to_flat(index, src_shape)
    pad = len(out_shape) - len(src_shape)
    src_index = []
    for i, size in enumerate(src_shape):
        src_index.append(0 if size == 1 else index[i + pad])
    return _index_to_flat(tuple(src_index), src_shape)


def _sum_to_shape(grad, out_shape, src_shape):
    if src_shape == out_shape:
        return grad[:]
    out = [0.0 for _ in range(_prod(src_shape))]
    for pos, value in enumerate(grad):
        idx = _flat_to_index(pos, out_shape)
        out[_broadcast_pos(idx, src_shape, out_shape)] += value
    return out


def _ensure_tensor(value):
    return value if isinstance(value, Tensor) else Tensor(value)


def _gpu_matmul(a_data, a_shape, b_data, b_shape, out_shape):
    """Try to run matmul on GPU. Returns flat result or None on failure."""
    try:
        from . import gpu
        if not gpu.cuda_available():
            return None
        if _prod(out_shape) < 256:
            return None
        a_gpu = gpu.CudaTensor.from_flat(a_data, a_shape)
        b_gpu = gpu.CudaTensor.from_flat(b_data, b_shape)
        c_gpu = a_gpu.matmul(b_gpu)
        return _flatten(c_gpu.tolist())
    except Exception:
        return None


class Tensor:
    def __init__(self, data, requires_grad=False, _children=(), _op=""):
        if isinstance(data, Tensor):
            self.shape = data.shape
            self.data = data.data[:]
            self.requires_grad = bool(requires_grad)
            self.grad = [0.0 for _ in self.data] if self.requires_grad else None
            self._prev = set(_children)
            self._op = _op
            self._backward = lambda: None
            return
        self.shape = _shape(data)
        self.data = _flatten(data)
        self.requires_grad = bool(requires_grad)
        self.grad = [0.0 for _ in self.data] if self.requires_grad else None
        self._prev = set(_children)
        self._op = _op
        self._backward = lambda: None

    @staticmethod
    def zeros(shape, requires_grad=False):
        return Tensor(_unflatten([0.0] * _prod(shape), shape), requires_grad)

    @staticmethod
    def randn(shape, scale=1.0, requires_grad=False):
        return Tensor(
            _unflatten([random.gauss(0.0, scale) for _ in range(_prod(shape))], shape),
            requires_grad,
        )

    def tolist(self):
        return _unflatten(self.data, self.shape)

    def item(self):
        if len(self.data) != 1:
            raise ValueError("only scalar tensors can be converted to item")
        return self.data[0]

    def __repr__(self):
        return "Tensor(data=%r, requires_grad=%r)" % (self.tolist(), self.requires_grad)

    def _binary(self, other, op, grad_self, grad_other, name):
        other = _ensure_tensor(other)
        out_shape = _broadcast_shape(self.shape, other.shape)
        out_data = []
        for pos in range(_prod(out_shape)):
            idx = _flat_to_index(pos, out_shape)
            a = self.data[_broadcast_pos(idx, self.shape, out_shape)]
            b = other.data[_broadcast_pos(idx, other.shape, out_shape)]
            out_data.append(op(a, b))
        requires_grad = _GRAD_ENABLED and (self.requires_grad or other.requires_grad)
        out = Tensor(_unflatten(out_data, out_shape), requires_grad, (self, other), name)

        def backward():
            if self.requires_grad:
                g = []
                for pos, upstream in enumerate(out.grad):
                    idx = _flat_to_index(pos, out_shape)
                    a = self.data[_broadcast_pos(idx, self.shape, out_shape)]
                    b = other.data[_broadcast_pos(idx, other.shape, out_shape)]
                    g.append(upstream * grad_self(a, b))
                reduced = _sum_to_shape(g, out_shape, self.shape)
                self.grad = [a + b for a, b in zip(self.grad, reduced)]
            if other.requires_grad:
                g = []
                for pos, upstream in enumerate(out.grad):
                    idx = _flat_to_index(pos, out_shape)
                    a = self.data[_broadcast_pos(idx, self.shape, out_shape)]
                    b = other.data[_broadcast_pos(idx, other.shape, out_shape)]
                    g.append(upstream * grad_other(a, b))
                reduced = _sum_to_shape(g, out_shape, other.shape)
                other.grad = [a + b for a, b in zip(other.grad, reduced)]

        out._backward = backward
        return out

    def __add__(self, other):
        return self._binary(other, lambda a, b: a + b, lambda a, b: 1.0, lambda a, b: 1.0, "+")

    def __radd__(self, other):
        return self + other

    def __sub__(self, other):
        return self._binary(other, lambda a, b: a - b, lambda a, b: 1.0, lambda a, b: -1.0, "-")

    def __rsub__(self, other):
        return _ensure_tensor(other) - self

    def __mul__(self, other):
        return self._binary(other, lambda a, b: a * b, lambda a, b: b, lambda a, b: a, "*")

    def __rmul__(self, other):
        return self * other

    def __truediv__(self, other):
        return self._binary(
            other,
            lambda a, b: a / b,
            lambda a, b: 1.0 / b,
            lambda a, b: -a / (b * b),
            "/",
        )

    def __rtruediv__(self, other):
        return _ensure_tensor(other) / self

    def __neg__(self):
        return self * -1.0

    def __pow__(self, power):
        out_data = [x**power for x in self.data]
        requires_grad = _GRAD_ENABLED and self.requires_grad
        out = Tensor(_unflatten(out_data, self.shape), requires_grad, (self,), "pow")

        def backward():
            if self.requires_grad:
                self.grad = [
                    g + upstream * power * (x ** (power - 1))
                    for g, upstream, x in zip(self.grad, out.grad, self.data)
                ]

        out._backward = backward
        return out

    def exp(self):
        out_data = [math.exp(x) for x in self.data]
        requires_grad = _GRAD_ENABLED and self.requires_grad
        out = Tensor(_unflatten(out_data, self.shape), requires_grad, (self,), "exp")

        def backward():
            if self.requires_grad:
                self.grad = [g + upstream * y for g, upstream, y in zip(self.grad, out.grad, out.data)]

        out._backward = backward
        return out

    def log(self):
        out_data = [math.log(x) for x in self.data]
        requires_grad = _GRAD_ENABLED and self.requires_grad
        out = Tensor(_unflatten(out_data, self.shape), requires_grad, (self,), "log")

        def backward():
            if self.requires_grad:
                self.grad = [g + upstream / x for g, upstream, x in zip(self.grad, out.grad, self.data)]

        out._backward = backward
        return out

    def tanh(self):
        out_data = [math.tanh(x) for x in self.data]
        requires_grad = _GRAD_ENABLED and self.requires_grad
        out = Tensor(_unflatten(out_data, self.shape), requires_grad, (self,), "tanh")

        def backward():
            if self.requires_grad:
                self.grad = [
                    g + upstream * (1.0 - y * y)
                    for g, upstream, y in zip(self.grad, out.grad, out.data)
                ]

        out._backward = backward
        return out

    def gelu(self):
        # approximation: 0.5 * x * (1 + tanh(sqrt(2/pi) * (x + 0.044715*x^3)))
        out_data = [
            0.5 * x * (1.0 + math.tanh(0.7978845608 * (x + 0.044715 * x ** 3)))
            for x in self.data
        ]
        requires_grad = _GRAD_ENABLED and self.requires_grad
        out = Tensor(_unflatten(out_data, self.shape), requires_grad, (self,), "gelu")

        def backward():
            if self.requires_grad:
                # GELU derivative from the tanh approximation
                for i, x in enumerate(self.data):
                    a = 0.044715 * x ** 3
                    b = x + a
                    c = 0.7978845608 * b
                    t = math.tanh(c)
                    dt = 1.0 - t * t
                    da = 3.0 * 0.044715 * x * x
                    dc = 0.7978845608 * (1.0 + da)
                    gelu_prime = 0.5 * (1.0 + t) + 0.5 * x * dt * dc
                    self.grad[i] += out.grad[i] * gelu_prime

        out._backward = backward
        return out

    def relu(self):
        out_data = [x if x > 0.0 else 0.0 for x in self.data]
        requires_grad = _GRAD_ENABLED and self.requires_grad
        out = Tensor(_unflatten(out_data, self.shape), requires_grad, (self,), "relu")

        def backward():
            if self.requires_grad:
                self.grad = [
                    g + upstream * (1.0 if x > 0.0 else 0.0)
                    for g, upstream, x in zip(self.grad, out.grad, self.data)
                ]

        out._backward = backward
        return out

    def sigmoid(self):
        return 1.0 / (1.0 + (-self).exp())

    def sum(self, axis=None, keepdims=False):
        if axis is None:
            out_shape = (1,) if keepdims else ()
            out_data = [sum(self.data)]
        else:
            if axis < 0:
                axis += len(self.shape)
            out_shape = list(self.shape)
            removed = out_shape.pop(axis)
            if keepdims:
                out_shape.insert(axis, 1)
            out_shape = tuple(out_shape)
            out_data = [0.0 for _ in range(_prod(out_shape))]
            for pos, value in enumerate(self.data):
                idx = list(_flat_to_index(pos, self.shape))
                idx.pop(axis)
                if keepdims:
                    idx.insert(axis, 0)
                out_data[_index_to_flat(tuple(idx), out_shape)] += value
        requires_grad = _GRAD_ENABLED and self.requires_grad
        out = Tensor(_unflatten(out_data, out_shape), requires_grad, (self,), "sum")

        def backward():
            if not self.requires_grad:
                return
            if axis is None:
                self.grad = [g + out.grad[0] for g in self.grad]
            else:
                for pos in range(len(self.data)):
                    idx = list(_flat_to_index(pos, self.shape))
                    idx.pop(axis)
                    if keepdims:
                        idx.insert(axis, 0)
                    self.grad[pos] += out.grad[_index_to_flat(tuple(idx), out_shape)]

        out._backward = backward
        return out

    def mean(self, axis=None, keepdims=False):
        denom = len(self.data) if axis is None else self.shape[axis]
        return self.sum(axis=axis, keepdims=keepdims) / float(denom)

    def reshape(self, shape):
        if _prod(shape) != len(self.data):
            raise ValueError("cannot reshape %s to %s" % (self.shape, shape))
        requires_grad = _GRAD_ENABLED and self.requires_grad
        out = Tensor(_unflatten(self.data, tuple(shape)), requires_grad, (self,), "reshape")

        def backward():
            if self.requires_grad:
                self.grad = [g + upstream for g, upstream in zip(self.grad, out.grad)]

        out._backward = backward
        return out

    def select(self, index):
        pos = _index_to_flat(tuple(index), self.shape)
        requires_grad = _GRAD_ENABLED and self.requires_grad
        out = Tensor(self.data[pos], requires_grad, (self,), "select")

        def backward():
            if self.requires_grad:
                self.grad[pos] += out.grad[0]

        out._backward = backward
        return out

    @staticmethod
    def stack(values, shape):
        values = [_ensure_tensor(value) for value in values]
        data = [value.data[0] for value in values]
        requires_grad = _GRAD_ENABLED and any(value.requires_grad for value in values)
        out = Tensor(_unflatten(data, shape), requires_grad, tuple(values), "stack")

        def backward():
            for value, upstream in zip(values, out.grad):
                if value.requires_grad:
                    value.grad[0] += upstream

        out._backward = backward
        return out

    def transpose(self, dim0=-2, dim1=-1):
        rank = len(self.shape)
        dim0 %= rank
        dim1 %= rank
        out_shape = list(self.shape)
        out_shape[dim0], out_shape[dim1] = out_shape[dim1], out_shape[dim0]
        out_data = [0.0 for _ in self.data]
        for pos, value in enumerate(self.data):
            idx = list(_flat_to_index(pos, self.shape))
            out_idx = idx[:]
            out_idx[dim0], out_idx[dim1] = out_idx[dim1], out_idx[dim0]
            out_data[_index_to_flat(tuple(out_idx), tuple(out_shape))] = value
        requires_grad = _GRAD_ENABLED and self.requires_grad
        out = Tensor(_unflatten(out_data, tuple(out_shape)), requires_grad, (self,), "transpose")

        def backward():
            if self.requires_grad:
                for pos in range(len(self.data)):
                    idx = list(_flat_to_index(pos, self.shape))
                    out_idx = idx[:]
                    out_idx[dim0], out_idx[dim1] = out_idx[dim1], out_idx[dim0]
                    self.grad[pos] += out.grad[_index_to_flat(tuple(out_idx), tuple(out_shape))]

        out._backward = backward
        return out

    def matmul(self, other):
        other = _ensure_tensor(other)
        if len(self.shape) < 2 or len(other.shape) < 2:
            raise ValueError("matmul expects tensors with rank >= 2")
        if other.shape[:-2] not in ((), self.shape[:-2]):
            raise ValueError("batched matmul requires matching or unbatched right-hand dims")
        m, k = self.shape[-2], self.shape[-1]
        k2, n = other.shape[-2], other.shape[-1]
        if k != k2:
            raise ValueError("matmul shape mismatch: %s and %s" % (self.shape, other.shape))
        batch_shape = self.shape[:-2]
        out_shape = batch_shape + (m, n)
        out_data = _gpu_matmul(self.data, self.shape, other.data, other.shape, out_shape)
        if out_data is None:
            out_data = [0.0 for _ in range(_prod(out_shape))]
            for batch_pos in range(_prod(batch_shape) if batch_shape else 1):
                batch_idx = _flat_to_index(batch_pos, batch_shape) if batch_shape else ()
                for i in range(m):
                    for j in range(n):
                        total = 0.0
                        for kk in range(k):
                            a_pos = _index_to_flat(batch_idx + (i, kk), self.shape)
                            b_index = (kk, j) if len(other.shape) == 2 else batch_idx + (kk, j)
                            b_pos = _index_to_flat(b_index, other.shape)
                            total += self.data[a_pos] * other.data[b_pos]
                        out_data[_index_to_flat(batch_idx + (i, j), out_shape)] = total
        requires_grad = _GRAD_ENABLED and (self.requires_grad or other.requires_grad)
        out = Tensor(_unflatten(out_data, out_shape), requires_grad, (self, other), "matmul")

        def backward():
            if self.requires_grad:
                # dA = dC @ B^T
                b_t_shape = other.shape[:-2] + (other.shape[-1], other.shape[-2])
                b_t_data = Tensor(_unflatten(other.data, other.shape)).transpose(-2, -1).data
                grad_a = _gpu_matmul(out.grad, out_shape, b_t_data, b_t_shape, self.shape)
                if grad_a is None:
                    for batch_pos in range(_prod(batch_shape) if batch_shape else 1):
                        batch_idx = _flat_to_index(batch_pos, batch_shape) if batch_shape else ()
                        for i in range(m):
                            for kk in range(k):
                                total = 0.0
                                for j in range(n):
                                    upstream = out.grad[_index_to_flat(batch_idx + (i, j), out_shape)]
                                    b_t_pos = _index_to_flat(batch_idx + (j, kk), b_t_shape) if len(b_t_shape) > 2 else _index_to_flat((j, kk), b_t_shape)
                                    total += upstream * b_t_data[b_t_pos]
                                self.grad[_index_to_flat(batch_idx + (i, kk), self.shape)] += total
                else:
                    for i in range(len(self.grad)):
                        self.grad[i] += grad_a[i]
            if other.requires_grad:
                # dB = A^T @ dC
                a_t_shape = self.shape[:-2] + (self.shape[-1], self.shape[-2])
                a_t_data = Tensor(_unflatten(self.data, self.shape)).transpose(-2, -1).data
                other_shape = other.shape
                grad_b = _gpu_matmul(a_t_data, a_t_shape, out.grad, out_shape, other_shape)
                if grad_b is None:
                    for batch_pos in range(_prod(batch_shape) if batch_shape else 1):
                        batch_idx = _flat_to_index(batch_pos, batch_shape) if batch_shape else ()
                        for kk in range(k):
                            for j in range(n):
                                total = 0.0
                                for i in range(m):
                                    upstream = out.grad[_index_to_flat(batch_idx + (i, j), out_shape)]
                                    a_t_pos = _index_to_flat(batch_idx + (kk, i), a_t_shape) if len(a_t_shape) > 2 else _index_to_flat((kk, i), a_t_shape)
                                    total += upstream * a_t_data[a_t_pos]
                                other.grad[_index_to_flat(batch_idx + (kk, j), other_shape)] += total
                else:
                    for i in range(len(other.grad)):
                        other.grad[i] += grad_b[i]

        out._backward = backward
        return out

    def __matmul__(self, other):
        return self.matmul(other)

    def log_softmax(self, axis=-1):
        axis %= len(self.shape)
        max_values = []
        for pos, value in enumerate(self.data):
            idx = list(_flat_to_index(pos, self.shape))
            best = -float("inf")
            for i in range(self.shape[axis]):
                idx[axis] = i
                best = max(best, self.data[_index_to_flat(tuple(idx), self.shape)])
            max_values.append(best)
        shifted = self - Tensor(_unflatten(max_values, self.shape))
        log_sum_exp = shifted.exp().sum(axis=axis, keepdims=True).log()
        return shifted - log_sum_exp

    def softmax(self, axis=-1):
        return self.log_softmax(axis=axis).exp()

    def backward(self):
        if len(self.data) != 1:
            raise ValueError("backward can only start from a scalar")
        topo = []
        seen = set()

        def build(node):
            if node not in seen:
                seen.add(node)
                for child in node._prev:
                    build(child)
                topo.append(node)

        build(self)
        self.grad = [1.0]
        for node in reversed(topo):
            node._backward()
