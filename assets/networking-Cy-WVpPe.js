import{t as e}from"./index-Bm8i0iSn.js";var t=e();function n(e){let n={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,strong:`strong`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:`Networking & RDMA`}),`
`,(0,t.jsxs)(`div`,{className:`py-12 px-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-white/10 mb-12`,children:[(0,t.jsx)(`h1`,{className:`text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60`,children:(0,t.jsx)(n.p,{children:`Direct Memory Fabric.`})}),(0,t.jsx)(`p`,{className:`text-xl text-foreground/80 leading-relaxed max-w-2xl`,children:(0,t.jsx)(n.p,{children:`NEF2 Networking utilizes Remote Direct Memory Access (RDMA) to enable ultra-low latency communication between nodes, bypassing the CPU and standard TCP stack.`})})]}),`
`,(0,t.jsx)(n.h2,{children:`Bypassing the Kernel`}),`
`,(0,t.jsxs)(n.p,{children:[`In large-scale distributed training, the standard Linux networking stack (TCP/IP) becomes a major bottleneck. The overhead of context switching and memory copying can consume a significant portion of the training time. NEF2 bypasses these limitations using `,(0,t.jsx)(n.strong,{children:`NEF-RDMA`}),`.`]}),`
`,(0,t.jsx)(n.h2,{children:`Key Technologies`}),`
`,(0,t.jsx)(n.h3,{children:`1. RDMA (Remote Direct Memory Access)`}),`
`,(0,t.jsx)(n.p,{children:`NEF2 supports RoCE (RDMA over Converged Ethernet) and InfiniBand. This allows one GPU to read or write directly into the memory of a remote GPU on another node without involving either node's CPU or OS kernel.`}),`
`,(0,t.jsx)(n.h3,{children:`2. GPUDirect RDMA`}),`
`,(0,t.jsx)(n.p,{children:`By integrating with NVIDIA's GPUDirect technology, NEF2 can move data from VRAM directly to the network interface card (NIC), further reducing latency and CPU utilization.`}),`
`,(0,t.jsx)(n.h3,{children:`3. Multi-Rail Support`}),`
`,(0,t.jsx)(n.p,{children:`NEF2 Networking can aggregate bandwidth across multiple NICs (rail-alignment), ensuring that the network never becomes the bottleneck for models sharded across massive clusters.`}),`
`,(0,t.jsx)(n.h2,{children:`The NEF-Net API`}),`
`,(0,t.jsxs)(n.p,{children:[`While the underlying technology is complex, the `,(0,t.jsx)(n.code,{children:`nef2.net`}),` API provides a simple interface for high-performance communication.`]}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`import nef2.net as net

# Initialize the RDMA fabric
fabric = net.init_rdma(interface="ib0")

# Send a tensor directly from VRAM to a remote node
fabric.send(tensor, destination_rank=1, tag=101)

# Receive a tensor directly into a pre-allocated buffer
fabric.recv(buffer_tensor, source_rank=0, tag=101)
`})}),`
`,(0,t.jsx)(n.h2,{children:`Collective Communication`}),`
`,(0,t.jsx)(n.p,{children:`NEF2's collective operations (AllReduce, AllGather, Broadcast) are built on top of the RDMA substrate. They are designed to be "topology-aware," automatically choosing the most efficient communication pattern based on the physical wiring of the cluster (e.g., Ring vs. Tree vs. Mesh).`}),`
`,(0,t.jsx)(n.h2,{children:`Reliability & Error Correction`}),`
`,(0,t.jsx)(n.p,{children:`Despite bypassing the kernel, NEF-RDMA includes a high-performance Rust-based reliability layer. It handles packet retransmission, congestion control, and link failures, ensuring that even the largest distributed jobs are resilient to network jitter.`}),`
`,(0,t.jsx)(n.p,{children:`By transforming the network into a seamless extension of the memory bus, NEF2 Networking enables the training of the world's largest models with unprecedented efficiency.`})]})}function r(e={}){let{wrapper:r}=e.components||{};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(n,{...e})}):n(e)}export{r as default};