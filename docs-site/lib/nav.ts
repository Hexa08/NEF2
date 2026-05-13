export interface NavItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Overview", href: "/docs" },
      { title: "Quickstart", href: "/docs/getting-started" },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      { title: "Architecture", href: "/docs/architecture" },
      { title: "Format Spec", href: "/docs/format-spec" },
    ],
  },
  {
    title: "Runtime & Backends",
    items: [
      { title: "Runtime Engine", href: "/docs/runtime" },
      { title: "GPU Backends", href: "/docs/gpu-backends" },
    ],
  },
  {
    title: "Advanced",
    items: [
      { title: "Distributed Systems", href: "/docs/distributed" },
      { title: "Compiler Pipeline", href: "/docs/compiler" },
    ],
  },
  {
    title: "Reference",
    items: [
      { title: "API Reference", href: "/docs/api-reference" },
      { title: "CLI", href: "/docs/cli" },
    ],
  },
];
