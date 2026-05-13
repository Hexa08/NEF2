import ctypes
import os
import platform

class HipError(RuntimeError):
    pass

def _check(code, name):
    if code != 0:
        raise HipError("%s failed with ROCm error code %s" % (name, code))

def _load_hip_lib():
    system = platform.system()
    try:
        if system == "Linux":
            # Standard ROCm path
            return ctypes.CDLL("libamdhip64.so")
        elif system == "Windows":
            return ctypes.WinDLL("amdhip64.dll")
        else:
            raise HipError("HIP is not supported on %s" % system)
    except Exception as e:
        raise HipError("Could not load HIP library: %s" % e)

class HipRuntime:
    def __init__(self, index=0):
        self.index = index
        try:
            self.hip = _load_hip_lib()
            self.count = ctypes.c_int()
            _check(self.hip.hipGetDeviceCount(ctypes.byref(self.count)), "hipGetDeviceCount")
        except Exception as e:
            raise HipError("HIP initialization failed: %s" % e)

    def name(self):
        # Placeholder for hipGetDeviceProperties
        return "AMD Radeon / Instinct GPU"

def hip_available():
    try:
        HipRuntime()
        return True
    except Exception:
        return False

def device_count():
    try:
        return HipRuntime().count.value
    except Exception:
        return 0

def list_devices():
    # Implementation similar to CUDA but using hipGetDeviceProperties
    return []

class HipTensor:
    def __init__(self, data, device=None):
        # This will be populated with hipMalloc / hipMemcpyHtoD
        pass

    @classmethod
    def empty(cls, shape, device=None):
        pass

    def tolist(self):
        pass

    def matmul(self, other):
        # Will call hipBLAS
        pass

    def layernorm(self, gamma, beta, eps=1e-5):
        # Will call MIOpen
        pass
