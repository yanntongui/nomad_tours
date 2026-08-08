"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBlogPostAction, updateBlogPostAction } from "@/app/admin/(dashboard)/contenu/actions";
import type { BlogPostRow } from "@/lib/server/blog";

interface FormValues {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author_name: string;
  cover_image: string;
  read_time_minutes: number;
  status: "DRAFT" | "PUBLISHED";
  published_at: string;
}

function toFormValues(post: BlogPostRow | null): FormValues {
  if (!post) {
    return {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      author_name: "",
      cover_image: "",
      read_time_minutes: 5,
      status: "DRAFT",
      published_at: format(new Date(), "yyyy-MM-dd"),
    };
  }
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    author_name: post.author_name,
    cover_image: post.cover_image,
    read_time_minutes: post.read_time_minutes,
    status: post.status,
    published_at: post.published_at
      ? post.published_at.slice(0, 10)
      : format(new Date(), "yyyy-MM-dd"),
  };
}

interface BlogFormProps {
  initial: BlogPostRow | null;
  mode: "create" | "edit";
}

export function BlogForm({ initial, mode }: BlogFormProps) {
  const router = useRouter();
  const [form, setForm] = React.useState<FormValues>(() => toFormValues(initial));
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    const payload = { ...form };

    const result =
      mode === "create"
        ? await createBlogPostAction(payload)
        : await updateBlogPostAction(initial!.id, payload);

    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/admin/contenu");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/contenu")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-stone-800 dark:text-stone-100">{mode === "create" ? "Nouvel article" : form.title || "Modifier l'article"}</h1>
        </div>
        <Button onClick={handleSave} disabled={!form.title.trim() || !form.slug.trim() || saving}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Contenu</TabsTrigger>
          <TabsTrigger value="meta">Métadonnées</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-1.5">
                <Label>Titre</Label>
                <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Extrait</Label>
                <Textarea rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Contenu</Label>
                <RichTextEditor value={form.content} onChange={(html) => set("content", html)} placeholder="Rédigez l'article..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meta">
          <Card>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Catégorie</Label>
                <Input value={form.category} onChange={(e) => set("category", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Auteur</Label>
                <Input value={form.author_name} onChange={(e) => set("author_name", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Image de couverture (URL)</Label>
                <Input value={form.cover_image} onChange={(e) => set("cover_image", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Temps de lecture (minutes)</Label>
                <Input type="number" min={1} value={form.read_time_minutes} onChange={(e) => set("read_time_minutes", Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label>Statut</Label>
                <Select value={form.status} onValueChange={(v) => set("status", v as FormValues["status"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Brouillon</SelectItem>
                    <SelectItem value="PUBLISHED">Publié</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Date de publication</Label>
                <Input type="date" value={form.published_at} onChange={(e) => set("published_at", e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
