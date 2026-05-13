"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navigation } from "@/lib/nav";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex w-64 flex-col gap-6 overflow-y-auto px-4 py-6 custom-scrollbar h-[calc(100vh-3.5rem)] sticky top-14 bg-surface/50 border-r border-zinc-800">
      {navigation.map((group, index) => (
        <NavGroup key={index} group={group} pathname={pathname} />
      ))}
    </nav>
  );
}

function NavGroup({ group, pathname }: { group: any; pathname: string }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-2 py-1 text-sm font-semibold text-zinc-100 hover:text-zinc-50"
      >
        {group.title}
        <ChevronRight
          className={cn(
            "h-4 w-4 text-zinc-500 transition-transform duration-200",
            isOpen && "rotate-90"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-0.5 pt-1">
              {group.items.map((item: any, i: number) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={i}
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
                      isActive
                        ? "border-l-2 border-indigo-500 bg-zinc-800/50 text-indigo-400 font-medium"
                        : "border-l-2 border-transparent text-zinc-400 hover:bg-zinc-800/30 hover:text-zinc-200"
                    )}
                  >
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
