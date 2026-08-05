import { ADMIN_CIRCUITS } from "@/lib/admin/mock/circuits";
import { AGENTS } from "@/lib/admin/mock/users";
import { CLIENTS } from "@/lib/admin/mock/clients";
import {
  Booking,
  BookingDocument,
  InternalNote,
  Message,
  Payment,
  PaymentSchedule,
  TimelineEntry,
} from "@/lib/admin/types";

const TODAY = new Date(2026, 7, 2);
function daysFromToday(offset: number) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + offset);
  return d.toISOString();
}

const c0 = ADMIN_CIRCUITS[0];
const c1 = ADMIN_CIRCUITS[1];
const c2 = ADMIN_CIRCUITS[2];

export const BOOKINGS: Booking[] = [
  {
    id: "bk-1",
    bookingNumber: "NT-2026-0001",
    client: CLIENTS[0],
    type: "CIRCUIT",
    referenceId: c0.id,
    referenceLabel: c0.title,
    destinationName: c0.destinationName,
    totalPriceXOF: c0.priceXOF,
    paidXOF: c0.priceXOF,
    status: "CONFIRMED",
    paymentStatus: "PAID",
    agent: AGENTS[0].name,
    passengers: 2,
    departDate: daysFromToday(18),
    createdAt: daysFromToday(-22),
    updatedAt: daysFromToday(-3),
  },
  {
    id: "bk-2",
    bookingNumber: "NT-2026-0002",
    client: CLIENTS[1],
    type: "CIRCUIT",
    referenceId: c1.id,
    referenceLabel: c1.title,
    destinationName: c1.destinationName,
    totalPriceXOF: c1.priceXOF,
    paidXOF: Math.round(c1.priceXOF * 0.4),
    status: "CONFIRMED",
    paymentStatus: "PARTIAL",
    agent: AGENTS[1].name,
    passengers: 1,
    departDate: daysFromToday(45),
    createdAt: daysFromToday(-15),
    updatedAt: daysFromToday(-1),
  },
  {
    id: "bk-3",
    bookingNumber: "NT-2026-0003",
    client: CLIENTS[2],
    type: "FLIGHT",
    referenceId: "flight-cotonou-paris",
    referenceLabel: "Vol Cotonou → Paris (Air France)",
    destinationName: "Paris, France",
    totalPriceXOF: 620000,
    paidXOF: 620000,
    status: "CONFIRMED",
    paymentStatus: "PAID",
    agent: AGENTS[0].name,
    passengers: 1,
    departDate: daysFromToday(9),
    createdAt: daysFromToday(-10),
    updatedAt: daysFromToday(-2),
  },
  {
    id: "bk-4",
    bookingNumber: "NT-2026-0004",
    client: CLIENTS[5],
    type: "EVENT",
    referenceId: "event-seminaire-sobebra",
    referenceLabel: "Séminaire d'entreprise 3 jours — Grand-Popo",
    destinationName: "Grand-Popo",
    totalPriceXOF: 3200000,
    paidXOF: 0,
    status: "PENDING",
    paymentStatus: "PENDING",
    agent: AGENTS[1].name,
    passengers: 25,
    departDate: daysFromToday(4),
    createdAt: daysFromToday(-6),
    updatedAt: daysFromToday(-1),
    urgent: true,
  },
  {
    id: "bk-5",
    bookingNumber: "NT-2026-0005",
    client: CLIENTS[3],
    type: "CIRCUIT",
    referenceId: c2.id,
    referenceLabel: c2.title,
    destinationName: c2.destinationName,
    totalPriceXOF: c2.priceXOF,
    paidXOF: c2.priceXOF,
    status: "CANCELLED",
    paymentStatus: "REFUNDED",
    agent: AGENTS[0].name,
    passengers: 2,
    departDate: daysFromToday(-5),
    createdAt: daysFromToday(-40),
    updatedAt: daysFromToday(-8),
  },
  {
    id: "bk-6",
    bookingNumber: "NT-2026-0006",
    client: CLIENTS[4],
    type: "CIRCUIT",
    referenceId: c0.id,
    referenceLabel: c0.title,
    destinationName: c0.destinationName,
    totalPriceXOF: c0.priceXOF,
    paidXOF: c0.priceXOF,
    status: "COMPLETED",
    paymentStatus: "PAID",
    agent: AGENTS[1].name,
    passengers: 3,
    departDate: daysFromToday(-30),
    createdAt: daysFromToday(-70),
    updatedAt: daysFromToday(-25),
  },
];

