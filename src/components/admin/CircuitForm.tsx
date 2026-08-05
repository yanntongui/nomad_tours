"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Calendar as CalendarIcon, Copy, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { TagListInput } from "@/components/admin/TagListInput";
import { FileUploader, UploadedFile } from "@/components/admin/FileUploader";
import { DragDropList } from "@/components/admin/DragDropList";
import { useDestinations } from "@/lib/admin/store/destinations-store";
import { upsertCircuit } from "@/lib/admin/store/circuits-store";
import { ADMIN_CIRCUITS } from "@/lib/admin/mock/circuits";
import { GUIDES } from "@/lib/admin/mock/users";
import { Circuit, CircuitDeparture, CircuitOption, ItineraryDay, PriceTier } from "@/lib/admin/types";

function fileFromUrl(url: string): UploadedFile {
  return { id: url, name: url.split("/").pop() ?? url, url, isImage: true };
}
function formatXOF(n: number) {
  return `${n.toLocaleString("fr-FR")} FCFA`;
}

const THEMES = ["Culture", "Safari", "Plage", "Aventure", "Événement"] as const;
const INCLUDED_SUGGESTIONS = Array.from(new Set(ADMIN_CIRCUITS.flatMap((c) => c.included)));
const EXCLUDED_SUGGESTIONS = Array.from(new Set(ADMIN_CIRCUITS.flatMap((c) => c.excluded)));

interface CircuitFormProps {
  initial: Circuit;
  mode: "create" | "edit";
}

