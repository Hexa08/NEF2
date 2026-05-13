from .runtime import CudaRuntime, CudaTensor, cuda_available, device_count, list_devices

__all__ = ["CudaRuntime", "CudaTensor", "cuda_available", "device_count", "list_devices"]

# Implement backend-specific API
def tensor(data, device=None):
    return CudaTensor(data, device)

def matmul(a, b):
    return a.matmul(b)

def layernorm(x, gamma, beta, eps=1e-5):
    return x.layernorm(gamma, beta, eps)
