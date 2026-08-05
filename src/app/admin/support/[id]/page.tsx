"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Send, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusWorkflowBar, WorkflowStep } from "@/components/admin/StatusWorkflowBar";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Timeline } from "@/components/admin/Timeline";
import { useAdminRole } from "@/context/AdminRoleContext";
import {
  useSupportStore,
  useTicketMessages,
  useTicketTimeline,
  updateTicketStatus,
  updateTicketPriority,
  addTicketMessage,
  addTicketNote,
} from "@/lib/admin/store/support-store";
import { TicketPriority, TicketStatus } from "@/lib/admin/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAdminRole();
  const store = useSupportStore();
  const ticket = store.tickets.find((t) => t.id === params.id);
  const messages = useTicketMessages(params.id);
  const timeline = useTicketTimeline(params.id);

  const [messageText, setMessageText] = React.useState("");
  const [noteText, setNoteText] = React.useState(ticket?.adminNotes ?? "");
  const [closeOpen, setCloseOpen] = React.useState(false);
  const [rejectOpen, setRejectOpen] = React.useState(false);

  React.useEffect(() => {
    setNoteText(ticket?.adminNotes ?? "");
  }, [ticket?.id, ticket?.adminNotes]);

  if (!ticket) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-10 text-center dark:border-stone-800 dark:bg-stone-900">
        <p className="text-stone-500 dark:text-stone-400">Ticket introuvable.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/admin/support"><ArrowLeft className="h-4 w-4" />Retour à la liste</Link>
        </Button>
      </div>
    );
  }

  const steps: WorkflowStep[] =
    ticket.status === "REJETE"
      ? [
          { key: "OUVERT", label: "Ouvert" },
          { key: "EN_COURS", label: "En cours" },
          { key: "REJETE", label: "Rejeté", tone: "danger" },
        ]
      : [
          { key: "OUVERT", label: "Ouvert" },
          { key: "EN_COURS", label: "En cours" },
          { key: "RESOLU", label: "Résolu" },
        ];

  const canClose = ticket.status === "RESOLU";
  const canReject = ticket.type === "RECLAMATION" && (ticket.status === "OUVERT" || ticket.status === "EN_COURS");

  const timelineItems = timeline.map((t) => ({ id: t.id, label: t.label, detail: t.detail, actor: t.actor, date: t.createdAt }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/support")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-stone-800 dark:text-stone-100">{ticket.subject}</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">{ticket.client.name} — {ticket.client.email} — Agent : {ticket.agent}</p>
        </div>
        <StatusBadge status={ticket.type} />
        <StatusBadge status={ticket.channel} />
        <Select value={ticket.priority} onValueChange={(v) => updateTicketPriority(ticket.id, v as TicketPriority, user.name)}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="NORMALE">Normale</SelectItem>
            <SelectItem value="URGENTE">Urgente</SelectItem>
          </SelectContent>
        </Select>
        {canReject && (
          <Button variant="destructive" size="sm" onClick={() => setRejectOpen(true)}>
            <XCircle className="h-3.5 w-3.5" />
            Rejeter
          </Button>
        )}
        {canClose && (
          <Button variant="outline" size="sm" onClick={() => setCloseOpen(true)}>
            <CheckCircle2 className="h-3.5 w-3.5" />
            Clôturer
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="py-6 overflow-x-auto">
          <StatusWorkflowBar
            steps={steps}
            current={ticket.status}
            onAdvance={
              ticket.status === "FERME"
                ? undefined
                : (key) => updateTicketStatus(ticket.id, key as TicketStatus, user.name)
            }
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="conversation">
        <TabsList>
          <TabsTrigger value="conversation">Conversation ({messages.length})</TabsTrigger>
          <TabsTrigger value="notes">Notes internes</TabsTrigger>
          <TabsTrigger value="historique">Historique ({timelineItems.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="conversation">
          <Card>
            <CardHeader><CardTitle className="text-sm">Fil de discussion — {ticket.client.name}</CardTitle></CardHeader>
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
                <Input placeholder="Répondre au client..." value={messageText} onChange={(e) => setMessageText(e.target.value)} />
                <Button
                  disabled={!messageText.trim()}
                  onClick={() => {
                    addTicketMessage(ticket.id, messageText.trim(), ticket.channel, false, user.name);
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
            <CardHeader><CardTitle className="text-sm">Note interne</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Ajouter une note interne sur ce ticket..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={4}
              />
              <Button
                disabled={noteText.trim() === (ticket.adminNotes ?? "")}
                onClick={() => addTicketNote(ticket.id, noteText.trim(), user.name)}
              >
                Enregistrer la note
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historique">
          <Card>
            <CardHeader><CardTitle className="text-sm">Historique du ticket</CardTitle></CardHeader>
            <CardContent>
              <Timeline items={timelineItems} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={closeOpen}
        onOpenChange={setCloseOpen}
        title="Clôturer ce ticket"
        description="Le ticket sera archivé comme clôturé. Cette action peut être effectuée après résolution."
        confirmLabel="Clôturer"
        onConfirm={() => updateTicketStatus(ticket.id, "FERME", user.name)}
      />

      <ConfirmDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title="Rejeter cette réclamation"
        description="La réclamation sera marquée comme non fondée. Merci de préciser le motif."
        requireReason
        destructive
        confirmLabel="Rejeter"
        onConfirm={(reason) => updateTicketStatus(ticket.id, "REJETE", user.name, reason)}
      />
    </div>
  );
}
