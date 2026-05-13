import{t as e}from"./index-mj3Ep446.js";var t=e();function n(e){let n={code:`code`,h1:`h1`,h2:`h2`,li:`li`,ol:`ol`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:`NEFCore Runtime`}),`
`,(0,t.jsxs)(`div`,{className:`py-12 px-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 mb-12`,children:[(0,t.jsx)(`h1`,{className:`text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60`,children:(0,t.jsx)(n.p,{children:`The Engine of Intelligence.`})}),(0,t.jsx)(`p`,{className:`text-xl text-foreground/80 leading-relaxed max-w-2xl`,children:(0,t.jsx)(n.p,{children:`NEFCore is the high-performance heart of NEF2. It orchestrates tensor lifecycles, execution graphs, and cross-language dispatch between Python, C++, and Rust.`})})]}),`
`,(0,t.jsx)(n.h2,{children:`Architecture Overview`}),`
`,(0,t.jsx)(n.p,{children:`NEFCore is designed to minimize the "Python tax" by moving heavy orchestration and compute logic into a compiled substrate. It consists of three primary layers:`}),`
`,(0,t.jsxs)(n.ol,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Python Frontend`}),`: Provides the ergonomic API for model definition and training. It uses `,(0,t.jsx)(n.code,{children:`ctypes`}),` and native extensions to communicate with the core.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`C++ Execution Engine`}),`: Handles the high-performance dispatch of tensor operations. It implements the graph execution logic and manages the interface with hardware-specific libraries (CUDA, HIP, etc.).`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Rust Safety & Concurrency Layer`}),`: Manages the multi-threaded aspects of the runtime, including asynchronous data loading, distributed coordination, and the Shared Tensor Bus.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Tensor Lifecycle`}),`
`,(0,t.jsx)(n.p,{children:`In NEFCore, a tensor is more than just a multi-dimensional array; it is a managed resource with a lifecycle tracked across memory tiers:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Allocation`}),`: Tensors are allocated via the Device Abstraction Layer (DAL). NEFCore uses a custom pool allocator to reduce fragmentation and allocation overhead.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Dispatch`}),`: When an operation is called, NEFCore analyzes the tensor's device and selects the optimal kernel. If a fused kernel is available from NEFInductor, it is prioritized.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Execution`}),`: Operations are submitted to hardware queues (e.g., CUDA streams). NEFCore supports asynchronous execution, allowing Python to continue preparing the next operation while the hardware is busy.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Deallocation`}),`: Memory is reclaimed automatically, but NEFCore also supports manual memory pinning and explicit deallocation for fine-grained control in memory-constrained environments.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Cross-Language Dispatch`}),`
`,(0,t.jsx)(n.p,{children:`NEFCore utilizes a "Zero-Overhead Dispatch" mechanism. By using stable C ABIs and shared memory pointers, NEF2 moves data between Python and the underlying C++/Rust core without copying.`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-cpp`,children:`// Internal C++ Dispatch Example
extern "C" {
    void nef_dispatch_op(const char* op_name, TensorHandle* inputs, int num_inputs, TensorHandle* output) {
        auto kernel = KernelRegistry::get(op_name, inputs[0]->device_type());
        kernel->launch(inputs, num_inputs, output);
    }
}
`})}),`
`,(0,t.jsx)(n.h2,{children:`Safety and Performance`}),`
`,(0,t.jsxs)(n.p,{children:[`The Rust layer (`,(0,t.jsx)(n.code,{children:`nef_rust`}),`) provides a safe boundary for complex operations like RDMA networking and multi-tier memory management. This ensures that while we operate at the limit of hardware performance, we maintain the memory safety required for stable long-running training jobs.`]}),`
`,(0,t.jsx)(n.p,{children:`By combining the flexibility of Python with the raw power of C++ and the safety of Rust, NEFCore provides a foundation that is both fast and reliable.`})]})}function r(e={}){let{wrapper:r}=e.components||{};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(n,{...e})}):n(e)}export{r as default};