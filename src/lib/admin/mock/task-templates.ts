import { TaskTemplate, TaskTemplateItem } from "@/lib/admin/types";

let itemSeq = 0;
function item(partial: Omit<TaskTemplateItem, "id" | "subItems" | "priority"> & { subItems?: string[]; priority?: TaskTemplateItem["priority"] }): TaskTemplateItem {
  itemSeq += 1;
  return {
    id: `tti-${itemSeq}`,
    priority: "NORMALE",
    subItems: [],
    ...partial,
  };
}

export const TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: "tt-safari",
    name: "Safari international",
    circuitTheme: "Safari",
    createdAt: "2026-01-10T09:00:00.000Z",
    updatedAt: "2026-01-10T09:00:00.000Z",
    items: [
      item({ title: "Confirmer les réservations hôtels/lodges", phase: "AVANT", category: "FOURNISSEURS", dueOffsetDays: -45, assigneeRole: "AGENT", supplierId: "sup-1", priority: "URGENTE" }),
      item({ title: "Envoyer la confirmation de réservation au client", phase: "AVANT", category: "COMMUNICATION", dueOffsetDays: -44, assigneeRole: "AGENT", communicationTemplateId: "ct-confirmation-reservation", communicationTrigger: "AUTO" }),
      item({ title: "Vérifier visa et documents client", phase: "AVANT", category: "DOCUMENTS_CLIENT", dueOffsetDays: -30, assigneeRole: "AGENT", priority: "URGENTE", subItems: ["Passeport valide 6 mois", "Visa obtenu", "Carte de vaccination fièvre jaune"] }),
      item({ title: "Rappel documents de voyage au client", phase: "AVANT", category: "COMMUNICATION", dueOffsetDays: -25, assigneeRole: "AGENT", communicationTemplateId: "ct-rappel-documents", communicationTrigger: "VALIDATION" }),
      item({ title: "Confirmer transport 4x4 et chauffeur", phase: "AVANT", category: "LOGISTIQUE", dueOffsetDays: -20, assigneeRole: "AGENT", supplierId: "sup-2" }),
      item({ title: "Encaisser le solde du paiement", phase: "AVANT", category: "FINANCE", dueOffsetDays: -14, assigneeRole: "AGENT", priority: "URGENTE" }),
      item({ title: "Rappel solde à payer", phase: "AVANT", category: "COMMUNICATION", dueOffsetDays: -13, assigneeRole: "AGENT", communicationTemplateId: "ct-rappel-paiement", communicationTrigger: "AUTO" }),
      item({ title: "Assigner et briefer le guide", phase: "AVANT", category: "LOGISTIQUE", dueOffsetDays: -7, assigneeRole: "GUIDE" }),
      item({ title: "Présentation du guide au client", phase: "AVANT", category: "COMMUNICATION", dueOffsetDays: -6, assigneeRole: "AGENT", communicationTemplateId: "ct-guide-assigne", communicationTrigger: "AUTO" }),
      item({ title: "Briefing veille de départ", phase: "AVANT", category: "COMMUNICATION", dueOffsetDays: -1, assigneeRole: "AGENT", communicationTemplateId: "ct-briefing-veille-depart", communicationTrigger: "AUTO" }),
      item({ title: "Message de bienvenue à l'arrivée", phase: "PENDANT", category: "COMMUNICATION", dueOffsetDays: 0, assigneeRole: "GUIDE", communicationTemplateId: "ct-arrivee-bienvenue", communicationTrigger: "AUTO" }),
      item({ title: "Point quotidien du guide", phase: "PENDANT", category: "COMMUNICATION", dueOffsetDays: 1, assigneeRole: "GUIDE", communicationTemplateId: "ct-point-quotidien", communicationTrigger: "MANUEL" }),
      item({ title: "Suivi satisfaction et album photo", phase: "APRES", category: "COMMUNICATION", dueOffsetDays: 2, assigneeRole: "AGENT", communicationTemplateId: "ct-merci-questionnaire", communicationTrigger: "AUTO" }),
      item({ title: "Solder les paiements fournisseurs", phase: "APRES", category: "FINANCE", dueOffsetDays: 5, assigneeRole: "AGENT", supplierId: "sup-1" }),
    ],
  },
  {
    id: "tt-culture-benin",
    name: "Circuit culturel Bénin",
    circuitTheme: "Culture",
    createdAt: "2026-01-12T09:00:00.000Z",
    updatedAt: "2026-01-12T09:00:00.000Z",
    items: [
      item({ title: "Confirmer les hébergements du circuit", phase: "AVANT", category: "FOURNISSEURS", dueOffsetDays: -30, assigneeRole: "AGENT", supplierId: "sup-1" }),
      item({ title: "Envoyer la confirmation de réservation au client", phase: "AVANT", category: "COMMUNICATION", dueOffsetDays: -29, assigneeRole: "AGENT", communicationTemplateId: "ct-confirmation-reservation", communicationTrigger: "AUTO" }),
      item({ title: "Vérifier pièce d'identité / passeport client", phase: "AVANT", category: "DOCUMENTS_CLIENT", dueOffsetDays: -21, assigneeRole: "AGENT", subItems: ["Pièce d'identité vérifiée", "Assurance voyage confirmée"] }),
      item({ title: "Réserver les guides culturels locaux", phase: "AVANT", category: "FOURNISSEURS", dueOffsetDays: -14, assigneeRole: "AGENT", supplierId: "sup-3" }),
      item({ title: "Encaisser le solde du paiement", phase: "AVANT", category: "FINANCE", dueOffsetDays: -10, assigneeRole: "AGENT", priority: "URGENTE" }),
      item({ title: "Rappel solde à payer", phase: "AVANT", category: "COMMUNICATION", dueOffsetDays: -9, assigneeRole: "AGENT", communicationTemplateId: "ct-rappel-paiement", communicationTrigger: "VALIDATION" }),
      item({ title: "Assigner le guide accompagnateur", phase: "AVANT", category: "LOGISTIQUE", dueOffsetDays: -5, assigneeRole: "GUIDE" }),
      item({ title: "Briefing veille de départ", phase: "AVANT", category: "COMMUNICATION", dueOffsetDays: -1, assigneeRole: "AGENT", communicationTemplateId: "ct-briefing-veille-depart", communicationTrigger: "AUTO" }),
      item({ title: "Message de bienvenue à l'arrivée", phase: "PENDANT", category: "COMMUNICATION", dueOffsetDays: 0, assigneeRole: "GUIDE", communicationTemplateId: "ct-arrivee-bienvenue", communicationTrigger: "AUTO" }),
      item({ title: "Point quotidien du guide", phase: "PENDANT", category: "COMMUNICATION", dueOffsetDays: 1, assigneeRole: "GUIDE", communicationTemplateId: "ct-point-quotidien", communicationTrigger: "MANUEL" }),
      item({ title: "Publier le questionnaire de satisfaction", phase: "APRES", category: "COMMUNICATION", dueOffsetDays: 1, assigneeRole: "AGENT", communicationTemplateId: "ct-merci-questionnaire", communicationTrigger: "AUTO" }),
      item({ title: "Préparer et envoyer l'album photo", phase: "APRES", category: "COMMUNICATION", dueOffsetDays: 4, assigneeRole: "AGENT", communicationTemplateId: "ct-album-photo", communicationTrigger: "VALIDATION" }),
    ],
  },
  {
    id: "tt-evenement-entreprise",
    name: "Événement d'entreprise",
    circuitTheme: "Événement",
    createdAt: "2026-01-15T09:00:00.000Z",
    updatedAt: "2026-01-15T09:00:00.000Z",
    items: [
      item({ title: "Valider le lieu et le traiteur", phase: "AVANT", category: "FOURNISSEURS", dueOffsetDays: -30, assigneeRole: "AGENT", supplierId: "sup-4", priority: "URGENTE" }),
      item({ title: "Envoyer la confirmation au client", phase: "AVANT", category: "COMMUNICATION", dueOffsetDays: -29, assigneeRole: "AGENT", communicationTemplateId: "ct-confirmation-reservation", communicationTrigger: "AUTO" }),
      item({ title: "Collecter la liste des participants", phase: "AVANT", category: "DOCUMENTS_CLIENT", dueOffsetDays: -15, assigneeRole: "AGENT" }),
      item({ title: "Confirmer le transport groupe", phase: "AVANT", category: "LOGISTIQUE", dueOffsetDays: -10, assigneeRole: "AGENT", supplierId: "sup-2" }),
      item({ title: "Encaisser le solde du paiement", phase: "AVANT", category: "FINANCE", dueOffsetDays: -7, assigneeRole: "AGENT", priority: "URGENTE" }),
      item({ title: "Briefing veille d'événement", phase: "AVANT", category: "COMMUNICATION", dueOffsetDays: -1, assigneeRole: "AGENT", communicationTemplateId: "ct-briefing-veille-depart", communicationTrigger: "AUTO" }),
      item({ title: "Accueil et bienvenue sur site", phase: "PENDANT", category: "COMMUNICATION", dueOffsetDays: 0, assigneeRole: "GUIDE", communicationTemplateId: "ct-arrivee-bienvenue", communicationTrigger: "AUTO" }),
      item({ title: "Suivi satisfaction post-événement", phase: "APRES", category: "COMMUNICATION", dueOffsetDays: 1, assigneeRole: "AGENT", communicationTemplateId: "ct-merci-questionnaire", communicationTrigger: "VALIDATION" }),
      item({ title: "Solder les paiements fournisseurs", phase: "APRES", category: "FINANCE", dueOffsetDays: 3, assigneeRole: "AGENT", supplierId: "sup-4" }),
    ],
  },
];
