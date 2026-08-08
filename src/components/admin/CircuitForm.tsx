"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Calendar as CalendarIcon, Copy, List, Plus, Trash2 } from "lucide-react";
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
import { CATEGORY_LABELS } from "@/lib/admin/programme-annuel";
import type { CircuitRow } from "@/lib/server/circuits";
import type { DestinationRow } from "@/lib/server/destinations";
import type { Enums } from "@/lib/server/types";
import { createCircuitAction, updateCircuitAction } from "@/app/admin/(dashboard)/circuits/actions";

function fileFromUrl(url: string): UploadedFile {
  return { id: url, name: url.split("/").pop() ?? url, url, isImage: true };
}
function formatXOF(n: number) {
  return `${n.toLocaleString("fr-FR")} FCFA`;
}

const THEMES = ["Culture", "Safari", "Plage", "Aventure", "Événement"] as const;
type DepartureStatus = Enums<"departure_status">;
type CircuitCategory = Enums<"circuit_category">;

interface FormValues {
  title: string;
  slug: string;
  destination_id: string;
  theme: string;
  category: CircuitCategory;
  duration_days: number;
  price_xof: number;
  is_featured: boolean;
  guide_id: string | null;
  included: string[];
  excluded: string[];
  seo_title: string;
  seo_description: string;
}

interface ItineraryDraft {
  tempId: string;
  day_number: number;
  title: string;
  description: string;
  accommodation: string;
  meals: string;
}
interface PriceTierDraft {
  tempId: string;
  label: string;
  min_pax: number;
  max_pax?: number;
  price_xof: number;
}
interface OptionDraft {
  tempId: string;
  label: string;
  price_xof: number;
}
interface DepartureDraft {
  tempId: string;
  departure_date: string;
  seats_total: number;
  seats_booked: number;
  status: DepartureStatus;
}

function toFormValues(circuit: CircuitRow | null): FormValues {
  if (!circuit) {
    return {
      title: "",
      slug: "",
      destination_id: "",
      theme: "Culture",
      category: "ESCAPADE_LOCALE",
      duration_days: 1,
      price_xof: 0,
      is_featured: false,
      guide_id: null,
      included: [],
      excluded: [],
      seo_title: "",
      seo_description: "",
    };
  }
  return {
    title: circuit.title,
    slug: circuit.slug,
    destination_id: circuit.destination_id,
    theme: circuit.theme,
    category: circuit.category,
    duration_days: circuit.duration_days,
    price_xof: circuit.price_xof,
    is_featured: circuit.is_featured,
    guide_id: circuit.guide_id,
    included: circuit.included ?? [],
    excluded: circuit.excluded ?? [],
    seo_title: circuit.seo_title ?? "",
    seo_description: circuit.seo_description ?? "",
  };
}

function toItineraryDrafts(circuit: CircuitRow | null): ItineraryDraft[] {
  if (!circuit) return [];
  return circuit.circuit_itinerary_days
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((d) => ({
      tempId: d.id,
      day_number: d.day_number,
      title: d.title,
      description: d.description,
      accommodation: d.accommodation ?? "",
      meals: d.meals ?? "",
    }));
}
function toPriceTierDrafts(circuit: CircuitRow | null): PriceTierDraft[] {
  if (!circuit) return [];
  return circuit.circuit_price_tiers
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((t) => ({
      tempId: t.id,
      label: t.label,
      min_pax: t.min_pax,
      max_pax: t.max_pax ?? undefined,
      price_xof: t.price_xof,
    }));
}
function toOptionDrafts(circuit: CircuitRow | null): OptionDraft[] {
  if (!circuit) return [];
  return circuit.circuit_options
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((o) => ({ tempId: o.id, label: o.label, price_xof: o.price_xof }));
}
function toDepartureDrafts(circuit: CircuitRow | null): DepartureDraft[] {
  if (!circuit) return [];
  return circuit.circuit_departures
    .slice()
    .sort((a, b) => a.departure_date.localeCompare(b.departure_date))
    .map((d) => ({
      tempId: d.id,
      departure_date: d.departure_date,
      seats_total: d.seats_total,
      seats_booked: d.seats_booked,
      status: d.status,
    }));
}

interface GuideOption {
  id: string;
  name: string;
}

interface CircuitFormProps {
  initial: CircuitRow | null;
  mode: "create" | "edit";
  destinations: DestinationRow[];
  allCircuits: CircuitRow[];
  guides: GuideOption[];
}

