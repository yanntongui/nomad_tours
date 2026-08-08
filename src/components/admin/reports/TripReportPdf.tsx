"use client";
import { Document, Page, View, Text, Image, StyleSheet, pdf } from "@react-pdf/renderer";
import { REPORT_SECTIONS } from "@/lib/admin/reports/section-defs";
import {
  getTripGeneralInfo,
  getRegistrationStats,
  getPreDepartureTasksSummary,
  getSupplierInvolvement,
  getItineraryVsActual,
  getGuideEngagementStats,
  getFeedbackAggregation,
  getFinancialSummary,
} from "@/lib/admin/store/trips-store";
import { Trip, TripReport } from "@/lib/admin/types";

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}
function formatXOF(n: number) {
  return `${n.toLocaleString("fr-FR")} FCFA`;
}

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#1A1A1A" },
  coverPage: { padding: 60, alignItems: "center", justifyContent: "center" },
  coverLogo: { width: 100, height: 87, marginBottom: 24 },
  coverTitle: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#1B4332", marginBottom: 8, textAlign: "center" },
  coverSubtitle: { fontSize: 12, color: "#57534e", marginBottom: 4, textAlign: "center" },
  coverBadge: { fontSize: 10, color: "#C4633A", marginTop: 16, textAlign: "center" },
  pageHeader: { fontSize: 9, color: "#a8a29e", marginBottom: 16, textAlign: "right" },
  sommaireTitle: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#1B4332", marginBottom: 16 },
  sommaireItem: { fontSize: 11, marginBottom: 6, color: "#1A1A1A" },
  sectionTitle: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#C4633A", marginBottom: 10 },
  blockTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#A54F2C", textTransform: "uppercase", marginBottom: 6, marginTop: 4 },
  label: { fontSize: 8, color: "#78716c" },
  value: { fontSize: 10, color: "#1A1A1A" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  divider: { borderBottomWidth: 1, borderBottomColor: "#EFEAE3", marginVertical: 10 },
  barRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  barLabel: { width: 24, fontSize: 8, color: "#78716c" },
  barTrack: { flex: 1, height: 6, backgroundColor: "#EFEAE3", marginHorizontal: 6 },
  barFill: { height: 6, backgroundColor: "#C4633A" },
  barCount: { width: 16, fontSize: 8, color: "#78716c", textAlign: "right" },
  emptyText: { fontSize: 9, color: "#a8a29e", fontStyle: "italic" },
});

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{String(value)}</Text>
    </View>
  );
}

function ManualText({ label, value }: { label: string; value?: string }) {
  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value && value.trim() ? value : "—"}</Text>
    </View>
  );
}

