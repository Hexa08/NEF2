import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import MDXComponents from "@/components/docs/MDXComponents";
import { notFound } from "next/navigation";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import TableOfContents from "@/components/layout/TableOfContents";

export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), "content/docs");
  if (!fs.existsSync(contentDir)) return [];
  const files = fs.readdirSync(contentDir);
  return files.map((file) => ({
    slug: file.replace(".mdx", ""),
  }));
}

export default async function DocPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const contentDir = path.join(process.cwd(), "content/docs");
  const filePath = path.join(contentDir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const source = fs.readFileSync(filePath, "utf8");

  // Basic frontmatter/title extraction fallback
  const titleMatch = source.match(/^#\s+(.*)/m);
  const title = titleMatch ? titleMatch[1] : slug.replace(/-/g, ' ');

  return (
    <div className="flex w-full">
      <div className="mx-auto w-full min-w-0 max-w-3xl px-6 py-12 lg:px-8">
        {/* Page Header */}
        <div className="mb-10">
          <div className="mb-2 text-sm font-medium text-indigo-400 capitalize tracking-wider">
            {slug.replace(/-/g, ' ')}
          </div>
          {/* Title is rendered by MDX # heading, or we can enforce it here if we strip it */}
          <div className="mt-8 border-b border-zinc-800" />
        </div>

        <article className="prose prose-zinc max-w-none dark:prose-invert prose-headings:scroll-mt-20">
          <MDXRemote 
            source={source} 
            components={MDXComponents} 
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [
                    rehypeAutolinkHeadings,
                    {
                      behavior: "wrap",
                      properties: {
                        className: ["subheading-anchor"],
                        ariaLabel: "Link to section",
                      },
                    },
                  ],
                ],
              },
            }}
          />
        </article>
      </div>
      <TableOfContents />
    </div>
  );
}
