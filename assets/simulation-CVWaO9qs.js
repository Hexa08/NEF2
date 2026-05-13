import{t as e}from"./index-mj3Ep446.js";var t=e();function n(e){let n={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:`Simulation & Virtual Hardware`}),`
`,(0,t.jsxs)(`div`,{className:`py-12 px-8 rounded-3xl bg-gradient-to-br from-slate-500/10 to-zinc-500/10 border border-white/10 mb-12`,children:[(0,t.jsx)(`h1`,{className:`text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60`,children:(0,t.jsx)(n.p,{children:`Hardware-in-the-Loop.`})}),(0,t.jsx)(`p`,{className:`text-xl text-foreground/80 leading-relaxed max-w-2xl`,children:(0,t.jsx)(n.p,{children:`NEF2 Simulation provides a high-fidelity environment for testing models against virtual hardware constraints and simulated physical dynamics.`})})]}),`
`,(0,t.jsx)(n.h2,{children:`Developing for the Physical World`}),`
`,(0,t.jsx)(n.p,{children:`AI models don't exist in a vacuum. Whether they are controlling a robot, driving a car, or managing a power grid, they must interact with complex physical systems. NEF2 Simulation bridges the gap between digital training and physical reality.`}),`
`,(0,t.jsx)(n.h2,{children:`Virtual Hardware Environments`}),`
`,(0,t.jsx)(n.p,{children:`NEF2 allows you to simulate the performance characteristics of different hardware targets before you even have access to the silicon.`}),`
`,(0,t.jsxs)(n.ul,{children:[`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Latency Simulation`}),`: Inject artificial delays into the execution graph to test how your agent handles real-world timing constraints.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Memory Constrained Simulation`}),`: Simulate the VRAM limits of edge devices (e.g., a 4GB Jetson Nano) to ensure your model's HyperCache logic works correctly.`]}),`
`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:`Precision Degradation`}),`: Artificially inject noise or reduced precision to test the robustness of your model against hardware-level errors or extreme quantization.`]}),`
`]}),`
`,(0,t.jsx)(n.h2,{children:`Hardware-in-the-Loop (HIL)`}),`
`,(0,t.jsxs)(n.p,{children:[`The `,(0,t.jsx)(n.code,{children:`nef2.sim`}),` module supports HIL testing, where the model runs on actual hardware while interacting with a simulated environment. This is critical for validating the safety and performance of autonomous systems.`]}),`
`,(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:`language-python`,children:`from nef2 import sim

# Create a virtual environment with physical dynamics
env = sim.PhysicsEnv("robotics_lab.scene")

# Connect the model to the virtual sensors and actuators
model.connect(env.sensors, env.actuators)

# Run the simulation at 10x real-time
for _ in range(1000):
    state = env.step()
    action = model(state)
    env.apply(action)
`})}),`
`,(0,t.jsx)(n.h2,{children:`Synthetic Data Generation`}),`
`,(0,t.jsx)(n.p,{children:`NEF2 Simulation includes a photorealistic rendering engine (integrated with the Vision primitives) to generate massive amounts of synthetic training data. This includes automatic ground-truth labeling for object detection, segmentation, and depth estimation.`}),`
`,(0,t.jsx)(n.h2,{children:`Agent-Environment Interaction`}),`
`,(0,t.jsx)(n.p,{children:`In multi-agent scenarios, the simulation environment acts as the "source of truth," coordinating the physical interactions between multiple agents and ensuring that the Shared Tensor Bus correctly reflects the state of the world.`}),`
`,(0,t.jsx)(n.p,{children:`By providing a robust simulation substrate, NEF2 allows you to iterate faster, test more safely, and deploy with confidence.`})]})}function r(e={}){let{wrapper:r}=e.components||{};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(n,{...e})}):n(e)}export{r as default};