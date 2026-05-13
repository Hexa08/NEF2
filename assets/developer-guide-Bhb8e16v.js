import{t as e}from"./index-mj3Ep446.js";var t=e();function n(e){let n={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,ol:`ol`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:`Developer Guide & Standards`}),`
`,(0,t.jsxs)(`div`,{className:`py-12 px-8 rounded-3xl bg-gradient-to-br from-slate-500/10 to-gray-500/10 border border-white/10 mb-12`,children:[(0,t.jsx)(`h1`,{className:`text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60`,children:(0,t.jsx)(n.p,{children:`Building the Future.`})}),(0,t.jsx)(`p`,{className:`text-xl text-foreground/80 leading-relaxed max-w-2xl`,children:(0,t.jsx)(n.p,{children:`NEF2 is a community-driven project. We maintain high standards for performance, code quality, and technical integrity to build the world's best AI infrastructure.`})})]}),`
`,(0,t.jsx)(n.h2,{children:`Our Core Philosophy`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Performance is a Feature`}),`: If it's not fast, it's a bug. Every line of code should be evaluated for its impact on the critical path.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Hardware First`}),`: We don't hide the hardware; we embrace it. Abstractions should enable hardware-specific optimizations, not prevent them.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Minimalism`}),`: Prefer small, focused modules over bloated, "all-in-one" solutions.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Coding Standards`}),`
`,(0,t.jsx)(n.h3,{children:`Python`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`Use Python 3.10+ features (Type hints, Structural Pattern Matching).`}),`
`,(0,t.jsx)(n.li,{children:`Follow PEP 8, but prioritize clarity over rigid adherence.`}),`
`,(0,t.jsx)(n.li,{children:`All public APIs must have comprehensive docstrings.`}),`
`]}),`
`,(0,t.jsx)(n.h3,{children:`C++ (The Runtime Core)`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`C++17 standard.`}),`
`,(0,t.jsx)(n.li,{children:`Use RAII for all resource management (memory, handles, locks).`}),`
`,(0,t.jsx)(n.li,{children:`Avoid heavy template metaprogramming where a simple C-style interface would suffice for the ABI.`}),`
`]}),`
`,(0,t.jsx)(n.h3,{children:`Rust (The Safety & Networking Layer)`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[`Idiomatic, safe Rust. `,(0,t.jsx)(n.code,{children:`unsafe`}),` is permitted but must be clearly justified and documented.`]}),`
`,(0,t.jsxs)(n.li,{children:[`Leverage `,(0,t.jsx)(n.code,{children:`tokio`}),` for asynchronous tasks and `,(0,t.jsx)(n.code,{children:`rayon`}),` for data parallelism.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Contribution Workflow`}),`
`,(0,t.jsxs)(n.ol,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Research`}),`: Before implementing a feature, research the state-of-the-art and the existing implementation.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`RFC`}),`: For major changes, open an Issue to discuss the architectural impact.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Implementation`}),`: Write clean, tested code. Ensure your changes don't regress performance (use the `,(0,t.jsx)(n.code,{children:`nef2.metrics.profile`}),` tools).`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Tests`}),`: Every PR must include unit tests and, where appropriate, integration tests.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Documentation`}),`: Update the relevant MDX pages in `,(0,t.jsx)(n.code,{children:`docs-site/`}),` to reflect your changes.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Testing Strategy`}),`
`,(0,t.jsxs)(n.p,{children:[`NEF2 uses `,(0,t.jsx)(n.code,{children:`pytest`}),` for Python and a custom GTest-based suite for the C++ core.`]}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-bash`,children:`# Run all tests
pytest tests/
# Run performance benchmarks
pytest tests/benchmarks/
`})}),`
`,(0,t.jsx)(n.h2,{children:`Pull Request Process`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsx)(n.li,{children:`Ensure all CI checks pass (linting, type checking, tests).`}),`
`,(0,t.jsxs)(n.li,{children:[`Provide a clear description of `,(0,t.jsx)(n.strong,{children:`what`}),` changed and `,(0,t.jsx)(n.strong,{children:`why`}),`.`]}),`
`,(0,t.jsx)(n.li,{children:`Include benchmark results if the PR affects the compute or memory path.`}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`By following these standards, we ensure that NEF2 remains the most performant and reliable substrate for the future of AI.`})]})}function r(e={}){let{wrapper:r}=e.components||{};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(n,{...e})}):n(e)}export{r as default};