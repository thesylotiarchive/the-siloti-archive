"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function PublicBlogViewPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/public/blogs/${slug}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        console.error(err);
        router.replace("/blogs"); // Redirect on error
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-4 px-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center text-red-500 px-4">
        Blog not found.
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 md:px-6 py-10 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        <a href="/blogs" className="hover:underline">← Back to Blogs</a>
      </div>

      {/* Banner */}
      {blog.bannerUrl && (
        <div className="w-full overflow-hidden rounded-md">
          <img
            src={blog.bannerUrl}
            alt={blog.title}
            className="w-full h-56 sm:h-72 md:h-96 object-cover rounded-md transition-all duration-300"
          />
        </div>
      )}

      {/* Title & Meta */}
      <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{blog.title}</h1>
      <p className="text-sm sm:text-base text-muted-foreground">
        By {blog.author || "Unknown Author"} · {format(new Date(blog.publishedAt), "PPP")}
      </p>

      {/* Markdown Content */}
      <article className="prose prose-neutral max-w-none prose-img:rounded-md prose-img:mx-auto prose-img:max-w-full prose-a:text-blue-600 hover:prose-a:underline">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {blog.content}
        </ReactMarkdown>
      </article>
    </main>
  );
}