const EXTRA_TEMPLATES: Array<[typeof BOOKINGS[number]["type"], typeof BOOKINGS[number]["status"], typeof BOOKINGS[number]["paymentStatus"], number]> = [
  ["CIRCUIT", "CONFIRMED", "PAID", 25],
  ["CIRCUIT", "PENDING", "PENDING", 3],
  ["FLIGHT", "CONFIRMED", "PARTIAL", 40],
  ["CIRCUIT", "CONFIRMED", "PAID", 60],
  ["EVENT", "CONFIRMED", "PAID", 15],
  ["CIRCUIT", "CANCELLED", "PENDING", -12],
  ["CIRCUIT", "COMPLETED", "PAID", -55],
  ["FLIGHT", "PENDING", "PENDING", 6],
  ["CIRCUIT", "CONFIRMED", "PARTIAL", 33],
  ["EVENT", "PENDING", "PENDING", 20],
];

EXTRA_TEMPLATES.forEach(([type, status, paymentStatus, depart], i) => {
  const client = CLIENTS[(i + 3) % CLIENTS.length];
  const circuit = ADMIN_CIRCUITS[i % ADMIN_CIRCUITS.length];
  const isCircuit = type === "CIRCUIT";
  const total = isCircuit ? circuit.priceXOF : type === "FLIGHT" ? 480000 + i * 15000 : 1800000 + i * 90000;
  const paidRatio = paymentStatus === "PAID" ? 1 : paymentStatus === "PARTIAL" ? 0.5 : 0;
  BOOKINGS.push({
    id: `bk-extra-${i}`,
    bookingNumber: `NT-2026-${String(7 + i).padStart(4, "0")}`,
    client,
    type,
    referenceId: isCircuit ? circuit.id : `${type.toLowerCase()}-${i}`,
    referenceLabel: isCircuit ? circuit.title : type === "FLIGHT" ? "Vol Cotonou → Bruxelles" : "Anniversaire privé — Cotonou",
    destinationName: isCircuit ? circuit.destinationName : type === "FLIGHT" ? "Bruxelles, Belgique" : "Cotonou",
    totalPriceXOF: total,
    paidXOF: Math.round(total * paidRatio),
    status,
    paymentStatus,
    agent: AGENTS[i % AGENTS.length].name,
    passengers: isCircuit ? 1 + (i % 4) : type === "EVENT" ? 10 + i * 2 : 1,
    departDate: daysFromToday(depart),
    createdAt: daysFromToday(depart - 20),
    updatedAt: daysFromToday(depart - 2),
    urgent: depart >= 0 && depart < 7 && status === "PENDING",
  });
});

export const PAYMENTS: Payment[] = [
  { id: "pay-1", bookingId: "bk-1", amountXOF: BOOKINGS[0].totalPriceXOF, method: "FEDAPAY", status: "PAID", transactionRef: "FDP-88213", paidAt: daysFromToday(-3), createdAt: daysFromToday(-3) },
  { id: "pay-2", bookingId: "bk-2", amountXOF: BOOKINGS[1].paidXOF, method: "MOBILE_MONEY_MTN", status: "PAID", transactionRef: "MTN-55129", paidAt: daysFromToday(-1), createdAt: daysFromToday(-1) },
  { id: "pay-3", bookingId: "bk-3", amountXOF: BOOKINGS[2].totalPriceXOF, method: "STRIPE_CARD", status: "PAID", transactionRef: "ch_3P9x", paidAt: daysFromToday(-2), createdAt: daysFromToday(-2) },
  { id: "pay-4", bookingId: "bk-5", amountXOF: BOOKINGS[4].totalPriceXOF, method: "BANK_TRANSFER", status: "REFUNDED", transactionRef: "VIR-9021", paidAt: daysFromToday(-38), createdAt: daysFromToday(-38) },
  { id: "pay-5", bookingId: "bk-6", amountXOF: BOOKINGS[5].totalPriceXOF, method: "MOBILE_MONEY_MOOV", status: "PAID", transactionRef: "MOOV-3312", paidAt: daysFromToday(-68), createdAt: daysFromToday(-68) },
];

