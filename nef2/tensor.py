import numpy as np
from .backend import get_backend

def _prod(iterable):
    p = 1
    for x in iterable: p *= x
    return p

class no_grad:
    def __enter__(self):
        pass
    def __exit__(self, exc_type, exc_val, exc_tb):
        pass

class Tensor:
    def __init__(self, data, device=None):
        self.backend = get_backend()
        if isinstance(data, np.ndarray):
            self._data = data
            self.shape = data.shape
        else:
            self._data = np.array(data)
            self.shape = self._data.shape
            
    def __mul__(self, other):
        # In a real scenario, this would call self.backend.launch_kernel
        # For the stress test, we simulate the workload
        return Tensor(self._data * other)

    def numpy(self):
        return self._data

def tensor(data, device=None):
    return Tensor(data, device)

def randn(shape, dtype="float32"):
    return Tensor(np.random.randn(*shape).astype(dtype))

def matmul(a, b):
    return Tensor(np.matmul(a.numpy(), b.numpy()))
