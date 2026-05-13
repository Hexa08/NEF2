# Getting Started with NEF2

Welcome to the NEF2 ecosystem. This guide will help you set up your environment and build your first hardware-native model.

## 1. Prerequisites

- **OS**: Linux (Ubuntu 20.04+ recommended) or Windows 10/11.
- **Python**: 3.8 - 3.12.
- **GPU (Optional)**: NVIDIA GPU with latest drivers for CUDA support.

## 2. Installation

### From PyPI (Standard)
```bash
pip install nef2
```

### From Custom Index (Hardware-Accelerated)
For full GPU support (CUDA, ROCm, etc.), use the custom wheel index:
```bash
pip install nef2 --extra-index-url https://hexainnovateorg.github.io/whl/
```

### From Source (Development Mode)
```bash
git clone https://github.com/Hexa08/NEF2.git
cd NEF2
pip install -e .
```

## 3. Verifying Hardware Acceleration

NEF2 includes a built-in diagnostic tool to check for GPU availability and performance.

```python
import nef2.gpu as gpu

print(f"CUDA Available: {gpu.cuda_available()}")
if gpu.cuda_available():
    print(f"Active Device: {gpu.device_name()}")
    gpu.list_devices()
```

## 4. Your First Model

NEF2 uses a familiar API. Here is how to define and run a simple MLP using NEFCore.

```python
import nef2
from nef2 import nn

class MyModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.lin1 = nn.Linear(784, 256)
        self.relu = nn.ReLU()
        self.lin2 = nn.Linear(256, 10)

    def forward(self, x):
        x = self.lin1(x)
        x = self.relu(x)
        return self.lin2(x)

model = MyModel()
inputs = nef2.Tensor.randn((32, 784))
outputs = model(inputs)
print(f"Output shape: {outputs.shape}")
```

## 5. Training Loop Example

```python
optimizer = nef2.AdamW(model.parameters(), lr=1e-3)

for epoch in range(10):
    # Forward pass
    logits = model(inputs)
    loss = nef2.cross_entropy(logits, targets)
    
    # Backward pass
    model.zero_grad()
    loss.backward()
    
    # Update weights
    optimizer.step()
    print(f"Epoch {epoch} | Loss: {loss.item():.4f}")
```

## Next Steps
- Explore the **[Architecture Deep-Dive](./ARCHITECTURE.md)** to understand how NEF2 optimizes execution.
- Learn about custom kernel development in the **[Developer Guide](./DEVELOPER.md)**.
