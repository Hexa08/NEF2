"use client";

import Link from "next/link";
import { ArrowRight, Box, Cpu, Network, Zap, Settings, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function DocsOverview() {
  return (
    <div className="relative mx-auto max-w-4xl px-8 py-16 lg:py-24">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-start justify-center">
        <div className="h-[400px] w-[600px] rounded-full bg-indigo-500/10 opacity-50 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
          NEF2 Documentation
        </h1>
        <p className="mt-4 text-lg text-zinc-400 max-w-2xl leading-relaxed">
          The next-generation AI model serialization and inference infrastructure framework.
          Built for zero-copy memory mapping, multi-GPU native execution, and extreme performance.
        </p>

        <div className="mt-8 flex items-center gap-4">
          <Link
            href="/docs/getting-started"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
          >
            Quick Start
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/docs/architecture"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
          >
            Architecture Overview
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2"
      >
        <FeatureCard
          icon={<Box className="h-5 w-5 text-indigo-400" />}
          title="Format Spec"
          description="Deep dive into the binary layout, header schemas, and tensor alignment in NEF2 files."
          href="/docs/format-spec"
        />
        <FeatureCard
          icon={<Cpu className="h-5 w-5 text-indigo-400" />}
          title="GPU Backends"
          description="Direct driver API integration for CUDA, ROCm, Metal, and custom accelerators."
          href="/docs/gpu-backends"
        />
        <FeatureCard
          icon={<Network className="h-5 w-5 text-indigo-400" />}
          title="Distributed Systems"
          description="Scaling multi-node setups, sharding strategies, and RDMA networking."
          href="/docs/distributed"
        />
        <FeatureCard
          icon={<Zap className="h-5 w-5 text-indigo-400" />}
          title="Compiler Pipeline"
          description="Explore NEFInductor, IR optimization passes, and kernel fusion techniques."
          href="/docs/compiler"
        />
        <FeatureCard
          icon={<BookOpen className="h-5 w-5 text-indigo-400" />}
          title="API Reference"
          description="Comprehensive technical documentation for all C++, Rust, and Python APIs."
          href="/docs/api-reference"
        />
        <FeatureCard
          icon={<Settings className="h-5 w-5 text-indigo-400" />}
          title="CLI Tools"
          description="Command-line utilities for inspecting, converting, and benchmarking NEF2 models."
          href="/docs/cli"
        />
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title, description, href }: any) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 transition-colors hover:bg-zinc-800/80"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 shadow-sm transition-colors group-hover:border-zinc-700">
        {icon}
      </div>
      <h3 className="font-semibold text-zinc-100">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
    </Link>
  );
}
