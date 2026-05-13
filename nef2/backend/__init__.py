import os
import ctypes

def get_backend():
    backend_name = os.environ.get("NEF_BACKEND", "cuda").lower()
    if backend_name == "cuda":
        from .cuda import runtime as cuda_rt
        return cuda_rt
    elif backend_name == "hip":
        from .hip import runtime as hip_rt
        return hip_rt
    elif backend_name == "metal":
        from .metal import runtime as metal_rt
        return metal_rt
    elif backend_name == "sycl":
        from .sycl import runtime as sycl_rt
        return sycl_rt
    elif backend_name == "vulkan":
        from .vulkan import runtime as vulkan_rt
        return vulkan_rt
    else:
        raise ValueError(f"Unknown NEF_BACKEND: {backend_name}")

def cuda_available():
    be = get_backend()
    if be and hasattr(be, "cuda_available"):
        return be.cuda_available()
    return False

def device_count():
    be = get_backend()
    if be and hasattr(be, "device_count"):
        return be.device_count()
    return 0

def list_devices():
    be = get_backend()
    if be and hasattr(be, "list_devices"):
        return be.list_devices()
    return []

_CURRENT_DEVICE = 0

def current_device():
    return _CURRENT_DEVICE

def set_device(index):
    global _CURRENT_DEVICE
    _CURRENT_DEVICE = index

from contextlib import contextmanager
@contextmanager
def use_device(index):
    previous = current_device()
    set_device(index)
    try:
        yield
    finally:
        set_device(previous)

def device_name(index=None):
    return "NEF_Accelerator"

def preferred_backend():
    return os.environ.get("NEF_BACKEND", "cuda").lower()

def tensor(data, device=None):
    from ..tensor import Tensor
    return Tensor(data, device)

def empty(shape, device=None):
    from ..tensor import Tensor
    import numpy as np
    return Tensor(np.empty(shape), device)

def full(shape, value, device=None):
    from ..tensor import Tensor
    import numpy as np
    return Tensor(np.full(shape, value), device)

def zeros(shape, device=None):
    return full(shape, 0.0, device)

def sgd_step_(param, grad, lr):
    pass

def matmul(a, b, device=None):
    from ..tensor import matmul as mm
    return mm(a, b)

def layernorm(x, gamma, beta, eps=1e-5, device=None):
    from ..tensor import Tensor
    return Tensor(x.numpy())

def embedding(indices, weight, vocab_size, embed_dim, device=None):
    pass

def cross_entropy(logits, targets, device=None):
    pass

class CudaTensor:
    def __init__(self, *args, **kwargs):
        from ..tensor import Tensor
        self._impl = Tensor(*args, **kwargs)
    @classmethod
    def from_flat(cls, flat, shape, device=None):
        from ..tensor import Tensor
        return Tensor(flat.reshape(shape), device)

def available_backends():
    return ["cuda", "hip", "metal", "sycl", "vulkan"]

def require_backend(name):
    if os.environ.get("NEF_BACKEND", "cuda").lower() != name:
        raise RuntimeError(f"This operation requires the {name} backend")

class DistributedGroup:
    def __init__(self, backend_lib):
        self._lib = backend_lib
    
    def all_reduce(self, tensor, op="sum"):
        # Python wrapper around C++ ProcessGroup->all_reduce
        pass
        
