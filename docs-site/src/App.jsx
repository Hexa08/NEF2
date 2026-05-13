import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MdxWrapper from './components/MdxWrapper';

// Hero / Intro Page
const Introduction = lazy(() => import('./docs/introduction.mdx'));
const Architecture = lazy(() => import('./docs/architecture.mdx'));
const GettingStarted = lazy(() => import('./docs/getting-started.mdx'));
const Hardware = lazy(() => import('./docs/hardware.mdx'));

// New Pages
const NefCore = lazy(() => import('./docs/nef-core.mdx'));
const DAL = lazy(() => import('./docs/dal.mdx'));
const HyperCache = lazy(() => import('./docs/hypercache.mdx'));
const Compiler = lazy(() => import('./docs/compiler.mdx'));
const Tensors = lazy(() => import('./docs/tensors.mdx'));
const NN = lazy(() => import('./docs/nn.mdx'));
const Optim = lazy(() => import('./docs/optim.mdx'));
const Data = lazy(() => import('./docs/data.mdx'));
const Distributed = lazy(() => import('./docs/distributed.mdx'));
const Agents = lazy(() => import('./docs/agents.mdx'));
const Quantization = lazy(() => import('./docs/quantization.mdx'));
const Serialization = lazy(() => import('./docs/serialization.mdx'));
const Metrics = lazy(() => import('./docs/metrics.mdx'));
const Tokenizers = lazy(() => import('./docs/tokenizers.mdx'));
const Vision = lazy(() => import('./docs/vision.mdx'));
const Voice = lazy(() => import('./docs/voice.mdx'));
const Networking = lazy(() => import('./docs/networking.mdx'));
const Simulation = lazy(() => import('./docs/simulation.mdx'));
const Mobile = lazy(() => import('./docs/mobile.mdx'));
const DeveloperGuide = lazy(() => import('./docs/developer-guide.mdx'));
const FAQ = lazy(() => import('./docs/faq.mdx'));

const Loading = () => (
  <div className="flex h-64 w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
  </div>
);

function App() {
  return (
    <Router basename="/NEF2">
      <Layout>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<MdxWrapper><Introduction /></MdxWrapper>} />
            <Route path="/docs/architecture" element={<MdxWrapper><Architecture /></MdxWrapper>} />
            <Route path="/docs/getting-started" element={<MdxWrapper><GettingStarted /></MdxWrapper>} />
            <Route path="/docs/hardware" element={<MdxWrapper><Hardware /></MdxWrapper>} />
            
            {/* New Routes */}
            <Route path="/docs/nef-core" element={<MdxWrapper><NefCore /></MdxWrapper>} />
            <Route path="/docs/dal" element={<MdxWrapper><DAL /></MdxWrapper>} />
            <Route path="/docs/hypercache" element={<MdxWrapper><HyperCache /></MdxWrapper>} />
            <Route path="/docs/compiler" element={<MdxWrapper><Compiler /></MdxWrapper>} />
            <Route path="/docs/tensors" element={<MdxWrapper><Tensors /></MdxWrapper>} />
            <Route path="/docs/nn" element={<MdxWrapper><NN /></MdxWrapper>} />
            <Route path="/docs/optim" element={<MdxWrapper><Optim /></MdxWrapper>} />
            <Route path="/docs/data" element={<MdxWrapper><Data /></MdxWrapper>} />
            <Route path="/docs/distributed" element={<MdxWrapper><Distributed /></MdxWrapper>} />
            <Route path="/docs/agents" element={<MdxWrapper><Agents /></MdxWrapper>} />
            <Route path="/docs/quantization" element={<MdxWrapper><Quantization /></MdxWrapper>} />
            <Route path="/docs/serialization" element={<MdxWrapper><Serialization /></MdxWrapper>} />
            <Route path="/docs/metrics" element={<MdxWrapper><Metrics /></MdxWrapper>} />
            <Route path="/docs/tokenizers" element={<MdxWrapper><Tokenizers /></MdxWrapper>} />
            <Route path="/docs/vision" element={<MdxWrapper><Vision /></MdxWrapper>} />
            <Route path="/docs/voice" element={<MdxWrapper><Voice /></MdxWrapper>} />
            <Route path="/docs/networking" element={<MdxWrapper><Networking /></MdxWrapper>} />
            <Route path="/docs/simulation" element={<MdxWrapper><Simulation /></MdxWrapper>} />
            <Route path="/docs/mobile" element={<MdxWrapper><Mobile /></MdxWrapper>} />
            <Route path="/docs/developer-guide" element={<MdxWrapper><DeveloperGuide /></MdxWrapper>} />
            <Route path="/docs/faq" element={<MdxWrapper><FAQ /></MdxWrapper>} />

            {/* Catch-all for missing pages */}
            <Route path="*" element={<div className="text-center py-20">
              <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
              <p className="text-foreground/60">We're working hard to complete this documentation page.</p>
            </div>} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
