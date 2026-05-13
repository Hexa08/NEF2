import Link from "next/link";
import { ArrowRight, Cpu, Zap, Share2, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center space-y-12 py-20">
      <div className="space-y-6">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-gradient">
          The AI Operating <br /> Substrate.
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          NEF2 is a hardware-native, framework-independent intelligence stack designed for the next generation of autonomous systems.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/docs/introduction"
          className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
        >
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
        <Link
          href="/docs/architecture"
          className="inline-flex items-center justify-center rounded-full border border-border bg-background px-8 py-3 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
        >
          Explore Architecture
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl mt-20">
        <FeatureCard 
          icon={<Cpu className="h-6 w-6" />}
          title="Hardware Native"
          description="Direct Driver API integration for NVIDIA, AMD, and Apple Silicon."
        />
        <FeatureCard 
          icon={<Zap className="h-6 w-6" />}
          title="HyperCache"
          description="Intelligent VRAM virtualization across RAM and NVMe storage."
        />
        <FeatureCard 
          icon={<Share2 className="h-6 w-6" />}
          title="Agent Native"
          description="Built-in primitives for model-chaining and shared tensor buses."
        />
        <FeatureCard 
          icon={<Shield className="h-6 w-6" />}
          title="Secure Core"
          description="Rust-based safe concurrency and distributed networking."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-start p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-all group">
      <div className="p-2 rounded-lg bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
