import{t as e}from"./index-Bm8i0iSn.js";var t=e();function n(e){let n={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,ol:`ol`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:`Device Abstraction Layer (DAL)`}),`
`,(0,t.jsxs)(`div`,{className:`py-12 px-8 rounded-3xl bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-white/10 mb-12`,children:[(0,t.jsx)(`h1`,{className:`text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60`,children:(0,t.jsx)(n.p,{children:`Hardware Agnostic.`})}),(0,t.jsx)(`p`,{className:`text-xl text-foreground/80 leading-relaxed max-w-2xl`,children:(0,t.jsx)(n.p,{children:`The NEF Device Abstraction Layer (DAL) provides a unified interface for diverse hardware backends, enabling high-performance execution on NVIDIA, AMD, Apple, and Intel silicon.`})})]}),`
`,(0,t.jsx)(n.h2,{children:`The Unified Substrate`}),`
`,(0,t.jsx)(n.p,{children:`Modern AI infrastructure is often locked into specific hardware ecosystems. NEF2 breaks this lock-in by abstracting hardware-specific details behind a common set of primitives. The DAL allows developers to write code once and run it anywhere with near-native performance.`}),`
`,(0,t.jsx)(n.h3,{children:`DAL Primitives:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`TensorOps`}),`: Unified math operations (Add, Mul, MatMul, etc.).`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`MemoryOps`}),`: Cross-device allocation, deallocation, and peer-to-peer transfers.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`KernelLaunch`}),`: A standard way to submit work to hardware command queues.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`EventSystem`}),`: Synchronization primitives for multi-stream and multi-device coordination.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Backend Implementation`}),`
`,(0,t.jsxs)(n.p,{children:[`Each hardware vendor has a dedicated backend implementation within the `,(0,t.jsx)(n.code,{children:`nef2/backend/`}),` directory. These backends translate DAL calls into vendor-specific API calls (e.g., CUDA, HIP, Metal).`]}),`
`,(0,t.jsxs)(n.p,{children:[`| Backend | Technology | Status |
| :--- | :--- | :--- |
| `,(0,t.jsx)(n.strong,{children:`CUDA`}),` | NVIDIA Driver / PTX | Production Ready |
| `,(0,t.jsx)(n.strong,{children:`HIP`}),` | AMD ROCm / hipBLAS | Production Ready |
| `,(0,t.jsx)(n.strong,{children:`Metal`}),` | Apple Metal Performance Shaders | Production Ready |
| `,(0,t.jsx)(n.strong,{children:`SYCL`}),` | Intel oneAPI / oneMKL | Active Development |
| `,(0,t.jsx)(n.strong,{children:`Vulkan`}),` | SPIR-V / Cross-platform | Active Development |`]}),`
`,(0,t.jsx)(n.h2,{children:`Memory Management`}),`
`,(0,t.jsx)(n.p,{children:`The DAL manages device memory through a hierarchical allocation system. It supports:`}),`
`,(0,t.jsxs)(n.ol,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Pinned Host Memory`}),`: Fast transfers between CPU and GPU.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Unified Virtual Addressing`}),`: Simplifying data movement across different devices in the same node.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Direct P2P Transfers`}),`: Moving data between GPUs via NVLink or Infinity Fabric without touching the CPU.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Extensibility`}),`
`,(0,t.jsx)(n.p,{children:`Adding support for new hardware is a matter of implementing the DAL interface. Because NEF2 uses a modular architecture, new backends can be added as plugins without modifying the core runtime.`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`# DAL usage example (internal)
import nef2.backend as backend

# Get the optimal backend for the current environment
dev_backend = backend.get_backend("cuda")

# Allocate memory via DAL
ptr = dev_backend.alloc(1024 * 1024) # 1MB

# Launch a generic kernel
dev_backend.launch("my_custom_kernel", inputs, outputs)
`})}),`
`,(0,t.jsx)(n.p,{children:`The DAL ensures that NEF2 remains future-proof, ready for whatever silicon comes next in the rapidly evolving AI landscape.`})]})}function r(e={}){let{wrapper:r}=e.components||{};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(n,{...e})}):n(e)}export{r as default};