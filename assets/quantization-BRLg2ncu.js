import{t as e}from"./index-mj3Ep446.js";var t=e();function n(e){let n={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:`Quantization (TurboQuant)`}),`
`,(0,t.jsxs)(`div`,{className:`py-12 px-8 rounded-3xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-white/10 mb-12`,children:[(0,t.jsx)(`h1`,{className:`text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60`,children:(0,t.jsx)(n.p,{children:`Precision Redefined.`})}),(0,t.jsx)(`p`,{className:`text-xl text-foreground/80 leading-relaxed max-w-2xl`,children:(0,t.jsx)(n.p,{children:`TurboQuant is NEF2's state-of-the-art quantization stack, enabling models to run with extreme efficiency by utilizing low-precision formats like FP8, INT8, and 4-bit.`})})]}),`
`,(0,t.jsx)(n.h2,{children:`The Precision-Performance Tradeoff`}),`
`,(0,t.jsx)(n.p,{children:`Traditional deep learning uses 32-bit floating point (FP32) for training and 16-bit (FP16/BF16) for inference. While accurate, these formats are demanding on memory bandwidth and VRAM. TurboQuant allows you to push the limits of efficiency by using lower precision with minimal impact on model quality.`}),`
`,(0,t.jsx)(n.h2,{children:`Supported Formats`}),`
`,(0,t.jsx)(n.p,{children:`TurboQuant supports a wide range of precisions, optimized for modern hardware:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`FP8 (E4M3/E5M2)`}),`: The new standard for high-performance training and inference on NVIDIA H100 and newer. It provides a near-perfect balance of range and precision.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`INT8`}),`: Widely supported across almost all modern CPUs and GPUs. Excellent for deployment on edge devices.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`4-bit (NF4/GGUF)`}),`: The gold standard for running massive LLMs on consumer hardware. TurboQuant utilizes Advanced Weight Quantization (AWQ) and AutoGPTQ techniques to maintain high accuracy at 4-bit.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Dynamic Quantization`}),`
`,(0,t.jsxs)(n.p,{children:[`One of TurboQuant's unique features is `,(0,t.jsx)(n.strong,{children:`Dynamic Precision Scaling`}),`. Instead of quantizing the entire model to a fixed format, TurboQuant can adjust precision on-the-fly based on the sensitivity of individual layers or even specific tokens (integrated with HyperCache).`]}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`from nef2.memory import TurboQuant

# Quantize a tensor to FP8 for efficient storage in HyperCache
compressed_tensor = TurboQuant.quantize(original_tensor, target_precision="FP8")
`})}),`
`,(0,t.jsx)(n.h2,{children:`Hardware-Native Kernels`}),`
`,(0,t.jsx)(n.p,{children:`TurboQuant isn't just about storage; it's about execution. We provide high-performance kernels for:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Mixed-Precision MatMul`}),`: Multiplying INT8 weights by FP16 activations.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Vectorized Dequantization`}),`: Rapidly converting low-precision weights during the forward pass.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Fused Quant-Op-Dequant`}),`: Performing operations entirely in low precision to save bandwidth.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Usage in Training (QAT)`}),`
`,(0,t.jsxs)(n.p,{children:[`TurboQuant supports `,(0,t.jsx)(n.strong,{children:`Quantization-Aware Training (QAT)`}),`, allowing the model to learn to compensate for the quantization error during the training process. This results in significantly higher accuracy compared to post-training quantization (PTQ).`]}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`import nef2.nn as nn

# Define a model with quantization-aware layers
model = nn.Sequential(
    nn.Linear(512, 1024, quantization="FP8"),
    nn.ReLU(),
    nn.Linear(1024, 10, quantization="INT8")
)
`})}),`
`,(0,t.jsx)(n.p,{children:`By mastering the art of low-precision computation, TurboQuant ensures that your models are not just powerful, but also exceptionally lean and fast.`})]})}function r(e={}){let{wrapper:r}=e.components||{};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(n,{...e})}):n(e)}export{r as default};