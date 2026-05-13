"use client"

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Copy, Terminal } from "lucide-react";

const CodeBlock = ({ children, className, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const code = React.isValidElement(children) ? (children.props as any).children : children;

  const onCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-8 overflow-hidden rounded-2xl border border-border/50 bg-[#050505] transition-all hover:border-primary/20 card-shadow">
      <div className="flex items-center justify-between border-b border-border/50 bg-muted/20 px-4 py-2">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Code</span>
        </div>
        <button
          onClick={onCopy}
          className="rounded-md p-1.5 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <pre className={cn("overflow-x-auto p-4 font-mono text-sm leading-relaxed custom-scrollbar", className)} {...props}>
        {children}
      </pre>
    </div>
  );
};

const MDXComponents = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        "mt-2 scroll-m-20 text-4xl font-bold tracking-tight text-gradient mb-8",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "mt-16 scroll-m-20 border-b border-border/50 pb-2 text-2xl font-semibold tracking-tight first:mt-0 mb-6",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        "mt-12 scroll-m-20 text-xl font-semibold tracking-tight mb-4",
        className
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground/90 text-[1.05rem]", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-3 text-muted-foreground/90", className)} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={cn("pl-2", className)} {...props} />
  ),
  pre: CodeBlock,
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        "relative rounded-md bg-secondary/50 px-[0.4rem] py-[0.2rem] font-mono text-[0.9em] font-medium text-primary-foreground/90 border border-border/50",
        className
      )}
      {...props}
    />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-8 w-full overflow-y-auto rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm">
      <table className={cn("w-full text-sm", className)} {...props} />
    </div>
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "border-b border-border/50 bg-muted/20 px-4 py-3 text-left font-semibold uppercase tracking-wider text-muted-foreground",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        "border-b border-border/20 px-4 py-3 text-muted-foreground",
        className
      )}
      {...props}
    />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn(
        "mt-8 rounded-2xl border-l-4 border-primary/20 bg-primary/5 px-6 py-4 italic text-muted-foreground/80",
        className
      )}
      {...props}
    />
  ),
};

export default MDXComponents;
