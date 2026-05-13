"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("h2, h3")).map((element) => ({
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
    <div className="sticky top-14 w-56 hidden xl:block shrink-0 overflow-y-auto pt-10 pb-8 pl-8 h-[calc(100vh-3.5rem)]">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          On this page
        </p>
        <ul className="space-y-2.5 text-sm">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={cn(
                "transition-colors",
                heading.level === 3 && "pl-4",
                activeId === heading.id
                  ? "text-indigo-400 font-medium"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <a href={`#${heading.id}`} className="block leading-relaxed">
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
