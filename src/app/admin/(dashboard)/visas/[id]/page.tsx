"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusWorkflowBar, WorkflowStep } from "@/components/admin/StatusWorkflowBar";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Timeline } from "@/components/admin/Timeline";
import { FileUploader, UploadedFile } from "@/components/admin/FileUploader";
import { useAdminRole } from "@/context/AdminRoleContext";
import { useVisasStore, updateVisaStatus, addVisaNote, addVisaDocument } from "@/lib/admin/store/visas-store";
import { VisaStatus } from "@/lib/admin/types";

function formatXOF(n: number) {
  return `${n.toLocaleString("fr-FR")} FCFA`;
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function VisaDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAdminRole();
  const store = useVisasStore();
  const visa = store.requests.find((v) => v.id === params.id);
  const [noteText, setNoteText] = React.useState(visa?.adminNotes ?? "");
  const [rejectOpen, setRejectOpen] = React.useState(false);

  React.useEffect(() => {
    setNoteText(visa?.adminNotes ?? "");
  }, [visa?.id, visa?.adminNotes]);

  if (!visa) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-10 text-center dark:border-stone-800 dark:bg-stone-900">
        <p className="text-stone-500 dark:text-stone-400">Demande de visa introuvable.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/admin/visas"><ArrowLeft className="h-4 w-4" />Retour à la liste</Link>
        </Button>
      </div>
    );
  }

  const steps: WorkflowStep[] =
    visa.status === "REJECTED"
      ? [
          { key: "SUBMITTED", label: "Soumis" },
          { key: "PROCESSING", label: "En traitement" },
          { key: "REJECTED", label: "Rejeté", tone: "danger" },
        ]
      : [
          { key: "SUBMITTED", label: "Soumis" },
          { key: "PROCESSING", label: "En traitement" },
          { key: "APPROVED", label: "Approuvé" },
        ];

  const canReject = visa.status === "SUBMITTED" || visa.status === "PROCESSING";
  const timelineItems = store.timeline
    .filter((t) => t.visaRequestId === visa.id)
    .map((t) => ({ id: t.id, label: t.label, detail: t.detail, actor: t.actor, date: t.createdAt }));

  const uploaderFiles: UploadedFile[] = visa.documents.map((d) => ({ id: d.id, name: d.name, url: d.url, isImage: false }));

  function handleFilesChange(next: UploadedFile[]) {
    const existingIds = new Set(visa!.documents.map((d) => d.id));
    next
      .filter((f) => !existingIds.has(f.id))
      .forEach((f) => addVisaDocument(visa!.id, { id: f.id, name: f.name, url: f.url, uploadedAt: new Date().toISOString() }, user.name));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/visas")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-stone-800 dark:text-stone-100">Visa {visa.country} — {visa.client.name}</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">{visa.client.email} — {formatXOF(visa.feeXOF)} — Agent : {visa.agent}</p>
        </div>
        <StatusBadge status={visa.status} />
        {canReject && (
          <Button variant="destructive" size="sm" onClick={() => setRejectOpen(true)}>
            <XCircle className="h-3.5 w-3.5" />
            Rejeter
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="py-6 overflow-x-auto">
          <StatusWorkflowBar
            steps={steps}
            current={visa.status}
            onAdvance={(key) => updateVisaStatus(visa.id, key as VisaStatus, user.name)}
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="documents">
        <TabsList>
          <TabsTrigger value="documents">Documents ({visa.documents.length})</TabsTrigger>
          <TabsTrigger value="notes">Notes internes</TabsTrigger>
          <TabsTrigger value="historique">Historique ({timelineItems.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <Card>
            <CardHeader><CardTitle className="text-sm">Documents du dossier</CardTitle></CardHeader>
            <CardContent>
              <FileUploader files={uploaderFiles} onChange={handleFilesChange} accept="image/*,application/pdf" label="Ajouter un document" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader><CardTitle className="text-sm">Note interne</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Ajouter une note interne sur ce dossier..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={4}
              />
              <Button
                disabled={noteText.trim() === (visa.adminNotes ?? "")}
                onClick={() => addVisaNote(visa.id, noteText.trim(), user.name)}
              >
                Enregistrer la note
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historique">
          <Card>
            <CardHeader><CardTitle className="text-sm">Historique du dossier</CardTitle></CardHeader>
            <CardContent>
              <Timeline items={timelineItems} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title="Rejeter le dossier de visa"
        description="Le client sera considéré comme refusé pour cette demande."
        requireReason
        destructive
        confirmLabel="Rejeter"
        onConfirm={(reason) => updateVisaStatus(visa.id, "REJECTED", user.name, reason)}
      />
    </div>
  );
}
