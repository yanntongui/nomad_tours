"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TagListInput } from "@/components/admin/TagListInput";
import { FileUploader, UploadedFile } from "@/components/admin/FileUploader";
import { DragDropList } from "@/components/admin/DragDropList";
import { createDestinationAction, updateDestinationAction } from "@/app/admin/(dashboard)/destinations/actions";
import type { DestinationRow, PointOfInterestRow } from "@/lib/server/destinations";
import type { CircuitRow } from "@/lib/server/circuits";

function fileFromUrl(url: string): UploadedFile {
  return { id: url, name: url.split("/").pop() ?? url, url, isImage: true };
}

interface FormValues {
  slug: string;
  name: string;
  country: string;
  region: string;
  description: string;
  highlights: string[];
  climate: string;
  best_period: string;
  is_international: boolean;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
}

interface PoiDraft {
  tempId: string;
  name: string;
  description: string;
  latitude?: number;
  longitude?: number;
}

function toFormValues(destination: DestinationRow | null): FormValues {
  if (!destination) {
    return {
      slug: "",
      name: "",
      country: "",
      region: "",
      description: "",
      highlights: [],
      climate: "",
      best_period: "",
      is_international: false,
      is_featured: false,
      seo_title: "",
      seo_description: "",
    };
  }
  return {
    slug: destination.slug,
    name: destination.name,
    country: destination.country,
    region: destination.region ?? "",
    description: destination.description,
    highlights: destination.highlights ?? [],
    climate: destination.climate,
    best_period: destination.best_period,
    is_international: destination.is_international,
    is_featured: destination.is_featured,
    seo_title: destination.seo_title ?? "",
    seo_description: destination.seo_description ?? "",
  };
}

function toPoiDrafts(pois: PointOfInterestRow[]): PoiDraft[] {
  return pois
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((p) => ({
      tempId: p.id,
      name: p.name,
      description: p.description,
      latitude: p.latitude ?? undefined,
      longitude: p.longitude ?? undefined,
    }));
}

interface DestinationFormProps {
  initial: DestinationRow | null;
  mode: "create" | "edit";
  circuits?: CircuitRow[];
}

