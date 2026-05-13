import{t as e}from"./index-Bm8i0iSn.js";var t=e();function n(e){let n={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:`Hardware Support Matrix`}),`
`,(0,t.jsx)(n.p,{children:`NEF2 is designed to extract maximum performance from diverse hardware without requiring code changes from the user. We implement backend-specific drivers that talk directly to the hardware.`}),`
`,(0,t.jsx)(n.h2,{children:`Support Overview`}),`
`,(0,t.jsxs)(n.p,{children:[`| Backend | Platform | Status | Primary Library |
| :--- | :--- | :--- | :--- |
| `,(0,t.jsx)(n.strong,{children:`NVIDIA CUDA`}),` | Linux / Windows | Production | cuBLAS / cuDNN |
| `,(0,t.jsx)(n.strong,{children:`AMD ROCm`}),` | Linux | Production | hipBLAS / MIOpen |
| `,(0,t.jsx)(n.strong,{children:`Apple Metal`}),` | macOS / iOS | Production | MPSGraph |
| `,(0,t.jsx)(n.strong,{children:`Intel oneAPI`}),` | Linux / Windows | Active | oneMKL |
| `,(0,t.jsx)(n.strong,{children:`Vulkan`}),` | Mobile / Edge | Active | SPIR-V Kernels |`]}),`
`,(0,t.jsx)(n.h2,{children:`Backend Details`}),`
`,(0,t.jsx)(n.h3,{children:`NVIDIA CUDA`}),`
`,(0,t.jsx)(n.p,{children:`We utilize direct PTX kernel execution for high-performance ops.`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Features`}),`: FP16/BF16 Tensor Cores, Async Copy, VRAM Virtualization.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Minimum Requirements`}),`: Volta Architecture (7.0) or newer.`]}),`
`]}),`
`,(0,t.jsx)(n.h3,{children:`AMD HIP / ROCm`}),`
`,(0,t.jsx)(n.p,{children:`Full support for AMD's compute stack with zero-overhead dispatch.`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Features`}),`: Matrix Core acceleration, RCCL for multi-GPU, Infinity Fabric support.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Tested On`}),`: Instinct MI200/MI300, Radeon RX 7000 Series.`]}),`
`]}),`
`,(0,t.jsx)(n.h3,{children:`Apple Silicon (Metal)`}),`
`,(0,t.jsx)(n.p,{children:`Native integration with Apple's Metal Performance Shaders (MPS).`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Features`}),`: Unified Memory optimization, Neural Engine offloading (beta), MPSGraph fusion.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Support`}),`: M1, M2, and M3 series chips.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Automatic Selection`}),`
`,(0,t.jsxs)(n.p,{children:[`NEF2 automatically detects and selects the best available backend at runtime. You can override this behavior by setting the `,(0,t.jsx)(n.code,{children:`NEF_BACKEND`}),` environment variable:`]}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-bash`,children:`export NEF_BACKEND=cuda  # Force NVIDIA
export NEF_BACKEND=hip   # Force AMD
export NEF_BACKEND=metal # Force Apple
`})}),`
`,(0,t.jsxs)(n.p,{children:[`For more details on how to write custom kernels for these backends, see the `,(0,t.jsx)(n.a,{href:`/docs/developer-guide`,children:`Developer Guide`}),`.`]})]})}function r(e={}){let{wrapper:r}=e.components||{};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(n,{...e})}):n(e)}export{r as default};