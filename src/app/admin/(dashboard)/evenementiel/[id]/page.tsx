"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Ban, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusWorkflowBar, WorkflowStep } from "@/components/admin/StatusWorkflowBar";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Timeline } from "@/components/admin/Timeline";
import { TagListInput } from "@/components/admin/TagListInput";
import { useAdminRole } from "@/context/AdminRoleContext";
import {
  useEventsStore,
  updateEventStatus,
  setQuoteAmount,
  setEventServices,
  addEventNote,
} from "@/lib/admin/store/events-store";
import { EventStatus } from "@/lib/admin/types";

function formatXOF(n: number) {
  return `${n.toLocaleString("fr-FR")} FCFA`;
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  { key: "DRAFT", label: "Brouillon" },
  { key: "REQUESTED", label: "Demandé" },
  { key: "QUOTED", label: "Devis envoyé" },
  { key: "CONFIRMED", label: "Confirmé" },
  { key: "IN_PROGRESS", label: "En cours" },
  { key: "COMPLETED", label: "Terminé" },
];

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAdminRole();
  const store = useEventsStore();
  const event = store.requests.find((e) => e.id === params.id);
  const [quoteInput, setQuoteInput] = React.useState(event?.quoteAmountXOF?.toString() ?? "");
  const [noteText, setNoteText] = React.useState("");
  const [cancelOpen, setCancelOpen] = React.useState(false);

  React.useEffect(() => {
    setQuoteInput(event?.quoteAmountXOF?.toString() ?? "");
  }, [event?.id, event?.quoteAmountXOF]);

  if (!event) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-10 text-center dark:border-stone-800 dark:bg-stone-900">
        <p className="text-stone-500 dark:text-stone-400">Demande événementielle introuvable.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/admin/evenementiel"><ArrowLeft className="h-4 w-4" />Retour à la liste</Link>
        </Button>
      </div>
    );
  }

  const timelineItems = store.timeline
    .filter((t) => t.eventRequestId === event.id)
    .map((t) => ({ id: t.id, label: t.label, detail: t.detail, actor: t.actor, date: t.createdAt }));

  const canCancel = event.status !== "CANCELLED" && event.status !== "COMPLETED";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/evenementiel")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-stone-800 dark:text-stone-100">{event.type} — {event.client.name}</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {formatDate(event.eventDate)} — {event.location ?? "Lieu à définir"} — {event.guestCount} invités — Agent : {event.agent}
          </p>
        </div>
        <StatusBadge status={event.status} />
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="h-3.5 w-3.5" />
          Générer le devis
        </Button>
        {canCancel && (
          <Button variant="destructive" size="sm" onClick={() => setCancelOpen(true)}>
            <Ban className="h-3.5 w-3.5" />
            Annuler
          </Button>
        )}
      </div>

      {event.status === "CANCELLED" ? (
        <Card>
          <CardContent className="py-6 flex items-center gap-3">
            <Ban className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm font-semibold text-stone-800 dark:text-stone-100">Cet événement a été annulé.</p>
              <p className="text-xs text-stone-500 mt-0.5 dark:text-stone-400">Consultez l'historique pour le motif de l'annulation.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-6 overflow-x-auto">
            <StatusWorkflowBar
              steps={WORKFLOW_STEPS}
              current={event.status}
              onAdvance={(key) => updateEventStatus(event.id, key as EventStatus, user.name)}
            />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="devis">
        <TabsList>
          <TabsTrigger value="devis">Devis & Prestations</TabsTrigger>
          <TabsTrigger value="notes">Notes internes</TabsTrigger>
          <TabsTrigger value="historique">Historique ({timelineItems.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="devis">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle className="text-sm">Prestations demandées</CardTitle></CardHeader>
              <CardContent>
                <TagListInput
                  tags={event.services}
                  onChange={(services) => setEventServices(event.id, services, user.name)}
                  suggestions={["Traiteur", "Décoration", "Sonorisation", "Photographe", "Transport", "Animation"]}
                  placeholder="Ajouter une prestation et appuyer sur Entrée..."
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Budget & Devis</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-stone-400 text-xs dark:text-stone-500">Budget client</p>
                  <p className="font-semibold text-stone-800 dark:text-stone-100">{formatXOF(event.budgetXOF)}</p>
                </div>
                <div className="space-y-1.5">
                  <Label>Montant du devis (FCFA)</Label>
                  <Input type="number" value={quoteInput} onChange={(e) => setQuoteInput(e.target.value)} />
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  disabled={!quoteInput || Number(quoteInput) === (event.quoteAmountXOF ?? -1)}
                  onClick={() => setQuoteAmount(event.id, Number(quoteInput), user.name)}
                >
                  Enregistrer le devis
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader><CardTitle className="text-sm">Ajouter une note</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Note interne sur cet événement..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={4}
              />
              <Button
                disabled={!noteText.trim()}
                onClick={() => {
                  addEventNote(event.id, noteText.trim(), user.name);
                  setNoteText("");
                }}
              >
                Ajouter la note
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historique">
          <Card>
            <CardHeader><CardTitle className="text-sm">Historique de l'événement</CardTitle></CardHeader>
            <CardContent>
              <Timeline items={timelineItems} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Annuler cet événement"
        description="Le client sera informé de l'annulation."
        requireReason
        destructive
        confirmLabel="Annuler l'événement"
        onConfirm={(reason) => updateEventStatus(event.id, "CANCELLED", user.name, reason)}
      />
    </div>
  );
}
