import{t as e}from"./index-CtgiBv6A.js";var t=e();function n(e){let n={code:`code`,h1:`h1`,h2:`h2`,li:`li`,ol:`ol`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:`HyperCache Memory Architecture`}),`
`,(0,t.jsxs)(`div`,{className:`py-12 px-8 rounded-3xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-white/10 mb-12`,children:[(0,t.jsx)(`h1`,{className:`text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60`,children:(0,t.jsx)(n.p,{children:`Infinite Memory.`})}),(0,t.jsx)(`p`,{className:`text-xl text-foreground/80 leading-relaxed max-w-2xl`,children:(0,t.jsx)(n.p,{children:`HyperCache is NEF2's intelligent memory virtualization system, seamlessly paging model weights and KV-caches across VRAM, System RAM, and NVMe storage.`})})]}),`
`,(0,t.jsx)(n.h2,{children:`The Memory Wall Problem`}),`
`,(0,t.jsx)(n.p,{children:`As models grow to trillions of parameters, they quickly exceed the physical VRAM available on even the most advanced GPUs. Traditional solutions involve slow offloading or expensive model parallelism. HyperCache solves this by treating all system memory as a single, virtualized hierarchy.`}),`
`,(0,t.jsx)(n.h2,{children:`Hierarchical Tiers`}),`
`,(0,t.jsx)(n.p,{children:`HyperCache organizes memory into three distinct tiers, optimized for latency and capacity:`}),`
`,(0,t.jsxs)(n.ol,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Hot (VRAM)`}),`: The most performance-critical data. This includes active tokens, immediate gradients, and the most frequently accessed weights.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Warm (System RAM)`}),`: Compressed KV-caches and secondary weight sets. Data in this tier can be paged into VRAM with minimal latency.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Cold (NVMe/SSD)`}),`: Semantic memory, archived weights, and long-term KV history. Data is streamed on-demand using high-speed NVMe protocols.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Intelligent Tiering Logic`}),`
`,(0,t.jsx)(n.p,{children:`HyperCache doesn't just move data; it makes "smart" decisions based on token importance and temporal locality:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Token Importance`}),`: During inference, HyperCache analyzes the attention weights to determine which tokens are critical for the current context. Low-importance tokens are compressed (using TurboQuant) and moved to the "Warm" or "Cold" tiers.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Temporal Decay`}),`: As the reasoning window shifts, older context is automatically migrated to slower storage tiers to make room for new input.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Predictive Prefetching`}),`: Based on the execution graph, HyperCache predicts which weights will be needed next and begins the transfer from RAM to VRAM before they are called.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`TurboQuant Integration`}),`
`,(0,t.jsxs)(n.p,{children:[`To maximize the capacity of each tier, HyperCache is tightly integrated with the `,(0,t.jsx)(n.strong,{children:`TurboQuant`}),` stack. Weights and caches can be dynamically re-quantized as they move between tiers (e.g., FP16 in VRAM, FP8 in RAM, INT4 on SSD).`]}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`from nef2.memory import HyperCache

# Initialize HyperCache with custom tier limits
cache = HyperCache(max_hot_tokens=2048, max_warm_tokens=8192)

# Append new data with an importance score
cache.append(key_tensor, value_tensor, token_importance=0.95)

# HyperCache automatically manages the migration between VRAM, RAM, and NVMe
stats = cache.stats()
print(f"VRAM usage: {stats['hot_tokens']} tokens")
`})}),`
`,(0,t.jsx)(n.p,{children:`HyperCache turns a single 24GB GPU into a workstation capable of running massive models, democratizing access to state-of-the-art AI.`})]})}function r(e={}){let{wrapper:r}=e.components||{};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(n,{...e})}):n(e)}export{r as default};