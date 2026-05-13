"use client"

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Check, Copy, Terminal, AlertCircle, Info, Lightbulb, TriangleAlert, ChevronRight, Cpu, Zap, FileText } from "lucide-react";
import { motion } from "framer-motion";

const CodeBlock = ({ children, className, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const code = React.isValidElement(children) ? (children.props as any).children : children;
  const lang = React.isValidElement(children) ? (children.props as any).className?.replace("language-", "") : "code";

  const onCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative my-8 overflow-hidden rounded-xl border border-white/[0.08] bg-[#080808] shadow-2xl transition-all hover:border-white/[0.15]"
    >
      <div className="flex items-center justify-between border-b border-white/[0.05] bg-white/[0.02] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
          <span className="text-[10px] font-bold font-mono text-white/30 uppercase tracking-[0.2em] ml-2">{lang}</span>
        </div>
        <button
          onClick={onCopy}
          className="rounded-md p-1.5 text-white/30 transition-all hover:bg-white/5 hover:text-white"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <pre className={cn("overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-white/80", className)} {...props}>
        {children}
      </pre>
    </motion.div>
  );
};

const Callout = ({ children, type = "info" }: { children: React.ReactNode, type?: "info" | "warning" | "tip" | "danger" }) => {
  const icons = {
    info: <Info className="h-5 w-5 text-blue-400" />,
    warning: <TriangleAlert className="h-5 w-5 text-amber-400" />,
    tip: <Lightbulb className="h-5 w-5 text-primary" />,
    danger: <AlertCircle className="h-5 w-5 text-red-400" />,
  };

  const colors = {
    info: "bg-blue-500/5 border-blue-500/10",
    warning: "bg-amber-500/5 border-amber-500/10",
    tip: "bg-primary/5 border-primary/10",
    danger: "bg-red-500/5 border-red-500/10",
  };

  return (
    <div className={cn("my-8 flex gap-4 rounded-2xl border p-6 backdrop-blur-sm", colors[type])}>
      <div className="mt-1 shrink-0">{icons[type]}</div>
      <div className="text-[0.95rem] leading-relaxed text-white/70">{children}</div>
    </div>
  );
};

const Card = ({ title, description, icon, href }: { title: string, description: string, icon?: React.ReactNode, href?: string }) => {
  const content = (
    <div className="card-premium h-full p-6 group">
      {icon && <div className="mb-4 text-primary group-hover:scale-110 transition-transform duration-300">{icon}</div>}
      <h4 className="mb-2 text-lg font-bold tracking-tight text-white/90">{title}</h4>
      <p className="text-sm leading-relaxed text-white/50">{description}</p>
      {href && (
        <div className="mt-4 flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          Learn more <ChevronRight className="h-3 w-3" />
        </div>
      )}
    </div>
  );

  return href ? <Link href={href} className="no-underline">{content}</Link> : content;
};

const MDXComponents = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        "mt-2 scroll-m-20 text-4xl font-extrabold tracking-tight text-white mb-10",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "mt-20 scroll-m-20 border-b border-white/[0.05] pb-3 text-2xl font-bold tracking-tight text-white/90 mb-8 group flex items-center gap-2",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        "mt-12 scroll-m-20 text-xl font-bold tracking-tight text-white/80 mb-6",
        className
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn("leading-[1.8] [&:not(:first-child)]:mt-6 text-white/60 text-[1.05rem]", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("my-6 ml-6 list-none space-y-3", className)} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={cn("relative pl-6 text-white/60 before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary/40", className)} {...props} />
  ),
  pre: CodeBlock,
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        "relative rounded-md bg-primary/10 px-[0.4rem] py-[0.15rem] font-mono text-[0.85em] font-medium text-primary border border-primary/20",
        className
      )}
      {...props}
    />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-8 w-full overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.02]">
      <table className={cn("w-full text-sm", className)} {...props} />
    </div>
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "border-b border-white/[0.05] bg-white/[0.03] px-4 py-3 text-left font-bold uppercase tracking-wider text-white/40 text-[10px]",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        "border-b border-white/[0.02] px-4 py-4 text-white/60 leading-relaxed",
        className
      )}
      {...props}
    />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn(
        "mt-8 rounded-2xl border-l-2 border-primary bg-primary/5 px-8 py-6 italic text-white/70 shadow-2xl",
        className
      )}
      {...props}
    />
  ),
  Callout,
  Card,
  Grid: ({ children }: { children: React.ReactNode }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10 no-underline">{children}</div>
  ),
  Step: ({ number, title, children }: { number: string, title: string, children: React.ReactNode }) => (
    <div className="relative pl-12 pb-12 last:pb-0">
      <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
        {number}
      </div>
      <div className="absolute left-4 top-8 bottom-0 w-[1px] bg-white/[0.05] last:hidden" />
      <h4 className="text-lg font-bold text-white/90 mb-2 tracking-tight">{title}</h4>
      <div className="text-white/60">{children}</div>
    </div>
  ),
  GpuTopology: () => (
    <div className="my-10 p-8 rounded-3xl border border-white/[0.05] bg-[#050505] overflow-hidden relative group">
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="relative z-10 flex flex-col items-center">
        <div className="grid grid-cols-4 gap-4 w-full max-w-lg mb-8">
          {[1, 2, 3, 4].map((i) => (
            <motion.div 
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="aspect-square rounded-xl border border-primary/30 bg-primary/10 flex items-center justify-center flex-col gap-2 shadow-[0_0_20px_rgba(139,92,246,0.1)]"
            >
              <Cpu className="h-6 w-6 text-primary" />
              <span className="text-[10px] font-bold text-primary/60">GPU {i}</span>
            </motion.div>
          ))}
        </div>
        <div className="h-[2px] w-full max-w-md bg-gradient-to-r from-transparent via-primary/40 to-transparent relative">
          <motion.div 
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent w-20"
          />
        </div>
        <div className="mt-8 text-center">
          <h5 className="text-sm font-bold text-white/80 mb-1 tracking-tight">Unified Memory Fabric</h5>
          <p className="text-[11px] text-white/40 uppercase tracking-widest">NVLink / PCIe Gen5 / Infinity Fabric</p>
        </div>
      </div>
    </div>
  ),
  RuntimeFlow: () => (
    <div className="my-10 space-y-4">
      {[
        { label: "Compiler Frontend", icon: <FileText className="h-4 w-4" /> },
        { label: "IR Optimization", icon: <Zap className="h-4 w-4" /> },
        { label: "Hardware Backend", icon: <Cpu className="h-4 w-4" /> },
        { label: "Kernel Execution", icon: <Terminal className="h-4 w-4" /> }
      ].map((step, i) => (
        <motion.div 
          key={i}
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.15 }}
          className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
        >
          <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            {step.icon}
          </div>
          <div className="flex-1">
            <h5 className="text-sm font-bold text-white/90 tracking-tight">{step.label}</h5>
          </div>
          <ChevronRight className="h-4 w-4 text-white/20" />
        </motion.div>
      ))}
    </div>
  ),
};

export default MDXComponents;
