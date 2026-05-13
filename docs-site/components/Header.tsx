"use client"

import Link from "next/link";
import { Search, Menu, Send, Command } from "lucide-react";
import { motion } from "framer-motion";
import { GithubIcon } from "./icons";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-white/[0.05]">
      <div className="flex h-16 items-center px-4 md:px-8 justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-primary accent-gradient flex items-center justify-center">
              <span className="text-primary-foreground font-black text-[10px] tracking-tighter">NEF2</span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="hidden font-bold tracking-tight text-white/90 sm:inline-block text-lg">
              NEF2
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white/50">
            <Link href="/docs/introduction" className="hover:text-primary transition-colors">Documentation</Link>
            <Link href="/docs/architecture" className="hover:text-primary transition-colors">Architecture</Link>
            <Link href="/docs/nef-core" className="hover:text-primary transition-colors">Runtime</Link>
            <Link href="#" className="hover:text-primary transition-colors">Showcase</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input 
              type="text" 
              placeholder="Search documentation..." 
              className="h-9 w-[260px] rounded-full border border-white/[0.08] bg-white/[0.03] pl-10 pr-12 text-sm text-white/70 outline-none transition-all focus:border-primary/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-primary/20"
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-white/30">
              <Command className="h-2.5 w-2.5" />
              <span>K</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:border-l border-white/10 md:pl-4">
            <Link href="https://github.com/Hexa08/NEF2" target="_blank" className="p-2 text-white/50 hover:text-white transition-colors hidden sm:block">
              <GithubIcon className="h-5 w-5" />
            </Link>
            <Link href="https://twitter.com" target="_blank" className="p-2 text-white/50 hover:text-white transition-colors hidden sm:block">
              <Send className="h-5 w-5" />
            </Link>
            <button className="md:hidden p-2 text-white/50 hover:text-white transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
