"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CodeBlock({ children, className, ...props }: any) {
  const [copied, setCopied] = useState(false);
  
  const code = React.isValidElement(children) ? (children.props as any).children : children;
  const lang = React.isValidElement(children) ? (children.props as any).className?.replace("language-", "") : "code";

  const onCopy = () => {
    if (typeof code === "string") {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-4 py-2 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="font-mono uppercase tracking-wider text-zinc-500">
            {lang}
          </span>
        </div>
        <button
          onClick={onCopy}
          className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-500 opacity-0 transition-all hover:bg-zinc-800 hover:text-zinc-200 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-indigo-400" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <div className="overflow-x-auto p-4 text-[13px] leading-relaxed text-zinc-300">
        <pre className={cn("font-mono", className)} {...props}>
          {children}
        </pre>
      </div>
    </div>
  );
}
