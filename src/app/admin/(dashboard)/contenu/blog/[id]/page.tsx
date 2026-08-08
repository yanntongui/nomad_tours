import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BlogForm } from "@/components/admin/BlogForm";
import { getBlogPost } from "@/lib/server/blog";

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await getBlogPost(params.id);

  if (!post) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-10 text-center dark:border-stone-800 dark:bg-stone-900">
        <p className="text-stone-500 dark:text-stone-400">Article introuvable.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/admin/contenu"><ArrowLeft className="h-4 w-4" />Retour</Link>
        </Button>
      </div>
    );
  }

  return <BlogForm initial={post} mode="edit" key={post.id} />;
}
