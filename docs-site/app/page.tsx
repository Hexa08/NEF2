"use client"

import Link from "next/link";
import { ArrowRight, Cpu, Zap, Share2, Shield, Box, Activity, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative isolate flex flex-col items-center overflow-hidden pb-24 pt-16 sm:pb-32 sm:pt-24">
      {/* Background glow */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-[#9089fc] opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mx-auto max-w-4xl px-6 lg:px-8 text-center"
      >
        <div className="mb-8 flex justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-white/40 ring-1 ring-white/10 hover:ring-white/20 transition-all flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
            <span>Introducing NEF2 v1.0 — Hardware-Native Intelligence</span>
            <Link href="/docs/introduction" className="font-semibold text-primary">
              <span className="absolute inset-0" aria-hidden="true"></span>Read more <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight text-white/95 sm:text-7xl mb-8">
          The AI Operating <br /> 
          <span className="text-gradient">Substrate.</span>
        </h1>
        
        <p className="mx-auto max-w-2xl text-lg md:text-xl leading-relaxed text-white/50 mb-10">
          A hardware-native, unified multi-backend intelligence stack for the next generation of autonomous systems and distributed AI execution.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link
            href="/docs/introduction"
            className="group relative inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            Start Building
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/docs/architecture"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/10"
          >
            View Architecture
            <ChevronRight className="h-4 w-4 text-white/30" />
          </Link>
        </div>
      </motion.div>

      {/* Feature Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mx-auto mt-32 max-w-7xl px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<Cpu className="h-6 w-6" />}
            title="Hardware Native"
            description="Direct driver API integration for NVIDIA, AMD, Apple Silicon, and custom accelerators."
          />
          <FeatureCard 
            icon={<Zap className="h-6 w-6" />}
            title="HyperCache"
            description="Intelligent VRAM virtualization across RAM and NVMe for massive model support."
          />
          <FeatureCard 
            icon={<Share2 className="h-6 w-6" />}
            title="Agent Native"
            description="Built-in primitives for zero-copy model chaining and shared tensor buses."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6" />}
            title="Unified Runtime"
            description="One substrate for inference, training, and distributed simulation."
          />
        </div>
      </motion.div>

      {/* Bottom Visual */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary/20 to-[#9089fc]/20 opacity-10 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="card-premium p-8 group flex flex-col items-start"
    >
      <div className="mb-6 rounded-xl bg-white/5 p-3 text-primary group-hover:bg-primary/20 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="mb-3 text-lg font-bold tracking-tight text-white/90">{title}</h3>
      <p className="text-sm leading-relaxed text-white/50">{description}</p>
      <div className="mt-auto pt-6 w-full flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Details</span>
        <ChevronRight className="h-4 w-4 text-primary" />
      </div>
    </motion.div>
  );
}
