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
import { useAgents } from "@/lib/admin/store/users-store";
import { PaymentMethod } from "@/lib/admin/types";
import {
  useBookingsStore,
  updateBookingStatus,
  toggleUrgent,
  reassignBooking,
  duplicateBooking,
  addPayment,
  addNote,
  addMessage,
  addDocument,
} from "@/lib/admin/store/bookings-store";

function formatXOF(n: number) {
  return `${n.toLocaleString("fr-FR")} FCFA`;
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

const METHOD_LABELS: Record<PaymentMethod, string> = {
  MOBILE_MONEY_MTN: "Mobile Money MTN",
  MOBILE_MONEY_MOOV: "Mobile Money Moov",
  FEDAPAY: "FedaPay",
  STRIPE_CARD: "Carte bancaire",
  BANK_TRANSFER: "Virement bancaire",
  CASH: "Espèces",
};

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAdminRole();
  const store = useBookingsStore();
  const agents = useAgents();
  const booking = store.bookings.find((b) => b.id === params.id);

  const [cancelOpen, setCancelOpen] = React.useState(false);
  const [paymentAmount, setPaymentAmount] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("MOBILE_MONEY_MTN");
  const [noteText, setNoteText] = React.useState("");
  const [messageText, setMessageText] = React.useState("");
  const [docFiles, setDocFiles] = React.useState<UploadedFile[]>([]);

  if (!booking) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-10 text-center dark:border-stone-800 dark:bg-stone-900">
        <p className="text-stone-500 dark:text-stone-400">Réservation introuvable.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/admin/reservations"><ArrowLeft className="h-4 w-4" />Retour à la liste</Link>
        </Button>
      </div>
    );
  }

  const payments = store.payments.filter((p) => p.bookingId === booking.id);
  const schedules = store.schedules.filter((s) => s.bookingId === booking.id);
  const timeline = store.timeline.filter((t) => t.bookingId === booking.id);
  const messages = store.messages.filter((m) => m.bookingId === booking.id);
  const notes = store.notes.filter((n) => n.bookingId === booking.id);
  const documents = store.documents.filter((d) => d.bookingId === booking.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/reservations")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-stone-800 font-mono dark:text-stone-100">{booking.bookingNumber}</h1>
            <StatusBadge status={booking.status} />
            <StatusBadge status={booking.paymentStatus} />
            {booking.urgent && <StatusBadge status="LATE" label="Urgent" />}
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400">{booking.referenceLabel} — {booking.client.name}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-xl border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
        {booking.status !== "CONFIRMED" && (
          <Button size="sm" onClick={() => updateBookingStatus(booking.id, "CONFIRMED", user.name)}>
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
        <Button size="sm" variant="outline" onClick={() => {
          const copy = duplicateBooking(booking.id, user.name);
          if (copy) router.push(`/admin/reservations/${copy.id}`);
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
              <DropdownMenuItem key={a.id} onSelect={() => reassignBooking(booking.id, a.name, user.name)}>
                {a.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" variant="outline" onClick={() => toggleUrgent(booking.id, user.name)}>
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
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Prestation</p><p className="font-medium text-stone-800 dark:text-stone-100">{booking.referenceLabel}</p></div>
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Destination</p><p className="font-medium text-stone-800 dark:text-stone-100">{booking.destinationName}</p></div>
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Type</p><p className="font-medium text-stone-800 dark:text-stone-100">{{ CIRCUIT: "Circuit", FLIGHT: "Vol", EVENT: "Événement" }[booking.type]}</p></div>
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Passagers</p><p className="font-medium text-stone-800 dark:text-stone-100">{booking.passengers}</p></div>
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Date de départ</p><p className="font-medium text-stone-800 dark:text-stone-100">{formatDate(booking.departDate)}</p></div>
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Agent</p><p className="font-medium text-stone-800 dark:text-stone-100">{booking.agent}</p></div>
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Créée le</p><p className="font-medium text-stone-800 dark:text-stone-100">{formatDate(booking.createdAt)}</p></div>
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Dernière mise à jour</p><p className="font-medium text-stone-800 dark:text-stone-100">{formatDate(booking.updatedAt)}</p></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Client</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-semibold text-stone-800 dark:text-stone-100">{booking.client.name}</p>
                <p className="text-stone-500 dark:text-stone-400">{booking.client.email}</p>
                <p className="text-stone-500 dark:text-stone-400">{booking.client.phone}</p>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader><CardTitle className="text-sm">Montants</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-3 gap-4 text-sm">
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Total</p><p className="font-bold text-stone-800 text-lg dark:text-stone-100">{formatXOF(booking.totalPriceXOF)}</p></div>
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Payé</p><p className="font-bold text-emerald-600 text-lg">{formatXOF(booking.paidXOF)}</p></div>
                <div><p className="text-stone-400 text-xs dark:text-stone-500">Solde restant</p><p className="font-bold text-amber-600 text-lg">{formatXOF(booking.totalPriceXOF - booking.paidXOF)}</p></div>
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
                  {payments.length === 0 && <p className="text-sm text-stone-400 py-4 text-center dark:text-stone-500">Aucun paiement enregistré.</p>}
                  {payments.map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg border border-stone-100 px-3 py-2 dark:border-stone-800">
                      <div>
                        <p className="text-sm font-semibold text-stone-800 dark:text-stone-100">{formatXOF(p.amountXOF)}</p>
                        <p className="text-xs text-stone-400 dark:text-stone-500">{METHOD_LABELS[p.method]} {p.transactionRef ? `· ${p.transactionRef}` : ""}</p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={p.status} />
                        <p className="text-[11px] text-stone-400 mt-1 dark:text-stone-500">{p.paidAt ? formatDate(p.paidAt) : "—"}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm">Échéancier</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {schedules.length === 0 && <p className="text-sm text-stone-400 py-4 text-center dark:text-stone-500">Aucun échéancier.</p>}
                  {schedules.map((s) => (
                    <div key={s.id} className="flex items-center justify-between rounded-lg border border-stone-100 px-3 py-2 dark:border-stone-800">
                      <div>
                        <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{formatXOF(s.amountXOF)}</p>
                        <p className="text-xs text-stone-400 dark:text-stone-500">Échéance : {formatDate(s.dueDate)}</p>
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
                  onClick={() => {
                    addPayment(
                      { bookingId: booking.id, amountXOF: Number(paymentAmount), method: paymentMethod, status: "PAID", paidAt: new Date().toISOString() },
                      user.name
                    );
                    setPaymentAmount("");
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
                  added.forEach((f) => addDocument(booking.id, { name: f.name, type: f.isImage ? "Image" : "Fichier", url: f.url }, user.name));
                  setDocFiles(files);
                }}
              />
              <div className="space-y-2">
                {documents.length === 0 && <p className="text-sm text-stone-400 py-4 text-center dark:text-stone-500">Aucun document.</p>}
                {documents.map((d) => (
                  <div key={d.id} className="flex items-center justify-between rounded-lg border border-stone-100 px-3 py-2 dark:border-stone-800">
                    <div>
                      <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{d.name}</p>
                      <p className="text-xs text-stone-400 dark:text-stone-500">{d.type} · {formatDate(d.uploadedAt)}</p>
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
              <Timeline items={timeline.map((t) => ({ id: t.id, label: t.label, detail: t.detail, actor: t.actor, date: t.createdAt }))} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication">
          <Card>
            <CardHeader><CardTitle className="text-sm">Fil de communication</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {messages.length === 0 && <p className="text-sm text-stone-400 py-4 text-center dark:text-stone-500">Aucun message.</p>}
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.fromClient ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[75%] rounded-xl px-3 py-2 ${m.fromClient ? "bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-100" : "bg-luxe-terracotta text-white"}`}>
                      <p className="text-sm">{m.content}</p>
                      <p className={`text-[10px] mt-1 ${m.fromClient ? "text-stone-400 dark:text-stone-500" : "text-white/70"}`}>{m.author} · {formatDate(m.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Écrire un message au client..." value={messageText} onChange={(e) => setMessageText(e.target.value)} />
                <Button
                  disabled={!messageText.trim()}
                  onClick={() => {
                    addMessage(booking.id, messageText.trim(), user.name);
                    setMessageText("");
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
                {notes.length === 0 && <p className="text-sm text-stone-400 py-4 text-center dark:text-stone-500">Aucune note.</p>}
                {notes.map((n) => (
                  <div key={n.id} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-800 dark:bg-amber-900/20">
                    <p className="text-sm text-stone-800 dark:text-stone-100">{n.content}</p>
                    <p className="text-[11px] text-stone-500 mt-1 dark:text-stone-400">{n.author} · {formatDate(n.createdAt)}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Textarea placeholder="Ajouter une note interne (non visible par le client)..." value={noteText} onChange={(e) => setNoteText(e.target.value)} />
                <Button
                  disabled={!noteText.trim()}
                  onClick={() => {
                    addNote(booking.id, noteText.trim(), user.name);
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

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Annuler cette réservation ?"
        description="Cette action notifiera le client et mettra à jour le statut de paiement."
        requireReason
        destructive
        confirmLabel="Annuler la réservation"
        onConfirm={(reason) => updateBookingStatus(booking.id, "CANCELLED", user.name, reason)}
      />
    </div>
  );
}
