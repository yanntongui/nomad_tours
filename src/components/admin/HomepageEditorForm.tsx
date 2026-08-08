"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, Trash2, UploadCloud, History, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DragDropList } from "@/components/admin/DragDropList";
import { TagListInput } from "@/components/admin/TagListInput";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  saveHomepageDraftAction,
  publishHomepageAction,
  rollbackHomepageVersionAction,
} from "@/app/admin/(dashboard)/contenu/homepage-actions";
import type { HomepageContentVersionRow } from "@/lib/server/homepage";
import type { DestinationRow } from "@/lib/server/destinations";
import type { TestimonialRow } from "@/lib/server/testimonials";
import { useAdminRole } from "@/context/AdminRoleContext";
import { HOMEPAGE_ICON_OPTIONS } from "@/lib/admin/homepage-icons";
import {
  HomepageContent,
  HomepageIconKey,
  HomepageStat,
  HomepageServiceItem,
  HomepageWhyUsItem,
  HomepageSectionKey,
  HomepageSectionMeta,
  HomepageFooterColumn,
  HomepageFooterLink,
  HomepageFooterSocialLink,
} from "@/lib/admin/types";

const SECTION_LABELS: Record<HomepageSectionKey, string> = {
  hero: "Hero (bannière principale)",
  trustBar: "Bandeau de statistiques",
  services: "Services",
  destinations: "Destinations vedettes",
  whyUs: "Pourquoi nous",
  featuredCircuit: "Circuit mis en avant",
  testimonials: "Témoignages",
  gallery: "Galerie",
  newsletter: "Newsletter",
};

function ImagePreview({ url }: { url: string }) {
  if (!url) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="" className="h-16 w-24 rounded-md object-cover border border-stone-200 dark:border-stone-800" />
  );
}

