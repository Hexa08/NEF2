import{t as e}from"./index-Bm8i0iSn.js";var t=e();function n(e){let n={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,ol:`ol`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:`Mobile & Edge Deployment`}),`
`,(0,t.jsxs)(`div`,{className:`py-12 px-8 rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-white/10 mb-12`,children:[(0,t.jsx)(`h1`,{className:`text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60`,children:(0,t.jsx)(n.p,{children:`Intelligence Everywhere.`})}),(0,t.jsx)(`p`,{className:`text-xl text-foreground/80 leading-relaxed max-w-2xl`,children:(0,t.jsx)(n.p,{children:`NEF2 Mobile enables the deployment of high-performance models on iOS and Android devices, utilizing native acceleration via Metal, CoreML, and Vulkan.`})})]}),`
`,(0,t.jsx)(n.h2,{children:`The Edge Challenge`}),`
`,(0,t.jsxs)(n.p,{children:[`Deploying state-of-the-art models on mobile devices is notoriously difficult due to strict thermal limits, limited VRAM, and diverse hardware architectures. NEF2 Mobile addresses these challenges by utilizing the same `,(0,t.jsx)(n.strong,{children:`DAL`}),` and `,(0,t.jsx)(n.strong,{children:`HyperCache`}),` technologies used in the datacenter, tailored for the mobile environment.`]}),`
`,(0,t.jsx)(n.h2,{children:`Platform Backends`}),`
`,(0,t.jsx)(n.h3,{children:`iOS (CoreML & Metal)`}),`
`,(0,t.jsx)(n.p,{children:`NEF2 talks directly to Apple's Neural Engine (ANE) via CoreML and to the GPU via Metal. This ensures peak performance on iPhones and iPads. Our mobile runtime supports:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`MPSGraph Execution`}),`: Leveraging Apple's latest graph compiler.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Shared Memory`}),`: Efficiently moving data between CPU and GPU on unified memory architectures.`]}),`
`]}),`
`,(0,t.jsx)(n.h3,{children:`Android (Vulkan & NNAPI)`}),`
`,(0,t.jsxs)(n.p,{children:[`For the diverse Android ecosystem, NEF2 utilizes the `,(0,t.jsx)(n.strong,{children:`Vulkan Compute`}),` backend and the Android Neural Networks API (NNAPI). This provides a portable yet high-performance path for acceleration across Qualcomm, Samsung, and Google silicon.`]}),`
`,(0,t.jsx)(n.h2,{children:`Mobile-First Optimizations`}),`
`,(0,t.jsxs)(n.p,{children:[`The `,(0,t.jsx)(n.code,{children:`nef2.mobile`}),` export pipeline includes specialized optimizations for the edge:`]}),`
`,(0,t.jsxs)(n.ol,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Extreme Quantization`}),`: Automatic conversion to 4-bit and 8-bit formats via TurboQuant.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Operator Pruning`}),`: Removing operations not supported by mobile NPUs.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Static Memory Planning`}),`: Pre-calculating all memory requirements to avoid dynamic allocations during inference, reducing latency jitter.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Usage`}),`
`,(0,t.jsx)(n.p,{children:`Exporting a model for mobile is a single command:`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`import nef2.mobile as mobile

# Export to a mobile-optimized format
mobile.export(model, "my_model.nef_mobile", target_platform="ios")
`})}),`
`,(0,t.jsx)(n.h2,{children:`The NEF Mobile Runtime`}),`
`,(0,t.jsx)(n.p,{children:`The mobile runtime is a lightweight, C++ implementation of the NEFCore, with a minimal binary footprint (under 5MB). It can be easily integrated into native iOS (Swift) or Android (Kotlin/Java) applications.`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-swift`,children:`// Swift Example
let model = NEFModel(path: "my_model.nef_mobile")
let result = model.predict(inputTensor)
`})}),`
`,(0,t.jsx)(n.p,{children:`By bringing the power of the NEF substrate to the palm of your hand, NEF2 Mobile is enabling a new generation of private, offline, and ultra-responsive AI applications.`})]})}function r(e={}){let{wrapper:r}=e.components||{};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(n,{...e})}):n(e)}export{r as default};