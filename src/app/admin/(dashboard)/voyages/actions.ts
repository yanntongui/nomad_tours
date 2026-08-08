"use server";

import { revalidatePath } from "next/cache";
import {
  updateTripStatus,
  updateTrip,
  logTripTimeline,
  setParticipantChecklistItem,
  addTripUpdate,
  addTripFeedback,
  createTripTask,
  updateTripTaskStatus,
  setTripTaskSubItem,
  deleteTripTask,
  applyTripTaskTemplate,
  updateTripCommunication,
  scheduleTripCommunication,
  setCheckin,
  addTripMedia,
  updateTripMedia,
  deleteTripMedia,
  getTripReport,
  ensureTripReport,
  updateTripReportManual,
  finalizeTripReport,
  addReportActionItems,
  toggleReportActionItem,
} from "@/lib/server/trips";
import { getTaskTemplate } from "@/lib/server/task-templates";
import { listCommunicationTemplates } from "@/lib/server/communication-templates";
import type { Json, Tables, TablesInsert } from "@/lib/server/types";

function revalidateTrip(id: string) {
  revalidatePath("/admin/voyages");
  revalidatePath(`/admin/voyages/${id}`);
  revalidatePath(`/admin/voyages/${id}/rapport`);
  revalidatePath("/admin/voyages/rapports");
  revalidatePath("/admin/programme-annuel");
}

const REPORT_GENERATED_LABEL = "Rapport de voyage généré";

