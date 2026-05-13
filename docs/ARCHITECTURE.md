# NEF2 Architecture: The Unified AI Operating Substrate

NEF2 is structured as a multi-layered infrastructure stack designed to bypass the overhead of traditional ML frameworks.

## 1. NEFCore Runtime
The "heart" of the system. NEFCore manages the lifecycle of tensors and execution graphs.
- **Python Layer:** Provides the user-facing API and high-level logic.
- **C++ Layer:** Handles heavy matrix operations and performance-critical dispatch.
- **Rust Layer:** Manages safe concurrency, distributed networking, and plugin sandboxing.

## 2. Hardware Native Stack (NEF-HNS)
Unlike frameworks that depend on thick layers like PyTorch or JAX, NEF2 talks directly to hardware APIs.
- **CUDA Backend:** Loads the `nvcuda` driver and executes raw **PTX Kernels**.
- **HIP/ROCm Backend (Planned):** Native support for AMD accelerators.
- **Metal Backend (Planned):** Native support for Apple Silicon.

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
