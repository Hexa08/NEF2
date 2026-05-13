import{t as e}from"./index-Bm8i0iSn.js";var t=e();function n(e){let n={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:`Vision Primitives`}),`
`,(0,t.jsxs)(`div`,{className:`py-12 px-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-white/10 mb-12`,children:[(0,t.jsx)(`h1`,{className:`text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60`,children:(0,t.jsx)(n.p,{children:`Seeing at Speed.`})}),(0,t.jsx)(`p`,{className:`text-xl text-foreground/80 leading-relaxed max-w-2xl`,children:(0,t.jsx)(n.p,{children:`NEF2 Vision provides high-performance primitives for computer vision, from optimized convolution kernels to state-of-the-art Vision Transformer (ViT) components.`})})]}),`
`,(0,t.jsx)(n.h2,{children:`Hardware-Accelerated Vision`}),`
`,(0,t.jsx)(n.p,{children:`Computer vision tasks are heavily dependent on spatial operations like convolutions, pooling, and resizing. NEF2 implements these operations using vendor-optimized libraries (cuDNN for NVIDIA, MIOpen for AMD, MPS for Apple) to ensure peak performance.`}),`
`,(0,t.jsx)(n.h2,{children:`Core Vision Layers`}),`
`,(0,t.jsx)(n.h3,{children:`Convolutions`}),`
`,(0,t.jsx)(n.p,{children:`Highly optimized 1D, 2D, and 3D convolution kernels with support for dilated, grouped, and depthwise operations.`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`from nef2.vision import nn

# A standard 2D convolution
conv = nn.Conv2d(in_channels=3, out_channels=64, kernel_size=3)
`})}),`
`,(0,t.jsx)(n.h3,{children:`Vision Transformers (ViT)`}),`
`,(0,t.jsx)(n.p,{children:`NEF2 includes first-class support for Vision Transformers. Our implementation features:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Patch Embedding`}),`: Efficiently sharding images into patches via optimized stride kernels.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`FlashAttention Integration`}),`: Scaling ViTs to high-resolution images with $O(N)$ memory efficiency.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Learnable Positional Encodings`}),`: Integrated into the `,(0,t.jsx)(n.code,{children:`nn.Parameter`}),` system.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Image Processing Substrate`}),`
`,(0,t.jsx)(n.p,{children:`NEF2 Vision includes a high-speed image processing library for data augmentation and preprocessing. Operations like resizing, rotation, and color space conversion are performed as GPU kernels, avoiding the slow CPU-GPU transfer loop.`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`from nef2.vision import transforms

# Define a GPU-accelerated pipeline
preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Process a batch of images directly on the GPU
images = preprocess(raw_image_tensors)
`})}),`
`,(0,t.jsx)(n.h2,{children:`Model Presets`}),`
`,(0,t.jsx)(n.p,{children:`NEF2 Vision comes with a library of pre-configured, high-performance model architectures:`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`ResNet & EfficientNet`}),`: The classics, optimized for low-latency inference.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`ViT & Swin Transformer`}),`: For state-of-the-art accuracy in complex scenes.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`YOLO-NEF`}),`: A specialized implementation of the YOLO architecture for real-time object detection.`]}),`
`]}),`
`,(0,t.jsx)(n.p,{children:`By combining low-level kernel optimization with high-level architectural primitives, NEF2 Vision provides everything you need to build world-class computer vision systems.`})]})}function r(e={}){let{wrapper:r}=e.components||{};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(n,{...e})}):n(e)}export{r as default};