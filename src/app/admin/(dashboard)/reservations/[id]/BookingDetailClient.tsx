"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Ban,
  CheckCircle2,
  Copy,
  Flag,
  Printer,
  Send,
  UserCog,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Timeline } from "@/components/admin/Timeline";
import { FileUploader, UploadedFile } from "@/components/admin/FileUploader";
import { useAdminRole } from "@/context/AdminRoleContext";
import {
  updateBookingStatusAction,
  toggleUrgentAction,
  reassignBookingAction,
  duplicateBookingAction,
  addPaymentAction,
  addNoteAction,
  addMessageAction,
  addDocumentAction,
} from "../actions";
import type { BookingRow } from "@/lib/server/bookings";
import type { Tables } from "@/lib/server/types";

type PaymentMethod = Tables<"payments">["method"];

function formatXOF(n: number) {
  return `${n.toLocaleString("fr-FR")} FCFA`;
}
function formatDate(iso: string | null) {
  return iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "—";
}

const METHOD_LABELS: Record<PaymentMethod, string> = {
  MOBILE_MONEY_MTN: "Mobile Money MTN",
  MOBILE_MONEY_MOOV: "Mobile Money Moov",
  FEDAPAY: "FedaPay",
  STRIPE_CARD: "Carte bancaire",
  BANK_TRANSFER: "Virement bancaire",
  CASH: "Espèces",
};

