import{t as e}from"./index-Bm8i0iSn.js";var t=e();function n(e){let n={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:`Metrics & Telemetry`}),`
`,(0,t.jsxs)(`div`,{className:`py-12 px-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-white/10 mb-12`,children:[(0,t.jsx)(`h1`,{className:`text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60`,children:(0,t.jsx)(n.p,{children:`Observability at Scale.`})}),(0,t.jsx)(`p`,{className:`text-xl text-foreground/80 leading-relaxed max-w-2xl`,children:(0,t.jsx)(n.p,{children:`NEF2 provides deep visibility into your models' performance, from high-level training metrics to low-level hardware utilization and profiling.`})})]}),`
`,(0,t.jsx)(n.h2,{children:`Integrated Performance Tracking`}),`
`,(0,t.jsx)(n.p,{children:`In the world of high-performance AI, you can't optimize what you can't measure. NEF2 includes a built-in telemetry substrate that tracks every aspect of the runtime's execution.`}),`
`,(0,t.jsx)(n.h2,{children:`Key Telemetry Domains`}),`
`,(0,t.jsx)(n.h3,{children:`1. Training Metrics`}),`
`,(0,t.jsx)(n.p,{children:`Standard tracking for loss, accuracy, gradient norms, and learning rates. NEF2 integrates with popular logging tools like Weights & Biases and TensorBoard.`}),`
`,(0,t.jsx)(n.h3,{children:`2. Hardware Utilization`}),`
`,(0,t.jsx)(n.p,{children:`Real-time monitoring of VRAM usage, GPU compute utilization, memory bandwidth, and power consumption. This is critical for identifying bottlenecks in the distributed fabric.`}),`
`,(0,t.jsx)(n.h3,{children:`3. HyperCache Stats`}),`
`,(0,t.jsx)(n.p,{children:`Visibility into the memory hierarchy, including hit rates for "Hot" and "Warm" tiers and the frequency of NVMe evictions.`}),`
`,(0,t.jsx)(n.h2,{children:`The NEF Profiler`}),`
`,(0,t.jsx)(n.p,{children:`The NEF Profiler is a deep-dive tool that captures the execution timing of every kernel in the computational graph. It generates trace files compatible with the Chrome Trace Viewer and NVIDIA Nsight.`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`import nef2.metrics as metrics

with metrics.profile(activities=[metrics.ProfilerActivity.CPU, metrics.ProfilerActivity.CUDA]):
    output = model(input_tensor)
    
# Export the trace for analysis
metrics.export_chrome_trace("trace.json")
`})}),`
`,(0,t.jsx)(n.h2,{children:`Real-Time Dashboards`}),`
`,(0,t.jsx)(n.p,{children:`For production deployments, NEF2 provides a Prometheus-compatible endpoint that exports real-time health and performance data, allowing for integrated monitoring within standard DevOps stacks.`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`from nef2.metrics import TelemetryServer

# Start a background telemetry server on port 9090
server = TelemetryServer(port=9090)
server.start()
`})}),`
`,(0,t.jsx)(n.h2,{children:`Alerting & Health Checks`}),`
`,(0,t.jsx)(n.p,{children:`NEF2 can be configured to trigger alerts or automatic hardware restarts if certain thresholds are met (e.g., sustained high temperatures or frequent ECC errors), ensuring the stability of massive training runs.`}),`
`,(0,t.jsx)(n.p,{children:`By providing comprehensive observability, NEF2 empowers you to squeeze every drop of performance out of your hardware.`})]})}function r(e={}){let{wrapper:r}=e.components||{};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(n,{...e})}):n(e)}export{r as default};