export const PAYMENT_SCHEDULES: PaymentSchedule[] = [
  { id: "sched-1", bookingId: "bk-2", dueDate: daysFromToday(-2), amountXOF: Math.round(BOOKINGS[1].totalPriceXOF * 0.4), status: "PAID", paidAt: daysFromToday(-1) },
  { id: "sched-2", bookingId: "bk-2", dueDate: daysFromToday(10), amountXOF: Math.round(BOOKINGS[1].totalPriceXOF * 0.3), status: "LATE" },
  { id: "sched-3", bookingId: "bk-2", dueDate: daysFromToday(30), amountXOF: Math.round(BOOKINGS[1].totalPriceXOF * 0.3), status: "PENDING" },
  { id: "sched-4", bookingId: "bk-4", dueDate: daysFromToday(1), amountXOF: BOOKINGS[3].totalPriceXOF, status: "LATE" },
];

export const TIMELINE: TimelineEntry[] = BOOKINGS.map((b, i) => ({
  id: `tl-${b.id}`,
  bookingId: b.id,
  label: b.status === "CANCELLED" ? "Réservation annulée" : b.status === "COMPLETED" ? "Voyage terminé" : "Réservation créée",
  detail: `Réservation ${b.bookingNumber} — ${b.type === "CIRCUIT" ? b.referenceLabel : b.destinationName}`,
  actor: b.agent,
  createdAt: b.createdAt,
}));

export const MESSAGES: Message[] = [
  { id: "msg-1", bookingId: "bk-1", author: CLIENTS[0].name, fromClient: true, content: "Bonjour, est-il possible d'ajouter une nuit supplémentaire à Ganvié ?", createdAt: daysFromToday(-5) },
  { id: "msg-2", bookingId: "bk-1", author: AGENTS[0].name, fromClient: false, content: "Bonjour Awa, oui c'est possible avec un supplément de 25 000 XOF. Je vous envoie le devis actualisé.", createdAt: daysFromToday(-4) },
  { id: "msg-3", bookingId: "bk-2", author: CLIENTS[1].name, fromClient: true, content: "Le deuxième versement peut-il être décalé de quelques jours ?", createdAt: daysFromToday(-1) },
];

export const INTERNAL_NOTES: InternalNote[] = [
  { id: "note-1", bookingId: "bk-2", author: AGENTS[1].name, content: "Client fiable, a déjà voyagé avec nous en 2025. Prévoir relance douce pour le 2e versement.", createdAt: daysFromToday(-1) },
  { id: "note-2", bookingId: "bk-4", author: AGENTS[1].name, content: "Devis en attente de validation par le service achat de SOBEBRA. Relancer avant le 3.", createdAt: daysFromToday(-1) },
];

export const DOCUMENTS: BookingDocument[] = [
  { id: "doc-1", bookingId: "bk-1", name: "Facture_NT-2026-0001.pdf", type: "Facture", url: "#", uploadedAt: daysFromToday(-3) },
  { id: "doc-2", bookingId: "bk-1", name: "Voucher_hebergement.pdf", type: "Voucher", url: "#", uploadedAt: daysFromToday(-2) },
  { id: "doc-3", bookingId: "bk-3", name: "Billet_electronique.pdf", type: "Billet", url: "#", uploadedAt: daysFromToday(-2) },
];
