"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const sidebarItems = [
  {
    title: "Foundations",
    items: [
      { title: "Introduction", href: "/docs/introduction" },
      { title: "Architecture", href: "/docs/architecture" },
      { title: "Getting Started", href: "/docs/getting-started" },
      { title: "Hardware Support", href: "/docs/hardware" },
    ],
  },
  {
    title: "Core Technology",
    items: [
      { title: "NEFCore Runtime", href: "/docs/nef-core" },
      { title: "Device Abstraction", href: "/docs/dal" },
      { title: "HyperCache", href: "/docs/hypercache" },
      { title: "NEF Compiler", href: "/docs/compiler" },
    ],
  },
  {
    title: "API Reference",
    items: [
      { title: "Tensors", href: "/docs/tensors" },
      { title: "Neural Networks", href: "/docs/nn" },
      { title: "Optimizers", href: "/docs/optim" },
      { title: "Data Loading", href: "/docs/data" },
    ],
  },
  {
    title: "Advanced",
    items: [
      { title: "Multi-GPU Fabric", href: "/docs/distributed" },
      { title: "Agent Infrastructure", href: "/docs/agents" },
      { title: "Quantization", href: "/docs/quantization" },
      { title: "Serialization", href: "/docs/serialization" },
    ],
  },
  {
    title: "Specialized",
    items: [
      { title: "Performance Metrics", href: "/docs/metrics" },
      { title: "Tokenizers", href: "/docs/tokenizers" },
      { title: "Computer Vision", href: "/docs/vision" },
      { title: "Voice Processing", href: "/docs/voice" },
      { title: "RDMA Networking", href: "/docs/networking" },
    ],
  },
  {
    title: "Ecosystem",
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
    <div className="w-full">
      {sidebarItems.map((section, index) => (
        <div key={index} className="pb-8">
          <h4 className="mb-1 rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
            {section.title}
          </h4>
          <div className="grid grid-flow-row auto-rows-max text-sm">
            {section.items.map((item, itemIndex) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={itemIndex}
                  href={item.href}
                  className={cn(
                    "group relative flex w-full items-center rounded-md border border-transparent px-2 py-1.5 transition-all",
                    active 
                      ? "text-foreground font-medium" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 z-0 rounded-md bg-secondary/50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <span className="relative z-10">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