export function BookingDetailClient({ booking, agents }: { booking: BookingRow; agents: Tables<"admin_profiles">[] }) {
  const router = useRouter();
  const { user } = useAdminRole();

  const [cancelOpen, setCancelOpen] = React.useState(false);
  const [paymentAmount, setPaymentAmount] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("MOBILE_MONEY_MTN");
  const [noteText, setNoteText] = React.useState("");
  const [messageText, setMessageText] = React.useState("");
  const [docFiles, setDocFiles] = React.useState<UploadedFile[]>([]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/reservations")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-stone-800 font-mono dark:text-stone-100">{booking.booking_number}</h1>
            <StatusBadge status={booking.status} />
            <StatusBadge status={booking.payment_status} />
            {booking.urgent && <StatusBadge status="LATE" label="Urgent" />}
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400">{booking.reference_label} — {booking.clients?.name}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-xl border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
        {booking.status !== "CONFIRMED" && (
          <Button size="sm" onClick={async () => { await updateBookingStatusAction(booking.id, "CONFIRMED", user.name); router.refresh(); }}>
            <CheckCircle2 className="h-3.5 w-3.5" />
            Confirmer
          </Button>
        )}
        {booking.status !== "CANCELLED" && (
          <Button size="sm" variant="destructive" onClick={() => setCancelOpen(true)}>
            <Ban className="h-3.5 w-3.5" />
            Annuler
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={async () => {
          const result = await duplicateBookingAction(booking.id, user.name);
          if (result.data) router.push(`/admin/reservations/${result.data.id}`);
        }}>
          <Copy className="h-3.5 w-3.5" />
          Dupliquer
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              <UserCog className="h-3.5 w-3.5" />
              Réassigner
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {agents.map((a) => (
              <DropdownMenuItem key={a.id} onSelect={async () => { await reassignBookingAction(booking.id, a.id, a.name, user.name); router.refresh(); }}>
                {a.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" variant="outline" onClick={async () => { await toggleUrgentAction(booking.id, booking.urgent, user.name); router.refresh(); }}>
          <Flag className="h-3.5 w-3.5" />
          {booking.urgent ? "Retirer l'urgence" : "Marquer urgent"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => window.print()}>
          <Printer className="h-3.5 w-3.5" />
          Imprimer
        </Button>
      </div>

      <Tabs defaultValue="apercu">
        <TabsList>
          <TabsTrigger value="apercu">Aperçu</TabsTrigger>
          <TabsTrigger value="paiements">Paiements</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="notes">Notes internes</TabsTrigger>
        </TabsList>

        <TabsContent value="apercu">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle className="text-sm">Détails de la prestation</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Prestation</p><p className="font-medium text-stone-800 dark:text-stone-100">{booking.reference_label}</p></div>
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Destination</p><p className="font-medium text-stone-800 dark:text-stone-100">{booking.destination_name}</p></div>
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Type</p><p className="font-medium text-stone-800 dark:text-stone-100">{{ CIRCUIT: "Circuit", FLIGHT: "Vol", EVENT: "Événement" }[booking.type]}</p></div>
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Passagers</p><p className="font-medium text-stone-800 dark:text-stone-100">{booking.passengers}</p></div>
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Date de départ</p><p className="font-medium text-stone-800 dark:text-stone-100">{formatDate(booking.depart_date)}</p></div>
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Agent</p><p className="font-medium text-stone-800 dark:text-stone-100">{booking.admin_profiles?.name ?? "—"}</p></div>
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Créée le</p><p className="font-medium text-stone-800 dark:text-stone-100">{formatDate(booking.created_at)}</p></div>
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Dernière mise à jour</p><p className="font-medium text-stone-800 dark:text-stone-100">{formatDate(booking.updated_at)}</p></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Client</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-semibold text-stone-800 dark:text-stone-100">{booking.clients?.name}</p>
                <p className="text-stone-500 dark:text-stone-400">{booking.clients?.email}</p>
                <p className="text-stone-500 dark:text-stone-400">{booking.clients?.phone}</p>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader><CardTitle className="text-sm">Montants</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-3 gap-4 text-sm">
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Total</p><p className="font-bold text-stone-800 text-lg dark:text-stone-100">{formatXOF(booking.total_price_xof)}</p></div>
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Payé</p><p className="font-bold text-emerald-600 text-lg">{formatXOF(booking.paid_xof)}</p></div>
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Solde restant</p><p className="font-bold text-amber-600 text-lg">{formatXOF(booking.total_price_xof - booking.paid_xof)}</p></div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="paiements">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-sm">Paiements reçus</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {booking.payments.length === 0 && <p className="text-sm text-stone-400 py-4 text-center dark:text-stone-500">Aucun paiement enregistré.</p>}
                  {booking.payments.map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg border border-stone-100 px-3 py-2 dark:border-stone-800">
                      <div>
                        <p className="text-sm font-semibold text-stone-800 dark:text-stone-100">{formatXOF(p.amount_xof)}</p>
                        <p className="text-xs text-stone-400 dark:text-stone-500">{METHOD_LABELS[p.method]} {p.transaction_ref ? `· ${p.transaction_ref}` : ""}</p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={p.status} />
                        <p className="text-[11px] text-stone-400 mt-1 dark:text-stone-500">{p.paid_at ? formatDate(p.paid_at) : "—"}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm">Échéancier</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {booking.payment_schedules.length === 0 && <p className="text-sm text-stone-400 py-4 text-center dark:text-stone-500">Aucun échéancier.</p>}
                  {booking.payment_schedules.map((s) => (
                    <div key={s.id} className="flex items-center justify-between rounded-lg border border-stone-100 px-3 py-2 dark:border-stone-800">
                      <div>
                        <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{formatXOF(s.amount_xof)}</p>
                        <p className="text-xs text-stone-400 dark:text-stone-500">Échéance : {formatDate(s.due_date)}</p>
                      </div>
                      <StatusBadge status={s.status} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader><CardTitle className="text-sm">Ajouter un paiement manuel</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Montant (FCFA)</Label>
                  <Input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="0" />
                </div>
                <div className="space-y-1.5">
                  <Label>Méthode</Label>
                  <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(METHOD_LABELS) as PaymentMethod[]).map((m) => (
                        <SelectItem key={m} value={m}>{METHOD_LABELS[m]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="w-full"
                  disabled={!paymentAmount || Number(paymentAmount) <= 0}
                  onClick={async () => {
                    await addPaymentAction(
                      booking.id,
                      { amount_xof: Number(paymentAmount), method: paymentMethod, status: "PAID", paid_at: new Date().toISOString() },
                      user.name
                    );
                    setPaymentAmount("");
                    router.refresh();
                  }}
                >
                  Enregistrer le paiement
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader><CardTitle className="text-sm">Documents</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FileUploader
                files={docFiles}
                onChange={(files) => {
                  const added = files.filter((f) => !docFiles.find((d) => d.id === f.id));
                  added.forEach(async (f) => {
                    await addDocumentAction(booking.id, { name: f.name, type: f.isImage ? "Image" : "Fichier", url: f.url }, user.name);
                    router.refresh();
                  });
                  setDocFiles(files);
                }}
              />
              <div className="space-y-2">
                {booking.booking_documents.length === 0 && <p className="text-sm text-stone-400 py-4 text-center dark:text-stone-500">Aucun document.</p>}
                {booking.booking_documents.map((d) => (
                  <div key={d.id} className="flex items-center justify-between rounded-lg border border-stone-100 px-3 py-2 dark:border-stone-800">
                    <div>
                      <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{d.name}</p>
                      <p className="text-xs text-stone-400 dark:text-stone-500">{d.type} · {formatDate(d.uploaded_at)}</p>
                    </div>
                    <a href={d.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-luxe-terracotta hover:underline">Ouvrir</a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historique">
          <Card>
            <CardHeader><CardTitle className="text-sm">Historique</CardTitle></CardHeader>
            <CardContent>
              <Timeline items={booking.booking_timeline.map((t) => ({ id: t.id, label: t.label, detail: t.detail ?? undefined, actor: t.actor, date: t.created_at }))} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication">
          <Card>
            <CardHeader><CardTitle className="text-sm">Fil de communication</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {booking.booking_messages.length === 0 && <p className="text-sm text-stone-400 py-4 text-center dark:text-stone-500">Aucun message.</p>}
                {booking.booking_messages.map((m) => (
                  <div key={m.id} className={`flex ${m.from_client ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[75%] rounded-xl px-3 py-2 ${m.from_client ? "bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-100" : "bg-luxe-terracotta text-white"}`}>
                      <p className="text-sm">{m.content}</p>
                      <p className={`text-[10px] mt-1 ${m.from_client ? "text-stone-400 dark:text-stone-500" : "text-white/70"}`}>{m.author} · {formatDate(m.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Écrire un message au client..." value={messageText} onChange={(e) => setMessageText(e.target.value)} />
                <Button
                  disabled={!messageText.trim()}
                  onClick={async () => {
                    await addMessageAction(booking.id, messageText.trim(), user.name);
                    setMessageText("");
                    router.refresh();
                  }}
                >
                  <Send className="h-3.5 w-3.5" />
                  Envoyer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader><CardTitle className="text-sm">Notes internes</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {booking.booking_notes.length === 0 && <p className="text-sm text-stone-400 py-4 text-center dark:text-stone-500">Aucune note.</p>}
                {booking.booking_notes.map((n) => (
                  <div key={n.id} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-800 dark:bg-amber-900/20">
                    <p className="text-sm text-stone-800 dark:text-stone-100">{n.content}</p>
                    <p className="text-[11px] text-stone-500 mt-1 dark:text-stone-400">{n.author} · {formatDate(n.created_at)}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Textarea placeholder="Ajouter une note interne (non visible par le client)..." value={noteText} onChange={(e) => setNoteText(e.target.value)} />
                <Button
                  disabled={!noteText.trim()}
                  onClick={async () => {
                    await addNoteAction(booking.id, noteText.trim(), user.name);
                    setNoteText("");
                    router.refresh();
                  }}
                >
                  Ajouter la note
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Annuler cette réservation ?"
        description="Cette action notifiera le client et mettra à jour le statut de paiement."
        requireReason
        destructive
        confirmLabel="Annuler la réservation"
        onConfirm={async (reason) => {
          await updateBookingStatusAction(booking.id, "CANCELLED", user.name, reason);
          router.refresh();
        }}
      />
    </div>
  );
}