export async function updateTripStatusAction(
  id: string,
  status: Tables<"trips">["status"],
  actor: string,
) {
  try {
    const data = await updateTripStatus(id, status, actor);
    if (status === "COMPLETED") {
      await logTripTimeline(
        id,
        "Système",
        "Questionnaire de satisfaction envoyé",
        "Envoi automatique au client à la clôture du voyage",
      );
      const existingReport = await getTripReport(id);
      if (!existingReport) {
        await ensureTripReport(id, "Système");
        await logTripTimeline(
          id,
          "Système",
          REPORT_GENERATED_LABEL,
          "Rapport de voyage brouillon généré automatiquement à la clôture",
        );
      }
    }
    revalidateTrip(id);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function assignGuideAction(
  tripId: string,
  guideId: string,
  guideName: string,
  actor: string,
) {
  try {
    const data = await updateTrip(tripId, { guide_id: guideId });
    await logTripTimeline(tripId, actor, "Guide assigné", guideName);
    revalidateTrip(tripId);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function setChecklistItemAction(
  tripId: string,
  participantId: string,
  label: string,
  done: boolean,
) {
  try {
    const data = await setParticipantChecklistItem(participantId, label, done);
    revalidateTrip(tripId);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function addTripUpdateAction(
  tripId: string,
  message: string,
  mediaUrls: string[],
  actor: string,
) {
  try {
    const data = await addTripUpdate(tripId, { author: actor, message, media_urls: mediaUrls });
    await logTripTimeline(tripId, actor, "Mise à jour publiée", message.slice(0, 60));
    revalidateTrip(tripId);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function addTripFeedbackAction(
  tripId: string,
  input: { author: string; rating: number; comment: string },
  actor: string,
) {
  try {
    const data = await addTripFeedback(tripId, input);
    await logTripTimeline(tripId, actor, "Avis client enregistré", `${input.rating}/5 — ${input.comment.slice(0, 60)}`);
    revalidateTrip(tripId);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

// ---- Tâches ----

export async function addTaskAction(
  tripId: string,
  input: Omit<TablesInsert<"trip_tasks">, "trip_id" | "status">,
  actor: string,
) {
  try {
    const data = await createTripTask(tripId, { ...input, status: "A_FAIRE" });
    await logTripTimeline(tripId, actor, "Tâche ajoutée", input.title);
    revalidateTrip(tripId);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

const TASK_STATUS_LABELS: Record<Tables<"trip_tasks">["status"], string> = {
  A_FAIRE: "Tâche remise à faire",
  EN_COURS: "Tâche en cours",
  FAIT: "Tâche terminée",
  BLOQUE: "Tâche bloquée",
};

export async function updateTaskStatusAction(
  taskId: string,
  status: Tables<"trip_tasks">["status"],
  actor: string,
) {
  try {
    const task = await updateTripTaskStatus(taskId, status);
    await logTripTimeline(task.trip_id, actor, TASK_STATUS_LABELS[status], task.title);
    if (status === "FAIT" && task.communication_template_id && task.communication_trigger && task.communication_trigger !== "MANUEL") {
      const commTemplates = await listCommunicationTemplates();
      const commTemplate = commTemplates.find((c) => c.id === task.communication_template_id);
      if (commTemplate) {
        const commStatus: Tables<"trip_communications">["status"] =
          task.communication_trigger === "AUTO" ? "ENVOYEE" : "EN_ATTENTE_VALIDATION";
        await scheduleTripCommunication(task.trip_id, {
          task_id: taskId,
          template_id: commTemplate.id,
          channel: commTemplate.channel,
          subject: commTemplate.subject,
          body: commTemplate.body,
          status: commStatus,
          sent_at: commStatus === "ENVOYEE" ? new Date().toISOString() : null,
          recipient_participant_ids: [],
          created_by: actor,
        });
        await logTripTimeline(
          task.trip_id,
          actor,
          commStatus === "ENVOYEE" ? "Communication envoyée automatiquement" : "Communication en attente de validation",
          commTemplate.name,
        );
      }
    }
    revalidateTrip(task.trip_id);
    return { data: task };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function toggleTaskSubItemAction(tripId: string, taskId: string, subItemId: string, done: boolean) {
  try {
    const data = await setTripTaskSubItem(taskId, subItemId, done);
    revalidateTrip(tripId);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function deleteTaskAction(tripId: string, taskId: string) {
  try {
    await deleteTripTask(taskId);
    revalidateTrip(tripId);
    return { data: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

function seedTaskStatus(dueDate: Date): Tables<"trip_tasks">["status"] {
  const daysPast = Math.floor((Date.now() - dueDate.getTime()) / 86400000);
  return daysPast > 3 ? "FAIT" : "A_FAIRE";
}

export async function applyTaskTemplateAction(
  tripId: string,
  templateId: string,
  tripStartDate: string,
  tripStatus: Tables<"trips">["status"],
  actor: string,
) {
  try {
    const template = await getTaskTemplate(templateId);
    if (!template) return { error: "Modèle introuvable" };
    const commTemplates = await listCommunicationTemplates();
    const start = new Date(tripStartDate);

    const tasks: Omit<TablesInsert<"trip_tasks">, "trip_id">[] = [];
    const comms: (Omit<TablesInsert<"trip_communications">, "trip_id" | "task_id"> & { taskIndex: number })[] = [];

    template.task_template_items.forEach((item, index) => {
      const due = new Date(start);
      due.setDate(due.getDate() + item.due_offset_days);
      const status = tripStatus === "CANCELLED" ? "A_FAIRE" : seedTaskStatus(due);
      tasks.push({
        template_item_id: item.id,
        title: item.title,
        phase: item.phase,
        category: item.category,
        due_date: due.toISOString(),
        status,
        priority: item.priority,
        sub_items: item.sub_items.map((label, i) => ({ id: `sub-${index}-${i}`, label, done: status === "FAIT" })),
        supplier_tag: item.supplier_tag,
        attachments: [],
        communication_template_id: item.communication_template_id,
        communication_trigger: item.communication_trigger,
      });
      if (status === "FAIT" && item.communication_template_id && item.communication_trigger && item.communication_trigger !== "MANUEL") {
        const commTemplate = commTemplates.find((c) => c.id === item.communication_template_id);
        if (commTemplate) {
          const commStatus: Tables<"trip_communications">["status"] =
            item.communication_trigger === "AUTO" ? "ENVOYEE" : "EN_ATTENTE_VALIDATION";
          comms.push({
            taskIndex: index,
            template_id: commTemplate.id,
            channel: commTemplate.channel,
            subject: commTemplate.subject,
            body: commTemplate.body,
            status: commStatus,
            sent_at: commStatus === "ENVOYEE" ? due.toISOString() : null,
            recipient_participant_ids: [],
            created_by: "Système",
          });
        }
      }
    });

    await applyTripTaskTemplate(tripId, tasks, comms);
    await logTripTimeline(tripId, actor, "Modèle de tâches appliqué", template.name);
    revalidateTrip(tripId);
    return { data: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

// ---- Communications ----

export async function validateCommunicationAction(tripId: string, id: string, actor: string) {
  try {
    const data = await updateTripCommunication(id, { status: "ENVOYEE", sent_at: new Date().toISOString() });
    await logTripTimeline(tripId, actor, "Communication validée et envoyée", data.subject ?? data.body.slice(0, 60));
    revalidateTrip(tripId);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function sendCommunicationAction(tripId: string, id: string, actor: string) {
  try {
    const data = await updateTripCommunication(id, { status: "ENVOYEE", sent_at: new Date().toISOString() });
    await logTripTimeline(tripId, actor, "Communication envoyée", data.subject ?? data.body.slice(0, 60));
    revalidateTrip(tripId);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function cancelCommunicationAction(tripId: string, id: string, actor: string) {
  try {
    const data = await updateTripCommunication(id, { status: "ANNULEE" });
    await logTripTimeline(tripId, actor, "Communication annulée", data.subject ?? data.body.slice(0, 60));
    revalidateTrip(tripId);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function composeManualCommunicationAction(
  tripId: string,
  payload: {
    channel: Tables<"trip_communications">["channel"];
    subject?: string | null;
    body: string;
    recipient_participant_ids: string[];
  },
  actor: string,
) {
  try {
    const data = await scheduleTripCommunication(tripId, {
      channel: payload.channel,
      subject: payload.subject ?? null,
      body: payload.body,
      status: "ENVOYEE",
      sent_at: new Date().toISOString(),
      recipient_participant_ids: payload.recipient_participant_ids,
      created_by: actor,
    });
    await logTripTimeline(tripId, actor, "Message manuel envoyé", payload.body.slice(0, 60));
    revalidateTrip(tripId);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

// ---- Check-ins ----

export async function toggleCheckinAction(tripId: string, participantId: string, day: number, done: boolean) {
  try {
    const data = await setCheckin(tripId, participantId, day, done);
    revalidateTrip(tripId);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

// ---- Album photo souvenir ----

export async function addTripPhotosAction(tripId: string, urls: string[], actor: string) {
  try {
    const data = await Promise.all(urls.map((url) => addTripMedia(tripId, { url, type: "PHOTO", uploaded_by: actor })));
    await logTripTimeline(
      tripId,
      actor,
      `${data.length} photo${data.length > 1 ? "s" : ""} ajoutée${data.length > 1 ? "s" : ""} à l'album`,
    );
    revalidateTrip(tripId);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function updateTripPhotoCaptionAction(tripId: string, photoId: string, caption: string) {
  try {
    const data = await updateTripMedia(photoId, { caption });
    revalidateTrip(tripId);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function removeTripPhotoAction(tripId: string, photoId: string) {
  try {
    await deleteTripMedia(photoId);
    revalidateTrip(tripId);
    return { data: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

// ---- Rapport de voyage ----

export async function ensureTripReportAction(tripId: string, actor: string) {
  try {
    const existing = await getTripReport(tripId);
    if (existing) return { data: existing };
    const data = await ensureTripReport(tripId, actor);
    await logTripTimeline(tripId, actor, REPORT_GENERATED_LABEL, "Rapport de voyage brouillon généré manuellement");
    revalidateTrip(tripId);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function updateReportSectionAction(tripId: string, patch: Record<string, Json>) {
  try {
    const existing = await getTripReport(tripId);
    const merged = { ...((existing?.manual as Record<string, Json>) ?? {}), ...patch };
    const data = await updateTripReportManual(tripId, merged);
    revalidateTrip(tripId);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function finalizeReportAction(tripId: string, actor: string) {
  try {
    const data = await finalizeTripReport(tripId, actor);
    await logTripTimeline(tripId, actor, "Rapport de voyage finalisé");
    revalidateTrip(tripId);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function addReportActionItemsAction(tripId: string, reportId: string, labels: string[]) {
  try {
    const data = await addReportActionItems(reportId, labels);
    revalidateTrip(tripId);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function toggleReportActionItemAction(tripId: string, id: string, currentDone: boolean) {
  try {
    const data = await toggleReportActionItem(id, !currentDone);
    revalidateTrip(tripId);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}
