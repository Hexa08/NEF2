# Stub for Vulkan runtime
def cuda_available():
    return False

def device_count():
    return 1

def list_devices():
    return [0]

def tensor(*args, **kwargs):
    raise NotImplementedError("Vulkan backend not fully implemented")
