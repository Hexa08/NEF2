import{t as e}from"./index-mj3Ep446.js";var t=e();function n(e){let n={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:`Neural Networks (nn)`}),`
`,(0,t.jsxs)(`div`,{className:`py-12 px-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-white/10 mb-12`,children:[(0,t.jsx)(`h1`,{className:`text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60`,children:(0,t.jsx)(n.p,{children:`Modular Intelligence.`})}),(0,t.jsx)(`p`,{className:`text-xl text-foreground/80 leading-relaxed max-w-2xl`,children:(0,t.jsxs)(n.p,{children:[`The `,(0,t.jsx)(n.code,{children:`nef2.nn`}),` module provides high-level primitives for building complex neural network architectures with ease and performance.`]})})]}),`
`,(0,t.jsx)(n.h2,{children:`The Module Abstraction`}),`
`,(0,t.jsxs)(n.p,{children:[`At the core of `,(0,t.jsx)(n.code,{children:`nef2.nn`}),` is the `,(0,t.jsx)(n.code,{children:`Module`}),` class. It serves as the base class for all neural network components, handling parameter registration, state management, and the `,(0,t.jsx)(n.code,{children:`forward`}),` pass logic.`]}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Parameter Tracking`}),`: Modules automatically discover and track `,(0,t.jsx)(n.code,{children:`nef2.Parameter`}),` objects within their attributes, making it easy to pass them to optimizers.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Composition`}),`: Modules can contain other modules, allowing you to build hierarchical architectures like Transformers or ResNets through simple composition.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Execution Modes`}),`: Easily toggle between `,(0,t.jsx)(n.code,{children:`train()`}),` and `,(0,t.jsx)(n.code,{children:`eval()`}),` modes to control behavior like dropout or batch normalization.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Standard Layers`}),`
`,(0,t.jsx)(n.p,{children:`NEF2 includes a comprehensive set of pre-built layers, all optimized for the NEFCore runtime.`}),`
`,(0,t.jsx)(n.h3,{children:`Linear Layers`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`from nef2 import nn

# A standard fully-connected layer
fc = nn.Linear(in_features=512, out_features=1024)
`})}),`
`,(0,t.jsx)(n.h3,{children:`Normalization`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`# Hardware-accelerated LayerNorm
ln = nn.LayerNorm(normalized_shape=512)
`})}),`
`,(0,t.jsx)(n.h3,{children:`Embeddings`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`# Efficient lookup tables for NLP tasks
emb = nn.Embedding(num_embeddings=50000, embedding_dim=768)
`})}),`
`,(0,t.jsx)(n.h2,{children:`The Pipeline Engine`}),`
`,(0,t.jsxs)(n.p,{children:[`One of NEF2's unique features is the `,(0,t.jsx)(n.strong,{children:`Pipeline Engine`}),`, enabled by the `,(0,t.jsx)(n.code,{children:`>>`}),` operator. This allows you to chain models together such that they share a `,(0,t.jsx)(n.strong,{children:`Shared Tensor Bus`}),`, eliminating the need for data serialization between model boundaries.`]}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`# Chain models into a seamless pipeline
full_system = vision_model >> reasoning_model >> speech_model

# Execute the entire chain in one call
output = full_system(image_input)
`})}),`
`,(0,t.jsx)(n.h2,{children:`Custom Modules`}),`
`,(0,t.jsxs)(n.p,{children:[`Creating custom layers is straightforward. Simply inherit from `,(0,t.jsx)(n.code,{children:`nn.Module`}),` and define your logic.`]}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`class MyBlock(nn.Module):
    def __init__(self, dim):
        super().__init__()
        self.ln = nn.LayerNorm(dim)
        self.fc = nn.Linear(dim, dim)

    def forward(self, x):
        return x + self.fc(self.ln(x))
`})}),`
`,(0,t.jsxs)(n.p,{children:[`By providing a clean, modular API that doesn't sacrifice performance, `,(0,t.jsx)(n.code,{children:`nef2.nn`}),` empowers developers to build the next generation of AI models without the friction of traditional frameworks.`]})]})}function r(e={}){let{wrapper:r}=e.components||{};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(n,{...e})}):n(e)}export{r as default};