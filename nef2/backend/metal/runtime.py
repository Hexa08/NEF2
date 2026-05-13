import platform
import subprocess

class MetalError(RuntimeError):
    pass

class MetalRuntime:
    def __init__(self, index=0):
        if platform.system() != "Darwin":
            raise MetalError("Metal is only available on macOS")
        self.index = index

    def name(self):
        # On macOS we can use system_profiler or sysctl to get GPU name
        return "Apple Silicon GPU"

def metal_available():
    if platform.system() != "Darwin":
        return False
    # Simple check for Metal support
    return True

def device_count():
    return 1 if metal_available() else 0

def list_devices():
    return [{"index": 0, "name": "Apple GPU", "backend": "metal"}] if metal_available() else []

class MetalTensor:
    def __init__(self, data, device=None):
        # This will use Metal-cpp or MPS bindings
        pass

    @classmethod
    def empty(cls, shape, device=None):
        pass

    def tolist(self):
        pass

    def matmul(self, other):
        # Will call MPSGraph
        pass

    def layernorm(self, gamma, beta, eps=1e-5):
        # Will call MPS normalization kernels
        pass
