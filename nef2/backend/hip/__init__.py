from .runtime import HipRuntime, HipTensor, hip_available, device_count, list_devices

__all__ = ["HipRuntime", "HipTensor", "hip_available", "device_count", "list_devices"]

# Implement backend-specific API
def tensor(data, device=None):
    return HipTensor(data, device)

def matmul(a, b):
    return a.matmul(b)

def layernorm(x, gamma, beta, eps=1e-5):
    return x.layernorm(gamma, beta, eps)
