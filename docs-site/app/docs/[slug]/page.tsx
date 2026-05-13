import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import MDXComponents from "@/components/MDXComponents";
import { notFound } from "next/navigation";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";

export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), "content");
  const files = fs.readdirSync(contentDir);
  return files.map((file) => ({
    slug: file.replace(".mdx", ""),
  }));
}

export default async function DocPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const contentDir = path.join(process.cwd(), "content");
  const filePath = path.join(contentDir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const source = fs.readFileSync(filePath, "utf8");

  return (
    <div className="space-y-6">
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
    </div>
  );
}
