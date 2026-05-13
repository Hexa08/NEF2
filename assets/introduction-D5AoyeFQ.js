import{t as e}from"./index-Bm8i0iSn.js";var t=e();function n(e){let n={code:`code`,h1:`h1`,h2:`h2`,li:`li`,ol:`ol`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:`NEF2: The Unified AI Operating Substrate`}),`
`,(0,t.jsxs)(`div`,{className:`py-12 px-8 rounded-3xl bg-gradient-to-br from-accent/20 to-secondary/20 border border-white/10 mb-12`,children:[(0,t.jsx)(`h1`,{className:`text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60`,children:(0,t.jsx)(n.p,{children:`Bypass the Overhead.`})}),(0,t.jsx)(`p`,{className:`text-xl text-foreground/80 leading-relaxed max-w-2xl`,children:(0,t.jsx)(n.p,{children:`NEF2 is a high-performance, multi-layered infrastructure stack designed for the next generation of AI applications. We treat hardware as a first-class citizen, removing the friction between your model and the silicon.`})}),(0,t.jsxs)(`div`,{className:`flex gap-4 mt-8`,children:[(0,t.jsx)(`a`,{href:`/docs/getting-started`,className:`px-6 py-3 bg-accent hover:bg-accent/80 text-white rounded-full font-semibold transition-all`,children:(0,t.jsx)(n.p,{children:`Get Started`})}),(0,t.jsx)(`a`,{href:`/docs/architecture`,className:`px-6 py-3 bg-card hover:bg-card/80 border border-border rounded-full font-semibold transition-all`,children:(0,t.jsx)(n.p,{children:`View Architecture`})})]})]}),`
`,(0,t.jsx)(n.h2,{children:`Core Philosophy`}),`
`,(0,t.jsx)(n.p,{children:`Traditional ML frameworks are built on layers of abstraction that prioritize developer convenience over machine efficiency. NEF2 flips this model:`}),`
`,(0,t.jsxs)(n.ol,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Hardware Native`}),`: Direct communication with CUDA, HIP, and Metal via a unified substrate.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Agent First`}),`: Built-in support for multi-model coordination and shared tensor buses.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Memory Efficient`}),`: HyperCache technology pages model weights between VRAM, RAM, and NVMe on-demand.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Language Independent`}),`: Core logic implemented in C++ and Rust for peak performance.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Key Features`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Multi-GPU Fabric`}),`: Seamlessly scale models across clusters of mixed hardware.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`NEFInductor`}),`: A state-of-the-art compiler that performs kernel fusion and graph optimization.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`RDMA Networking`}),`: Low-latency communication for distributed training and inference.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Zero-Copy Serialization`}),`: Move models between disk and memory without expensive conversion steps.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Quick Start`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`import nef2
from nef2 import nn

# Define a model in standard Python
class Model(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc = nn.Linear(512, 1024)

    def forward(self, x):
        return self.fc(x)

# Run with hardware-native performance
model = Model()
inputs = nef2.Tensor.randn((1, 512))
outputs = model(inputs)
`})}),`
`,(0,t.jsx)(n.p,{children:`Join us in building the future of AI infrastructure.`})]})}function r(e={}){let{wrapper:r}=e.components||{};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(n,{...e})}):n(e)}export{r as default};