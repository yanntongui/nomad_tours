import { CLIENTS } from "@/lib/admin/mock/clients";
import { AGENTS } from "@/lib/admin/mock/users";
import { EventRequest, EventTimelineEntry } from "@/lib/admin/types";

const TODAY = new Date(2026, 7, 2);
function daysFromToday(offset: number) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + offset);
  return d.toISOString();
}

export const EVENT_TYPES = ["Mariage", "Séminaire d'entreprise", "Team Building", "Anniversaire", "Baptême", "Conférence"];

const TEMPLATES: Array<[string, EventRequest["status"], number, number]> = [
  ["Séminaire d'entreprise", "CONFIRMED", 4, 25],
  ["Mariage", "QUOTED", 40, 120],
  ["Anniversaire", "REQUESTED", 15, 30],
  ["Team Building", "IN_PROGRESS", -1, 18],
  ["Conférence", "COMPLETED", -20, 80],
  ["Baptême", "DRAFT", 60, 40],
  ["Mariage", "CANCELLED", -10, 100],
  ["Séminaire d'entreprise", "REQUESTED", 25, 15],
  ["Team Building", "QUOTED", 12, 22],
];

export const EVENT_REQUESTS: EventRequest[] = TEMPLATES.map(([type, status, dateOffset, guestCount], i) => {
  const client = CLIENTS[(i + 2) % CLIENTS.length];
  const agent = AGENTS[i % AGENTS.length];
  const budgetXOF = 500000 + guestCount * 45000;
  const hasQuote = status !== "DRAFT" && status !== "REQUESTED";
  return {
    id: `evt-${i + 1}`,
    client,
    type,
    guestCount,
    budgetXOF,
    quoteAmountXOF: hasQuote ? Math.round(budgetXOF * 0.92) : undefined,
    services: ["Traiteur", "Décoration", "Sonorisation"].slice(0, 1 + (i % 3)),
    eventDate: daysFromToday(dateOffset),
    location: i % 4 === 0 ? "Cotonou" : i % 4 === 1 ? "Grand-Popo" : i % 4 === 2 ? "Ouidah" : "Porto-Novo",
    status,
    agent: agent.name,
    createdAt: daysFromToday(dateOffset - 30),
    updatedAt: daysFromToday(dateOffset - 5),
  };
});

export const EVENT_TIMELINE: EventTimelineEntry[] = EVENT_REQUESTS.map((e) => ({
  id: `evtl-${e.id}`,
  eventRequestId: e.id,
  label: "Demande créée",
  detail: `${e.type} — ${e.guestCount} invités`,
  actor: e.client.name,
  createdAt: e.createdAt,
}));
