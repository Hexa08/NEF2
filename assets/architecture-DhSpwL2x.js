import{t as e}from"./index-Bm8i0iSn.js";var t=e();function n(e){let n={code:`code`,em:`em`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:`NEF2 Architecture`}),`
`,(0,t.jsx)(n.p,{children:`NEF2 is structured as a hierarchical stack that abstracts hardware complexity while exposing raw performance primitives.`}),`
`,(0,t.jsx)(n.h2,{children:`The Multi-Layered Substrate`}),`
`,(0,t.jsx)(n.p,{children:`The system is divided into five distinct layers, each optimized for its specific role in the execution lifecycle.`}),`
`,(0,t.jsx)(n.h3,{children:`1. NEFCore Runtime`}),`
`,(0,t.jsx)(n.p,{children:`The foundational layer responsible for tensor lifecycle management and execution graph dispatch.`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Performance`}),`: Written in C++17 and Rust.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Safety`}),`: Rust-based memory safety for distributed components.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Portability`}),`: Compiled as a native shared object for high-speed Python bindings.`]}),`
`]}),`
`,(0,t.jsx)(n.h3,{children:`2. Device Abstraction Layer (DAL)`}),`
`,(0,t.jsxs)(n.p,{children:[`The DAL provides a unified API for interacting with diverse hardware. It translates generic `,(0,t.jsx)(n.code,{children:`TensorOps`}),` into vendor-specific kernels.`]}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`NVIDIA`}),`: Direct PTX and cuBLAS integration.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`AMD`}),`: HIP and hipBLAS support.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Apple`}),`: Metal and MPSGraph acceleration.`]}),`
`]}),`
`,(0,t.jsx)(n.h3,{children:`3. HyperCache Memory Stack`}),`
`,(0,t.jsx)(n.p,{children:`A revolutionary approach to memory management that allows models to exceed the physical limits of VRAM.`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Hot`}),`: VRAM for active execution.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Warm`}),`: System RAM for pre-fetched weights and KV-cache.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Cold`}),`: NVMe storage for paged-out semantic memory.`]}),`
`]}),`
`,(0,t.jsx)(n.h3,{children:`4. NEF Compiler (Inductor)`}),`
`,(0,t.jsx)(n.p,{children:`The compiler transforms high-level Python models into optimized execution kernels.`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Kernel Fusion`}),`: Combines multiple operations into a single GPU kernel to reduce memory bandwidth.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Graph Capture`}),`: Uses NEFDynamo to capture execution logic without manual intervention.`]}),`
`]}),`
`,(0,t.jsx)(n.h3,{children:`5. Agent-Native Infrastructure`}),`
`,(0,t.jsx)(n.p,{children:`Built-in primitives for building distributed systems of cooperating AI models.`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Shared Tensor Bus`}),`: Zero-copy data sharing between multiple processes.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Coordination Layer`}),`: Managed lifecycle for multi-agent cognitive tasks.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Data Flow Diagram`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-mermaid`,children:`graph TD
    A[Python API] --> B[NEFDynamo]
    B --> C[NEFIR]
    C --> D[NEFInductor]
    D --> E[DAL]
    E --> F[Hardware: CUDA/HIP/Metal]
    G[HyperCache] -.-> E
`})}),`
`,(0,t.jsx)(n.p,{children:(0,t.jsx)(n.em,{children:`Note: The actual site will feature interactive WebGL-based diagrams in this section.`})})]})}function r(e={}){let{wrapper:r}=e.components||{};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(n,{...e})}):n(e)}export{r as default};