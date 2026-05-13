import{t as e}from"./index-Bm8i0iSn.js";var t=e();function n(e){let n={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:`Optimizers`}),`
`,(0,t.jsxs)(`div`,{className:`py-12 px-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-white/10 mb-12`,children:[(0,t.jsx)(`h1`,{className:`text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60`,children:(0,t.jsx)(n.p,{children:`Accelerated Convergence.`})}),(0,t.jsx)(`p`,{className:`text-xl text-foreground/80 leading-relaxed max-w-2xl`,children:(0,t.jsx)(n.p,{children:`NEF2 optimizers are designed for high-throughput training, featuring hardware-native implementations of state-of-the-art optimization algorithms.`})})]}),`
`,(0,t.jsx)(n.h2,{children:`Beyond Python Loops`}),`
`,(0,t.jsx)(n.p,{children:`Traditional optimizers often suffer from significant overhead when updating millions of parameters from Python. NEF2 solves this by implementing optimizer update logic directly in C++ and CUDA kernels, ensuring that the "weight update" phase of training is as fast as the forward pass.`}),`
`,(0,t.jsx)(n.h2,{children:`Supported Optimizers`}),`
`,(0,t.jsx)(n.p,{children:`NEF2 provides optimized implementations for the most widely used algorithms:`}),`
`,(0,t.jsx)(n.h3,{children:`AdamW`}),`
`,(0,t.jsx)(n.p,{children:`The industry standard for training Transformers. NEF2's AdamW implementation includes integrated weight decay and specialized kernels to handle the second-moment estimations efficiently.`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`import nef2

optimizer = nef2.AdamW(model.parameters(), lr=1e-4, weight_decay=0.01)
`})}),`
`,(0,t.jsx)(n.h3,{children:`SGD with Momentum`}),`
`,(0,t.jsx)(n.p,{children:`A classic choice for computer vision. Our SGD implementation supports Nesterov momentum and is highly optimized for multi-GPU scaling.`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`optimizer = nef2.SGD(model.parameters(), lr=0.1, momentum=0.9)
`})}),`
`,(0,t.jsx)(n.h2,{children:`Hardware-Native Optimization`}),`
`,(0,t.jsx)(n.p,{children:`When running on NVIDIA or AMD hardware, NEF2 utilizes specialized kernels for the optimizer step. This reduces memory bandwidth pressure by combining the gradient application, weight decay, and momentum updates into a single fused operation.`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`# Under the hood, NEF2 might use a fused CUDA kernel for AdamW
# This avoids multiple round-trips to VRAM for each parameter
`})}),`
`,(0,t.jsx)(n.h2,{children:`Training Workflow`}),`
`,(0,t.jsx)(n.p,{children:`The optimizer works seamlessly with the NEF2 Autograd engine. A typical training step looks like this:`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`# 1. Forward pass
loss = model(inputs, targets)

# 2. Reset gradients
optimizer.zero_grad()

# 3. Backward pass (Autograd)
loss.backward()

# 4. Update weights (Hardware-accelerated)
optimizer.step()
`})}),`
`,(0,t.jsx)(n.h2,{children:`Custom Optimizers`}),`
`,(0,t.jsxs)(n.p,{children:[`The `,(0,t.jsx)(n.code,{children:`Optimizer`}),` base class allows you to implement custom optimization logic while still benefiting from NEF2's parameter management and hardware abstraction.`]}),`
`,(0,t.jsx)(n.p,{children:`By focusing on the performance of the weight update cycle, NEF2 ensures that your training runs aren't just accurate, but also significantly faster than traditional frameworks.`})]})}function r(e={}){let{wrapper:r}=e.components||{};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(n,{...e})}):n(e)}export{r as default};