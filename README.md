<div align="center">

# NEF2: The AI Operating Substrate

**A next-generation neural framework designed for peak performance, hardware-native execution, and autonomous AI systems.**

[![PyPI](https://img.shields.io/pypi/v/nef2.svg?color=0f766e)](https://pypi.org/project/nef2/)
[![Python](https://img.shields.io/pypi/pyversions/nef2.svg?color=2563eb)](https://pypi.org/project/nef2/)
[![License](https://img.shields.io/badge/license-MIT-111827.svg)](LICENSE)
[![GPU](https://img.shields.io/badge/GPU-Native%20CUDA%20%7C%20HIP%20%7C%20Metal-f59e0b.svg)](#hardware-native-stack)

`pip install nef2`

</div>

---

## 🚀 Vision

NEF2 is not just another "deep learning library." It is an **AI Infrastructure Stack** built to bridge the gap between high-level research and hardware-peak performance. While traditional frameworks treat GPUs as external devices, NEF2 treats them as native components of a unified **AI Memory Fabric**.

### Why NEF2?
*   **Zero-Framework Dependency:** No PyTorch, no TensorFlow, no JAX. We talk directly to the hardware.
*   **Hardware-Native Stack:** Custom CUDA driver backend using raw PTX kernels for maximum efficiency.
*   **NEFCore Runtime:** A hybrid execution engine spanning Python, C++, and Rust.
*   **HyperCache Memory:** Intelligent KV-cache management that virtualizes VRAM across System RAM and NVMe.
*   **Agent-Native Architecture:** Built from the ground up to support autonomous agents as first-class primitives.

---

## 🛠 Features & Capabilities

| Area | Status | Technology |
| :--- | :--- | :--- |
| **Execution Engine** | ✅ Active | **NEFCore**: C++ / Python / Rust hybrid |
| **GPU Backend** | ✅ Active | **Native CUDA Driver** (no external toolkit required) |
| **Autograd** | ✅ Active | Reverse-mode graph execution |
| **Memory** | 🚧 Beta | **HyperCache**: Hierarchical VRAM/RAM/NVMe pooling |
| **Quantization** | 🚧 Beta | **TurboQuant**: Dynamic precision (FP8, INT4, NF4) |
| **Multi-GPU** | 📅 Planned | Native GPU Fabric for unified execution |
| **Compiler** | 📅 Planned | **NEFDynamo**: Graph capture & kernel fusion |

---

## 📦 Project Layout

```text
nef2/
  ├── gpu.py             # Native CUDA Driver backend (PTX Kernels)
  ├── tensor.py          # NEFCore Tensor engine & Autograd
  ├── nn.py              # Neural layers (Linear, LayerNorm, etc.)
  ├── models/            # Native model implementations (GPT, Vision)
  ├── compiler/          # JIT Graph capture & Inductor fusion
  ├── vendor/            # High-performance native BLAS/NCCL libs
  └── cli/               # Hardware stress tests & diagnostic tools
```

---

## 🚦 Quick Start

### Hardware-Native Tensor Operations
NEF2 automatically detects and utilizes available hardware backends (CUDA, HIP, Metal).

```python
from nef2 import Tensor
import nef2.gpu as gpu

# Create a tensor (defaults to NEFCore CPU)
x = Tensor([[1, 2], [3, 4]], requires_grad=True)

# Explicitly use the CUDA backend if available
if gpu.cuda_available():
    a = gpu.tensor([[1.0, 2.0], [3.0, 4.0]])
    b = gpu.tensor([[5.0, 6.0], [7.0, 8.0]])
    c = a.matmul(b)
    print(c.tolist())
```

### Building a Model
NEF2 provides a familiar API for users of modern ML frameworks while maintaining internal independence.

```python
from nef2.models import GPT, GPTConfig

config = GPTConfig(vocab_size=16, block_size=256, n_embd=384, n_layer=6, n_head=6)
model = GPT(config)

# Forward pass through the GPT architecture
logits = model(Tensor([[1, 2, 3, 4]]))
```

---

## 🗺 Roadmap: The Road to Autonomy

1.  **Phase 1: Foundation** - Pure Python/C++ core with custom CUDA kernels (Current).
2.  **Phase 2: Hybrid Acceleration** - Integration of Rust for safe, distributed concurrency and networking.
3.  **Phase 3: HyperScale Fabric** - Unified multi-GPU runtime where all cards behave as one logical accelerator.
4.  **Phase 4: Agentic Intelligence** - Native support for streaming inference pipelines and agent coordination.

---

## 📄 License
NEF2 is released under the **MIT License**. See [LICENSE](LICENSE) for details.

---

<div align="center">
  <b>Built for the future of Distributed Intelligence.</b>
</div>
