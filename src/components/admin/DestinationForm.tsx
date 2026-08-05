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
import { useCircuits } from "@/lib/admin/store/circuits-store";
import { upsertDestination } from "@/lib/admin/store/destinations-store";
import { Destination, PointOfInterest } from "@/lib/admin/types";

function fileFromUrl(url: string): UploadedFile {
  return { id: url, name: url.split("/").pop() ?? url, url, isImage: true };
}

interface DestinationFormProps {
  initial: Destination;
  mode: "create" | "edit";
}

export function DestinationForm({ initial, mode }: DestinationFormProps) {
  const router = useRouter();
  const circuits = useCircuits();
  const [form, setForm] = React.useState<Destination>(initial);
  const [images, setImages] = React.useState<UploadedFile[]>(initial.images.map(fileFromUrl));
  const [poiName, setPoiName] = React.useState("");
  const [poiDesc, setPoiDesc] = React.useState("");

  function set<K extends keyof Destination>(key: K, value: Destination[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addPoi() {
    if (!poiName.trim()) return;
    const poi: PointOfInterest = { id: `poi-${Date.now()}`, name: poiName.trim(), description: poiDesc.trim() };
    set("pointsOfInterest", [...form.pointsOfInterest, poi]);
    setPoiName("");
    setPoiDesc("");
  }

  function handleSave() {
    upsertDestination({ ...form, images: images.map((f) => f.url) });
    router.push("/admin/destinations");
  }

  const relatedCircuits = circuits.filter((c) => c.destinationId === form.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/destinations")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-stone-800 dark:text-stone-100">{mode === "create" ? "Nouvelle destination" : form.name || "Modifier la destination"}</h1>
        </div>
        <Button onClick={handleSave} disabled={!form.name.trim() || !form.country.trim()}>Enregistrer</Button>
      </div>

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
                <Input value={form.region ?? ""} onChange={(e) => set("region", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Climat</Label>
                <Input value={form.climate} onChange={(e) => set("climate", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Meilleure période</Label>
                <Input value={form.bestPeriod} onChange={(e) => set("bestPeriod", e.target.value)} />
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
                <Checkbox checked={form.isInternational} onCheckedChange={(v) => set("isInternational", !!v)} />
                Destination internationale
              </label>
              <label className="flex items-center gap-2.5 text-sm text-stone-700 dark:text-stone-300 cursor-pointer">
                <Checkbox checked={form.isFeatured} onCheckedChange={(v) => set("isFeatured", !!v)} />
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
                {form.pointsOfInterest.map((poi) => (
                  <div key={poi.id} className="flex items-start justify-between gap-3 rounded-lg border border-stone-100 dark:border-stone-800 p-3">
                    <div>
                      <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{poi.name}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{poi.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => set("pointsOfInterest", form.pointsOfInterest.filter((p) => p.id !== poi.id))}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </div>
                ))}
                {form.pointsOfInterest.length === 0 && <p className="text-sm text-stone-400 dark:text-stone-500">Aucun point d'intérêt.</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 items-end border-t border-stone-100 dark:border-stone-800 pt-4">
                <div className="space-y-1.5">
                  <Label>Nom</Label>
                  <Input value={poiName} onChange={(e) => setPoiName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Input value={poiDesc} onChange={(e) => setPoiDesc(e.target.value)} />
                </div>
                <Button variant="outline" onClick={addPoi} disabled={!poiName.trim()}>
                  <Plus className="h-3.5 w-3.5" />
                  Ajouter
                </Button>
              </div>
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
                    <span className="text-xs text-stone-400 dark:text-stone-500">{c.durationDays} jours</span>
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
