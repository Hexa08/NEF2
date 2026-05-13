import{t as e}from"./index-mj3Ep446.js";var t=e();function n(e){let n={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:`NEF Compiler Stack`}),`
`,(0,t.jsxs)(`div`,{className:`py-12 px-8 rounded-3xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-white/10 mb-12`,children:[(0,t.jsx)(`h1`,{className:`text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60`,children:(0,t.jsx)(n.p,{children:`Fusing Intelligence.`})}),(0,t.jsx)(`p`,{className:`text-xl text-foreground/80 leading-relaxed max-w-2xl`,children:(0,t.jsx)(n.p,{children:`The NEF Compiler stack transforms high-level Python code into highly optimized machine code through graph capture, intermediate representation, and kernel fusion.`})})]}),`
`,(0,t.jsx)(n.h2,{children:`Beyond Eager Execution`}),`
`,(0,t.jsx)(n.p,{children:`While eager execution is great for debugging, it introduces significant overhead due to Python's slow loop speeds and frequent kernel launch latencies. The NEF Compiler stack bypasses these bottlenecks by compiling the model into an optimized execution plan.`}),`
`,(0,t.jsx)(n.h2,{children:`The Compilation Pipeline`}),`
`,(0,t.jsx)(n.p,{children:`The compilation process follows three main stages:`}),`
`,(0,t.jsx)(n.h3,{children:`1. NEFDynamo (Graph Capture)`}),`
`,(0,t.jsx)(n.p,{children:`NEFDynamo uses PEP 523 (Frame Evaluation API) to intercept Python bytecode and extract the execution graph. Unlike traditional tracing, it can handle control flow (ifs and loops) by creating multiple sub-graphs or specialized guards.`}),`
`,(0,t.jsx)(n.h3,{children:`2. NEFIR (Intermediate Representation)`}),`
`,(0,t.jsxs)(n.p,{children:[`Once captured, the graph is lowered into `,(0,t.jsx)(n.strong,{children:`NEFIR`}),`. This is a hardware-agnostic representation of the model's logic. In NEFIR, we perform high-level optimizations such as:`]}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Dead Code Elimination`}),`: Removing operations that don't contribute to the final output.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Constant Folding`}),`: Pre-calculating static values.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Common Subexpression Elimination`}),`: Reusing the results of identical operations.`]}),`
`]}),`
`,(0,t.jsx)(n.h3,{children:`3. NEFInductor (Kernel Fusion)`}),`
`,(0,t.jsxs)(n.p,{children:[`The final stage is `,(0,t.jsx)(n.strong,{children:`NEFInductor`}),`, our state-of-the-art back-end compiler. Its primary goal is `,(0,t.jsx)(n.strong,{children:`Kernel Fusion`}),`. Instead of launching ten small kernels for a sequence of operations (e.g., `,(0,t.jsx)(n.code,{children:`ReLU(Add(Mul(x, w), b))`}),`), NEFInductor generates a single, optimized kernel that performs all operations in a single pass over the data. This drastically reduces memory bandwidth requirements—the primary bottleneck in modern AI.`]}),`
`,(0,t.jsx)(n.h2,{children:`Supported Fusion Types:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Pointwise Fusion`}),`: Combining simple element-wise ops.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Reduction Fusion`}),`: Fusing normalization layers like LayerNorm or BatchNorm with preceding operations.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Template-based Fusion`}),`: Utilizing high-performance GEMM and Convolution templates for heavy compute.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Usage`}),`
`,(0,t.jsx)(n.p,{children:`Compiling a model is as simple as a single function call:`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`import nef2

model = MyModel()
# Compile the model for peak performance
compiled_model = nef2.compile(model)

# The first run will trigger the compilation pipeline
output = compiled_model(input_tensor)
`})}),`
`,(0,t.jsx)(n.p,{children:`By bridging the gap between Pythonic flexibility and machine-code efficiency, the NEF Compiler stack ensures your models run at the speed of light.`})]})}function r(e={}){let{wrapper:r}=e.components||{};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(n,{...e})}):n(e)}export{r as default};