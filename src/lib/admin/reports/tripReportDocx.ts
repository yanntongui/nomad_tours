"use client";
import { AlignmentType, Document, HeadingLevel, ImageRun, Packer, Paragraph, TextRun } from "docx";
import { REPORT_SECTIONS } from "@/lib/admin/reports/section-defs";
import {
  getTripGeneralInfo,
  getRegistrationStats,
  getPreDepartureTasksSummary,
  getTripSupplierTags,
  getItineraryVsActual,
  getGuideEngagementStats,
  getFeedbackAggregation,
  getFinancialSummary,
  type ItineraryDayInfo,
} from "@/lib/admin/reports/trip-report-data";
import type { TripReportManualFields } from "@/lib/admin/types";
import type { TripRow, TripReportRow } from "@/lib/server/trips";
import type { BookingRow } from "@/lib/server/bookings";

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}
function formatXOF(n: number) {
  return `${n.toLocaleString("fr-FR")} FCFA`;
}

function rowPara(label: string, value: string | number) {
  return new Paragraph({
    children: [new TextRun({ text: `${label} : `, bold: true }), new TextRun({ text: String(value) })],
    spacing: { after: 80 },
  });
}

function manualPara(label: string, value?: string) {
  return rowPara(label, value && value.trim() ? value : "—");
}