export function CircuitForm({ initial, mode, destinations, allCircuits, guides }: CircuitFormProps) {
  const router = useRouter();
  const [form, setForm] = React.useState<FormValues>(() => toFormValues(initial));
  const [images, setImages] = React.useState<UploadedFile[]>((initial?.images ?? []).map(fileFromUrl));
  const [itinerary, setItinerary] = React.useState<ItineraryDraft[]>(() => toItineraryDrafts(initial));
  const [priceTiers, setPriceTiers] = React.useState<PriceTierDraft[]>(() => toPriceTierDrafts(initial));
  const [options, setOptions] = React.useState<OptionDraft[]>(() => toOptionDrafts(initial));
  const [departures, setDepartures] = React.useState<DepartureDraft[]>(() => toDepartureDrafts(initial));
  const [newDepartureDate, setNewDepartureDate] = React.useState<Date | undefined>();
  const [departuresView, setDeparturesView] = React.useState<"list" | "calendar">("list");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const includedSuggestions = React.useMemo(() => Array.from(new Set(allCircuits.flatMap((c) => c.included ?? []))), [allCircuits]);
  const excludedSuggestions = React.useMemo(() => Array.from(new Set(allCircuits.flatMap((c) => c.excluded ?? []))), [allCircuits]);

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    const payload = { ...form, images: images.map((f) => f.url) };
    const children = {
      itinerary: itinerary.map(({ day_number, title, description, accommodation, meals }, i) => ({
        day_number,
        title,
        description,
        accommodation: accommodation || null,
        meals: meals || null,
        position: i,
      })),
      priceTiers: priceTiers.map(({ label, min_pax, max_pax, price_xof }, i) => ({
        label,
        min_pax,
        max_pax: max_pax ?? null,
        price_xof,
        position: i,
      })),
      options: options.map(({ label, price_xof }, i) => ({ label, price_xof, position: i })),
      departures: departures.map(({ departure_date, seats_total, seats_booked, status }) => ({
        departure_date,
        seats_total,
        seats_booked,
        status,
      })),
    };

    const result =
      mode === "create"
        ? await createCircuitAction(payload, children)
        : await updateCircuitAction(initial!.id, payload, children);

    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/admin/circuits");
  }

  function addItineraryDay() {
    const day: ItineraryDraft = {
      tempId: `day-${Date.now()}`,
      day_number: itinerary.length + 1,
      title: "",
      description: "",
      accommodation: "",
      meals: "",
    };
    setItinerary([...itinerary, day]);
  }
  function reorderItinerary(items: ItineraryDraft[]) {
    setItinerary(items.map((d, i) => ({ ...d, day_number: i + 1 })));
  }
  function updateItineraryDay(tempId: string, patch: Partial<ItineraryDraft>) {
    setItinerary(itinerary.map((d) => (d.tempId === tempId ? { ...d, ...patch } : d)));
  }
  function removeItineraryDay(tempId: string) {
    setItinerary(itinerary.filter((d) => d.tempId !== tempId).map((d, i) => ({ ...d, day_number: i + 1 })));
  }

  function addPriceTier() {
    const tier: PriceTierDraft = { tempId: `tier-${Date.now()}`, label: "", min_pax: 1, price_xof: form.price_xof };
    setPriceTiers([...priceTiers, tier]);
  }
  function updatePriceTier(tempId: string, patch: Partial<PriceTierDraft>) {
    setPriceTiers(priceTiers.map((t) => (t.tempId === tempId ? { ...t, ...patch } : t)));
  }
  function removePriceTier(tempId: string) {
    setPriceTiers(priceTiers.filter((t) => t.tempId !== tempId));
  }

  function addOption() {
    const opt: OptionDraft = { tempId: `opt-${Date.now()}`, label: "", price_xof: 0 };
    setOptions([...options, opt]);
  }
  function updateOption(tempId: string, patch: Partial<OptionDraft>) {
    setOptions(options.map((o) => (o.tempId === tempId ? { ...o, ...patch } : o)));
  }
  function removeOption(tempId: string) {
    setOptions(options.filter((o) => o.tempId !== tempId));
  }

  function addDeparture() {
    if (!newDepartureDate) return;
    const dep: DepartureDraft = {
      tempId: `dep-${Date.now()}`,
      departure_date: format(newDepartureDate, "yyyy-MM-dd"),
      seats_total: 14,
      seats_booked: 0,
      status: "OPEN",
    };
    setDepartures([...departures, dep].sort((a, b) => a.departure_date.localeCompare(b.departure_date)));
    setNewDepartureDate(undefined);
  }
  function updateDeparture(tempId: string, patch: Partial<DepartureDraft>) {
    setDepartures(departures.map((d) => (d.tempId === tempId ? { ...d, ...patch } : d)));
  }
  function duplicateDeparture(tempId: string) {
    const source = departures.find((d) => d.tempId === tempId);
    if (!source) return;
    const copy: DepartureDraft = { ...source, tempId: `dep-${Date.now()}`, seats_booked: 0, status: "OPEN" };
    setDepartures([...departures, copy]);
  }
  function removeDeparture(tempId: string) {
    setDepartures(departures.filter((d) => d.tempId !== tempId));
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
        <Button onClick={handleSave} disabled={!form.title.trim() || !form.destination_id || !form.slug.trim() || saving}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

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
                <Select value={form.destination_id} onValueChange={(v) => set("destination_id", v)}>
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
                <Select value={form.theme} onValueChange={(v) => set("theme", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {THEMES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Catégorie</Label>
                <Select value={form.category} onValueChange={(v) => set("category", v as CircuitCategory)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(CATEGORY_LABELS) as CircuitCategory[]).map((c) => (
                      <SelectItem key={c} value={c}>{CATEGORY_LABELS[c]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Durée (jours)</Label>
                <Input type="number" min={1} value={form.duration_days} onChange={(e) => set("duration_days", Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label>Prix de base (FCFA)</Label>
                <Input type="number" min={0} value={form.price_xof} onChange={(e) => set("price_xof", Number(e.target.value))} />
              </div>
              <label className="flex items-center gap-2.5 text-sm text-stone-700 dark:text-stone-300 cursor-pointer md:col-span-2">
                <Checkbox checked={form.is_featured} onCheckedChange={(v) => set("is_featured", !!v)} />
                Mis en avant
              </label>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="program">
          <Card>
            <CardHeader><CardTitle className="text-sm">Programme jour par jour</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {itinerary.length === 0 ? (
                <p className="text-sm text-stone-400 dark:text-stone-500">Aucune étape. Ajoutez le premier jour.</p>
              ) : (
                <DragDropList
                  items={itinerary.map((d) => ({ ...d, id: d.tempId }))}
                  onReorder={reorderItinerary}
                  renderItem={(day) => (
                    <div className="space-y-2 py-1">
                      <div className="flex items-center gap-2">
                        <span className="shrink-0 rounded-full bg-luxe-terracotta/10 text-luxe-terracotta text-xs font-bold px-2 py-0.5">Jour {day.day_number}</span>
                        <Input
                          value={day.title}
                          placeholder="Titre de l'étape"
                          onChange={(e) => updateItineraryDay(day.tempId, { title: e.target.value })}
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeItineraryDay(day.tempId)}>
                          <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        </Button>
                      </div>
                      <Textarea
                        rows={2}
                        value={day.description}
                        placeholder="Description de la journée..."
                        onChange={(e) => updateItineraryDay(day.tempId, { description: e.target.value })}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={day.accommodation}
                          placeholder="Hébergement"
                          onChange={(e) => updateItineraryDay(day.tempId, { accommodation: e.target.value })}
                        />
                        <Input
                          value={day.meals}
                          placeholder="Repas inclus"
                          onChange={(e) => updateItineraryDay(day.tempId, { meals: e.target.value })}
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
                <TagListInput tags={form.included} onChange={(v) => set("included", v)} suggestions={includedSuggestions} placeholder="Ajouter un élément inclus..." />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Non-inclus</CardTitle></CardHeader>
              <CardContent>
                <TagListInput tags={form.excluded} onChange={(v) => set("excluded", v)} suggestions={excludedSuggestions} placeholder="Ajouter un élément non-inclus..." />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pricing">
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-sm">Tarifs dégressifs par nombre de participants</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {priceTiers.map((tier) => (
                  <div key={tier.tempId} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto_auto] gap-2 items-end">
                    <Input placeholder="Libellé" value={tier.label} onChange={(e) => updatePriceTier(tier.tempId, { label: e.target.value })} />
                    <Input type="number" className="w-24" placeholder="Min pax" value={tier.min_pax} onChange={(e) => updatePriceTier(tier.tempId, { min_pax: Number(e.target.value) })} />
                    <Input type="number" className="w-24" placeholder="Max pax" value={tier.max_pax ?? ""} onChange={(e) => updatePriceTier(tier.tempId, { max_pax: e.target.value ? Number(e.target.value) : undefined })} />
                    <Input type="number" className="w-32" placeholder="Prix FCFA" value={tier.price_xof} onChange={(e) => updatePriceTier(tier.tempId, { price_xof: Number(e.target.value) })} />
                    <Button variant="ghost" size="icon" onClick={() => removePriceTier(tier.tempId)}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addPriceTier}><Plus className="h-3.5 w-3.5" />Ajouter un palier</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Options payantes</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {options.map((opt) => (
                  <div key={opt.tempId} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2 items-end">
                    <Input placeholder="Libellé de l'option" value={opt.label} onChange={(e) => updateOption(opt.tempId, { label: e.target.value })} />
                    <Input type="number" className="w-32" placeholder="Prix FCFA" value={opt.price_xof} onChange={(e) => updateOption(opt.tempId, { price_xof: Number(e.target.value) })} />
                    <Button variant="ghost" size="icon" onClick={() => removeOption(opt.tempId)}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addOption}><Plus className="h-3.5 w-3.5" />Ajouter une option</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departures">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-sm">Dates de départ & places</CardTitle>
              <div className="flex items-center gap-1 rounded-lg border border-stone-200 p-0.5 dark:border-stone-800">
                <Button
                  type="button"
                  variant={departuresView === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setDeparturesView("list")}
                >
                  <List className="h-3.5 w-3.5" />
                  Vue liste
                </Button>
                <Button
                  type="button"
                  variant={departuresView === "calendar" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setDeparturesView("calendar")}
                >
                  <CalendarIcon className="h-3.5 w-3.5" />
                  Vue calendrier
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {departuresView === "calendar" && (
                <div className="rounded-lg border border-stone-100 p-4 dark:border-stone-800">
                  <Calendar mode="single" markedDates={departures.map((d) => parseISO(d.departure_date))} />
                  <p className="mt-2 text-xs text-stone-400 dark:text-stone-500">Les points indiquent les dates de départ programmées. Utilisez la vue liste pour modifier les places ou le statut.</p>
                </div>
              )}
              {departuresView === "list" && departures.length === 0 && <p className="text-sm text-stone-400 dark:text-stone-500">Aucune date de départ programmée.</p>}
              {departuresView === "list" && departures.map((dep) => (
                <div key={dep.tempId} className="flex flex-wrap items-center gap-2 rounded-lg border border-stone-100 dark:border-stone-800 p-3">
                  <span className="text-sm font-medium text-stone-800 dark:text-stone-100 w-32">{format(parseISO(dep.departure_date), "PPP", { locale: fr })}</span>
                  <Input
                    type="number"
                    className="w-24"
                    value={dep.seats_booked}
                    onChange={(e) => updateDeparture(dep.tempId, { seats_booked: Number(e.target.value) })}
                  />
                  <span className="text-xs text-stone-400 dark:text-stone-500">/</span>
                  <Input
                    type="number"
                    className="w-24"
                    value={dep.seats_total}
                    onChange={(e) => updateDeparture(dep.tempId, { seats_total: Number(e.target.value) })}
                  />
                  <span className="text-xs text-stone-400 dark:text-stone-500">places</span>
                  <Select value={dep.status} onValueChange={(v) => updateDeparture(dep.tempId, { status: v as DepartureStatus })}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">Ouvert</SelectItem>
                      <SelectItem value="COMPLET">Complet</SelectItem>
                      <SelectItem value="ANNULE">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                  <StatusBadge status={dep.status} />
                  <div className="flex-1" />
                  <Button variant="ghost" size="icon" onClick={() => duplicateDeparture(dep.tempId)}><Copy className="h-3.5 w-3.5 text-stone-500 dark:text-stone-400" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => removeDeparture(dep.tempId)}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
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
              <Select value={form.guide_id ?? "NONE"} onValueChange={(v) => set("guide_id", v === "NONE" ? null : v)}>
                <SelectTrigger className="w-96"><SelectValue placeholder="Aucun guide" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">Aucun guide</SelectItem>
                  {guides.map((g) => (
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
                <Input value={form.seo_title} onChange={(e) => set("seo_title", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Meta description</Label>
                <Textarea rows={3} value={form.seo_description} onChange={(e) => set("seo_description", e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
