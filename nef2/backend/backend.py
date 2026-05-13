from .backend import get_backend, available_backends, require_backend

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
    # Note: Backend specific set_device could be called here

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
    be = get_backend()
    if be and hasattr(be, "runtime"):
        return be.runtime(index).name()
    return "CPU"

def preferred_backend():
    be = get_backend()
    return be.__name__.split('.')[-1] if be else None

def tensor(data, device=None):
    be = get_backend()
    if be: return be.tensor(data, device)
    raise RuntimeError("No hardware backend available for 'tensor'")

def empty(shape, device=None):
    be = get_backend()
    if be: return be.CudaTensor.empty(shape, device)
    raise RuntimeError("No hardware backend available for 'empty'")

def full(shape, value, device=None):
    out = empty(shape, device)
    # This would need a backend-specific fill_ kernel
    return out

def zeros(shape, device=None):
    return full(shape, 0.0, device)

def sgd_step_(param, grad, lr):
    # Dispatch to backend
    pass

def matmul(a, b, device=None):
    be = get_backend()
    if be: return be.matmul(a, b)
    raise RuntimeError("No hardware backend available for 'matmul'")

def layernorm(x, gamma, beta, eps=1e-5, device=None):
    be = get_backend()
    if be: return be.layernorm(x, gamma, beta, eps)
    raise RuntimeError("No hardware backend available for 'layernorm'")

def embedding(indices, weight, vocab_size, embed_dim, device=None):
    # Dispatch to backend
    pass

def cross_entropy(logits, targets, device=None):
    # Dispatch to backend
    pass

# Legacy compatibility alias
class CudaTensor:
    def __init__(self, *args, **kwargs):
        be = get_backend()
        self._impl = be.CudaTensor(*args, **kwargs)
    @classmethod
    def from_flat(cls, flat, shape, device=None):
        be = get_backend()
        return be.CudaTensor.from_flat(flat, shape, device)
