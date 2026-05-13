import{t as e}from"./index-mj3Ep446.js";var t=e();function n(e){let n={code:`code`,h1:`h1`,h2:`h2`,li:`li`,ol:`ol`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:`AI Agents & Multi-Agent Coordination`}),`
`,(0,t.jsxs)(`div`,{className:`py-12 px-8 rounded-3xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-white/10 mb-12`,children:[(0,t.jsx)(`h1`,{className:`text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60`,children:(0,t.jsx)(n.p,{children:`Collective Intelligence.`})}),(0,t.jsx)(`p`,{className:`text-xl text-foreground/80 leading-relaxed max-w-2xl`,children:(0,t.jsx)(n.p,{children:`NEF2 treats AI agents as primary primitives, providing the infrastructure for multi-model coordination, shared memory, and distributed cognition.`})})]}),`
`,(0,t.jsx)(n.h2,{children:`Beyond Single-Model Inference`}),`
`,(0,t.jsx)(n.p,{children:`The future of AI lies in the cooperation of specialized models. NEF2 is the first framework built specifically to support this "Agent-Native" future. We move beyond simple API calls to a deeply integrated substrate where agents can share thoughts, memories, and compute resources.`}),`
`,(0,t.jsx)(n.h2,{children:`The Shared Tensor Bus`}),`
`,(0,t.jsxs)(n.p,{children:[`The core of NEF2's agent infrastructure is the `,(0,t.jsx)(n.strong,{children:`Shared Tensor Bus`}),`. This is a high-speed, zero-copy communication channel that allows multiple models to exchange data at the speed of the hardware interconnect.`]}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Zero-Serialization`}),`: Unlike JSON or Protobuf based communication, agents on the Tensor Bus exchange raw tensors. No time is wasted "parsing" or "encoding."`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Shared Context`}),`: Multiple agents (e.g., a vision model and a reasoning model) can point to the same KV-cache in VRAM, enabling "shared attention" over the same input.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Agent Coordination Runtime`}),`
`,(0,t.jsxs)(n.p,{children:[`The `,(0,t.jsx)(n.strong,{children:`Agent Coordination Runtime (ACR)`}),` manages the lifecycle and communication of cooperating models. It handles:`]}),`
`,(0,t.jsxs)(n.ol,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Dynamic Routing`}),`: Routing requests to the most appropriate agent based on current load or expertise.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Consensus Protocols`}),`: Algorithms that allow multiple agents to "agree" on an output, improving reliability through multi-model verification.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Resource Arbitration`}),`: Ensuring that competing agents don't starve each other for VRAM or compute cycles.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Building Multi-Agent Systems`}),`
`,(0,t.jsx)(n.p,{children:`NEF2 provides a clean API for defining and connecting agents into a cohesive system.`}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`from nef2.agent import Agent, Coordinator

# Define specialized agents
vision_agent = Agent(model=ViTModel(), role="perceiver")
reasoning_agent = Agent(model=LLMModel(), role="reasoner")

# Connect them via the Coordinator
system = Coordinator([vision_agent, reasoning_agent])

# The agents now communicate via the Shared Tensor Bus
response = system.solve("Analyze this image and explain the physical dynamics.")
`})}),`
`,(0,t.jsx)(n.h2,{children:`Semantic Memory & HyperCache`}),`
`,(0,t.jsxs)(n.p,{children:[`Agents in NEF2 utilize `,(0,t.jsx)(n.strong,{children:`HyperCache`}),` as a long-term semantic memory. Experiences from one agent can be archived into the "Cold" storage tier and retrieved later by other agents, creating a persistent, shared knowledge base for the entire system.`]}),`
`,(0,t.jsx)(n.p,{children:`By providing the substrate for collective intelligence, NEF2 is paving the way for autonomous systems that are more capable, efficient, and reliable than any single model could ever be.`})]})}function r(e={}){let{wrapper:r}=e.components||{};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(n,{...e})}):n(e)}export{r as default};