import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { navigation } from "@/lib/nav";

interface PaginationProps {
  currentSlug: string;
}

export default function Pagination({ currentSlug }: PaginationProps) {
  const allItems = navigation.flatMap(group => group.items);
  const currentIndex = allItems.findIndex(item => item.href === `/docs/${currentSlug}`);
  
  const prev = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const next = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  return (
    <div className="mt-16 flex items-center justify-between gap-4 border-t border-zinc-800 pt-8">
      {prev ? (
        <Link 
          href={prev.href}
          className="group flex flex-col gap-1.5 transition-colors"
        >
          <span className="flex items-center gap-1 text-xs font-medium text-zinc-500 group-hover:text-zinc-300">
            <ChevronLeft className="h-3 w-3" />
            Previous
          </span>
          <span className="text-sm font-semibold text-zinc-300 group-hover:text-indigo-400">
            {prev.title}
          </span>
        </Link>
      ) : <div />}

      {next ? (
        <Link 
          href={next.href}
          className="group flex flex-col items-end gap-1.5 transition-colors text-right"
        >
          <span className="flex items-center gap-1 text-xs font-medium text-zinc-500 group-hover:text-zinc-300">
            Next
            <ChevronRight className="h-3 w-3" />
          </span>
          <span className="text-sm font-semibold text-zinc-300 group-hover:text-indigo-400">
            {next.title}
          </span>
        </Link>
      ) : <div />}
    </div>
  );
}
