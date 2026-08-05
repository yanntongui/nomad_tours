import { CLIENTS } from "@/lib/admin/mock/clients";
import { AGENTS } from "@/lib/admin/mock/users";
import { SupportTicket, TicketMessage, TicketType, TicketChannel, TicketStatus, TicketPriority } from "@/lib/admin/types";

const TODAY = new Date(2026, 7, 2);
function daysFromToday(offset: number) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + offset);
  return d.toISOString();
}

const TEMPLATES: Array<{
  type: TicketType;
  channel: TicketChannel;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  offset: number;
  firstMessage: string;
}> = [
  { type: "RECLAMATION", channel: "EMAIL", subject: "Chambre non conforme à la réservation", status: "EN_COURS", priority: "URGENTE", offset: -3, firstMessage: "Bonjour, la chambre attribuée à l'hôtel ne correspond pas à ce qui était prévu dans le circuit (vue mer promise, vue parking obtenue)." },
  { type: "SUPPORT", channel: "CHAT", subject: "Question sur les bagages autorisés", status: "RESOLU", priority: "NORMALE", offset: -12, firstMessage: "Bonjour, combien de kg de bagages sont autorisés pour le vol Cotonou-Paris ?" },
  { type: "SUPPORT", channel: "TELEPHONE", subject: "Modification date de départ", status: "OUVERT", priority: "NORMALE", offset: -1, firstMessage: "Le client souhaite décaler son départ de 3 jours, à vérifier la disponibilité." },
  { type: "RECLAMATION", channel: "EMAIL", subject: "Guide absent le premier jour du circuit", status: "OUVERT", priority: "URGENTE", offset: -2, firstMessage: "Le guide n'était pas présent au point de rendez-vous ce matin, nous avons perdu 2h de visite." },
  { type: "SUPPORT", channel: "EMAIL", subject: "Demande de facture pour note de frais", status: "RESOLU", priority: "NORMALE", offset: -20, firstMessage: "Pouvez-vous m'envoyer la facture détaillée de ma réservation pour mon employeur ?" },
  { type: "RECLAMATION", channel: "TELEPHONE", subject: "Remboursement suite annulation fournisseur", status: "REJETE", priority: "NORMALE", offset: -30, firstMessage: "Je demande un remboursement complet suite à l'annulation de l'excursion en pirogue." },
  { type: "SUPPORT", channel: "EMAIL", subject: "Informations visa pour le Ghana", status: "FERME", priority: "NORMALE", offset: -45, firstMessage: "Quels documents sont nécessaires pour le visa touristique Ghana ?" },
  { type: "RECLAMATION", channel: "CHAT", subject: "Transport aéroport non présenté", status: "EN_COURS", priority: "URGENTE", offset: -1, firstMessage: "Le chauffeur prévu pour le transfert aéroport ne s'est jamais présenté, nous avons dû prendre un taxi à nos frais." },
];

export const SUPPORT_TICKETS: SupportTicket[] = TEMPLATES.map((t, i) => {
  const client = CLIENTS[i % CLIENTS.length];
  const agent = AGENTS[i % AGENTS.length];
  return {
    id: `tkt-${i + 1}`,
    client,
    type: t.type,
    channel: t.channel,
    subject: t.subject,
    status: t.status,
    priority: t.priority,
    agent: agent.name,
    adminNotes: t.status === "REJETE" ? "Excursion annulée pour raisons météo, remboursement non applicable selon les CGV." : undefined,
    createdAt: daysFromToday(t.offset),
    updatedAt: daysFromToday(t.offset + (t.status === "OUVERT" ? 0 : 1)),
  };
});

export const SUPPORT_MESSAGES: TicketMessage[] = SUPPORT_TICKETS.flatMap((ticket, i) => {
  const t = TEMPLATES[i];
  const messages: TicketMessage[] = [
    {
      id: `tmsg-${ticket.id}-1`,
      ticketId: ticket.id,
      author: ticket.client.name,
      fromClient: true,
      channel: ticket.channel,
      content: t.firstMessage,
      createdAt: ticket.createdAt,
    },
  ];
  if (ticket.status !== "OUVERT") {
    messages.push({
      id: `tmsg-${ticket.id}-2`,
      ticketId: ticket.id,
      author: ticket.agent,
      fromClient: false,
      channel: ticket.channel,
      content: "Merci pour votre message, nous prenons en charge votre demande et revenons vers vous rapidement.",
      createdAt: ticket.updatedAt,
    });
  }
  return messages;
});
