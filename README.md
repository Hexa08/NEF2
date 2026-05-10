# NEF2

NEF2 is a tiny neural network and LLM training framework with a pure-Python CPU
core and a NEF2-owned CUDA backend:

- `Tensor` values with reverse-mode autograd
- `Module`, `Parameter`, `Linear`, `Embedding`, `LayerNorm`, `Dropout`
- `SGD`, `AdamW`, and CUDA-backed `CudaSGD`
- character tokenization and batch creation
- byte tokenization for large web text datasets
- a compact GPT-style CPU model that runs with only the Python standard library
- CUDA tensor kernels loaded directly through NVIDIA's driver API
- multi-GPU discovery and explicit device placement for CUDA devices

The CPU core has no third-party runtime dependencies. GPU support uses Python's
standard-library `ctypes` with `nvcuda.dll`; it does not use external ML
frameworks.

## Quick Start

```python
from nef2 import Tensor
from nef2.models import GPT, GPTConfig

model = GPT(GPTConfig(vocab_size=16, block_size=8, n_embd=8, n_layer=1, n_head=2))
logits = model(Tensor([[1, 2, 3, 4]]))
print(logits.shape)
```

## CUDA Backend

```python
from nef2 import gpu

print(gpu.device_name())
print(gpu.list_devices())
a = gpu.tensor([1, 2, 3])
b = gpu.tensor([4, 5, 6])
print((a + b).tolist())
```

Choose a CUDA device:

```python
from nef2 import gpu

with gpu.use_device(0):
    x = gpu.tensor([1, 2, 3])
```

Use the CUDA optimizer in training:

```python
from nef2 import CudaSGD, Linear, Tensor

x = Tensor([[1.0, 2.0]], requires_grad=True)
layer = Linear(2, 1)
loss = layer(x).sum()
loss.backward()
CudaSGD(layer.parameters(), lr=0.01).step()
```

Keep the GPU busy long enough to verify in `nvidia-smi`:

```powershell
nef2-gpu-stress --seconds 60 --hold-seconds 10 --elements 50000000
```

## Wikipedia 200M Preset

NEF2 includes a Hugging Face Wikipedia loader that uses the public dataset-server
API with the Python standard library:

```powershell
nef2-wikipedia-200m --preset 200m --articles 8
```

This creates the 200M configuration without allocating the full pure-Python
parameter set. For a small end-to-end smoke train on Wikipedia text:

```powershell
nef2-wikipedia-200m --preset tiny --articles 4 --steps 2
```

Save trained weights:

```powershell
nef2-wikipedia-200m --preset tiny --articles 4 --steps 50 --save model.nef
```

## Project Layout

- `nef2/tensor.py` - scalar/list tensor storage and autograd
- `nef2/nn.py` - neural-network module primitives
- `nef2/optim.py` - CPU optimizers and CUDA SGD bridge
- `nef2/tokenizer.py` - character tokenizer
- `nef2/byte_tokenizer.py` - byte tokenizer
- `nef2/data.py` - sequence batching
- `nef2/datasets/huggingface.py` - Hugging Face Wikipedia loader
- `nef2/gpu.py` - NEF2 CUDA driver backend
- `nef2/serialization.py` - `.nef` model save/load helpers
- `nef2/models/gpt.py` - causal Transformer language model

## Current Scope

This is an educational reference implementation, not a fast production runtime.
The CUDA backend currently covers low-level float tensor kernels and optimizer
updates; broader model execution can be moved onto these kernels incrementally.
NVIDIA CUDA is implemented. AMD, Intel, Apple, Vulkan, OpenCL, HIP/ROCm, Metal,
and Level Zero backends need separate native backend implementations; NEF2 exposes
backend errors clearly instead of pretending unsupported GPUs are active.