function sectionParagraphs(
  sectionKey: string,
  trip: TripRow,
  report: TripReportRow,
  booking: BookingRow | null,
  itineraryDays: ItineraryDayInfo[],
): Paragraph[] {
  const manual = (report.manual ?? {}) as TripReportManualFields;
  switch (sectionKey) {
    case "INFOS_GENERALES": {
      const info = getTripGeneralInfo(trip);
      return [
        rowPara("Circuit", info.circuitName),
        rowPara("Dates", `${formatDate(info.startDate)} → ${formatDate(info.endDate)}`),
        rowPara("Participants", info.participantCount),
        rowPara("Guide", info.guideName ?? "—"),
        manualPara("Rédacteur", manual.redacteur),
        manualPara("Date de rédaction", manual.dateRedaction ? formatDate(manual.dateRedaction) : undefined),
      ];
    }
    case "CAMPAGNE_COMMUNICATION":
      return [
        manualPara("Canaux de communication", manual.canauxCommunication),
        manualPara("Budget communication", manual.budgetCommunication),
        manualPara("Résultats de la campagne", manual.resultatsCampagne),
      ];
    case "INSCRIPTIONS_PARTICIPANTS": {
      const stats = getRegistrationStats(trip, booking);
      return [
        rowPara("Inscrits", stats.inscrits),
        rowPara("Total encaissé", formatXOF(stats.totalPaid)),
        manualPara("Désistements", manual.desistements),
        manualPara("Raisons des désistements", manual.raisonsDesistement),
      ];
    }
    case "PREPARATIFS_DOCUMENTS": {
      const summary = getPreDepartureTasksSummary(trip);
      return [
        rowPara("Taux de complétion", `${summary.completionRate}% (${summary.done}/${summary.total})`),
        manualPara("Appréciation des préparatifs", manual.appreciationPreparatifs),
        manualPara("Statut visa", manual.statutVisa),
      ];
    }
    case "BILLETTERIE_AERIENNE":
      return [
        manualPara("Compagnie aérienne", manual.compagnieAerienne),
        manualPara("Référence billet", manual.referenceBillet),
        manualPara("Notes billetterie", manual.notesBilletterie),
      ];
    case "ARRIVEE_DESTINATION":
      return [
        manualPara("Date et heure d'arrivée", manual.dateHeureArrivee),
        manualPara("Accueil par", manual.accueilPar),
        manualPara("Incidents à l'arrivée", manual.incidentsArrivee),
      ];
    case "HEBERGEMENT": {
      const tags = getTripSupplierTags(trip);
      return [
        rowPara("Fournisseurs", tags.length > 0 ? tags.join(", ") : "—"),
        manualPara("Qualité perçue", manual.qualitePerçueHebergement ? `${manual.qualitePerçueHebergement}/5` : undefined),
        manualPara("Notes hébergement", manual.notesHebergement),
      ];
    }
    case "RESTAURATION":
      return [manualPara("Notes restauration", manual.notesRestauration)];
    case "DEPLACEMENTS": {
      const tags = getTripSupplierTags(trip);
      return [
        rowPara("Fournisseurs", tags.length > 0 ? tags.join(", ") : "—"),
        manualPara("Fiabilité", manual.fiabiliteTransport ? `${manual.fiabiliteTransport}/5` : undefined),
        manualPara("Incidents transport", manual.incidentsTransport),
      ];
    }
    case "PROGRAMME_ACTIVITES": {
      const { prevu, reel } = getItineraryVsActual(trip, itineraryDays);
      return [
        rowPara("Programme prévu", prevu.length > 0 ? prevu.map((d) => `J${d.day}. ${d.title}`).join(" · ") : "—"),
        rowPara("Déroulé réel", reel.length > 0 ? reel.map((u) => `${formatDate(u.created_at)} — ${u.message}`).join(" · ") : "—"),
        manualPara("Écarts par rapport au programme prévu", manual.ecartsProgramme),
      ];
    }
    case "ENCADREMENT": {
      const stats = getGuideEngagementStats(trip);
      return [
        rowPara("Guide", stats.guideName ?? "—"),
        rowPara("Mises à jour publiées", stats.updatesCount),
        manualPara("Appréciation de l'encadrement", manual.appreciationEncadrement),
      ];
    }
    case "RETOUR_SOUVENIRS":
      return [manualPara("Commentaire", manual.commentaireSouvenirs)];
    case "SATISFACTION_AVIS": {
      const agg = getFeedbackAggregation(trip);
      return [
        rowPara("Note moyenne", agg.feedbacks.length > 0 ? agg.avg.toFixed(1) : "—"),
        rowPara("Nombre d'avis", agg.feedbacks.length),
        rowPara("Répartition", agg.distribution.map((d) => `${d.star}★ : ${d.count}`).join(" · ")),
        manualPara("Synthèse de satisfaction", manual.syntheseSatisfaction),
        manualPara("Réclamations", manual.reclamations),
      ];
    }
    case "BILAN_FINANCIER": {
      const summary = getFinancialSummary(booking);
      return [
        rowPara("Budget prévu", formatXOF(summary.budgetPrevu)),
        rowPara("Encaissé", formatXOF(summary.encaisse)),
        rowPara("Impayé", formatXOF(summary.impaye)),
        manualPara("Analyse des écarts financiers", manual.analyseEcartsFinanciers),
      ];
    }
    case "RECOMMANDATIONS":
      return [manualPara("Recommandations pour les prochains voyages", manual.recommandations)];
    default:
      return [];
  }
}

export async function downloadTripReportDocx({
  trip,
  report,
  booking,
  itineraryDays,
}: {
  trip: TripRow;
  report: TripReportRow;
  booking: BookingRow | null;
  itineraryDays: ItineraryDayInfo[];
}) {
  const info = getTripGeneralInfo(trip);
  const logoBuffer = await fetch("/nomad-logo.jpg").then((r) => r.arrayBuffer());

  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new ImageRun({ type: "jpg", data: logoBuffer, transformation: { width: 100, height: 87 } })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.TITLE,
      children: [new TextRun("Rapport de voyage")],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun(info.circuitName)],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun(`${formatDate(info.startDate)} au ${formatDate(info.endDate)}`)],
    }),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun("Sommaire")],
    }),
    ...REPORT_SECTIONS.map((s) => new Paragraph({ text: s.title, spacing: { after: 60 } })),
  ];

  REPORT_SECTIONS.forEach((s) => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
        children: [new TextRun(s.title)],
      })
    );
    children.push(...sectionParagraphs(s.key, trip, report, booking, itineraryDays));
  });

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `rapport-voyage-${trip.id}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
