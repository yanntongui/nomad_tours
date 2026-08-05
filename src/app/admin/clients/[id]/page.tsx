"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Gift, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { TagListInput } from "@/components/admin/TagListInput";
import { useAdminRole } from "@/context/AdminRoleContext";
import { useClientsStore, updateClient, addClientNote } from "@/lib/admin/store/clients-store";
import { useBookingsStore } from "@/lib/admin/store/bookings-store";
import { useSupportStore } from "@/lib/admin/store/support-store";
import { useTrips } from "@/lib/admin/store/trips-store";
import { useLoyaltyOffers, VIP_TIERS, tierRank } from "@/lib/admin/store/loyalty-store";
import { ContactMethod, VipTier } from "@/lib/admin/types";

function formatXOF(n: number) {
  return `${n.toLocaleString("fr-FR")} FCFA`;
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

const CONTACT_LABELS: Record<ContactMethod, string> = {
  EMAIL: "Email",
  PHONE: "Téléphone",
  WHATSAPP: "WhatsApp",
};

const TIER_LABELS: Record<VipTier, string> = {
  STANDARD: "Standard",
  SILVER: "Argent",
  GOLD: "Or",
  PLATINUM: "Platine",
};

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAdminRole();
  const store = useClientsStore();
  const bookingsStore = useBookingsStore();
  const supportStore = useSupportStore();
  const trips = useTrips();
  const loyaltyOffers = useLoyaltyOffers();
  const client = store.clients.find((c) => c.id === params.id);

  const [form, setForm] = React.useState({
    name: client?.name ?? "",
    email: client?.email ?? "",
    phone: client?.phone ?? "",
    address: client?.address ?? "",
    tags: client?.tags ?? [],
    preferredContact: (client?.preferredContact ?? "EMAIL") as ContactMethod,
    loyaltyNote: client?.loyaltyNote ?? "",
    vipTier: (client?.vipTier ?? "STANDARD") as VipTier,
  });
  const [noteText, setNoteText] = React.useState("");

  if (!client) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-10 text-center dark:border-stone-800 dark:bg-stone-900">
        <p className="text-stone-500 dark:text-stone-400">Client introuvable.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/admin/clients"><ArrowLeft className="h-4 w-4" />Retour à la liste</Link>
        </Button>
      </div>
    );
  }

  const clientBookings = bookingsStore.bookings.filter((b) => b.client.id === client.id);
  const notes = store.notes.filter((n) => n.clientId === client.id);
  const clientTickets = supportStore.tickets.filter((t) => t.client.id === client.id);
  const clientBookingIds = new Set(clientBookings.map((b) => b.id));
  const clientFeedbacks = trips.filter((t) => clientBookingIds.has(t.bookingId)).flatMap((t) => t.feedbacks);
  const avgRating = clientFeedbacks.length > 0 ? (clientFeedbacks.reduce((s, f) => s + f.rating, 0) / clientFeedbacks.length).toFixed(1) : "—";
  const eligibleOffers = loyaltyOffers.filter((o) => o.active && tierRank(o.tierRequired) <= tierRank(client.vipTier));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/clients")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-stone-800 dark:text-stone-100">{client.name}</h1>
            <StatusBadge status={client.vipTier} />
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400">{client.email} — {client.phone}</p>
        </div>
        <Button
          size="sm"
          onClick={() => updateClient(client.id, form, user.name)}
        >
          <Save className="h-3.5 w-3.5" />
          Enregistrer
        </Button>
      </div>

      <Tabs defaultValue="profil">
        <TabsList>
          <TabsTrigger value="profil">Profil</TabsTrigger>
          <TabsTrigger value="historique">Historique ({clientBookings.length})</TabsTrigger>
          <TabsTrigger value="tickets">Tickets ({clientTickets.length})</TabsTrigger>
          <TabsTrigger value="fidelite">Fidélité</TabsTrigger>
          <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="profil">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle className="text-sm">Informations</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Nom</Label>
                  <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Téléphone</Label>
                  <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Contact préféré</Label>
                  <Select value={form.preferredContact} onValueChange={(v) => setForm((f) => ({ ...f, preferredContact: v as ContactMethod }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(CONTACT_LABELS) as ContactMethod[]).map((c) => (
                        <SelectItem key={c} value={c}>{CONTACT_LABELS[c]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Palier fidélité</Label>
                  <Select value={form.vipTier} onValueChange={(v) => setForm((f) => ({ ...f, vipTier: v as VipTier }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {VIP_TIERS.map((t) => (
                        <SelectItem key={t} value={t}>{TIER_LABELS[t]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>Adresse</Label>
                  <Input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>Tags</Label>
                  <TagListInput tags={form.tags} onChange={(tags) => setForm((f) => ({ ...f, tags }))} placeholder="Ajouter un tag et appuyer sur Entrée..." />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>Note de fidélité</Label>
                  <Textarea value={form.loyaltyNote} onChange={(e) => setForm((f) => ({ ...f, loyaltyNote: e.target.value }))} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Résumé</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Réservations</p><p className="font-bold text-stone-800 text-lg dark:text-stone-100">{clientBookings.length}</p></div>
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Valeur cumulée</p><p className="font-bold text-emerald-600 text-lg">{formatXOF(clientBookings.reduce((s, b) => s + b.paidXOF, 0))}</p></div>
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Client depuis</p><p className="font-medium text-stone-800 dark:text-stone-100">{formatDate(client.createdAt)}</p></div>
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Satisfaction moyenne</p><p className="font-medium text-stone-800 dark:text-stone-100">{avgRating}{avgRating !== "—" ? "/5" : ""} <span className="text-xs text-stone-400 dark:text-stone-500">({clientFeedbacks.length} avis)</span></p></div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="historique">
          <Card>
            <CardHeader><CardTitle className="text-sm">Historique de réservations</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {clientBookings.length === 0 && <p className="text-sm text-stone-400 py-6 text-center dark:text-stone-500">Aucune réservation pour ce client.</p>}
              {clientBookings.map((b) => (
                <Link
                  key={b.id}
                  href={`/admin/reservations/${b.id}`}
                  className="flex items-center justify-between rounded-lg border border-stone-100 px-3 py-2.5 hover:border-luxe-terracotta/40 hover:bg-luxe-terracotta/5 transition-colors dark:border-stone-800"
                >
                  <div>
                    <p className="text-sm font-medium text-stone-800 font-mono dark:text-stone-100">{b.bookingNumber}</p>
                    <p className="text-xs text-stone-400 dark:text-stone-500">{b.referenceLabel} — {formatDate(b.departDate)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={b.status} />
                    <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">{formatXOF(b.totalPriceXOF)}</span>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets">
          <Card>
            <CardHeader><CardTitle className="text-sm">Support & réclamations</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {clientTickets.length === 0 && <p className="text-sm text-stone-400 py-6 text-center dark:text-stone-500">Aucun ticket pour ce client.</p>}
              {clientTickets.map((t) => (
                <Link
                  key={t.id}
                  href={`/admin/support/${t.id}`}
                  className="flex items-center justify-between rounded-lg border border-stone-100 px-3 py-2.5 hover:border-luxe-terracotta/40 hover:bg-luxe-terracotta/5 transition-colors dark:border-stone-800"
                >
                  <div>
                    <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{t.subject}</p>
                    <p className="text-xs text-stone-400 dark:text-stone-500">{formatDate(t.updatedAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={t.type} />
                    <StatusBadge status={t.status} />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fidelite">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-1">
              <CardHeader><CardTitle className="text-sm">Palier fidélité</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <StatusBadge status={client.vipTier} />
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {eligibleOffers.length} avantage{eligibleOffers.length > 1 ? "s" : ""} actif{eligibleOffers.length > 1 ? "s" : ""} à ce palier.
                </p>
                {client.loyaltyNote && <p className="text-xs text-stone-400 border-t border-stone-100 pt-2 dark:text-stone-500 dark:border-stone-800">{client.loyaltyNote}</p>}
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle className="text-sm">Offres & avantages</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {loyaltyOffers.filter((o) => o.active).length === 0 && (
                  <p className="text-sm text-stone-400 py-4 text-center dark:text-stone-500">Aucune offre active pour le moment.</p>
                )}
                {loyaltyOffers.filter((o) => o.active).map((o) => {
                  const unlocked = tierRank(o.tierRequired) <= tierRank(client.vipTier);
                  return (
                    <div
                      key={o.id}
                      className={`flex items-start gap-2.5 rounded-lg border p-3 ${unlocked ? "border-stone-100 dark:border-stone-800" : "border-stone-100 opacity-60 dark:border-stone-800"}`}
                    >
                      {unlocked ? <Gift className="h-4 w-4 shrink-0 text-luxe-terracotta mt-0.5" /> : <Lock className="h-4 w-4 shrink-0 text-stone-400 mt-0.5" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{o.title}</p>
                          <StatusBadge status={o.tierRequired} />
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5 dark:text-stone-400">{o.description}</p>
                        {!unlocked && <p className="text-[11px] text-stone-400 mt-1 dark:text-stone-500">Débloqué au palier {TIER_LABELS[o.tierRequired]}</p>}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader><CardTitle className="text-sm">Notes internes</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {notes.length === 0 && <p className="text-sm text-stone-400 py-4 text-center dark:text-stone-500">Aucune note.</p>}
                {notes.map((n) => (
                  <div key={n.id} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-800 dark:bg-amber-900/40">
                    <p className="text-sm text-stone-800 dark:text-stone-100">{n.content}</p>
                    <p className="text-[11px] text-stone-500 mt-1 dark:text-stone-400">{n.author} · {formatDate(n.createdAt)}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Textarea placeholder="Ajouter une note interne..." value={noteText} onChange={(e) => setNoteText(e.target.value)} />
                <Button
                  disabled={!noteText.trim()}
                  onClick={() => {
                    addClientNote(client.id, noteText.trim(), user.name);
                    setNoteText("");
                  }}
                >
                  Ajouter la note
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
