import { AlertCircle, Info, Lightbulb, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CalloutProps {
  children: ReactNode;
  type?: "info" | "warning" | "error" | "tip";
  title?: string;
}

export default function Callout({ children, type = "info", title }: CalloutProps) {
  const styles = {
    info: {
      border: "border-blue-500",
      bg: "bg-blue-950/20",
      icon: <Info className="h-4 w-4 text-blue-500" />,
      text: "text-blue-200",
    },
    warning: {
      border: "border-amber-500",
      bg: "bg-amber-950/20",
      icon: <TriangleAlert className="h-4 w-4 text-amber-500" />,
      text: "text-amber-200",
    },
    error: {
      border: "border-red-500",
      bg: "bg-red-950/20",
      icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      text: "text-red-200",
    },
    tip: {
      border: "border-green-500",
      bg: "bg-green-950/20",
      icon: <Lightbulb className="h-4 w-4 text-green-500" />,
      text: "text-green-200",
    },
  };

  const current = styles[type];

  return (
    <div className={cn("my-6 flex flex-col gap-2 rounded-lg border-l-4 p-4", current.border, current.bg)}>
      <div className="flex items-center gap-2">
        {current.icon}
        <span className={cn("text-sm font-semibold", current.text)}>
          {title || type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      </div>
      <div className="text-sm leading-relaxed text-zinc-300 [&>p]:mb-0">
        {children}
      </div>
    </div>
  );
}
