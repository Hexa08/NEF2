import{t as e}from"./index-mj3Ep446.js";var t=e();function n(e){let n={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:`Distributed Computing`}),`
`,(0,t.jsxs)(`div`,{className:`py-12 px-8 rounded-3xl bg-gradient-to-br from-rose-500/10 to-red-500/10 border border-white/10 mb-12`,children:[(0,t.jsx)(`h1`,{className:`text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60`,children:(0,t.jsx)(n.p,{children:`Scaling to the Horizon.`})}),(0,t.jsx)(`p`,{className:`text-xl text-foreground/80 leading-relaxed max-w-2xl`,children:(0,t.jsx)(n.p,{children:`NEF2 is built from the ground up for massive scale. Our distributed substrate enables seamless model and data parallelism across clusters of thousands of GPUs.`})})]}),`
`,(0,t.jsx)(n.h2,{children:`The Distributed Fabric`}),`
`,(0,t.jsxs)(n.p,{children:[`Distributed training in NEF2 is managed by the `,(0,t.jsx)(n.strong,{children:`NEF Fabric`}),`, a low-level orchestration layer that coordinates communication between devices. It supports multiple backends:`]}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`NCCL`}),`: For NVIDIA GPUs, utilizing NVLink and InfiniBand.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`RCCL`}),`: For AMD GPUs, utilizing Infinity Fabric.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Gloo`}),`: A versatile backend for CPU-based distributed tasks.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`NEF-RDMA`}),`: Our custom Rust-based networking stack for ultra-low latency direct memory access.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Parallelism Strategies`}),`
`,(0,t.jsx)(n.p,{children:`NEF2 supports a variety of strategies to scale models beyond a single device:`}),`
`,(0,t.jsx)(n.h3,{children:`1. Data Parallelism (DDP)`}),`
`,(0,t.jsxs)(n.p,{children:[`The simplest and most common strategy. Each GPU holds a copy of the model and processes a different batch of data. Gradients are synchronized using high-speed `,(0,t.jsx)(n.code,{children:`AllReduce`}),` operations.`]}),`
`,(0,t.jsx)(n.h3,{children:`2. Model Parallelism (Tensor Sharding)`}),`
`,(0,t.jsx)(n.p,{children:`For models too large for a single GPU's VRAM. NEF2 can shard individual layers across multiple GPUs, using collective communication to maintain consistency.`}),`
`,(0,t.jsx)(n.h3,{children:`3. Pipeline Parallelism`}),`
`,(0,t.jsxs)(n.p,{children:[`Different stages of a model are placed on different GPUs. NEF2's unique `,(0,t.jsx)(n.strong,{children:`Pipeline Engine`}),` and `,(0,t.jsx)(n.strong,{children:`Shared Tensor Bus`}),` minimize the overhead of moving intermediate activations between devices.`]}),`
`,(0,t.jsx)(n.h2,{children:`The Shared Tensor Bus`}),`
`,(0,t.jsx)(n.p,{children:`The Shared Tensor Bus is a breakthrough in multi-agent and multi-node coordination. It allows multiple independent model processes to share tensors in memory without the need for expensive serialization or IPC overhead.`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`import nef2.parallel as parallel

# Initialize the distributed environment
parallel.init_process_group(backend="nccl")

# Wrap your model for distributed data parallel training
model = parallel.DistributedDataParallel(MyModel())
`})}),`
`,(0,t.jsx)(n.h2,{children:`Fault Tolerance & Elasticity`}),`
`,(0,t.jsx)(n.p,{children:`Large-scale training runs are prone to hardware failures. NEF2 includes built-in support for elastic training, allowing the cluster to automatically reconfigure itself if a node goes offline, resuming from the last checkpoint without manual intervention.`}),`
`,(0,t.jsx)(n.p,{children:`By removing the complexity of distributed systems, NEF2 allows you to scale your ambitions from a single workstation to a world-class supercomputer.`})]})}function r(e={}){let{wrapper:r}=e.components||{};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(n,{...e})}):n(e)}export{r as default};