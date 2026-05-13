import{t as e}from"./index-Bm8i0iSn.js";var t=e();function n(e){let n={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:`Tokenizers`}),`
`,(0,t.jsxs)(`div`,{className:`py-12 px-8 rounded-3xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-white/10 mb-12`,children:[(0,t.jsx)(`h1`,{className:`text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60`,children:(0,t.jsx)(n.p,{children:`The Gateway to Meaning.`})}),(0,t.jsx)(`p`,{className:`text-xl text-foreground/80 leading-relaxed max-w-2xl`,children:(0,t.jsx)(n.p,{children:`NEF2 features high-speed, byte-level tokenization engines implemented in Rust, supporting BPE, WordPiece, and custom tokenization strategies with zero overhead.`})})]}),`
`,(0,t.jsx)(n.h2,{children:`Performance-First Text Processing`}),`
`,(0,t.jsx)(n.p,{children:`Tokenization is often an overlooked bottleneck in NLP pipelines. Standard Python-based tokenizers can struggle to keep up with the inference speeds of modern GPUs. NEF2 moves tokenization into a multi-threaded Rust substrate, capable of processing millions of tokens per second.`}),`
`,(0,t.jsx)(n.h2,{children:`Supported Strategies`}),`
`,(0,t.jsx)(n.p,{children:`NEF2's tokenizer engine is highly versatile, supporting the industry's most common algorithms:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Byte-Pair Encoding (BPE)`}),`: The standard for models like GPT-4 and Llama. Our implementation is optimized for large vocabularies.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Byte-Level BPE`}),`: Ensuring that the tokenizer can handle any sequence of bytes, making it robust to out-of-vocabulary characters and diverse languages.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`WordPiece / Unigram`}),`: Support for BERT-style and T5-style tokenization.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Zero-Copy Integration`}),`
`,(0,t.jsxs)(n.p,{children:[`The `,(0,t.jsx)(n.code,{children:`nef2.tokenizer`}),` is tightly integrated with the NEFCore runtime. Token IDs are generated as `,(0,t.jsx)(n.code,{children:`nef2.Tensor`}),` objects directly on the target device, avoiding unnecessary round-trips to the CPU.`]}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`from nef2.tokenizer import Tokenizer

# Load a pre-trained tokenizer
tokenizer = Tokenizer.from_file("tokenizer.json")

# Encode text directly to a GPU tensor
input_ids = tokenizer.encode("Hello, NEF2!", return_tensors="cuda")
`})}),`
`,(0,t.jsx)(n.h2,{children:`Custom Tokenization Kernels`}),`
`,(0,t.jsx)(n.p,{children:`For specialized domains (e.g., DNA sequencing, log analysis, or custom protocols), NEF2 allows you to define custom tokenization logic in Rust and expose it as a high-performance kernel within the NEF pipeline.`}),`
`,(0,t.jsx)(n.h2,{children:`Streaming Tokenization`}),`
`,(0,t.jsxs)(n.p,{children:[`For long-form generation, NEF2 supports `,(0,t.jsx)(n.strong,{children:`Streaming Tokenization`}),`. This allows for the incremental decoding of model outputs into text in real-time, providing the "typewriter" effect essential for interactive AI applications without waiting for the full sequence to complete.`]}),`
`,(0,t.jsx)(n.p,{children:`By providing a fast, flexible, and integrated tokenization layer, NEF2 ensures that your NLP models are never held back by the speed of text processing.`})]})}function r(e={}){let{wrapper:r}=e.components||{};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(n,{...e})}):n(e)}export{r as default};