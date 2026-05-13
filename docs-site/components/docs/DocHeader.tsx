import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface DocHeaderProps {
  title: string;
  description?: string;
  slug: string;
}

export default function DocHeader({ title, description, slug }: DocHeaderProps) {
  return (
    <div className="mb-10 space-y-4">
      <nav className="flex items-center gap-2 text-xs font-medium text-zinc-500">
        <Link href="/docs" className="hover:text-zinc-300 transition-colors">Docs</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-zinc-300 capitalize">{slug.replace(/-/g, ' ')}</span>
      </nav>
      
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-50">{title}</h1>
        {description && (
          <p className="text-lg text-zinc-400 leading-relaxed">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-4 pt-4 text-xs font-medium text-zinc-500">
        <div className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Last updated: May 2026</span>
        </div>
        <Link 
          href={`https://github.com/Hexa08/NEF2/edit/main/docs-site/content/docs/${slug}.mdx`}
          className="hover:text-zinc-300 transition-colors underline-offset-4 hover:underline"
        >
          Edit this page on GitHub
        </Link>
      </div>
      
      <div className="mt-8 border-b border-zinc-800" />
    </div>
  );
}
