import os
import platform
import importlib

_BACKEND = None

def get_backend():
    global _BACKEND
    if _BACKEND is None:
        _BACKEND = _detect_backend()
    return _BACKEND

def _detect_backend():
    """Auto-detect the best available hardware backend."""
    # 1. Check for NVIDIA CUDA
    try:
        from .cuda.runtime import cuda_available
        if cuda_available():
            return importlib.import_module(".cuda", __package__)
    except Exception:
        pass

    # 2. Check for AMD HIP
    try:
        from .hip.runtime import hip_available
        if hip_available():
            return importlib.import_module(".hip", __package__)
    except Exception:
        pass

    # 3. Check for Apple Metal
    try:
        from .metal.runtime import metal_available
        if metal_available():
            return importlib.import_module(".metal", __package__)
    except Exception:
        pass
    
    return None

def require_backend(name):
    global _BACKEND
    try:
        _BACKEND = importlib.import_module(f".{name}", __package__)
        return _BACKEND
    except ImportError:
        raise RuntimeError(f"Backend '{name}' not found or not installed.")

def available_backends():
    backends = []
    # Check filesystem for implemented backends
    base_dir = os.path.dirname(__file__)
    for item in os.listdir(base_dir):
        if os.path.isdir(os.path.join(base_dir, item)) and not item.startswith("__"):
            backends.append(item)
    return backends
