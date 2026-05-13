import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Cpu, 
  Layers, 
  Zap, 
  Monitor, 
  Box, 
  Database, 
  Terminal, 
  Activity, 
  Shield, 
  Share2, 
  Code2, 
  Eye, 
  Mic, 
  Network, 
  Globe, 
  Smartphone, 
  Users, 
  HelpCircle,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Github = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 19 19" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fillRule="evenodd" d="M9.356 1.85C5.05 1.85 1.57 5.356 1.57 9.694a7.84 7.84 0 0 0 5.324 7.44c.387.079.528-.168.528-.376 0-.182-.013-.805-.013-1.454-2.165.467-2.616-.935-2.616-.935-.349-.91-.864-1.143-.864-1.143-.71-.48.051-.48.051-.48.787.051 1.2.805 1.2.805.695 1.194 1.817.857 2.268.649.064-.507.27-.857.49-1.052-1.728-.182-3.545-.857-3.545-3.87 0-.857.31-1.558.8-2.104-.078-.195-.349-1 .077-2.078 0 0 .657-.208 2.14.805a7.5 7.5 0 0 1 1.946-.26c.657 0 1.328.092 1.946.26 1.483-1.013 2.14-.805 2.14-.805.426 1.078.155 1.883.078 2.078.502.546.799 1.247.799 2.104 0 3.013-1.818 3.675-3.558 3.87.284.247.528.714.528 1.454 0 1.052-.012 1.896-.012 2.156 0 .208.142.455.528.377a7.84 7.84 0 0 0 5.324-7.441c.013-4.338-3.48-7.844-7.773-7.844" clipRule="evenodd"/>
  </svg>
);

const navigation = [
  { name: 'Foundations', items: [
    { name: 'Introduction', href: '/', icon: Globe },
    { name: 'Architecture', href: '/docs/architecture', icon: Layers },
    { name: 'Getting Started', href: '/docs/getting-started', icon: Zap },
    { name: 'Hardware Support', href: '/docs/hardware', icon: Monitor },
  ]},
  { name: 'Core Technology', items: [
    { name: 'NEFCore Runtime', href: '/docs/nef-core', icon: Cpu },
    { name: 'Device Abstraction', href: '/docs/dal', icon: Box },
    { name: 'HyperCache', href: '/docs/hypercache', icon: Database },
    { name: 'NEF Compiler', href: '/docs/compiler', icon: Terminal },
  ]},
  { name: 'API Reference', items: [
    { name: 'Tensors', href: '/docs/tensors', icon: Box },
    { name: 'Neural Networks', href: '/docs/nn', icon: Box },
    { name: 'Optimizers', href: '/docs/optim', icon: Zap },
    { name: 'Data Loading', href: '/docs/data', icon: Database },
  ]},
  { name: 'Advanced Features', items: [
    { name: 'Multi-GPU Fabric', href: '/docs/distributed', icon: Share2 },
    { name: 'Agent Infrastructure', href: '/docs/agents', icon: Users },
    { name: 'Quantization', href: '/docs/quantization', icon: Shield },
    { name: 'Serialization', href: '/docs/serialization', icon: Box },
  ]},
  { name: 'Specialized Domains', items: [
    { name: 'Performance Metrics', href: '/docs/metrics', icon: Activity },
    { name: 'Tokenizers', href: '/docs/tokenizers', icon: Code2 },
    { name: 'Computer Vision', href: '/docs/vision', icon: Eye },
    { name: 'Voice Processing', href: '/docs/voice', icon: Mic },
    { name: 'RDMA Networking', href: '/docs/networking', icon: Network },
  ]},
  { name: 'Ecosystem', items: [
    { name: 'Simulation', href: '/docs/simulation', icon: Monitor },
    { name: 'Mobile Deployment', href: '/docs/mobile', icon: Smartphone },
    { name: 'Developer Guide', href: '/docs/developer-guide', icon: Code2 },
    { name: 'FAQ', href: '/docs/faq', icon: HelpCircle },
  ]},
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  return (
    <>
      <div 
        className={`fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden ${isOpen ? 'block' : 'hidden'}`} 
        onClick={() => setIsOpen(false)}
      />
      
      <aside className={`fixed top-0 left-0 z-50 h-screen w-72 border-r border-border bg-background transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-2 px-6 h-16 border-b border-border">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Cpu className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">NEF2</span>
        </div>
        
        <nav className="p-4 h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar">
          {navigation.map((section) => (
            <div key={section.name} className="mb-8">
              <h3 className="px-4 mb-3 text-xs font-semibold text-foreground/40 uppercase tracking-wider">
                {section.name}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors group ${isActive ? 'bg-accent/10 text-accent' : 'text-foreground/60 hover:text-foreground hover:bg-card'}`}
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon size={18} className={isActive ? 'text-accent' : 'text-foreground/40 group-hover:text-foreground'} />
                        <span className="text-sm font-medium">{item.name}</span>
                        {isActive && <motion.div layoutId="active" className="ml-auto w-1 h-1 bg-accent rounded-full" />}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

const Header = ({ setIsOpen }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4 lg:hidden">
        <button onClick={() => setIsOpen(true)} className="text-foreground/60 hover:text-foreground">
          <Menu size={24} />
        </button>
        <span className="font-bold">NEF2</span>
      </div>
      
      <div className="hidden lg:block">
        {/* Placeholder for breadcrumbs or search */}
      </div>

      <div className="flex items-center gap-4">
        <a href="https://github.com/Hexa08/NEF2" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-card">
          <Github size={16} />
          <span>GitHub</span>
        </a>
      </div>
    </header>
  );
};

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      
      <div className="lg:pl-72">
        <Header setIsOpen={setIsOpen} />
        <main className="mx-auto max-w-5xl p-6 lg:p-12">
          {children}
        </main>
      </div>
    </div>
  );
}
