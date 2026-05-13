from .runtime import MetalRuntime, MetalTensor, metal_available, device_count, list_devices

__all__ = ["MetalRuntime", "MetalTensor", "metal_available", "device_count", "list_devices"]

# Implement backend-specific API
def tensor(data, device=None):
    return MetalTensor(data, device)

def matmul(a, b):
    return a.matmul(b)

def layernorm(x, gamma, beta, eps=1e-5):
    return x.layernorm(gamma, beta, eps)
