"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { upsertPost } from "@/lib/admin/store/blog-store";
import { AdminBlogPost } from "@/lib/admin/types";

interface BlogFormProps {
  initial: AdminBlogPost;
  mode: "create" | "edit";
}

export function BlogForm({ initial, mode }: BlogFormProps) {
  const router = useRouter();
  const [form, setForm] = React.useState<AdminBlogPost>(initial);

  function set<K extends keyof AdminBlogPost>(key: K, value: AdminBlogPost[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave() {
    upsertPost(form);
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
        <Button onClick={handleSave} disabled={!form.title.trim() || !form.slug.trim()}>Enregistrer</Button>
      </div>

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
                <Textarea rows={10} value={form.content} onChange={(e) => set("content", e.target.value)} />
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
                <Input value={form.authorName} onChange={(e) => set("authorName", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Image de couverture (URL)</Label>
                <Input value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Temps de lecture (minutes)</Label>
                <Input type="number" min={1} value={form.readTimeMinutes} onChange={(e) => set("readTimeMinutes", Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label>Statut</Label>
                <Select value={form.status} onValueChange={(v) => set("status", v as AdminBlogPost["status"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Brouillon</SelectItem>
                    <SelectItem value="PUBLISHED">Publié</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Date de publication</Label>
                <Input value={form.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
