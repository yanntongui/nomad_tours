import { listPublishedBlogPosts } from "@/lib/server/blog";
import { BlogListClient } from "./BlogListClient";

export default async function BlogPage() {
  const posts = await listPublishedBlogPosts();
  return <BlogListClient posts={posts} />;
}
