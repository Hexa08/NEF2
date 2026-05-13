import{t as e}from"./index-mj3Ep446.js";var t=e();function n(e){let n={code:`code`,h1:`h1`,h2:`h2`,li:`li`,ol:`ol`,p:`p`,pre:`pre`,strong:`strong`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:`Serialization & Model I/O`}),`
`,(0,t.jsxs)(`div`,{className:`py-12 px-8 rounded-3xl bg-gradient-to-br from-slate-500/10 to-gray-500/10 border border-white/10 mb-12`,children:[(0,t.jsx)(`h1`,{className:`text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60`,children:(0,t.jsx)(n.p,{children:`Zero-Copy Persistence.`})}),(0,t.jsx)(`p`,{className:`text-xl text-foreground/80 leading-relaxed max-w-2xl`,children:(0,t.jsx)(n.p,{children:`NEF2's serialization engine is built for speed, utilizing zero-copy memory mapping to save and load massive models in seconds.`})})]}),`
`,(0,t.jsx)(n.h2,{children:`The Serialization Bottleneck`}),`
`,(0,t.jsx)(n.p,{children:`For models with hundreds of billions of parameters, the simple act of loading weights from disk can take minutes, stalling research and deployment. Standard formats like Pickle or even Safetensors often involve expensive data copies or Python-level overhead.`}),`
`,(0,t.jsx)(n.h2,{children:`The NEF Format (.nef)`}),`
`,(0,t.jsxs)(n.p,{children:[`NEF2 introduces the `,(0,t.jsx)(n.strong,{children:`.nef`}),` format, designed for high-performance I/O:`]}),`
`,(0,t.jsxs)(n.ol,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Memory-Mapped I/O (mmap)`}),`: Models are mapped directly from disk into the process's address space. The OS handles paging data into RAM on-demand, allowing for "instant" loading.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`FlatBuffers Architecture`}),`: The file structure is designed so that the on-disk representation is identical to the in-memory representation. No "parsing" or "deserialization" is required.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Unified Metadata`}),`: Architecture details, quantization scales, and hardware requirements are embedded directly in the file header.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Fast Saving and Loading`}),`
`,(0,t.jsxs)(n.p,{children:[`The `,(0,t.jsx)(n.code,{children:`nef2.serialization`}),` module provides a simple API for persisting your models.`]}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`import nef2

# Save a model with zero-copy efficiency
nef2.save(model, "my_model.nef")

# Load a model instantly via memory mapping
model = nef2.load("my_model.nef")
`})}),`
`,(0,t.jsx)(n.h2,{children:`Shared Weights & Forking`}),`
`,(0,t.jsxs)(n.p,{children:[`Because NEF2 utilizes memory mapping, multiple processes on the same machine can load the same `,(0,t.jsx)(n.code,{children:`.nef`}),` file and share the underlying physical RAM. This is invaluable for serving multiple instances of a model or performing multi-GPU inference without duplicating weight memory.`]}),`
`,(0,t.jsx)(n.h2,{children:`Cross-Hardware Compatibility`}),`
`,(0,t.jsxs)(n.p,{children:[`While optimized for raw speed, the `,(0,t.jsx)(n.code,{children:`.nef`}),` format is hardware-agnostic. A model saved on an NVIDIA workstation can be loaded on an Apple Silicon MacBook or an AMD-based server. The NEFCore runtime handles the necessary device-specific allocations and transfers upon loading.`]}),`
`,(0,t.jsx)(n.h2,{children:`Checkpointing for Large-Scale Training`}),`
`,(0,t.jsxs)(n.p,{children:[`For long-running training jobs, NEF2 provides an `,(0,t.jsx)(n.strong,{children:`Asynchronous Checkpointer`}),`. This allows the training process to continue immediately after a checkpoint is "initiated," with a background Rust thread handling the actual I/O to disk or cloud storage.`]}),`
`,(0,t.jsx)(n.p,{children:`By treating serialization as a performance-critical operation, NEF2 ensures that your workflow is never stalled by the speed of your storage.`})]})}function r(e={}){let{wrapper:r}=e.components||{};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(n,{...e})}):n(e)}export{r as default};