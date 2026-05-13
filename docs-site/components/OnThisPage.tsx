"use client"

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function OnThisPage() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("h2, h3"))
      .map((element) => ({
        id: element.id,
        text: element.textContent || "",
        level: parseInt(element.tagName.charAt(1)),
      }));
    setHeadings(elements);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    document.querySelectorAll("h2, h3").forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="hidden xl:block">
      <h5 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
        On This Page
      </h5>
      <ul className="flex flex-col gap-3">
        {headings.map((heading) => (
          <li 
            key={heading.id}
            className={cn(
              "transition-all duration-200",
              heading.level === 3 && "pl-4"
            )}
          >
            <a
              href={`#${heading.id}`}
              className={cn(
                "text-[13px] transition-all duration-200 block",
                activeId === heading.id
                  ? "text-primary font-medium translate-x-1"
                  : "text-white/40 hover:text-white/70"
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
      
      <div className="mt-8 border-t border-white/[0.05] pt-8 flex flex-col gap-4">
        <a href="#" className="text-[12px] text-white/30 hover:text-primary transition-colors flex items-center gap-2">
          <span>Edit this page on GitHub</span>
        </a>
        <a href="#" className="text-[12px] text-white/30 hover:text-primary transition-colors flex items-center gap-2">
          <span>Join our Discord community</span>
        </a>
      </div>
    </div>
  );
}