function IconSelect({ value, onChange }: { value: HomepageIconKey; onChange: (v: HomepageIconKey) => void }) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as HomepageIconKey)}>
      <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
      <SelectContent>
        {HOMEPAGE_ICON_OPTIONS.map((opt) => (
          <SelectItem key={opt.key} value={opt.key}>{opt.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface HomepageEditorFormProps {
  publishedContent: HomepageContent;
  versions: HomepageContentVersionRow[];
  destinations: DestinationRow[];
  testimonials: TestimonialRow[];
}

export function HomepageEditorForm({
  publishedContent,
  versions,
  destinations,
  testimonials,
}: HomepageEditorFormProps) {
  const router = useRouter();
  const { user } = useAdminRole();
  const latestVersion = versions[0];
  const draftContent = (latestVersion?.content as unknown as HomepageContent | undefined) ?? publishedContent;
  const [form, setForm] = React.useState<HomepageContent>(draftContent);
  const [saving, setSaving] = React.useState<"draft" | "publish" | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [rollbackTarget, setRollbackTarget] = React.useState<string | null>(null);

  React.useEffect(() => {
    setForm(draftContent);
  }, [draftContent]);

  const dirty = JSON.stringify(form) !== JSON.stringify(draftContent);

  function setHero<K extends keyof HomepageContent["hero"]>(key: K, value: HomepageContent["hero"][K]) {
    setForm((f) => ({ ...f, hero: { ...f.hero, [key]: value } }));
  }
  function setServicesHeading<K extends "eyebrow" | "title">(key: K, value: string) {
    setForm((f) => ({ ...f, services: { ...f.services, [key]: value } }));
  }
  function setWhyUs<K extends keyof HomepageContent["whyUs"]>(key: K, value: HomepageContent["whyUs"][K]) {
    setForm((f) => ({ ...f, whyUs: { ...f.whyUs, [key]: value } }));
  }
  function setFeaturedCircuit<K extends keyof HomepageContent["featuredCircuit"]>(key: K, value: HomepageContent["featuredCircuit"][K]) {
    setForm((f) => ({ ...f, featuredCircuit: { ...f.featuredCircuit, [key]: value } }));
  }
  function setNewsletter<K extends keyof HomepageContent["newsletter"]>(key: K, value: HomepageContent["newsletter"][K]) {
    setForm((f) => ({ ...f, newsletter: { ...f.newsletter, [key]: value } }));
  }
  function setFeaturedDestinations<K extends keyof HomepageContent["featuredDestinations"]>(
    key: K,
    value: HomepageContent["featuredDestinations"][K]
  ) {
    setForm((f) => ({ ...f, featuredDestinations: { ...f.featuredDestinations, [key]: value } }));
  }
  function setTestimonialsConfig<K extends keyof HomepageContent["testimonialsConfig"]>(
    key: K,
    value: HomepageContent["testimonialsConfig"][K]
  ) {
    setForm((f) => ({ ...f, testimonialsConfig: { ...f.testimonialsConfig, [key]: value } }));
  }
  function setFooter<K extends keyof HomepageContent["footer"]>(key: K, value: HomepageContent["footer"][K]) {
    setForm((f) => ({ ...f, footer: { ...f.footer, [key]: value } }));
  }

  function addFooterColumn() {
    const column: HomepageFooterColumn = { id: `footer-col-${Date.now()}`, title: "", links: [] };
    setForm((f) => ({ ...f, footer: { ...f.footer, columns: [...f.footer.columns, column] } }));
  }
  function updateFooterColumn(id: string, patch: Partial<HomepageFooterColumn>) {
    setForm((f) => ({
      ...f,
      footer: { ...f.footer, columns: f.footer.columns.map((c) => (c.id === id ? { ...c, ...patch } : c)) },
    }));
  }
  function removeFooterColumn(id: string) {
    setForm((f) => ({ ...f, footer: { ...f.footer, columns: f.footer.columns.filter((c) => c.id !== id) } }));
  }
  function reorderFooterColumns(items: HomepageFooterColumn[]) {
    setForm((f) => ({ ...f, footer: { ...f.footer, columns: items } }));
  }

  function addFooterLink(columnId: string) {
    const link: HomepageFooterLink = { id: `footer-link-${Date.now()}`, label: "", href: "" };
    updateFooterColumn(columnId, {
      links: [...(form.footer.columns.find((c) => c.id === columnId)?.links ?? []), link],
    });
  }
  function updateFooterLink(columnId: string, linkId: string, patch: Partial<HomepageFooterLink>) {
    const column = form.footer.columns.find((c) => c.id === columnId);
    if (!column) return;
    updateFooterColumn(columnId, {
      links: column.links.map((l) => (l.id === linkId ? { ...l, ...patch } : l)),
    });
  }
  function removeFooterLink(columnId: string, linkId: string) {
    const column = form.footer.columns.find((c) => c.id === columnId);
    if (!column) return;
    updateFooterColumn(columnId, { links: column.links.filter((l) => l.id !== linkId) });
  }

  function addFooterSocial() {
    const social: HomepageFooterSocialLink = { id: `footer-social-${Date.now()}`, platform: "", url: "" };
    setForm((f) => ({ ...f, footer: { ...f.footer, socials: [...f.footer.socials, social] } }));
  }
  function updateFooterSocial(id: string, patch: Partial<HomepageFooterSocialLink>) {
    setForm((f) => ({
      ...f,
      footer: { ...f.footer, socials: f.footer.socials.map((s) => (s.id === id ? { ...s, ...patch } : s)) },
    }));
  }
  function removeFooterSocial(id: string) {
    setForm((f) => ({ ...f, footer: { ...f.footer, socials: f.footer.socials.filter((s) => s.id !== id) } }));
  }

  function addStat() {
    const stat: HomepageStat = { id: `stat-${Date.now()}`, value: 0, suffix: "", label: "" };
    setForm((f) => ({ ...f, stats: [...f.stats, stat] }));
  }
  function updateStat(id: string, patch: Partial<HomepageStat>) {
    setForm((f) => ({ ...f, stats: f.stats.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));
  }
  function removeStat(id: string) {
    setForm((f) => ({ ...f, stats: f.stats.filter((s) => s.id !== id) }));
  }
  function reorderStats(items: HomepageStat[]) {
    setForm((f) => ({ ...f, stats: items }));
  }

  function addServiceItem() {
    const item: HomepageServiceItem = {
      id: `service-${Date.now()}`,
      title: "",
      description: "",
      icon: "COMPASS",
      image: "",
      href: "",
    };
    setForm((f) => ({ ...f, services: { ...f.services, items: [...f.services.items, item] } }));
  }
  function updateServiceItem(id: string, patch: Partial<HomepageServiceItem>) {
    setForm((f) => ({
      ...f,
      services: { ...f.services, items: f.services.items.map((s) => (s.id === id ? { ...s, ...patch } : s)) },
    }));
  }
  function removeServiceItem(id: string) {
    setForm((f) => ({ ...f, services: { ...f.services, items: f.services.items.filter((s) => s.id !== id) } }));
  }
  function reorderServiceItems(items: HomepageServiceItem[]) {
    setForm((f) => ({ ...f, services: { ...f.services, items } }));
  }

  function addWhyUsItem() {
    const item: HomepageWhyUsItem = { id: `why-${Date.now()}`, icon: "COMPASS", title: "", description: "" };
    setForm((f) => ({ ...f, whyUs: { ...f.whyUs, items: [...f.whyUs.items, item] } }));
  }
  function updateWhyUsItem(id: string, patch: Partial<HomepageWhyUsItem>) {
    setForm((f) => ({
      ...f,
      whyUs: { ...f.whyUs, items: f.whyUs.items.map((w) => (w.id === id ? { ...w, ...patch } : w)) },
    }));
  }
  function removeWhyUsItem(id: string) {
    setForm((f) => ({ ...f, whyUs: { ...f.whyUs, items: f.whyUs.items.filter((w) => w.id !== id) } }));
  }
  function reorderWhyUsItems(items: HomepageWhyUsItem[]) {
    setForm((f) => ({ ...f, whyUs: { ...f.whyUs, items } }));
  }

  async function handleSaveDraft() {
    setSaving("draft");
    setError(null);
    const result = await saveHomepageDraftAction(form, user.name);
    setSaving(null);
    if (result.error) {
      setError(result.error);
    } else {
      router.refresh();
    }
  }
  async function handlePublish() {
    setSaving("publish");
    setError(null);
    const result = await publishHomepageAction(form, user.name);
    setSaving(null);
    if (result.error) {
      setError(result.error);
    } else {
      router.refresh();
    }
  }
  async function handleRollback(versionId: string) {
    setError(null);
    setRollbackTarget(versionId);
    const result = await rollbackHomepageVersionAction(versionId, user.name);
    setRollbackTarget(null);
    if (result.error) {
      setError(result.error);
    } else {
      router.refresh();
    }
  }

  const sortedSections = React.useMemo(
    () => [...form.sectionsOrder].sort((a, b) => a.order - b.order),
    [form.sectionsOrder]
  );

  function reorderSections(items: (HomepageSectionMeta & { id: string })[]) {
    setForm((f) => ({
      ...f,
      sectionsOrder: items.map((it, i) => ({ key: it.key, enabled: it.enabled, order: i })),
    }));
  }
  function toggleSection(key: HomepageSectionKey, enabled: boolean) {
    setForm((f) => ({
      ...f,
      sectionsOrder: f.sectionsOrder.map((s) => (s.key === key ? { ...s, enabled } : s)),
    }));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Contenu affiché sur la page d&apos;accueil publique. Enregistrez un brouillon pour sauvegarder votre
          travail, puis publiez pour le rendre visible sur le site public.
        </p>
        <div className="flex items-center gap-2 shrink-0">
          {latestVersion && (
            <Badge variant={latestVersion.status === "PUBLISHED" ? "emerald" : "amber"}>
              {latestVersion.status === "PUBLISHED" ? "Publié" : "Brouillon"}
            </Badge>
          )}
          <Button variant="outline" onClick={handleSaveDraft} disabled={!dirty || saving !== null}>
            <Save className="h-3.5 w-3.5" />
            {saving === "draft" ? "Enregistrement..." : "Enregistrer le brouillon"}
          </Button>
          <Button onClick={handlePublish} disabled={(!dirty && latestVersion?.status === "PUBLISHED") || saving !== null}>
            <UploadCloud className="h-3.5 w-3.5" />
            {saving === "publish" ? "Publication..." : "Publier"}
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      <Tabs defaultValue="sections">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="destinations">Destinations vedettes</TabsTrigger>
          <TabsTrigger value="whyus">Pourquoi nous</TabsTrigger>
          <TabsTrigger value="banner">Bannière circuit</TabsTrigger>
          <TabsTrigger value="testimonials">Témoignages</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="sections">
          <Card>
            <CardHeader><CardTitle className="text-sm">Ordre et visibilité des sections</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Glissez-déposez pour réordonner les sections de la page d&apos;accueil. Décochez pour masquer une section sans la supprimer.
              </p>
              <DragDropList
                items={sortedSections.map((s) => ({ ...s, id: s.key }))}
                onReorder={reorderSections}
                renderItem={(item) => (
                  <label className="flex items-center gap-3 py-1 cursor-pointer">
                    <Checkbox
                      checked={item.enabled}
                      onCheckedChange={(v) => toggleSection(item.key, Boolean(v))}
                    />
                    <span className="text-sm font-medium text-stone-800 dark:text-stone-100">
                      {SECTION_LABELS[item.key]}
                    </span>
                  </label>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero">
          <Card>
            <CardHeader><CardTitle className="text-sm">Section Hero (première section, plein écran)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Bandeau (eyebrow)</Label>
                <Input value={form.hero.eyebrow} onChange={(e) => setHero("eyebrow", e.target.value)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Titre principal</Label>
                  <Input value={form.hero.headlineLine1} onChange={(e) => setHero("headlineLine1", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Titre — mot mis en avant</Label>
                  <Input value={form.hero.headlineHighlight} onChange={(e) => setHero("headlineHighlight", e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Sous-titre</Label>
                <Textarea rows={3} value={form.hero.subheadline} onChange={(e) => setHero("subheadline", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Image de fond (URL)</Label>
                <div className="flex items-center gap-3">
                  <Input value={form.hero.backgroundImage} onChange={(e) => setHero("backgroundImage", e.target.value)} />
                  <ImagePreview url={form.hero.backgroundImage} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader><CardTitle className="text-sm">Bandeau de statistiques</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {form.stats.length === 0 ? (
                <p className="text-sm text-stone-400 dark:text-stone-500">Aucune statistique. Ajoutez-en une.</p>
              ) : (
                <DragDropList
                  items={form.stats}
                  onReorder={reorderStats}
                  renderItem={(stat) => (
                    <div className="grid grid-cols-1 sm:grid-cols-[100px_100px_1fr_auto] gap-2 items-end py-1">
                      <div className="space-y-1">
                        <Label className="text-xs">Valeur</Label>
                        <Input type="number" value={stat.value} onChange={(e) => updateStat(stat.id, { value: Number(e.target.value) })} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Suffixe</Label>
                        <Input value={stat.suffix} onChange={(e) => updateStat(stat.id, { suffix: e.target.value })} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Libellé</Label>
                        <Input value={stat.label} onChange={(e) => updateStat(stat.id, { label: e.target.value })} />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeStat(stat.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      </Button>
                    </div>
                  )}
                />
              )}
              <Button variant="outline" size="sm" onClick={addStat}>
                <Plus className="h-3.5 w-3.5" />
                Ajouter une statistique
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-sm">En-tête de section</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Bandeau (eyebrow)</Label>
                  <Input value={form.services.eyebrow} onChange={(e) => setServicesHeading("eyebrow", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Titre</Label>
                  <Input value={form.services.title} onChange={(e) => setServicesHeading("title", e.target.value)} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Cartes de services</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {form.services.items.length === 0 ? (
                  <p className="text-sm text-stone-400 dark:text-stone-500">Aucun service. Ajoutez-en un.</p>
                ) : (
                  <DragDropList
                    items={form.services.items}
                    onReorder={reorderServiceItems}
                    renderItem={(item) => (
                      <div className="space-y-2 py-1">
                        <div className="flex items-center gap-2">
                          <IconSelect value={item.icon} onChange={(v) => updateServiceItem(item.id, { icon: v })} />
                          <Input
                            value={item.title}
                            placeholder="Titre du service"
                            onChange={(e) => updateServiceItem(item.id, { title: e.target.value })}
                          />
                          <Button variant="ghost" size="icon" onClick={() => removeServiceItem(item.id)}>
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                          </Button>
                        </div>
                        <Textarea
                          rows={2}
                          value={item.description}
                          placeholder="Description"
                          onChange={(e) => updateServiceItem(item.id, { description: e.target.value })}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                          <Input
                            value={item.href}
                            placeholder="Lien (ex: /circuits)"
                            onChange={(e) => updateServiceItem(item.id, { href: e.target.value })}
                          />
                          <div className="flex items-center gap-2">
                            <Input
                              value={item.image}
                              placeholder="Image (URL)"
                              onChange={(e) => updateServiceItem(item.id, { image: e.target.value })}
                            />
                            <ImagePreview url={item.image} />
                          </div>
                        </div>
                      </div>
                    )}
                  />
                )}
                <Button variant="outline" size="sm" onClick={addServiceItem}>
                  <Plus className="h-3.5 w-3.5" />
                  Ajouter un service
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="destinations">
          <Card>
            <CardHeader><CardTitle className="text-sm">Destinations vedettes</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Bandeau (eyebrow)</Label>
                  <Input
                    value={form.featuredDestinations.eyebrow}
                    onChange={(e) => setFeaturedDestinations("eyebrow", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Titre</Label>
                  <Input
                    value={form.featuredDestinations.title}
                    onChange={(e) => setFeaturedDestinations("title", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Destinations affichées sur la page d&apos;accueil</Label>
                <MultiSelect
                  options={destinations.map((d) => ({ value: d.id, label: d.name }))}
                  selected={form.featuredDestinations.destinationIds}
                  onChange={(v) => setFeaturedDestinations("destinationIds", v)}
                  placeholder="Aucune destination sélectionnée"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whyus">
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-sm">En-tête de section</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Bandeau (eyebrow)</Label>
                    <Input value={form.whyUs.eyebrow} onChange={(e) => setWhyUs("eyebrow", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Titre</Label>
                    <Input value={form.whyUs.title} onChange={(e) => setWhyUs("title", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Texte d&apos;introduction</Label>
                  <Textarea rows={3} value={form.whyUs.intro} onChange={(e) => setWhyUs("intro", e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Image 1 (URL)</Label>
                    <div className="flex items-center gap-3">
                      <Input value={form.whyUs.image1} onChange={(e) => setWhyUs("image1", e.target.value)} />
                      <ImagePreview url={form.whyUs.image1} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Image 2 (URL)</Label>
                    <div className="flex items-center gap-3">
                      <Input value={form.whyUs.image2} onChange={(e) => setWhyUs("image2", e.target.value)} />
                      <ImagePreview url={form.whyUs.image2} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Points forts</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {form.whyUs.items.length === 0 ? (
                  <p className="text-sm text-stone-400 dark:text-stone-500">Aucun point fort. Ajoutez-en un.</p>
                ) : (
                  <DragDropList
                    items={form.whyUs.items}
                    onReorder={reorderWhyUsItems}
                    renderItem={(item) => (
                      <div className="space-y-2 py-1">
                        <div className="flex items-center gap-2">
                          <IconSelect value={item.icon} onChange={(v) => updateWhyUsItem(item.id, { icon: v })} />
                          <Input
                            value={item.title}
                            placeholder="Titre"
                            onChange={(e) => updateWhyUsItem(item.id, { title: e.target.value })}
                          />
                          <Button variant="ghost" size="icon" onClick={() => removeWhyUsItem(item.id)}>
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                          </Button>
                        </div>
                        <Textarea
                          rows={2}
                          value={item.description}
                          placeholder="Description"
                          onChange={(e) => updateWhyUsItem(item.id, { description: e.target.value })}
                        />
                      </div>
                    )}
                  />
                )}
                <Button variant="outline" size="sm" onClick={addWhyUsItem}>
                  <Plus className="h-3.5 w-3.5" />
                  Ajouter un point fort
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="banner">
          <Card>
            <CardHeader><CardTitle className="text-sm">Bannière promotionnelle — circuit mis en avant</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Badge</Label>
                  <Input value={form.featuredCircuit.badge} onChange={(e) => setFeaturedCircuit("badge", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Sous-titre (durée / lieu)</Label>
                  <Input value={form.featuredCircuit.subtitle} onChange={(e) => setFeaturedCircuit("subtitle", e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Titre</Label>
                <Input value={form.featuredCircuit.title} onChange={(e) => setFeaturedCircuit("title", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Points forts</Label>
                <TagListInput
                  tags={form.featuredCircuit.highlights}
                  onChange={(v) => setFeaturedCircuit("highlights", v)}
                  placeholder="Ajouter un point fort..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Libellé prix</Label>
                  <Input value={form.featuredCircuit.priceLabel} onChange={(e) => setFeaturedCircuit("priceLabel", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Prix affiché</Label>
                  <Input value={form.featuredCircuit.priceValue} onChange={(e) => setFeaturedCircuit("priceValue", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Texte du bouton</Label>
                  <Input value={form.featuredCircuit.ctaLabel} onChange={(e) => setFeaturedCircuit("ctaLabel", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Lien du bouton</Label>
                  <Input value={form.featuredCircuit.ctaHref} onChange={(e) => setFeaturedCircuit("ctaHref", e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Image (URL)</Label>
                <div className="flex items-center gap-3">
                  <Input value={form.featuredCircuit.image} onChange={(e) => setFeaturedCircuit("image", e.target.value)} />
                  <ImagePreview url={form.featuredCircuit.image} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials">
          <Card>
            <CardHeader><CardTitle className="text-sm">Section témoignages</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Bandeau (eyebrow)</Label>
                  <Input
                    value={form.testimonialsConfig.eyebrow}
                    onChange={(e) => setTestimonialsConfig("eyebrow", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Titre</Label>
                  <Input
                    value={form.testimonialsConfig.title}
                    onChange={(e) => setTestimonialsConfig("title", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Témoignages affichés (approuvés uniquement)</Label>
                <MultiSelect
                  options={testimonials.map((t) => ({ value: t.id, label: `${t.user_name} — ${t.trip_title}` }))}
                  selected={form.testimonialsConfig.testimonialIds}
                  onChange={(v) => setTestimonialsConfig("testimonialIds", v)}
                  placeholder="Aucun témoignage sélectionné"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="newsletter">
          <Card>
            <CardHeader><CardTitle className="text-sm">Bannière newsletter</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Titre</Label>
                <Input value={form.newsletter.title} onChange={(e) => setNewsletter("title", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Sous-titre</Label>
                <Textarea rows={2} value={form.newsletter.subtitle} onChange={(e) => setNewsletter("subtitle", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Message de confirmation (après inscription)</Label>
                <Input value={form.newsletter.confirmMessage} onChange={(e) => setNewsletter("confirmMessage", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Mention légère (sous le formulaire)</Label>
                <Input value={form.newsletter.disclaimer} onChange={(e) => setNewsletter("disclaimer", e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer">
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-sm">Coordonnées</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea rows={2} value={form.footer.description} onChange={(e) => setFooter("description", e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label>Adresse</Label>
                    <Input value={form.footer.address} onChange={(e) => setFooter("address", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Téléphone</Label>
                    <Input value={form.footer.phone} onChange={(e) => setFooter("phone", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input value={form.footer.email} onChange={(e) => setFooter("email", e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-sm">Réseaux sociaux</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {form.footer.socials.length === 0 ? (
                  <p className="text-sm text-stone-400 dark:text-stone-500">Aucun réseau social. Ajoutez-en un.</p>
                ) : (
                  <div className="space-y-2">
                    {form.footer.socials.map((social) => (
                      <div key={social.id} className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-2 items-end">
                        <div className="space-y-1">
                          <Label className="text-xs">Plateforme</Label>
                          <Input
                            value={social.platform}
                            placeholder="Instagram"
                            onChange={(e) => updateFooterSocial(social.id, { platform: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Lien</Label>
                          <Input
                            value={social.url}
                            placeholder="https://..."
                            onChange={(e) => updateFooterSocial(social.id, { url: e.target.value })}
                          />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeFooterSocial(social.id)}>
                          <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <Button variant="outline" size="sm" onClick={addFooterSocial}>
                  <Plus className="h-3.5 w-3.5" />
                  Ajouter un réseau social
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-sm">Colonnes de liens</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {form.footer.columns.length === 0 ? (
                  <p className="text-sm text-stone-400 dark:text-stone-500">Aucune colonne. Ajoutez-en une.</p>
                ) : (
                  <DragDropList
                    items={form.footer.columns}
                    onReorder={reorderFooterColumns}
                    renderItem={(column) => (
                      <div className="space-y-3 py-1">
                        <div className="flex items-center gap-2">
                          <Input
                            value={column.title}
                            placeholder="Titre de la colonne"
                            onChange={(e) => updateFooterColumn(column.id, { title: e.target.value })}
                          />
                          <Button variant="ghost" size="icon" onClick={() => removeFooterColumn(column.id)}>
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                          </Button>
                        </div>
                        <div className="space-y-2 pl-2 border-l-2 border-stone-100 dark:border-stone-800">
                          {column.links.map((link) => (
                            <div key={link.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-end">
                              <div className="space-y-1">
                                <Label className="text-xs">Libellé</Label>
                                <Input
                                  value={link.label}
                                  onChange={(e) => updateFooterLink(column.id, link.id, { label: e.target.value })}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Lien</Label>
                                <Input
                                  value={link.href}
                                  onChange={(e) => updateFooterLink(column.id, link.id, { href: e.target.value })}
                                />
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => removeFooterLink(column.id, link.id)}>
                                <Trash2 className="h-3.5 w-3.5 text-red-500" />
                              </Button>
                            </div>
                          ))}
                          <Button variant="outline" size="sm" onClick={() => addFooterLink(column.id)}>
                            <Plus className="h-3.5 w-3.5" />
                            Ajouter un lien
                          </Button>
                        </div>
                      </div>
                    )}
                  />
                )}
                <Button variant="outline" size="sm" onClick={addFooterColumn}>
                  <Plus className="h-3.5 w-3.5" />
                  Ajouter une colonne
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader><CardTitle className="text-sm">Historique des versions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {versions.length === 0 ? (
                <p className="text-sm text-stone-400 dark:text-stone-500">Aucune version enregistrée pour le moment.</p>
              ) : (
                versions.map((version, index) => (
                  <div
                    key={version.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 dark:border-stone-800 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <History className="h-4 w-4 text-stone-400 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-stone-800 dark:text-stone-100">
                            {new Date(version.created_at).toLocaleString("fr-FR")}
                          </span>
                          <Badge variant={version.status === "PUBLISHED" ? "emerald" : "amber"}>
                            {version.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                          </Badge>
                          {index === 0 && <Badge variant="blue">Actuelle</Badge>}
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          Par {version.actor}
                          {version.published_at &&
                            ` — publié le ${new Date(version.published_at).toLocaleString("fr-FR")}`}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={index === 0 || rollbackTarget !== null}
                      onClick={() => handleRollback(version.id)}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      {rollbackTarget === version.id ? "Restauration..." : "Restaurer"}
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
