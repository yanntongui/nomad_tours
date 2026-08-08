"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus, Star, Check, X, Save, Pencil, Trash2, Ban, RotateCcw } from "lucide-react";
import { DataTable, exportRowsToCsv } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { HomepageEditorForm } from "@/components/admin/HomepageEditorForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  approveTestimonialAction,
  rejectTestimonialAction,
  updateCmsSeoSettingsAction,
} from "./actions";
import type { TestimonialRow } from "@/lib/server/testimonials";
import type { BlogPostRow } from "@/lib/server/blog";
import type { CmsSeoSettingsRow } from "@/lib/server/cms-settings";
import type { HomepageContentVersionRow } from "@/lib/server/homepage";
import type { DestinationRow } from "@/lib/server/destinations";
import { HomepageContent } from "@/lib/admin/types";
import {
  useBanners,
  createEmptyBanner,
  upsertBanner,
  deleteBanner,
} from "@/lib/admin/store/banners-store";
import {
  useNewsletterSubscribers,
  disableNewsletterSubscriber,
  enableNewsletterSubscriber,
} from "@/lib/admin/store/newsletter-store";
import { Banner, BannerPlacement, NewsletterSubscriber } from "@/lib/admin/types";

const BANNER_PLACEMENT_LABELS: Record<BannerPlacement, string> = {
  HOMEPAGE_TOP: "Accueil (bandeau haut)",
  HOMEPAGE_INLINE: "Accueil (contenu)",
  CIRCUITS: "Page Circuits",
  DESTINATIONS: "Page Destinations",
  SITE_WIDE: "Tout le site",
};

function TemoignagesTab({ testimonials }: { testimonials: TestimonialRow[] }) {
  const router = useRouter();
  const [rejectTarget, setRejectTarget] = React.useState<TestimonialRow | null>(null);
  const [pending, setPending] = React.useState<string | null>(null);

  async function approve(id: string) {
    setPending(id);
    await approveTestimonialAction(id);
    setPending(null);
    router.refresh();
  }

  async function reject(id: string) {
    setPending(id);
    await rejectTestimonialAction(id);
    setPending(null);
    router.refresh();
  }

  const columns = React.useMemo<ColumnDef<TestimonialRow, any>[]>(
    () => [
      { accessorKey: "user_name", header: "Client" },
      { accessorKey: "trip_title", header: "Voyage" },
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
      {
        id: "date",
        header: "Date",
        cell: ({ row }) => format(parseISO(row.original.created_at.slice(0, 10)), "d MMM yyyy", { locale: fr }),
      },
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
          const busy = pending === t.id;
          if (t.status !== "PENDING") {
            return (
              <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                {t.status === "REJECTED" && (
                  <Button variant="ghost" size="sm" disabled={busy} onClick={() => approve(t.id)}>Approuver</Button>
                )}
              </div>
            );
          }
          return (
            <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" disabled={busy} onClick={() => approve(t.id)}>
                <Check className="h-4 w-4 text-emerald-600" />
              </Button>
              <Button variant="ghost" size="icon" disabled={busy} onClick={() => setRejectTarget(t)}>
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          );
        },
      },
    ],
    [pending]
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
        description={rejectTarget ? `L'avis de ${rejectTarget.user_name} ne sera pas publié sur le site.` : undefined}
        destructive
        confirmLabel="Rejeter"
        onConfirm={() => {
          if (rejectTarget) reject(rejectTarget.id);
        }}
      />
    </>
  );
}

