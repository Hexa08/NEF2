import{t as e}from"./index-CtgiBv6A.js";var t=e();function n(e){let n={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:`Tensors`}),`
`,(0,t.jsxs)(`div`,{className:`py-12 px-8 rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10 mb-12`,children:[(0,t.jsx)(`h1`,{className:`text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60`,children:(0,t.jsx)(n.p,{children:`The Atomic Unit.`})}),(0,t.jsx)(`p`,{className:`text-xl text-foreground/80 leading-relaxed max-w-2xl`,children:(0,t.jsxs)(n.p,{children:[`The `,(0,t.jsx)(n.code,{children:`Tensor`}),` class is the fundamental building block of NEF2. It represents multi-dimensional arrays with hardware-native acceleration and automatic differentiation support.`]})})]}),`
`,(0,t.jsx)(n.h2,{children:`Performance Characteristics`}),`
`,(0,t.jsx)(n.p,{children:`NEF2 Tensors are designed for zero-overhead computation. Unlike generic arrays, they are aware of the underlying hardware substrate and the HyperCache memory hierarchy.`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Asynchronous Execution`}),`: Most tensor operations are submitted to hardware queues and return immediately. The runtime manages dependencies to ensure correctness.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Zero-Copy Views`}),`: Operations like slicing and reshaping create new tensor headers that point to the same underlying memory buffer, avoiding expensive data duplication.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Lazy Allocation`}),`: Memory is only physically allocated on the device when the tensor is first used in a computation, reducing VRAM fragmentation.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`API Reference`}),`
`,(0,t.jsxs)(n.p,{children:[`The `,(0,t.jsx)(n.code,{children:`nef2.Tensor`}),` API will feel familiar to users of NumPy or PyTorch, but it includes several advanced features for modern AI workloads.`]}),`
`,(0,t.jsx)(n.h3,{children:`Creation`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`import nef2

# From Python lists or NumPy
t1 = nef2.tensor([1.0, 2.0, 3.0])
# Random initialization
t2 = nef2.randn((128, 512), dtype="float16", device="cuda:0")
# Zeros and Ones
t3 = nef2.zeros_like(t2)
`})}),`
`,(0,t.jsx)(n.h3,{children:`Operations`}),`
`,(0,t.jsx)(n.p,{children:`Tensors support all standard mathematical operations, both as operators and as methods.`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`# Element-wise
a = t1 + t2
b = t1.relu()

# Matrix operations
c = nef2.matmul(t1, t2.T)
d = t1 @ t2.T
`})}),`
`,(0,t.jsx)(n.h2,{children:`Automatic Differentiation`}),`
`,(0,t.jsxs)(n.p,{children:[`NEF2 includes a built-in Autograd engine. When a tensor is created with `,(0,t.jsx)(n.code,{children:`requires_grad=True`}),`, the runtime tracks all operations performed on it, building a dynamic computational graph.`]}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`x = nef2.tensor([2.0, 3.0], requires_grad=True)
y = x[0] * x[1] + x[0]**2

y.backward()
print(x.grad) # [7.0, 2.0]
`})}),`
`,(0,t.jsx)(n.h2,{children:`Hardware Placement`}),`
`,(0,t.jsx)(n.p,{children:`Tensors can be moved between devices and host memory with ease. The DAL handles the underlying transfer protocols, utilizing RDMA or NVLink where available.`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`# Move to GPU
t_gpu = t_cpu.to("cuda")

# Move back to CPU for visualization
data = t_gpu.cpu().numpy()
`})}),`
`,(0,t.jsx)(n.p,{children:`By providing a powerful yet intuitive interface, NEF2 Tensors enable researchers and engineers to focus on model architecture rather than memory management.`})]})}function r(e={}){let{wrapper:r}=e.components||{};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(n,{...e})}):n(e)}export{r as default};