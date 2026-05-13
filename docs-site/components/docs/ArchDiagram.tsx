import { ReactNode } from "react";

export default function ArchDiagram({ children, title }: { children: ReactNode, title?: string }) {
  return (
    <div className="my-10 flex flex-col items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-8 shadow-sm">
      {title && <h4 className="mb-6 font-mono text-sm font-semibold tracking-tight text-zinc-400">{title}</h4>}
      <div className="w-full max-w-2xl overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