function BlogTab({ posts }: { posts: BlogPostRow[] }) {
  const router = useRouter();

  const columns = React.useMemo<ColumnDef<BlogPostRow, any>[]>(
    () => [
      { accessorKey: "title", header: "Titre" },
      { accessorKey: "category", header: "Catégorie" },
      { accessorKey: "author_name", header: "Auteur" },
      {
        id: "published_at",
        header: "Date",
        cell: ({ row }) =>
          row.original.published_at
            ? format(parseISO(row.original.published_at.slice(0, 10)), "d MMM yyyy", { locale: fr })
            : "—",
      },
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

function SeoTab({ settings }: { settings: CmsSeoSettingsRow }) {
  const router = useRouter();
  const [form, setForm] = React.useState<CmsSeoSettingsRow>(settings);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setForm(settings);
  }, [settings]);

  const dirty = JSON.stringify(form) !== JSON.stringify(settings);

  function set<K extends keyof CmsSeoSettingsRow>(key: K, value: CmsSeoSettingsRow[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setError(null);
    const result = await updateCmsSeoSettingsAction({
      site_title: form.site_title,
      meta_description: form.meta_description,
      og_image: form.og_image,
    });
    setSaving(false);
    if (result.error) setError(result.error);
    else router.refresh();
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader><CardTitle className="text-sm">SEO global du site</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>Titre du site</Label>
          <Input value={form.site_title} onChange={(e) => set("site_title", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Meta description</Label>
          <Textarea rows={3} value={form.meta_description} onChange={(e) => set("meta_description", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Image Open Graph (URL)</Label>
          <Input value={form.og_image ?? ""} onChange={(e) => set("og_image", e.target.value)} />
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <Button disabled={!dirty || saving} onClick={save}>
          <Save className="h-3.5 w-3.5" />
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </CardContent>
    </Card>
  );
}

function BannerFormDialog({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Banner | null;
}) {
  const [form, setForm] = React.useState<Banner>(() => editing ?? createEmptyBanner());

  React.useEffect(() => {
    if (open) setForm(editing ?? createEmptyBanner());
  }, [open, editing]);

  function set<K extends keyof Banner>(key: K, value: Banner[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const valid = form.title.trim().length > 0 && form.image.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Modifier la bannière" : "Nouvelle bannière"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Titre</Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Ex. Soldes d'été" />
          </div>
          <div className="space-y-1.5">
            <Label>Sous-titre</Label>
            <Textarea rows={2} value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="Texte d'accroche" />
          </div>
          <div className="space-y-1.5">
            <Label>Image (URL)</Label>
            <Input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Libellé du bouton</Label>
              <Input value={form.ctaLabel} onChange={(e) => set("ctaLabel", e.target.value)} placeholder="Voir les circuits" />
            </div>
            <div className="space-y-1.5">
              <Label>Lien du bouton</Label>
              <Input value={form.ctaHref} onChange={(e) => set("ctaHref", e.target.value)} placeholder="/circuits" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Emplacement</Label>
            <Select value={form.placement} onValueChange={(v) => set("placement", v as BannerPlacement)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(BANNER_PLACEMENT_LABELS) as BannerPlacement[]).map((p) => (
                  <SelectItem key={p} value={p}>{BANNER_PLACEMENT_LABELS[p]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Date de début</Label>
              <Input type="date" value={form.startDate ?? ""} onChange={(e) => set("startDate", e.target.value || null)} />
            </div>
            <div className="space-y-1.5">
              <Label>Date de fin</Label>
              <Input type="date" value={form.endDate ?? ""} onChange={(e) => set("endDate", e.target.value || null)} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
            <Checkbox checked={form.active} onCheckedChange={(v) => set("active", Boolean(v))} />
            Bannière active
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button
            disabled={!valid}
            onClick={() => {
              upsertBanner(form);
              onOpenChange(false);
            }}
          >
            {editing ? "Enregistrer" : "Créer la bannière"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BanneresTab() {
  const banners = useBanners();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Banner | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Banner | null>(null);

  const columns = React.useMemo<ColumnDef<Banner, any>[]>(
    () => [
      { accessorKey: "title", header: "Bannière", cell: ({ row }) => <span className="text-sm font-medium text-stone-800 dark:text-stone-100">{row.original.title}</span> },
      { id: "placement", header: "Emplacement", cell: ({ row }) => <StatusBadge status={row.original.placement} label={BANNER_PLACEMENT_LABELS[row.original.placement]} /> },
      {
        id: "period",
        header: "Période",
        cell: ({ row }) => (
          <span className="text-sm text-stone-600 dark:text-stone-400">
            {row.original.startDate || row.original.endDate
              ? `${row.original.startDate ?? "…"} → ${row.original.endDate ?? "…"}`
              : "—"}
          </span>
        ),
      },
      {
        id: "active",
        header: "Statut",
        cell: ({ row }) => (
          <StatusBadge status={row.original.active ? "ACTIVE" : "INACTIVE"} label={row.original.active ? "Active" : "Inactive"} />
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onSelect={() => { setEditing(row.original); setFormOpen(true); }}>
                <Pencil className="h-3.5 w-3.5" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setDeleteTarget(row.original)} className="text-red-600">
                <Trash2 className="h-3.5 w-3.5" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="h-3.5 w-3.5" />
          Nouvelle bannière
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={banners}
        getRowId={(b) => b.id}
        onRowClick={(b) => { setEditing(b); setFormOpen(true); }}
        emptyMessage="Aucune bannière."
      />
      <BannerFormDialog open={formOpen} onOpenChange={setFormOpen} editing={editing} />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Supprimer cette bannière ?"
        destructive
        confirmLabel="Supprimer"
        onConfirm={() => deleteTarget && deleteBanner(deleteTarget.id)}
      />
    </div>
  );
}

const NEWSLETTER_CSV_HEADERS: { key: keyof NewsletterSubscriber; label: string }[] = [
  { key: "email", label: "Email" },
  { key: "name", label: "Nom" },
  { key: "source", label: "Source" },
  { key: "subscribedAt", label: "Date d'inscription" },
  { key: "status", label: "Statut" },
];

function NewsletterTab() {
  const subscribers = useNewsletterSubscribers();

  const columns = React.useMemo<ColumnDef<NewsletterSubscriber, any>[]>(
    () => [
      { accessorKey: "email", header: "Email", cell: ({ row }) => <span className="text-sm font-medium text-stone-800 dark:text-stone-100">{row.original.email}</span> },
      { id: "name", header: "Nom", cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">{row.original.name ?? "—"}</span> },
      { accessorKey: "source", header: "Source" },
      { accessorKey: "subscribedAt", header: "Date d'inscription" },
      {
        id: "status",
        header: "Statut",
        cell: ({ row }) => (
          <StatusBadge status={row.original.status} label={row.original.status === "ACTIVE" ? "Actif" : "Désactivé"} />
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => {
          const s = row.original;
          return (
            <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
              {s.status === "ACTIVE" ? (
                <Button variant="ghost" size="sm" onClick={() => disableNewsletterSubscriber(s.id)}>
                  <Ban className="h-3.5 w-3.5" />
                  Désactiver
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => enableNewsletterSubscriber(s.id)}>
                  <RotateCcw className="h-3.5 w-3.5" />
                  Réactiver
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={subscribers}
      getRowId={(s) => s.id}
      emptyMessage="Aucun abonné à la newsletter."
      onExportCsv={() => exportRowsToCsv(subscribers, NEWSLETTER_CSV_HEADERS, `newsletter-${Date.now()}`)}
    />
  );
}

interface ContenuClientProps {
  posts: BlogPostRow[];
  testimonials: TestimonialRow[];
  approvedTestimonials: TestimonialRow[];
  homepageContent: HomepageContent;
  homepageVersions: HomepageContentVersionRow[];
  seoSettings: CmsSeoSettingsRow;
  destinations: DestinationRow[];
}

export function ContenuClient({
  posts,
  testimonials,
  approvedTestimonials,
  homepageContent,
  homepageVersions,
  seoSettings,
  destinations,
}: ContenuClientProps) {
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
          <TabsTrigger value="bannieres">Bannières</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
        </TabsList>

        <TabsContent value="temoignages"><TemoignagesTab testimonials={testimonials} /></TabsContent>
        <TabsContent value="blog"><BlogTab posts={posts} /></TabsContent>
        <TabsContent value="seo"><SeoTab settings={seoSettings} /></TabsContent>
        <TabsContent value="accueil">
          <HomepageEditorForm
            publishedContent={homepageContent}
            versions={homepageVersions}
            destinations={destinations}
            testimonials={approvedTestimonials}
          />
        </TabsContent>
        <TabsContent value="bannieres"><BanneresTab /></TabsContent>
        <TabsContent value="newsletter"><NewsletterTab /></TabsContent>
      </Tabs>
    </div>
  );
}