export function CircuitForm({ initial, mode }: CircuitFormProps) {
  const router = useRouter();
  const destinations = useDestinations();
  const [form, setForm] = React.useState<Circuit>(initial);
  const [images, setImages] = React.useState<UploadedFile[]>(initial.images.map(fileFromUrl));
  const [newDepartureDate, setNewDepartureDate] = React.useState<Date | undefined>();

  function set<K extends keyof Circuit>(key: K, value: Circuit[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave() {
    upsertCircuit({ ...form, images: images.map((f) => f.url) });
    router.push("/admin/circuits");
  }

  function addItineraryDay() {
    const day: ItineraryDay = {
      id: `day-${Date.now()}`,
      day: form.itinerary.length + 1,
      title: "",
      description: "",
    };
    set("itinerary", [...form.itinerary, day]);
  }
  function reorderItinerary(items: ItineraryDay[]) {
    set("itinerary", items.map((d, i) => ({ ...d, day: i + 1 })));
  }
  function updateItineraryDay(id: string, patch: Partial<ItineraryDay>) {
    set("itinerary", form.itinerary.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }
  function removeItineraryDay(id: string) {
    set("itinerary", form.itinerary.filter((d) => d.id !== id).map((d, i) => ({ ...d, day: i + 1 })));
  }

  function addPriceTier() {
    const tier: PriceTier = { id: `tier-${Date.now()}`, label: "", minPax: 1, priceXOF: form.priceXOF };
    set("priceTiers", [...form.priceTiers, tier]);
  }
  function updatePriceTier(id: string, patch: Partial<PriceTier>) {
    set("priceTiers", form.priceTiers.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }
  function removePriceTier(id: string) {
    set("priceTiers", form.priceTiers.filter((t) => t.id !== id));
  }

  function addOption() {
    const opt: CircuitOption = { id: `opt-${Date.now()}`, label: "", priceXOF: 0 };
    set("options", [...form.options, opt]);
  }
  function updateOption(id: string, patch: Partial<CircuitOption>) {
    set("options", form.options.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }
  function removeOption(id: string) {
    set("options", form.options.filter((o) => o.id !== id));
  }

  function addDeparture() {
    if (!newDepartureDate) return;
    const dep: CircuitDeparture = {
      id: `dep-${Date.now()}`,
      date: newDepartureDate.toISOString(),
      seatsTotal: 14,
      seatsBooked: 0,
      status: "OPEN",
    };
    set("departures", [...form.departures, dep].sort((a, b) => a.date.localeCompare(b.date)));
    setNewDepartureDate(undefined);
  }
  function updateDeparture(id: string, patch: Partial<CircuitDeparture>) {
    set("departures", form.departures.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }
  function duplicateDeparture(id: string) {
    const source = form.departures.find((d) => d.id === id);
    if (!source) return;
    const copy: CircuitDeparture = { ...source, id: `dep-${Date.now()}`, seatsBooked: 0, status: "OPEN" };
    set("departures", [...form.departures, copy]);
  }
  function removeDeparture(id: string) {
    set("departures", form.departures.filter((d) => d.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/circuits")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-stone-800 dark:text-stone-100">{mode === "create" ? "Nouveau circuit" : form.title || "Modifier le circuit"}</h1>
        </div>
        <Button onClick={handleSave} disabled={!form.title.trim() || !form.destinationId}>Enregistrer</Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="general">Informations générales</TabsTrigger>
          <TabsTrigger value="program">Programme</TabsTrigger>
          <TabsTrigger value="included">Inclus/Non-inclus</TabsTrigger>
          <TabsTrigger value="pricing">Tarification</TabsTrigger>
          <TabsTrigger value="departures">Disponibilités & Places</TabsTrigger>
          <TabsTrigger value="media">Médias</TabsTrigger>
          <TabsTrigger value="guide">Guide assigné</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Titre</Label>
                <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Destination</Label>
                <Select
                  value={form.destinationId}
                  onValueChange={(v) => {
                    const dest = destinations.find((d) => d.id === v);
                    setForm((f) => ({ ...f, destinationId: v, destinationName: dest?.name ?? f.destinationName }));
                  }}
                >
                  <SelectTrigger><SelectValue placeholder="Choisir une destination" /></SelectTrigger>
                  <SelectContent>
                    {destinations.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Thème</Label>
                <Select value={form.theme} onValueChange={(v) => set("theme", v as Circuit["theme"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {THEMES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Durée (jours)</Label>
                <Input type="number" min={1} value={form.durationDays} onChange={(e) => set("durationDays", Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label>Prix de base (FCFA)</Label>
                <Input type="number" min={0} value={form.priceXOF} onChange={(e) => set("priceXOF", Number(e.target.value))} />
              </div>
              <label className="flex items-center gap-2.5 text-sm text-stone-700 dark:text-stone-300 cursor-pointer md:col-span-2">
                <Checkbox checked={form.isFeatured} onCheckedChange={(v) => set("isFeatured", !!v)} />
                Mis en avant
              </label>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="program">
          <Card>
            <CardHeader><CardTitle className="text-sm">Programme jour par jour</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {form.itinerary.length === 0 ? (
                <p className="text-sm text-stone-400 dark:text-stone-500">Aucune étape. Ajoutez le premier jour.</p>
              ) : (
                <DragDropList
                  items={form.itinerary}
                  onReorder={reorderItinerary}
                  renderItem={(day) => (
                    <div className="space-y-2 py-1">
                      <div className="flex items-center gap-2">
                        <span className="shrink-0 rounded-full bg-luxe-terracotta/10 text-luxe-terracotta text-xs font-bold px-2 py-0.5">Jour {day.day}</span>
                        <Input
                          value={day.title}
                          placeholder="Titre de l'étape"
                          onChange={(e) => updateItineraryDay(day.id, { title: e.target.value })}
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeItineraryDay(day.id)}>
                          <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        </Button>
                      </div>
                      <Textarea
                        rows={2}
                        value={day.description}
                        placeholder="Description de la journée..."
                        onChange={(e) => updateItineraryDay(day.id, { description: e.target.value })}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={day.accommodation ?? ""}
                          placeholder="Hébergement"
                          onChange={(e) => updateItineraryDay(day.id, { accommodation: e.target.value })}
                        />
                        <Input
                          value={day.meals ?? ""}
                          placeholder="Repas inclus"
                          onChange={(e) => updateItineraryDay(day.id, { meals: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                />
              )}
              <Button variant="outline" size="sm" onClick={addItineraryDay}>
                <Plus className="h-3.5 w-3.5" />
                Ajouter un jour
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="included">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-sm">Inclus</CardTitle></CardHeader>
              <CardContent>
                <TagListInput tags={form.included} onChange={(v) => set("included", v)} suggestions={INCLUDED_SUGGESTIONS} placeholder="Ajouter un élément inclus..." />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Non-inclus</CardTitle></CardHeader>
              <CardContent>
                <TagListInput tags={form.excluded} onChange={(v) => set("excluded", v)} suggestions={EXCLUDED_SUGGESTIONS} placeholder="Ajouter un élément non-inclus..." />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pricing">
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-sm">Tarifs dégressifs par nombre de participants</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {form.priceTiers.map((tier) => (
                  <div key={tier.id} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto_auto] gap-2 items-end">
                    <Input placeholder="Libellé" value={tier.label} onChange={(e) => updatePriceTier(tier.id, { label: e.target.value })} />
                    <Input type="number" className="w-24" placeholder="Min pax" value={tier.minPax} onChange={(e) => updatePriceTier(tier.id, { minPax: Number(e.target.value) })} />
                    <Input type="number" className="w-24" placeholder="Max pax" value={tier.maxPax ?? ""} onChange={(e) => updatePriceTier(tier.id, { maxPax: e.target.value ? Number(e.target.value) : undefined })} />
                    <Input type="number" className="w-32" placeholder="Prix FCFA" value={tier.priceXOF} onChange={(e) => updatePriceTier(tier.id, { priceXOF: Number(e.target.value) })} />
                    <Button variant="ghost" size="icon" onClick={() => removePriceTier(tier.id)}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addPriceTier}><Plus className="h-3.5 w-3.5" />Ajouter un palier</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Options payantes</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {form.options.map((opt) => (
                  <div key={opt.id} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2 items-end">
                    <Input placeholder="Libellé de l'option" value={opt.label} onChange={(e) => updateOption(opt.id, { label: e.target.value })} />
                    <Input type="number" className="w-32" placeholder="Prix FCFA" value={opt.priceXOF} onChange={(e) => updateOption(opt.id, { priceXOF: Number(e.target.value) })} />
                    <Button variant="ghost" size="icon" onClick={() => removeOption(opt.id)}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addOption}><Plus className="h-3.5 w-3.5" />Ajouter une option</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departures">
          <Card>
            <CardHeader><CardTitle className="text-sm">Dates de départ & places</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {form.departures.length === 0 && <p className="text-sm text-stone-400 dark:text-stone-500">Aucune date de départ programmée.</p>}
              {form.departures.map((dep) => (
                <div key={dep.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-stone-100 dark:border-stone-800 p-3">
                  <span className="text-sm font-medium text-stone-800 dark:text-stone-100 w-32">{format(new Date(dep.date), "PPP", { locale: fr })}</span>
                  <Input
                    type="number"
                    className="w-24"
                    value={dep.seatsBooked}
                    onChange={(e) => updateDeparture(dep.id, { seatsBooked: Number(e.target.value) })}
                  />
                  <span className="text-xs text-stone-400 dark:text-stone-500">/</span>
                  <Input
                    type="number"
                    className="w-24"
                    value={dep.seatsTotal}
                    onChange={(e) => updateDeparture(dep.id, { seatsTotal: Number(e.target.value) })}
                  />
                  <span className="text-xs text-stone-400 dark:text-stone-500">places</span>
                  <Select value={dep.status} onValueChange={(v) => updateDeparture(dep.id, { status: v as CircuitDeparture["status"] })}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">Ouvert</SelectItem>
                      <SelectItem value="COMPLET">Complet</SelectItem>
                      <SelectItem value="ANNULE">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                  <StatusBadge status={dep.status} />
                  <div className="flex-1" />
                  <Button variant="ghost" size="icon" onClick={() => duplicateDeparture(dep.id)}><Copy className="h-3.5 w-3.5 text-stone-500 dark:text-stone-400" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => removeDeparture(dep.id)}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
                </div>
              ))}
              <div className="flex items-center gap-2 border-t border-stone-100 dark:border-stone-800 pt-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start font-normal">
                      <CalendarIcon className="h-4 w-4" />
                      {newDepartureDate ? format(newDepartureDate, "PPP", { locale: fr }) : "Choisir une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto">
                    <Calendar mode="single" selected={newDepartureDate} onSelect={(d) => setNewDepartureDate(d as Date | undefined)} />
                  </PopoverContent>
                </Popover>
                <Button variant="outline" size="sm" onClick={addDeparture} disabled={!newDepartureDate}>
                  <Plus className="h-3.5 w-3.5" />
                  Ajouter la date
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <Card>
            <CardHeader><CardTitle className="text-sm">Galerie photo</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FileUploader files={images} onChange={setImages} label="Ajouter des photos" />
              {images.length > 1 && (
                <div className="space-y-1.5">
                  <Label>Réordonner</Label>
                  <DragDropList
                    items={images}
                    onReorder={setImages}
                    renderItem={(f) => <span className="text-sm text-stone-600 dark:text-stone-400 truncate">{f.name}</span>}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide">
          <Card>
            <CardContent className="pt-6 space-y-1.5">
              <Label>Guide assigné</Label>
              <Select
                value={form.guide?.guideId ?? "NONE"}
                onValueChange={(v) => {
                  if (v === "NONE") return set("guide", undefined);
                  const guide = GUIDES.find((g) => g.id === v);
                  if (guide) set("guide", { guideId: guide.id, guideName: guide.name });
                }}
              >
                <SelectTrigger className="w-64"><SelectValue placeholder="Aucun guide" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">Aucun guide</SelectItem>
                  {GUIDES.map((g) => (
                    <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-1.5">
                <Label>Titre SEO</Label>
                <Input value={form.seoTitle ?? ""} onChange={(e) => set("seoTitle", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Meta description</Label>
                <Textarea rows={3} value={form.seoDescription ?? ""} onChange={(e) => set("seoDescription", e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
