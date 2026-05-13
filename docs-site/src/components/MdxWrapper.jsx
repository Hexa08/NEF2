import React from 'react';
import { MDXProvider } from '@mdx-js/react';

const components = {
  h1: (props) => <h1 className="text-4xl font-bold tracking-tight mb-8" {...props} />,
  h2: (props) => <h2 className="text-2xl font-semibold tracking-tight mt-12 mb-4 border-b border-border pb-2" {...props} />,
  h3: (props) => <h3 className="text-xl font-medium tracking-tight mt-8 mb-4" {...props} />,
  p: (props) => <p className="text-foreground/80 leading-7 mb-6" {...props} />,
  ul: (props) => <ul className="list-disc list-inside space-y-2 mb-6 text-foreground/80" {...props} />,
  ol: (props) => <ol className="list-decimal list-inside space-y-2 mb-6 text-foreground/80" {...props} />,
  li: (props) => <li className="ml-4" {...props} />,
  code: (props) => (
    <code className="bg-card px-1.5 py-0.5 rounded text-sm font-mono text-accent" {...props} />
  ),
  pre: (props) => (
    <pre className="bg-card border border-border rounded-xl p-4 mb-8 overflow-x-auto custom-scrollbar" {...props} />
  ),
  blockquote: (props) => (
    <blockquote className="border-l-4 border-accent bg-accent/5 px-6 py-4 rounded-r-xl italic mb-6" {...props} />
  ),
  table: (props) => (
    <div className="overflow-x-auto mb-8 rounded-xl border border-border">
      <table className="w-full text-left border-collapse" {...props} />
    </div>
  ),
  th: (props) => <th className="bg-card/50 px-4 py-3 font-semibold border-b border-border" {...props} />,
  td: (props) => <td className="px-4 py-3 border-b border-border/50" {...props} />,
};

export default function MdxWrapper({ children }) {
  return (
    <MDXProvider components={components}>
      <article className="prose prose-invert max-w-none">
        {children}
      </article>
    </MDXProvider>
  );
}
