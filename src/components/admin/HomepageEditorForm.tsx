"use client";
import * as React from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DragDropList } from "@/components/admin/DragDropList";
import { TagListInput } from "@/components/admin/TagListInput";
import { useHomepageContent, updateHomepageContent } from "@/lib/admin/store/homepage-store";
import { HOMEPAGE_ICON_OPTIONS } from "@/lib/admin/homepage-icons";
import {
  HomepageContent,
  HomepageIconKey,
  HomepageStat,
  HomepageServiceItem,
  HomepageWhyUsItem,
} from "@/lib/admin/types";

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

export function HomepageEditorForm() {
  const content = useHomepageContent();
  const [form, setForm] = React.useState<HomepageContent>(content);

  React.useEffect(() => {
    setForm(content);
  }, [content]);

  const dirty = JSON.stringify(form) !== JSON.stringify(content);

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

  function handleSave() {
    updateHomepageContent(form);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Contenu affiché sur la page d&apos;accueil publique. Les modifications sont visibles immédiatement après enregistrement.
        </p>
        <Button onClick={handleSave} disabled={!dirty}>
          <Save className="h-3.5 w-3.5" />
          Enregistrer
        </Button>
      </div>

      <Tabs defaultValue="hero">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="whyus">Pourquoi nous</TabsTrigger>
          <TabsTrigger value="banner">Bannière circuit</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
        </TabsList>

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
      </Tabs>
    </div>
  );
}
