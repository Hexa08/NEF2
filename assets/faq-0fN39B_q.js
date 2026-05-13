import{t as e}from"./index-Bm8i0iSn.js";var t=e();function n(e){let n={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:`FAQ & Troubleshooting`}),`
`,(0,t.jsxs)(`div`,{className:`py-12 px-8 rounded-3xl bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-white/10 mb-12`,children:[(0,t.jsx)(`h1`,{className:`text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60`,children:(0,t.jsx)(n.p,{children:`Common Questions.`})}),(0,t.jsx)(`p`,{className:`text-xl text-foreground/80 leading-relaxed max-w-2xl`,children:(0,t.jsx)(n.p,{children:`Everything you need to know about setting up, optimizing, and troubleshooting your NEF2 environment.`})})]}),`
`,(0,t.jsx)(n.h2,{children:`General Questions`}),`
`,(0,t.jsx)(n.h3,{children:`How does NEF2 differ from PyTorch or JAX?`}),`
`,(0,t.jsx)(n.p,{children:`NEF2 is designed as a lower-level "substrate." While PyTorch focuses on researcher ergonomics, NEF2 focuses on machine efficiency and agent-native workflows. We bypass the overhead of traditional frameworks by utilizing a unified DAL and the HyperCache memory hierarchy.`}),`
`,(0,t.jsx)(n.h3,{children:`Can I use my existing PyTorch models?`}),`
`,(0,t.jsxs)(n.p,{children:[`Yes. NEF2 includes a converter for ONNX and Safetensors formats. You can also use our `,(0,t.jsx)(n.code,{children:`nef2.compiler`}),` to capture graphs from standard Python code.`]}),`
`,(0,t.jsx)(n.h2,{children:`Installation & Setup`}),`
`,(0,t.jsx)(n.h3,{children:`My GPU isn't being detected. What should I do?`}),`
`,(0,t.jsx)(n.p,{children:`Ensure you have the latest drivers for your hardware. Run the diagnostic tool:`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`import nef2.gpu as gpu
gpu.diagnostic_report()
`})}),`
`,(0,t.jsx)(n.p,{children:`Check if the required libraries (CUDA, ROCm, or Metal) are in your system's library path.`}),`
`,(0,t.jsx)(n.h3,{children:`Can I run NEF2 without a GPU?`}),`
`,(0,t.jsx)(n.p,{children:`Yes. NEF2 has a high-performance C++/SIMD backend for CPUs. However, many advanced features like HyperCache and large-scale training require a supported accelerator for optimal performance.`}),`
`,(0,t.jsx)(n.h2,{children:`Performance Tuning`}),`
`,(0,t.jsx)(n.h3,{children:`Why is my model training slower than expected?`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Check the Bottleneck`}),`: Use the NEF Profiler (`,(0,t.jsx)(n.code,{children:`nef2.metrics.profile`}),`) to see if you are CPU-bound, I/O-bound, or GPU-bound.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Enable Compilation`}),`: Ensure you are using `,(0,t.jsx)(n.code,{children:`nef2.compile(model)`}),` to enable kernel fusion.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`HyperCache Config`}),`: Adjust your `,(0,t.jsx)(n.code,{children:`max_hot_tokens`}),` and `,(0,t.jsx)(n.code,{children:`max_warm_tokens`}),` settings to better match your VRAM capacity.`]}),`
`]}),`
`,(0,t.jsx)(n.h3,{children:`How do I reduce VRAM usage?`}),`
`,(0,t.jsxs)(n.p,{children:[`Utilize `,(0,t.jsx)(n.strong,{children:`TurboQuant`}),` to quantize your weights to FP8 or INT8, and ensure `,(0,t.jsx)(n.strong,{children:`HyperCache`}),` is enabled to page less-frequently used data to system RAM.`]}),`
`,(0,t.jsx)(n.h2,{children:`Distributed Training`}),`
`,(0,t.jsx)(n.h3,{children:`What networking hardware is recommended?`}),`
`,(0,t.jsx)(n.p,{children:`For multi-node training, we strongly recommend InfiniBand or 100GbE+ with RoCE support to take full advantage of our RDMA networking stack.`}),`
`,(0,t.jsx)(n.h2,{children:`Getting More Help`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Discord`}),`: Join our developer community for real-time support.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`GitHub Issues`}),`: Report bugs or request features.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Documentation`}),`: Search through these pages for deep-dives into every module.`]}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`NEF2 is a complex system, but we're here to help you get the most out of it. If you can't find the answer here, don't hesitate to reach out.`})]})}function r(e={}){let{wrapper:r}=e.components||{};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(n,{...e})}):n(e)}export{r as default};