export function DestinationForm({ initial, mode, circuits = [] }: DestinationFormProps) {
  const router = useRouter();
  const [form, setForm] = React.useState<FormValues>(() => toFormValues(initial));
  const [images, setImages] = React.useState<UploadedFile[]>((initial?.images ?? []).map(fileFromUrl));
  const [pois, setPois] = React.useState<PoiDraft[]>(() => toPoiDrafts(initial?.destination_points_of_interest ?? []));
  const [poiName, setPoiName] = React.useState("");
  const [poiDesc, setPoiDesc] = React.useState("");
  const [poiLat, setPoiLat] = React.useState("");
  const [poiLng, setPoiLng] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addPoi() {
    if (!poiName.trim()) return;
    const lat = poiLat.trim() ? Number(poiLat) : undefined;
    const lng = poiLng.trim() ? Number(poiLng) : undefined;
    setPois((list) => [
      ...list,
      {
        tempId: `poi-${Date.now()}`,
        name: poiName.trim(),
        description: poiDesc.trim(),
        latitude: lat !== undefined && !Number.isNaN(lat) ? lat : undefined,
        longitude: lng !== undefined && !Number.isNaN(lng) ? lng : undefined,
      },
    ]);
    setPoiName("");
    setPoiDesc("");
    setPoiLat("");
    setPoiLng("");
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    const payload = { ...form, images: images.map((f) => f.url) };
    const poiPayload = pois.map(({ name, description, latitude, longitude }) => ({
      name,
      description,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
    }));

    const result =
      mode === "create"
        ? await createDestinationAction(payload, poiPayload)
        : await updateDestinationAction(initial!.id, payload, poiPayload);

    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/admin/destinations");
  }

  const relatedCircuits = circuits;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/destinations")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-stone-800 dark:text-stone-100">{mode === "create" ? "Nouvelle destination" : form.name || "Modifier la destination"}</h1>
        </div>
        <Button onClick={handleSave} disabled={!form.name.trim() || !form.country.trim() || !form.slug.trim() || saving}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Informations générales</TabsTrigger>
          <TabsTrigger value="media">Médias</TabsTrigger>
          <TabsTrigger value="poi">Points d'intérêt</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          {mode === "edit" && <TabsTrigger value="circuits">Circuits associés</TabsTrigger>}
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Nom</Label>
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Pays</Label>
                <Input value={form.country} onChange={(e) => set("country", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Région</Label>
                <Input value={form.region} onChange={(e) => set("region", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Climat</Label>
                <Input value={form.climate} onChange={(e) => set("climate", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Meilleure période</Label>
                <Input value={form.best_period} onChange={(e) => set("best_period", e.target.value)} />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label>Description</Label>
                <Textarea rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label>Points forts</Label>
                <TagListInput tags={form.highlights} onChange={(v) => set("highlights", v)} placeholder="Ajouter un point fort..." />
              </div>
              <label className="flex items-center gap-2.5 text-sm text-stone-700 dark:text-stone-300 cursor-pointer">
                <Checkbox checked={form.is_international} onCheckedChange={(v) => set("is_international", !!v)} />
                Destination internationale
              </label>
              <label className="flex items-center gap-2.5 text-sm text-stone-700 dark:text-stone-300 cursor-pointer">
                <Checkbox checked={form.is_featured} onCheckedChange={(v) => set("is_featured", !!v)} />
                Mise en avant
              </label>
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

        <TabsContent value="poi">
          <Card>
            <CardHeader><CardTitle className="text-sm">Points d'intérêt</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {pois.map((poi) => (
                  <div key={poi.tempId} className="flex items-start justify-between gap-3 rounded-lg border border-stone-100 dark:border-stone-800 p-3">
                    <div>
                      <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{poi.name}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{poi.description}</p>
                      {(poi.latitude !== undefined || poi.longitude !== undefined) && (
                        <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                          {poi.latitude ?? "—"}, {poi.longitude ?? "—"}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPois((list) => list.filter((p) => p.tempId !== poi.tempId))}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </div>
                ))}
                {pois.length === 0 && <p className="text-sm text-stone-400 dark:text-stone-500">Aucun point d'intérêt.</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border-t border-stone-100 dark:border-stone-800 pt-4">
                <div className="space-y-1.5">
                  <Label>Nom</Label>
                  <Input value={poiName} onChange={(e) => setPoiName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Input value={poiDesc} onChange={(e) => setPoiDesc(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Latitude</Label>
                  <Input type="number" step="any" value={poiLat} onChange={(e) => setPoiLat(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Longitude</Label>
                  <Input type="number" step="any" value={poiLng} onChange={(e) => setPoiLng(e.target.value)} />
                </div>
              </div>
              <Button variant="outline" onClick={addPoi} disabled={!poiName.trim()}>
                <Plus className="h-3.5 w-3.5" />
                Ajouter
              </Button>
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

        {mode === "edit" && (
          <TabsContent value="circuits">
            <Card>
              <CardContent className="pt-6 space-y-2">
                {relatedCircuits.length === 0 && <p className="text-sm text-stone-400 dark:text-stone-500">Aucun circuit associé à cette destination.</p>}
                {relatedCircuits.map((c) => (
                  <Link
                    key={c.id}
                    href={`/admin/circuits/${c.id}`}
                    className="flex items-center justify-between rounded-lg border border-stone-100 dark:border-stone-800 p-3 hover:border-luxe-terracotta/40"
                  >
                    <span className="text-sm font-medium text-stone-800 dark:text-stone-100">{c.title}</span>
                    <span className="text-xs text-stone-400 dark:text-stone-500">{c.duration_days} jours</span>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
