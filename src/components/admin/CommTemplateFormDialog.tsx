"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  createCommunicationTemplateAction,
  updateCommunicationTemplateAction,
} from "@/app/admin/(dashboard)/voyages/modeles/actions";
import type { Tables } from "@/lib/server/types";
import { CommTemplateScope, TaskPhase, CommChannel } from "@/lib/admin/types";

export type CommunicationTemplateRow = Tables<"communication_templates">;

export const PHASE_LABELS: Record<TaskPhase, string> = { AVANT: "Avant le voyage", PENDANT: "Pendant le voyage", APRES: "Après le voyage" };
export const TONE_HINTS: Record<TaskPhase, string> = {
  AVANT: "Ton indicatif : rassurant / pratique",
  PENDANT: "Ton indicatif : informatif / chaleureux",
  APRES: "Ton indicatif : reconnaissant / fidélisation",
};
export const CHANNEL_LABELS: Record<CommChannel, string> = { EMAIL: "Email", SMS: "SMS", PUSH: "Push" };

interface FormValues {
  name: string;
  phase: TaskPhase;
  channel: CommChannel;
  subject: string;
  body: string;
}

function toFormValues(template: CommunicationTemplateRow | null): FormValues {
  return {
    name: template?.name ?? "",
    phase: (template?.phase as TaskPhase | null) ?? "AVANT",
    channel: (template?.channel as CommChannel) ?? "EMAIL",
    subject: template?.subject ?? "",
    body: template?.body ?? "",
  };
}

export function CommTemplateFormDialog({
  open,
  onOpenChange,
  editing,
  scope,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: CommunicationTemplateRow | null;
  scope: CommTemplateScope;
}) {
  const router = useRouter();
  const [form, setForm] = React.useState<FormValues>(() => toFormValues(editing));
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setForm(toFormValues(editing));
      setError(null);
    }
  }, [open, editing]);

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const valid = form.name.trim().length > 0 && form.body.trim().length > 0;

  async function handleSave() {
    setSaving(true);
    setError(null);
    const payload = {
      name: form.name,
      scope,
      phase: scope === "TRIP" ? form.phase : null,
      channel: form.channel,
      subject: form.channel === "EMAIL" ? form.subject : null,
      body: form.body,
    };
    const result = editing
      ? await updateCommunicationTemplateAction(editing.id, payload)
      : await createCommunicationTemplateAction(payload);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Modifier le modèle" : "Nouveau modèle"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Nom</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ex. Rappel documents" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {scope === "TRIP" && (
              <div className="space-y-1.5">
                <Label>Phase</Label>
                <Select value={form.phase} onValueChange={(v) => set("phase", v as TaskPhase)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(PHASE_LABELS) as TaskPhase[]).map((p) => (
                      <SelectItem key={p} value={p}>{PHASE_LABELS[p]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-stone-400 dark:text-stone-500">{TONE_HINTS[form.phase]}</p>
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Canal</Label>
              <Select value={form.channel} onValueChange={(v) => set("channel", v as CommChannel)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(CHANNEL_LABELS) as CommChannel[]).map((c) => (
                    <SelectItem key={c} value={c}>{CHANNEL_LABELS[c]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {form.channel === "EMAIL" && (
            <div className="space-y-1.5">
              <Label>Objet</Label>
              <Input value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="Objet de l'email" />
            </div>
          )}
          <div className="space-y-1.5">
            <Label>Message</Label>
            <Textarea rows={5} value={form.body} onChange={(e) => set("body", e.target.value)} placeholder="Bonjour {{prenom}}, ..." />
            <p className="text-xs text-stone-400 dark:text-stone-500">Variables disponibles : {"{{prenom}}"}, {"{{destination}}"}, {"{{date_depart}}"}, {"{{nom_guide}}"}</p>
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button disabled={!valid || saving} onClick={handleSave}>
            {saving ? "Enregistrement..." : editing ? "Enregistrer" : "Créer le modèle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
