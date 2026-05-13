import CodeBlock from "./CodeBlock";
import Callout from "./Callout";
import ApiBlock from "./ApiBlock";
import ArchDiagram from "./ArchDiagram";

const MDXComponents = {
  pre: CodeBlock,
  Callout,
  ApiBlock,
  ArchDiagram,
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-8 w-full overflow-hidden rounded-xl border border-zinc-800">
      <table className="w-full text-left text-sm" {...props} />
    </div>
  ),
  thead: ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-zinc-900 text-xs uppercase tracking-wider text-zinc-400" {...props} />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="border-b border-zinc-800 px-4 py-3 font-semibold" {...props} />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border-b border-zinc-800/50 px-4 py-3 text-zinc-300" {...props} />
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="hover:bg-zinc-800/20 transition-colors" {...props} />
  ),
};

export default MDXComponents;
