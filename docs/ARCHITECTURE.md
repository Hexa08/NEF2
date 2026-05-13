# NEF2 Architecture: The Unified AI Operating Substrate

NEF2 is structured as a multi-layered infrastructure stack designed to bypass the overhead of traditional ML frameworks.

## 1. NEFCore Runtime
The "heart" of the system. NEFCore manages the lifecycle of tensors and execution graphs.
- **Python Layer**: Provides the user-facing API and high-level logic.
- **C++ Layer**: Handles heavy matrix operations and performance-critical dispatch.
- **Rust Layer**: Manages safe concurrency, distributed networking, and plugin sandboxing.

## 2. NEF Device Abstraction Layer (DAL)
To support multi-vendor hardware without code duplication, NEF2 implements a unified Device Abstraction Layer. This layer exposes standard primitives (`TensorOps`, `MemoryOps`, `KernelLaunch`) that are implemented by vendor-specific backends.

### Internal Backend Structure:
```text
nef2/
 └── backend/
      ├── cuda/      # NVIDIA implementation
      ├── hip/       # AMD implementation
      ├── metal/     # Apple implementation
      ├── sycl/      # Intel implementation
      └── vulkan/    # Portable/Mobile implementation
```

## 3. HyperCache Memory Architecture
NEF2 implements a hierarchical memory system to support massive models on limited hardware.
- **VRAM (Hot)**: Active tokens and immediate gradients.
- **System RAM (Warm)**: Compressed KV-cache and weights.
- **NVMe (Cold)**: Semantic memory and archived weights streamed on-demand.

## 4. NEF Compiler Stack
The compiler transforms high-level Python code into optimized machine code.
- **NEFDynamo**: Captures the execution graph from standard Python code.
- **NEFIR**: A unified intermediate representation for model operations.
- **NEFInductor**: Performs kernel fusion to reduce memory bandwidth bottlenecks.

## 5. Agent-Native Infrastructure
NEF2 treats AI agents as primary primitives.
- **Shared Tensor Bus**: Allows multiple models to communicate without serialization.
- **Agent Coordination Runtime**: Manages the distributed cognition of multiple cooperating models.
