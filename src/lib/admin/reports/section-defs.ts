import { TripReportManualFields, TripReportSectionKey } from "@/lib/admin/types";

export type SectionCompletionStatus = "EMPTY" | "IN_PROGRESS" | "COMPLETE";

export interface TripReportSectionDef {
  key: TripReportSectionKey;
  title: string;
  fields: (keyof TripReportManualFields)[];
}

export const REPORT_SECTIONS: TripReportSectionDef[] = [
  { key: "INFOS_GENERALES", title: "1. Informations générales", fields: ["redacteur", "dateRedaction"] },
  {
    key: "CAMPAGNE_COMMUNICATION",
    title: "2. Campagne de communication & promotion",
    fields: ["canauxCommunication", "budgetCommunication", "resultatsCampagne"],
  },
  {
    key: "INSCRIPTIONS_PARTICIPANTS",
    title: "3. Inscriptions & gestion des participants",
    fields: ["desistements", "raisonsDesistement"],
  },
  {
    key: "PREPARATIFS_DOCUMENTS",
    title: "4. Préparatifs & documents avant-départ",
    fields: ["appreciationPreparatifs", "statutVisa"],
  },
  {
    key: "BILLETTERIE_AERIENNE",
    title: "5. Billetterie aérienne",
    fields: ["compagnieAerienne", "referenceBillet", "notesBilletterie"],
  },
  {
    key: "ARRIVEE_DESTINATION",
    title: "6. Arrivée à destination",
    fields: ["dateHeureArrivee", "accueilPar", "incidentsArrivee"],
  },
  { key: "HEBERGEMENT", title: "7. Hébergement", fields: ["qualitePerçueHebergement", "notesHebergement"] },
  { key: "RESTAURATION", title: "8. Restauration", fields: ["notesRestauration"] },
  { key: "DEPLACEMENTS", title: "9. Déplacements sur place", fields: ["fiabiliteTransport", "incidentsTransport"] },
  { key: "PROGRAMME_ACTIVITES", title: "10. Programme & activités réalisées", fields: ["ecartsProgramme"] },
  { key: "ENCADREMENT", title: "11. Encadrement & accompagnement", fields: ["appreciationEncadrement"] },
  { key: "RETOUR_SOUVENIRS", title: "12. Retour", fields: ["commentaireSouvenirs"] },
  {
    key: "SATISFACTION_AVIS",
    title: "13. Satisfaction & avis participants",
    fields: ["syntheseSatisfaction", "reclamations"],
  },
  { key: "BILAN_FINANCIER", title: "14. Bilan financier", fields: ["analyseEcartsFinanciers"] },
  {
    key: "RECOMMANDATIONS",
    title: "15. Recommandations pour les prochains voyages",
    fields: ["recommandations"],
  },
];

export function computeSectionCompletion(
  def: TripReportSectionDef,
  manual: TripReportManualFields
): SectionCompletionStatus {
  const filled = def.fields.filter((f) => {
    const v = manual[f];
    return v !== undefined && v !== null && String(v).trim() !== "";
  }).length;
  if (filled === 0) return "EMPTY";
  if (filled === def.fields.length) return "COMPLETE";
  return "IN_PROGRESS";
}
