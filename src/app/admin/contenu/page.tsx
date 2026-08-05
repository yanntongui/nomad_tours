"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Star, Check, X, Save } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { RequireSuperAdmin } from "@/components/admin/RequireSuperAdmin";
import { HomepageEditorForm } from "@/components/admin/HomepageEditorForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useTestimonialsStore,
  approveTestimonial,
  rejectTestimonial,
} from "@/lib/admin/store/testimonials-store";
import { useBlogPosts } from "@/lib/admin/store/blog-store";
import { useCmsSeoSettings, updateCmsSeoSettings } from "@/lib/admin/store/cms-settings-store";
import { AdminTestimonial, AdminBlogPost, CmsSeoSettings } from "@/lib/admin/types";

function TemoignagesTab() {
  const testimonials = useTestimonialsStore();
  const [rejectTarget, setRejectTarget] = React.useState<AdminTestimonial | null>(null);

  const columns = React.useMemo<ColumnDef<AdminTestimonial, any>[]>(
    () => [
      { accessorKey: "userName", header: "Client" },
      { accessorKey: "tripTitle", header: "Voyage" },
      {
        accessorKey: "rating",
        header: "Note",
        cell: ({ row }) => (
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-3.5 w-3.5 ${i < row.original.rating ? "fill-amber-400 text-amber-400" : "text-stone-200 dark:text-stone-700"}`} />
            ))}
          </div>
        ),
      },
      {
        accessorKey: "content",
        header: "Avis",
        cell: ({ row }) => <p className="text-sm text-stone-600 max-w-md truncate dark:text-stone-400">{row.original.content}</p>,
      },
      { accessorKey: "date", header: "Date" },
      {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => {
          const t = row.original;
          if (t.status !== "PENDING") {
            return (
              <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                {t.status === "REJECTED" && (
                  <Button variant="ghost" size="sm" onClick={() => approveTestimonial(t.id)}>Approuver</Button>
                )}
              </div>
            );
          }
          return (
            <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" onClick={() => approveTestimonial(t.id)}>
                <Check className="h-4 w-4 text-emerald-600" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setRejectTarget(t)}>
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={testimonials}
        getRowId={(t) => t.id}
        emptyMessage="Aucun témoignage."
      />
      <ConfirmDialog
        open={!!rejectTarget}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        title="Rejeter ce témoignage ?"
        description={rejectTarget ? `L'avis de ${rejectTarget.userName} ne sera pas publié sur le site.` : undefined}
        destructive
        confirmLabel="Rejeter"
        onConfirm={() => {
          if (rejectTarget) rejectTestimonial(rejectTarget.id);
        }}
      />
    </>
  );
}

function BlogTab() {
  const router = useRouter();
  const posts = useBlogPosts();

  const columns = React.useMemo<ColumnDef<AdminBlogPost, any>[]>(
    () => [
      { accessorKey: "title", header: "Titre" },
      { accessorKey: "category", header: "Catégorie" },
      { accessorKey: "authorName", header: "Auteur" },
      { accessorKey: "publishedAt", header: "Date" },
      {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
    ],
    []
  );

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/admin/contenu/blog/new">
            <Plus className="h-4 w-4" />
            Nouvel article
          </Link>
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={posts}
        getRowId={(p) => p.id}
        onRowClick={(p) => router.push(`/admin/contenu/blog/${p.id}`)}
        emptyMessage="Aucun article."
      />
    </div>
  );
}

function SeoTab() {
  const settings = useCmsSeoSettings();
  const [form, setForm] = React.useState<CmsSeoSettings>(settings);

  React.useEffect(() => {
    setForm(settings);
  }, [settings]);

  const dirty = JSON.stringify(form) !== JSON.stringify(settings);

  function set<K extends keyof CmsSeoSettings>(key: K, value: CmsSeoSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader><CardTitle className="text-sm">SEO global du site</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>Titre du site</Label>
          <Input value={form.siteTitle} onChange={(e) => set("siteTitle", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Meta description</Label>
          <Textarea rows={3} value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Image Open Graph (URL)</Label>
          <Input value={form.ogImage ?? ""} onChange={(e) => set("ogImage", e.target.value)} />
        </div>
        <Button disabled={!dirty} onClick={() => updateCmsSeoSettings(form)}>
          <Save className="h-3.5 w-3.5" />
          Enregistrer
        </Button>
      </CardContent>
    </Card>
  );
}

function ContenuContent() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Contenu (CMS)</h1>
        <p className="text-sm text-stone-500 mt-0.5 dark:text-stone-400">Témoignages, articles de blog et référencement du site public.</p>
      </div>

      <Tabs defaultValue="temoignages">
        <TabsList>
          <TabsTrigger value="temoignages">Témoignages</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="accueil">Accueil</TabsTrigger>
        </TabsList>

        <TabsContent value="temoignages"><TemoignagesTab /></TabsContent>
        <TabsContent value="blog"><BlogTab /></TabsContent>
        <TabsContent value="seo"><SeoTab /></TabsContent>
        <TabsContent value="accueil"><HomepageEditorForm /></TabsContent>
      </Tabs>
    </div>
  );
}

export default function ContenuPage() {
  return (
    <RequireSuperAdmin>
      <ContenuContent />
    </RequireSuperAdmin>
  );
}
