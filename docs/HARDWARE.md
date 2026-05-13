# NEF2 Hardware Support Matrix

NEF2 is designed for "First-Class Hardware Support." We do not rely on generic abstractions; we write backend-specific drivers to extract maximum performance from production-grade libraries.

## 1. NVIDIA CUDA (Production Ready)

NEF2 talks directly to the NVIDIA Driver (`nvcuda.dll` / `libcuda.so.1`) via `ctypes`.

### Features:
- **PTX Kernel Execution**: Custom assembly kernels for `matmul`, `layernorm`, `cross_entropy`, and `embedding`.
- **Zero-Overhead Memory**: Direct control over device memory allocation and asynchronous transfers.
- **VRAM Virtualization**: Integrated with HyperCache to page memory to system RAM.

## 2. AMD HIP / ROCm Stack (Production Ready)

AMD’s main GPU compute platform is a primary target for NEF2.

### Core Libraries:
- **HIP Runtime**: The language/API layer for execution.
- **hipBLAS**: High-performance matrix multiplication and GEMM kernels.
- **MIOpen**: Deep learning primitives (convolutions, normalization).
- **RCCL**: Multi-GPU communication for the NEF Multi-GPU Fabric.
- **rocWMMA**: Tensor core acceleration for optimized transformer kernels.

## 3. Apple Silicon Backend (Production Ready)

NEF2 utilizes Apple's native Metal stack to extract peak performance from M-series chips.

### Core Libraries:
- **Metal API**: Main GPU compute framework for memory and command queues.
- **Metal Performance Shaders (MPS)**: Optimized tensor ops and transformer acceleration.
- **MPSGraph**: Graph execution and model scheduling.
- **metal-cpp**: C++ bindings to integrate Metal directly into the NEFCore runtime.

## 4. Intel oneAPI / SYCL (Active)
- **oneMKL**: Math Kernel Library for Intel GPUs.
- **oneCCL**: Collective Communications Library.

## 5. Vulkan Compute (Active)
- **Cross-vendor**: SPIR-V kernels for mobile and edge devices.
