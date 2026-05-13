import{t as e}from"./index-CtgiBv6A.js";var t=e();function n(e){let n={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:`Getting Started`}),`
`,(0,t.jsx)(n.p,{children:`Welcome to the NEF2 ecosystem. This guide will help you set up your environment and build your first hardware-native model.`}),`
`,(0,t.jsx)(n.h2,{children:`Prerequisites`}),`
`,(0,t.jsx)(n.p,{children:`Before installing NEF2, ensure your system meets the following requirements:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`OS`}),`: Linux (Ubuntu 20.04+ recommended) or macOS 12+ (Apple Silicon).`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Python`}),`: 3.9 - 3.12.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Hardware`}),`: NVIDIA GPU (Compute Capability 7.0+), AMD GPU (ROCm 5.0+), or Apple M-Series Chip.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Installation`}),`
`,(0,t.jsx)(n.h3,{children:`From PyPI (Standard)`}),`
`,(0,t.jsx)(n.p,{children:`The easiest way to get started is via pip:`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-bash`,children:`pip install nef2
`})}),`
`,(0,t.jsx)(n.h3,{children:`Hardware-Accelerated (Recommended)`}),`
`,(0,t.jsx)(n.p,{children:`For full GPU support and optimized kernels, use our custom wheel index:`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-bash`,children:`pip install nef2 --extra-index-url https://Hexa08.github.io/whl/
`})}),`
`,(0,t.jsx)(n.h3,{children:`From Source`}),`
`,(0,t.jsx)(n.p,{children:`If you want to contribute or use the latest development features:`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-bash`,children:`git clone https://github.com/Hexa08/NEF2.git
cd NEF2
pip install -e .
`})}),`
`,(0,t.jsx)(n.h2,{children:`Verifying the Setup`}),`
`,(0,t.jsx)(n.p,{children:`Run the following diagnostic script to ensure NEF2 can see your hardware:`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`import nef2.gpu as gpu

print(f"CUDA Available: {gpu.cuda_available()}")
print(f"ROCm Available: {gpu.rocm_available()}")
print(f"Metal Available: {gpu.metal_available()}")

if any([gpu.cuda_available(), gpu.rocm_available(), gpu.metal_available()]):
    print("🚀 Hardware acceleration is active!")
`})}),`
`,(0,t.jsx)(n.h2,{children:`Your First Model`}),`
`,(0,t.jsx)(n.p,{children:`NEF2 follows a familiar object-oriented API for building neural networks.`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`import nef2
from nef2 import nn

class TinyModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.layer = nn.Linear(128, 10)

    def forward(self, x):
        return self.layer(x)

model = TinyModel()
x = nef2.Tensor.randn((1, 128))
y = model(x)
print(f"Output: {y.shape}")
`})}),`
`,(0,t.jsxs)(n.p,{children:[`Next, check out the `,(0,t.jsx)(n.a,{href:`/docs/architecture`,children:`Architecture`}),` guide to see how we optimize these operations under the hood.`]})]})}function r(e={}){let{wrapper:r}=e.components||{};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(n,{...e})}):n(e)}export{r as default};