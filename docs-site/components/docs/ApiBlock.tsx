import { cn } from "@/lib/utils";

interface ApiBlockProps {
  method: "GET" | "POST" | "DELETE" | "PATCH" | "PUT";
  endpoint: string;
  description?: string;
}

export default function ApiBlock({ method, endpoint, description }: ApiBlockProps) {
  const methodColors = {
    GET: "bg-green-500/10 text-green-400 border-green-500/20",
    POST: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    DELETE: "bg-red-500/10 text-red-400 border-red-500/20",
    PATCH: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    PUT: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  return (
    <div className="my-8 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "rounded-md border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider",
            methodColors[method]
          )}
        >
          {method}
        </span>
        <code className="rounded-md bg-zinc-900 px-2 py-1 font-mono text-sm text-zinc-100">
          {endpoint}
        </code>
      </div>
      {description && <p className="text-sm text-zinc-400 m-0">{description}</p>}
    </div>
  );
}
