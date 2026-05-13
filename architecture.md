# NEF2 Unified Multi-Backend Runtime & Distributed Fabric

NEF2 is designed from day one to treat multi-GPU systems not as isolated islands passing messages, but as a unified execution fabric. The runtime orchestrates hardware using deep C++ abstractions that delegate natively to vendor-specific libraries.

## 1. Hardware Abstraction Layer (HAL)

To achieve true hardware agnosticism without sacrificing performance, NEF2 implements a polymorphic C++ Backend API:

```cpp
namespace nef {
    class Backend {
        virtual void launch_kernel(Kernel, args, stream) = 0;
        virtual void all_reduce(send, recv, op, stream) = 0;
        virtual void* malloc(size, device) = 0;
        // ...
    };
}
```

This enforces that the higher-level Python and C++ Graph layers NEVER include `cuda_runtime.h` or `hip/hip_runtime.h` directly. They rely exclusively on `nef::Device`, `nef::Stream`, and `nef::Backend`.

### 1.1 NVIDIA Backend (CUDA)
*   **Runtime:** The `CUDABackend` subclass delegates memory allocation to `cudaMalloc` and `cudaMemcpyAsync`.
*   **Math:** TensorOps are routed to `cuBLAS` (for GEMMs) and `cuDNN` (for Convolutions and RNNs).
*   **Communication:** `nef::comm::ProcessGroup` wraps `NCCL` (NVIDIA Collective Communications Library). `ncclAllReduce` and `ncclAllGather` are invoked natively for Tensor and Pipeline Parallelism across NVLink or InfiniBand.

### 1.2 AMD Backend (HIP / ROCm)
ROCm provides an almost 1:1 translation path for CUDA code, but NEF2 targets it natively.
*   **Runtime:** `HIPBackend` uses `hipMalloc` and `hipLaunchKernelGGL`.
*   **Math:** `hipBLAS` handles standard matrix multiplications. `MIOpen` replaces cuDNN for deep learning primitives. `rocWMMA` is used for accessing matrix core acceleration (similar to Tensor Cores).
*   **Communication:** **RCCL (ROCm Communication Collectives Library)** is critical here. It functions identically to NCCL but leverages AMD Infinity Fabric. When NEF2 distributes a transformer layer across 8 MI300X GPUs, the Rust Orchestrator schedules an `all_reduce` which the HAL drops directly into `rcclAllReduce`.

### 1.3 Apple Silicon Backend (Metal)
Apple architecture is Unified Memory architecture (UMA), meaning RAM and VRAM are shared.
*   **Runtime:** `MetalBackend` allocates memory via `MTLBuffer` and dispatches work via `MTLCommandQueue` and `MTLComputeCommandEncoder`.
*   **Math:** `MPSGraph` and raw Metal Shaders are used. Since Apple lacks a direct equivalent to cuBLAS/cuDNN for low-level matrix injection, NEF2 compiles custom `metal-cpp` kernels.
*   **Communication:** While multi-node Mac clusters are rare, the API remains unified. `all_reduce` on Apple Silicon simply performs a zero-copy pointer swap or local memory reduction, treating the unified M-series chip as a single massive accelerator.

### 1.4 Intel Backend (oneAPI / SYCL)
For Intel Data Center GPUs (Max Series) and integrated graphics.
*   **Runtime:** `SYCLBackend` utilizes `sycl::queue` and Unified Shared Memory (USM) through `sycl::malloc_device`.
*   **Math:** `oneMKL` (Intel oneAPI Math Kernel Library) for dense linear algebra and `oneDNN` for deep learning primitives.
*   **Communication:** **oneCCL (Intel oneAPI Collective Communications Library)** is used for multi-node and multi-GPU distributed operations, mapping to `all_reduce`, `all_gather`, and `broadcast`.

### 1.5 Vulkan Backend
Cross-platform GPU compute for mobile, gaming GPUs, and Linux environments without vendor drivers.
*   **Runtime:** `VulkanBackend` manages `VkDevice`, `VkQueue`, and memory allocation through `vkAllocateMemory`.
*   **Math:** Uses SPIR-V compute shaders for custom kernels and libraries like `Vulkan Kompute` or `vkFFT`.
*   **Communication:** Since Vulkan lacks a native multi-node collective library, NEF2 implements high-performance SPIR-V reduction kernels and utilizes the Rust orchestrator for cross-node coordination.

## 2. The Distributed Fabric & Collective Communication

NEF2 treats multi-GPU scaling as a fundamental primitive, not an afterthought.

### 2.1 Unified Accelerator Pools
Instead of manually moving tensors (`tensor.to("cuda:3")`), NEF2 supports virtualized routing. A user requests `tensor.to("cluster")`. The Rust orchestrator and C++ HAL maintain a topological map of the node.

### 2.2 Parallelism Strategies via Collectives
*   **Tensor Parallelism (TP):** Splitting a single MatMul across multiple GPUs. 
    *   *Implementation:* GPU 0 and GPU 1 calculate their half of the MatMul. The HAL issues an asynchronous `all_gather` (NCCL/RCCL) on the computation stream. The GPUs exchange the halves via NVLink/Infinity Fabric without CPU intervention.
*   **Pipeline Parallelism (PP):** Splitting layers of a model across GPUs (e.g., Layers 1-10 on GPU 0, 11-20 on GPU 1).
    *   *Implementation:* Uses asynchronous point-to-point sends/recvs (`ncclSend` / `rcclRecv`). NEF2 utilizes a zero-bubble scheduling algorithm.
*   **Expert Parallelism (EP):** For Mixture of Experts (MoE).
    *   *Implementation:* Uses `all_to_all` collectives to route tokens to the GPU holding the specific expert weights based on a gating network's routing decisions.

### 2.3 Zero-Copy Tensor Transfer
When passing data between GPUs on the same node, NEF2 uses `cudaMemcpyPeerAsync` or `hipMemcpyPeerAsync`. When passing data between nodes, the Rust orchestration layer leverages RDMA (Remote Direct Memory Access). The tensor memory on the GPU is pinned, and the network interface card (NIC) reads it directly from VRAM, bypassing the host CPU and RAM entirely.