function sectionBody(sectionKey: string, trip: Trip, report: TripReport) {
  const manual = report.manual;
  switch (sectionKey) {
    case "INFOS_GENERALES": {
      const info = getTripGeneralInfo(trip);
      return (
        <>
          <Row label="Circuit" value={info.circuitName} />
          <Row label="Dates" value={`${formatDate(info.startDate)} → ${formatDate(info.endDate)}`} />
          <Row label="Participants" value={info.participantCount} />
          <Row label="Guide" value={info.guideName ?? "—"} />
          <View style={styles.divider} />
          <ManualText label="Rédacteur" value={manual.redacteur} />
          <ManualText label="Date de rédaction" value={manual.dateRedaction ? formatDate(manual.dateRedaction) : undefined} />
        </>
      );
    }
    case "CAMPAGNE_COMMUNICATION":
      return (
        <>
          <ManualText label="Canaux de communication" value={manual.canauxCommunication} />
          <ManualText label="Budget communication" value={manual.budgetCommunication} />
          <ManualText label="Résultats de la campagne" value={manual.resultatsCampagne} />
        </>
      );
    case "INSCRIPTIONS_PARTICIPANTS": {
      const stats = getRegistrationStats(trip);
      return (
        <>
          <Row label="Inscrits" value={stats.inscrits} />
          <Row label="Total encaissé" value={formatXOF(stats.totalPaid)} />
          <View style={styles.divider} />
          <ManualText label="Désistements" value={manual.desistements} />
          <ManualText label="Raisons des désistements" value={manual.raisonsDesistement} />
        </>
      );
    }
    case "PREPARATIFS_DOCUMENTS": {
      const summary = getPreDepartureTasksSummary(trip.id);
      return (
        <>
          <Row label="Taux de complétion" value={`${summary.completionRate}% (${summary.done}/${summary.total})`} />
          <View style={styles.divider} />
          <ManualText label="Appréciation des préparatifs" value={manual.appreciationPreparatifs} />
          <ManualText label="Statut visa" value={manual.statutVisa} />
        </>
      );
    }
    case "BILLETTERIE_AERIENNE":
      return (
        <>
          <ManualText label="Compagnie aérienne" value={manual.compagnieAerienne} />
          <ManualText label="Référence billet" value={manual.referenceBillet} />
          <ManualText label="Notes billetterie" value={manual.notesBilletterie} />
        </>
      );
    case "ARRIVEE_DESTINATION":
      return (
        <>
          <ManualText label="Date et heure d'arrivée" value={manual.dateHeureArrivee} />
          <ManualText label="Accueil par" value={manual.accueilPar} />
          <ManualText label="Incidents à l'arrivée" value={manual.incidentsArrivee} />
        </>
      );
    case "HEBERGEMENT": {
      const suppliers = getSupplierInvolvement(trip.id, "HEBERGEMENT");
      return (
        <>
          <Text style={styles.blockTitle}>Fournisseurs</Text>
          {suppliers.length === 0 ? (
            <Text style={styles.emptyText}>Aucun fournisseur lié.</Text>
          ) : (
            suppliers.map((s) => <Text key={s.id} style={styles.value}>{s.name}</Text>)
          )}
          <View style={styles.divider} />
          <ManualText label="Qualité perçue" value={manual.qualitePerçueHebergement ? `${manual.qualitePerçueHebergement}/5` : undefined} />
          <ManualText label="Notes hébergement" value={manual.notesHebergement} />
        </>
      );
    }
    case "RESTAURATION":
      return <ManualText label="Notes restauration" value={manual.notesRestauration} />;
    case "DEPLACEMENTS": {
      const suppliers = getSupplierInvolvement(trip.id, "TRANSPORT");
      return (
        <>
          <Text style={styles.blockTitle}>Fournisseurs</Text>
          {suppliers.length === 0 ? (
            <Text style={styles.emptyText}>Aucun fournisseur lié.</Text>
          ) : (
            suppliers.map((s) => <Text key={s.id} style={styles.value}>{s.name}</Text>)
          )}
          <View style={styles.divider} />
          <ManualText label="Fiabilité" value={manual.fiabiliteTransport ? `${manual.fiabiliteTransport}/5` : undefined} />
          <ManualText label="Incidents transport" value={manual.incidentsTransport} />
        </>
      );
    }
    case "PROGRAMME_ACTIVITES": {
      const { prevu, reel } = getItineraryVsActual(trip);
      return (
        <>
          <Text style={styles.blockTitle}>Programme prévu</Text>
          {prevu.length === 0 ? (
            <Text style={styles.emptyText}>Aucun itinéraire type disponible.</Text>
          ) : (
            prevu.map((d) => <Text key={d.id} style={styles.value}>J{d.day}. {d.title}</Text>)
          )}
          <Text style={[styles.blockTitle, { marginTop: 10 }]}>Déroulé réel</Text>
          {reel.length === 0 ? (
            <Text style={styles.emptyText}>Aucune mise à jour publiée pendant le voyage.</Text>
          ) : (
            reel.map((u) => <Text key={u.id} style={styles.value}>{formatDate(u.createdAt)} — {u.message}</Text>)
          )}
          <View style={styles.divider} />
          <ManualText label="Écarts par rapport au programme prévu" value={manual.ecartsProgramme} />
        </>
      );
    }
    case "ENCADREMENT": {
      const stats = getGuideEngagementStats(trip);
      return (
        <>
          <Row label="Guide" value={stats.guideName ?? "—"} />
          <Row label="Mises à jour publiées" value={stats.updatesCount} />
          <View style={styles.divider} />
          <ManualText label="Appréciation de l'encadrement" value={manual.appreciationEncadrement} />
        </>
      );
    }
    case "RETOUR_SOUVENIRS":
      return <ManualText label="Commentaire" value={manual.commentaireSouvenirs} />;
    case "SATISFACTION_AVIS": {
      const agg = getFeedbackAggregation(trip);
      return (
        <>
          <Row label="Note moyenne" value={agg.feedbacks.length > 0 ? agg.avg.toFixed(1) : "—"} />
          <Row label="Nombre d'avis" value={agg.feedbacks.length} />
          {agg.distribution
            .slice()
            .reverse()
            .map((d) => (
              <View key={d.star} style={styles.barRow}>
                <Text style={styles.barLabel}>{d.star}★</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: agg.feedbacks.length > 0 ? `${(d.count / agg.feedbacks.length) * 100}%` : "0%" }]} />
                </View>
                <Text style={styles.barCount}>{d.count}</Text>
              </View>
            ))}
          <View style={styles.divider} />
          <ManualText label="Synthèse de satisfaction" value={manual.syntheseSatisfaction} />
          <ManualText label="Réclamations" value={manual.reclamations} />
        </>
      );
    }
    case "BILAN_FINANCIER": {
      const summary = getFinancialSummary(trip);
      return (
        <>
          <Row label="Budget prévu" value={formatXOF(summary.budgetPrevu)} />
          <Row label="Encaissé" value={formatXOF(summary.encaisse)} />
          <Row label="Impayé" value={formatXOF(summary.impaye)} />
          <View style={styles.divider} />
          <ManualText label="Analyse des écarts financiers" value={manual.analyseEcartsFinanciers} />
        </>
      );
    }
    case "RECOMMANDATIONS":
      return <ManualText label="Recommandations pour les prochains voyages" value={manual.recommandations} />;
    default:
      return null;
  }
}

