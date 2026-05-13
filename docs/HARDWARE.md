# NEF2 Hardware Support Matrix

NEF2 is designed for "First-Class Hardware Support." We do not rely on generic abstractions; we write backend-specific drivers to extract maximum performance.

## 1. NVIDIA CUDA (Production Ready)

NEF2 talks directly to the NVIDIA Driver (`nvcuda.dll` / `libcuda.so.1`) via `ctypes`. 

### Features:
- **PTX Kernel Execution**: Custom assembly kernels for `matmul`, `layernorm`, `cross_entropy`, and `embedding`.
- **Zero-Overhead Memory**: Direct control over device memory allocation and asynchronous transfers.
- **VRAM Virtualization**: Integrated with HyperCache to page memory to system RAM.

## 2. AMD HIP/ROCm (Beta)

Support for AMD Instinct and Radeon GPUs via the HIP runtime.

### Status:
- Vector kernels implemented.
- Matrix multiplication optimized for CDNA architecture.
- Full parity with CUDA backend expected in Q4 2026.

## 3. Apple Metal (Planned)

Targeting M1/M2/M3 chips for high-performance inference on macOS.

### Roadmap:
- Metal Shading Language (MSL) integration for unified memory performance.
- Optimization for Apple Neural Engine (ANE).

## 4. Intel Level Zero / oneAPI (In Research)

Targeting Intel Data Center GPU Max Series and Arc graphics.

## 5. Generic Backends (Fallback)

- **Vulkan**: For portable GPU acceleration across mobile and desktop.
- **OpenCL**: Legacy support for diverse hardware.

---

## Hardware Detection Logic

NEF2 uses an automated detection heuristic:
1.  Check for `libcuda` (NVIDIA).
2.  If fail, check for `libamdhip` (AMD).
3.  If fail, check for Metal (macOS).
4.  Fallback to **NEFCore CPU** (highly optimized C++/Rust engine).

To force a specific backend:
```python
from nef2 import gpu
gpu.require_backend("hip")
```
