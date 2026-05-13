# NEF2 Hardware Support Matrix

NEF2 is designed for "First-Class Hardware Support." We do not rely on generic abstractions; we write backend-specific drivers to extract maximum performance from production-grade libraries.

## 1. NVIDIA CUDA (Production Ready)

NEF2 talks directly to the NVIDIA Driver (`nvcuda.dll` / `libcuda.so.1`) via `ctypes`.

### Features:
- **PTX Kernel Execution**: Custom assembly kernels for `matmul`, `layernorm`, `cross_entropy`, and `embedding`.
- **Zero-Overhead Memory**: Direct control over device memory allocation and asynchronous transfers.
- **VRAM Virtualization**: Integrated with HyperCache to page memory to system RAM.

## 2. AMD HIP / ROCm Stack (Active)

AMD’s main GPU compute platform is a primary target for NEF2 to ensure vendor neutrality.

### Core Libraries:
- **HIP Runtime**: The language/API layer for execution.
- **hipBLAS**: High-performance matrix multiplication and GEMM kernels.
- **MIOpen**: Deep learning primitives (convolutions, normalization).
- **RCCL**: Multi-GPU communication for the NEF Multi-GPU Fabric.
- **rocWMMA**: Tensor core acceleration for optimized transformer kernels.

### Recommended AMD Stack:
```text
NEF2 Runtime
     ↓
HIP Runtime
     ↓
hipBLAS / MIOpen / RCCL
     ↓
ROCm Driver Stack
     ↓
AMD GPU
```

## 3. Apple Silicon Backend (Planned)

NEF2 utilizes Apple's native Metal stack to extract peak performance from M-series chips.

### Core Libraries:
- **Metal API**: Main GPU compute framework for memory and command queues.
- **Metal Performance Shaders (MPS)**: Optimized tensor ops and transformer acceleration.
- **MPSGraph**: Graph execution and model scheduling.
- **metal-cpp**: C++ bindings to integrate Metal directly into the NEFCore runtime.

### Recommended Apple Stack:
```text
NEF2 Runtime
     ↓
Metal API
     ↓
MPS / MPSGraph
     ↓
Apple GPU
```

## 4. Cross-Platform & Future Backends

To avoid backend fragmentation, NEF2 implements a **Device Abstraction Layer** that maps a unified API to vendor-specific runtimes.

| Backend | Runtime | Libraries |
| :--- | :--- | :--- |
| **NVIDIA** | CUDA | cuBLAS, cuDNN, NCCL |
| **AMD** | HIP | hipBLAS, MIOpen, RCCL |
| **Apple** | Metal | MPS, MPSGraph |
| **Intel** | SYCL | oneAPI, Level Zero |
| **Portable** | Vulkan | Vulkan Compute |

### Advanced Kernel Generation:
- **Triton**: Integrated for generating custom GPU kernels across NVIDIA and AMD.
- **oneAPI / SYCL**: For Intel Data Center GPU support.
