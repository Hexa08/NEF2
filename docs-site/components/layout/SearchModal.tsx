"use client";

import { useEffect, useState } from "react";
import { Command, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        isOpen ? onClose() : null; // Logic handled by parent, but keyboard support here
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-[560px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl"
          >
            <div className="flex items-center border-b border-zinc-800 px-4 py-4">
              <Search className="h-5 w-5 text-zinc-500" />
              <input
                autoFocus
                type="text"
                placeholder="Search documentation..."
                className="ml-3 flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
              />
              <div className="flex items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
                ESC
              </div>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto p-2">
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Quick Results
              </div>
              <div className="flex flex-col gap-1">
                <SearchResult title="Installation" section="Getting Started" breadcrumb="Docs > Getting Started" />
                <SearchResult title="Architecture Overview" section="Core Concepts" breadcrumb="Docs > Core Concepts" />
                <SearchResult title="GPU Backends" section="Runtime" breadcrumb="Docs > Runtime" />
                <SearchResult title="CLI Reference" section="Reference" breadcrumb="Docs > Reference" />
              </div>
            </div>
            
            <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-900/50 px-4 py-3 text-xs text-zinc-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><Command className="h-3 w-3" /> <span className="text-[10px]">Enter</span> Select</span>
                <span className="flex items-center gap-1"><span className="text-[10px]">↑↓</span> Navigate</span>
              </div>
              <span>4 results found</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SearchResult({ title, section, breadcrumb }: { title: string, section: string, breadcrumb: string }) {
  return (
    <div className="group flex cursor-pointer flex-col gap-0.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-zinc-800">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-200 group-hover:text-indigo-400">{title}</span>
        <span className="text-[10px] text-zinc-500">{section}</span>
      </div>
      <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400">{breadcrumb}</span>
    </div>
  );
}