function TripReportPdfDocument({ trip, report, logoUrl }: { trip: Trip; report: TripReport; logoUrl: string }) {
  const info = getTripGeneralInfo(trip);
  return (
    <Document>
      <Page size="A4" style={styles.coverPage}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image src={logoUrl} style={styles.coverLogo} />
        <Text style={styles.coverTitle}>Rapport de voyage</Text>
        <Text style={styles.coverSubtitle}>{info.circuitName}</Text>
        <Text style={styles.coverSubtitle}>{formatDate(info.startDate)} au {formatDate(info.endDate)}</Text>
        <Text style={styles.coverBadge}>{report.status === "FINALIZED" ? "Rapport finalisé" : "Rapport en brouillon"}</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sommaireTitle}>Sommaire</Text>
        {REPORT_SECTIONS.map((s) => (
          <Text key={s.key} style={styles.sommaireItem}>{s.title}</Text>
        ))}
      </Page>

      {REPORT_SECTIONS.map((s) => (
        <Page key={s.key} size="A4" style={styles.page}>
          <Text style={styles.pageHeader}>{info.circuitName} — Rapport de voyage</Text>
          <Text style={styles.sectionTitle}>{s.title}</Text>
          {sectionBody(s.key, trip, report)}
        </Page>
      ))}
    </Document>
  );
}

export async function downloadTripReportPdf({ trip, report }: { trip: Trip; report: TripReport }) {
  const logoUrl = `${window.location.origin}/nomad-logo.jpg`;
  const blob = await pdf(<TripReportPdfDocument trip={trip} report={report} logoUrl={logoUrl} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `rapport-voyage-${trip.id}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
