"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Box, 
  Cpu, 
  Zap, 
  Share2, 
  Shield, 
  Activity, 
  Code, 
  Layers, 
  Terminal, 
  ChevronRight,
  Database,
  Globe,
  Smartphone,
  HelpCircle,
  FileText
} from "lucide-react";
import { useState } from "react";

const sidebarItems = [
  {
    title: "Foundations",
    icon: <Layers className="h-4 w-4" />,
    items: [
      { title: "Introduction", href: "/docs/introduction" },
      { title: "Architecture", href: "/docs/architecture" },
      { title: "Getting Started", href: "/docs/getting-started" },
      { title: "Hardware Support", href: "/docs/hardware" },
    ],
  },
  {
    title: "Core Technology",
    icon: <Cpu className="h-4 w-4" />,
    items: [
      { title: "NEFCore Runtime", href: "/docs/nef-core" },
      { title: "Device Abstraction", href: "/docs/dal" },
      { title: "HyperCache", href: "/docs/hypercache" },
      { title: "NEF Compiler", href: "/docs/compiler" },
    ],
  },
  {
    title: "API Reference",
    icon: <Code className="h-4 w-4" />,
    items: [
      { title: "Tensors", href: "/docs/tensors" },
      { title: "Neural Networks", href: "/docs/nn" },
      { title: "Optimizers", href: "/docs/optim" },
      { title: "Data Loading", href: "/docs/data" },
    ],
  },
  {
    title: "Advanced",
    icon: <Zap className="h-4 w-4" />,
    items: [
      { title: "Multi-GPU Fabric", href: "/docs/distributed" },
      { title: "Agent Infrastructure", href: "/docs/agents" },
      { title: "Quantization", href: "/docs/quantization" },
      { title: "Serialization", href: "/docs/serialization" },
    ],
  },
  {
    title: "Ecosystem",
    icon: <Globe className="h-4 w-4" />,
    items: [
      { title: "Simulation", href: "/docs/simulation" },
      { title: "Mobile Deployment", href: "/docs/mobile" },
      { title: "Developer Guide", href: "/docs/developer-guide" },
      { title: "FAQ", href: "/docs/faq" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6 pr-4">
      {sidebarItems.map((section, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-2 text-white/40 mb-1">
            {section.icon}
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em]">
              {section.title}
            </h4>
          </div>
          <div className="flex flex-col gap-0.5">
            {section.items.map((item, itemIndex) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={itemIndex}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all duration-200",
                    active 
                      ? "text-primary font-medium bg-primary/5" 
                      : "text-white/50 hover:text-white/90 hover:bg-white/[0.03]"
                  )}
                >
                  <span className="relative z-10">{item.title}</span>
                  {active && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 w-[2px] h-4 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <ChevronRight className={cn(
                    "h-3 w-3 transition-transform duration-200 opacity-0 group-hover:opacity-100",
                    active ? "opacity-100 text-primary" : "text-white/20"
                  )} />
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
