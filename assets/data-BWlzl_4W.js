import{t as e}from"./index-Bm8i0iSn.js";var t=e();function n(e){let n={code:`code`,h1:`h1`,h2:`h2`,li:`li`,ol:`ol`,p:`p`,pre:`pre`,strong:`strong`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:`Data Loading & Preprocessing`}),`
`,(0,t.jsxs)(`div`,{className:`py-12 px-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-white/10 mb-12`,children:[(0,t.jsx)(`h1`,{className:`text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60`,children:(0,t.jsx)(n.p,{children:`Feeding the Beast.`})}),(0,t.jsx)(`p`,{className:`text-xl text-foreground/80 leading-relaxed max-w-2xl`,children:(0,t.jsx)(n.p,{children:`NEF2's data pipeline is built for extreme throughput, utilizing asynchronous I/O and multi-threaded Rust workers to ensure your GPUs never wait for data.`})})]}),`
`,(0,t.jsx)(n.h2,{children:`The Data Bottleneck`}),`
`,(0,t.jsx)(n.p,{children:`As GPU compute power increases, the bottleneck often shifts to the CPU and disk I/O. Loading, decoding, and augmenting data can become the primary constraint on training speed. NEF2 addresses this with a high-performance data substrate.`}),`
`,(0,t.jsx)(n.h2,{children:`High-Throughput Architecture`}),`
`,(0,t.jsxs)(n.p,{children:[`The `,(0,t.jsx)(n.code,{children:`nef2.data`}),` module utilizes several techniques to maximize throughput:`]}),`
`,(0,t.jsxs)(n.ol,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Rust Worker Pool`}),`: Data fetching and augmentation are offloaded to a pool of highly efficient Rust threads, bypassing the Python Global Interpreter Lock (GIL).`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Asynchronous Prefetching`}),`: Data for future batches is loaded and processed in the background, maintaining a high-speed buffer for the GPU.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Zero-Copy Loading`}),`: Utilizing memory-mapped files and direct I/O to move data from disk to memory with minimal CPU intervention.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`The DataLoader API`}),`
`,(0,t.jsxs)(n.p,{children:[`The `,(0,t.jsx)(n.code,{children:`DataLoader`}),` provides a simple interface for iterating over large datasets with built-in support for shuffling, batching, and parallel processing.`]}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`from nef2.data import DataLoader, Dataset

# Define a dataset
dataset = MyDataset("/path/to/data")

# Create a high-speed loader
loader = DataLoader(
    dataset, 
    batch_size=128, 
    shuffle=True, 
    num_workers=8,
    pin_memory=True
)

for batch in loader:
    # batch is already a nef2.Tensor on the target device
    train_step(batch)
`})}),`
`,(0,t.jsx)(n.h2,{children:`On-the-Fly Augmentation`}),`
`,(0,t.jsx)(n.p,{children:`NEF2 supports common data augmentation primitives (cropping, flipping, color jitter for vision; masking for NLP) implemented as high-performance kernels. Where possible, these augmentations are performed directly on the GPU to save CPU cycles.`}),`
`,(0,t.jsx)(n.h2,{children:`Distributed Data Sampling`}),`
`,(0,t.jsxs)(n.p,{children:[`When training across multiple nodes, the `,(0,t.jsx)(n.code,{children:`DistributedSampler`}),` ensures that each worker receives a unique, non-overlapping subset of the data, maintaining the mathematical correctness of the training process without complex manual partitioning.`]}),`
`,(0,t.jsx)(n.p,{children:`By treating data loading as a first-class performance problem, NEF2 ensures that your hardware investment is fully utilized, translating into faster iteration times and lower training costs.`})]})}function r(e={}){let{wrapper:r}=e.components||{};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(n,{...e})}):n(e)}export{r as default};