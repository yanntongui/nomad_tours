import { CLIENTS } from "@/lib/admin/mock/clients";
import { AGENTS } from "@/lib/admin/mock/users";
import { VisaRequest, VisaTimelineEntry } from "@/lib/admin/types";

const TODAY = new Date(2026, 7, 2);
function daysFromToday(offset: number) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + offset);
  return d.toISOString();
}

const COUNTRIES = ["France", "Émirats Arabes Unis", "Canada", "Chine", "Turquie", "États-Unis", "Royaume-Uni", "Maroc"];

const TEMPLATES: Array<[string, VisaRequest["status"], number]> = [
  ["France", "APPROVED", -20],
  ["Émirats Arabes Unis", "SUBMITTED", -2],
  ["Canada", "PROCESSING", -10],
  ["Chine", "REJECTED", -18],
  ["Turquie", "SUBMITTED", -1],
  ["États-Unis", "PROCESSING", -6],
  ["Royaume-Uni", "APPROVED", -30],
  ["Maroc", "SUBMITTED", -4],
  ["France", "PROCESSING", -8],
  ["Émirats Arabes Unis", "APPROVED", -45],
  ["Canada", "REJECTED", -25],
];

export const VISA_REQUESTS: VisaRequest[] = TEMPLATES.map(([country, status, submittedOffset], i) => {
  const client = CLIENTS[i % CLIENTS.length];
  const agent = AGENTS[i % AGENTS.length];
  const docs =
    status === "SUBMITTED"
      ? [{ id: `vdoc-${i}-1`, name: "Passeport.pdf", url: "#", uploadedAt: daysFromToday(submittedOffset) }]
      : [
          { id: `vdoc-${i}-1`, name: "Passeport.pdf", url: "#", uploadedAt: daysFromToday(submittedOffset) },
          { id: `vdoc-${i}-2`, name: "Photo_identite.jpg", url: "#", uploadedAt: daysFromToday(submittedOffset) },
          { id: `vdoc-${i}-3`, name: "Reservation_hotel.pdf", url: "#", uploadedAt: daysFromToday(submittedOffset + 1) },
        ];
  return {
    id: `visa-${i + 1}`,
    client,
    country,
    documents: docs,
    status,
    adminNotes: status === "REJECTED" ? "Dossier incomplet — justificatif de fonds manquant." : undefined,
    feeXOF: 45000 + (i % 4) * 15000,
    agent: agent.name,
    submittedAt: daysFromToday(submittedOffset),
    updatedAt: daysFromToday(submittedOffset + (status === "SUBMITTED" ? 0 : 2)),
  };
});

export const VISA_TIMELINE: VisaTimelineEntry[] = VISA_REQUESTS.map((v) => ({
  id: `vtl-${v.id}`,
  visaRequestId: v.id,
  label: "Dossier soumis",
  detail: `Demande de visa ${v.country}`,
  actor: v.client.name,
  createdAt: v.submittedAt,
}));

export { COUNTRIES as VISA_COUNTRIES };
