"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Hexagon, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SearchModal from "./SearchModal";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 flex h-14 w-full items-center border-b border-zinc-800 bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
        <div className="flex w-full items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="mr-2 rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/docs" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <Hexagon className="h-6 w-6 text-indigo-500" fill="currentColor" />
              <span className="font-semibold text-zinc-50 tracking-tight text-lg">NEF2</span>
            </Link>
          </div>

          {/* Center: Search */}
          <div className="hidden max-w-md flex-1 px-4 sm:block">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="flex w-full items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-background"
            >
              <Search className="h-4 w-4" />
              <span className="flex-1 text-left">Search docs...</span>
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-zinc-800 bg-zinc-950 px-1.5 font-mono text-[10px] font-medium text-zinc-500 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden items-center rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-0.5 text-xs font-medium text-zinc-400 sm:flex">
              v2.0
            </div>
            <Link href="https://github.com/Hexa08/NEF2" target="_blank" className="text-zinc-400 transition-colors hover:text-zinc-100">
              <GithubIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* Mobile Drawer Placeholder - Linked to parent layout toggle */}
      <MobileDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}

function MobileDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  // Mobile drawer logic would usually go here, for now it's a simple overlay
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 top-0 w-full max-w-xs border-r border-zinc-800 bg-zinc-950 p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Hexagon className="h-6 w-6 text-indigo-500" fill="currentColor" />
                <span className="font-bold text-zinc-50">NEF2</span>
              </div>
              <button onClick={onClose} className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Mobile Nav contents would mirror Sidebar */}
            <div className="text-sm text-zinc-400">Mobile navigation content...</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
