"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileDown, FileText, Lock, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { KpiCard } from "@/components/admin/KpiCard";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { RequireRole } from "@/components/admin/RequireRole";
import { ReportSectionNav } from "@/components/admin/reports/ReportSectionNav";
import { REPORT_SECTIONS, computeSectionCompletion } from "@/lib/admin/reports/section-defs";
import { useAdminRole } from "@/context/AdminRoleContext";
import {
  useTrips,
  useTripReport,
  useTripPhotos,
  useReportActionItems,
  ensureTripReport,
  updateReportSection,
  finalizeReport,
  addReportActionItems,
  toggleReportActionItem,
  getTripGeneralInfo,
  getRegistrationStats,
  getPreDepartureTasksSummary,
  getSupplierInvolvement,
  getItineraryVsActual,
  getGuideEngagementStats,
  getFeedbackAggregation,
  getFinancialSummary,
} from "@/lib/admin/store/trips-store";
import { Trip, TripReport, TripReportManualFields, TripReportSectionKey } from "@/lib/admin/types";
import { downloadTripReportPdf } from "@/components/admin/reports/TripReportPdf";
import { downloadTripReportDocx } from "@/lib/admin/reports/tripReportDocx";

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}
function formatXOF(n: number) {
  return `${n.toLocaleString("fr-FR")} FCFA`;
}

function Field({
  label,
  value,
  onCommit,
  disabled,
  multiline,
  type = "text",
}: {
  label: string;
  value: string;
  onCommit: (value: string) => void;
  disabled?: boolean;
  multiline?: boolean;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {multiline ? (
        <Textarea
          rows={3}
          defaultValue={value}
          disabled={disabled}
          onBlur={(e) => e.target.value !== value && onCommit(e.target.value)}
        />
      ) : (
        <Input
          type={type}
          defaultValue={value}
          disabled={disabled}
          onBlur={(e) => e.target.value !== value && onCommit(e.target.value)}
        />
      )}
    </div>
  );
}

function RatingField({
  label,
  value,
  onCommit,
  disabled,
}: {
  label: string;
  value: number | undefined;
  onCommit: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onClick={() => onCommit(i + 1)}
            className="disabled:cursor-not-allowed"
          >
            <Star className={`h-5 w-5 ${i < (value ?? 0) ? "fill-amber-400 text-amber-400" : "text-stone-200 dark:text-stone-700"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

function AutoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-luxe-terracotta/20 bg-luxe-terracotta/5 p-3 space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-luxe-terracotta-dark dark:text-luxe-terracotta">{title}</p>
      {children}
    </div>
  );
}

function Dl({ items }: { items: { label: string; value: React.ReactNode }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
      {items.map((item) => (
        <div key={item.label} className="col-span-1">
          <dt className="text-xs text-stone-400 dark:text-stone-500">{item.label}</dt>
          <dd className="text-stone-800 dark:text-stone-100">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function SectionContent({
  sectionKey,
  trip,
  report,
  disabled,
  onManualCommit,
}: {
  sectionKey: TripReportSectionKey;
  trip: Trip;
  report: TripReport;
  disabled: boolean;
  onManualCommit: (patch: Partial<TripReportManualFields>) => void;
}) {
  const manual = report.manual;
  const photos = useTripPhotos(trip.id);
  const actionItems = useReportActionItems(report.id);
  const [newAction, setNewAction] = React.useState("");

  switch (sectionKey) {
    case "INFOS_GENERALES": {
      const info = getTripGeneralInfo(trip);
      return (
        <div className="space-y-4">
          <AutoBlock title="Données automatiques">
            <Dl
              items={[
                { label: "Circuit", value: info.circuitName },
                { label: "Dates", value: `${formatDate(info.startDate)} → ${formatDate(info.endDate)}` },
                { label: "Participants", value: info.participantCount },
                { label: "Guide", value: info.guideName ?? "—" },
              ]}
            />
          </AutoBlock>
          <Field label="Rédacteur du rapport" value={manual.redacteur ?? ""} disabled={disabled} onCommit={(v) => onManualCommit({ redacteur: v })} />
          <Field label="Date de rédaction" type="date" value={manual.dateRedaction ?? ""} disabled={disabled} onCommit={(v) => onManualCommit({ dateRedaction: v })} />
        </div>
      );
    }
    case "CAMPAGNE_COMMUNICATION":
      return (
        <div className="space-y-4">
          <Field label="Canaux de communication utilisés" value={manual.canauxCommunication ?? ""} disabled={disabled} onCommit={(v) => onManualCommit({ canauxCommunication: v })} />
          <Field label="Budget communication" value={manual.budgetCommunication ?? ""} disabled={disabled} onCommit={(v) => onManualCommit({ budgetCommunication: v })} />
          <Field label="Résultats de la campagne" multiline value={manual.resultatsCampagne ?? ""} disabled={disabled} onCommit={(v) => onManualCommit({ resultatsCampagne: v })} />
        </div>
      );
    case "INSCRIPTIONS_PARTICIPANTS": {
      const stats = getRegistrationStats(trip);
      return (
        <div className="space-y-4">
          <AutoBlock title="Données automatiques">
            <Dl
              items={[
                { label: "Inscrits", value: stats.inscrits },
                { label: "Total encaissé", value: formatXOF(stats.totalPaid) },
              ]}
            />
            {stats.historiquePaiements.length > 0 && (
              <div className="space-y-1 border-t border-luxe-terracotta/10 pt-2">
                {stats.historiquePaiements.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
                    <span>{formatDate(p.paidAt ?? p.createdAt)} · {p.method}</span>
                    <span className="font-medium">{formatXOF(p.amountXOF)}</span>
                  </div>
                ))}
              </div>
            )}
          </AutoBlock>
          <Field label="Désistements" value={manual.desistements ?? ""} disabled={disabled} onCommit={(v) => onManualCommit({ desistements: v })} />
          <Field label="Raisons des désistements" multiline value={manual.raisonsDesistement ?? ""} disabled={disabled} onCommit={(v) => onManualCommit({ raisonsDesistement: v })} />
        </div>
      );
    }
    case "PREPARATIFS_DOCUMENTS": {
      const summary = getPreDepartureTasksSummary(trip.id);
      return (
        <div className="space-y-4">
          <AutoBlock title="Données automatiques">
            <Dl items={[{ label: "Taux de complétion", value: `${summary.completionRate}% (${summary.done}/${summary.total})` }]} />
            {summary.tasks.length > 0 && (
              <div className="space-y-1 border-t border-luxe-terracotta/10 pt-2">
                {summary.tasks.map((t) => (
                  <div key={t.id} className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
                    <span>{t.title}</span>
                    <StatusBadge status={t.status} />
                  </div>
                ))}
              </div>
            )}
          </AutoBlock>
          <Field label="Appréciation des préparatifs" multiline value={manual.appreciationPreparatifs ?? ""} disabled={disabled} onCommit={(v) => onManualCommit({ appreciationPreparatifs: v })} />
          <Field label="Statut visa" value={manual.statutVisa ?? ""} disabled={disabled} onCommit={(v) => onManualCommit({ statutVisa: v })} />
        </div>
      );
    }
    case "BILLETTERIE_AERIENNE":
      return (
        <div className="space-y-4">
          <Field label="Compagnie aérienne" value={manual.compagnieAerienne ?? ""} disabled={disabled} onCommit={(v) => onManualCommit({ compagnieAerienne: v })} />
          <Field label="Référence billet" value={manual.referenceBillet ?? ""} disabled={disabled} onCommit={(v) => onManualCommit({ referenceBillet: v })} />
          <Field label="Notes billetterie" multiline value={manual.notesBilletterie ?? ""} disabled={disabled} onCommit={(v) => onManualCommit({ notesBilletterie: v })} />
        </div>
      );
    case "ARRIVEE_DESTINATION":
      return (
        <div className="space-y-4">
          <Field label="Date et heure d'arrivée" value={manual.dateHeureArrivee ?? ""} disabled={disabled} onCommit={(v) => onManualCommit({ dateHeureArrivee: v })} />
          <Field label="Accueil par" value={manual.accueilPar ?? ""} disabled={disabled} onCommit={(v) => onManualCommit({ accueilPar: v })} />
          <Field label="Incidents à l'arrivée" multiline value={manual.incidentsArrivee ?? ""} disabled={disabled} onCommit={(v) => onManualCommit({ incidentsArrivee: v })} />
        </div>
      );
    case "HEBERGEMENT": {
      const suppliers = getSupplierInvolvement(trip.id, "HEBERGEMENT");
      return (
        <div className="space-y-4">
          <AutoBlock title="Fournisseurs hébergement">
            {suppliers.length === 0 ? (
              <p className="text-xs text-stone-500 dark:text-stone-400">Aucun fournisseur lié.</p>
            ) : (
              suppliers.map((s) => (
                <p key={s.id} className="text-sm text-stone-700 dark:text-stone-300">
                  {s.name} {s.contactName ? `— ${s.contactName}` : ""}
                </p>
              ))
            )}
          </AutoBlock>
          <RatingField label="Qualité perçue" value={manual.qualitePerçueHebergement} disabled={disabled} onCommit={(v) => onManualCommit({ qualitePerçueHebergement: v })} />
          <Field label="Notes hébergement" multiline value={manual.notesHebergement ?? ""} disabled={disabled} onCommit={(v) => onManualCommit({ notesHebergement: v })} />
        </div>
      );
    }
    case "RESTAURATION":
      return (
        <div className="space-y-4">
          <Field label="Notes restauration" multiline value={manual.notesRestauration ?? ""} disabled={disabled} onCommit={(v) => onManualCommit({ notesRestauration: v })} />
        </div>
      );
    case "DEPLACEMENTS": {
      const suppliers = getSupplierInvolvement(trip.id, "TRANSPORT");
      return (
        <div className="space-y-4">
          <AutoBlock title="Fournisseurs transport">
            {suppliers.length === 0 ? (
              <p className="text-xs text-stone-500 dark:text-stone-400">Aucun fournisseur lié.</p>
            ) : (
              suppliers.map((s) => (
                <p key={s.id} className="text-sm text-stone-700 dark:text-stone-300">
                  {s.name} {s.contactName ? `— ${s.contactName}` : ""}
                </p>
              ))
            )}
          </AutoBlock>
          <RatingField label="Fiabilité" value={manual.fiabiliteTransport} disabled={disabled} onCommit={(v) => onManualCommit({ fiabiliteTransport: v })} />
          <Field label="Incidents transport" multiline value={manual.incidentsTransport ?? ""} disabled={disabled} onCommit={(v) => onManualCommit({ incidentsTransport: v })} />
        </div>
      );
    }
    case "PROGRAMME_ACTIVITES": {
      const { prevu, reel } = getItineraryVsActual(trip);
      return (
        <div className="space-y-4">
          <AutoBlock title="Programme prévu (itinéraire du circuit)">
            {prevu.length === 0 ? (
              <p className="text-xs text-stone-500 dark:text-stone-400">Aucun itinéraire type disponible.</p>
            ) : (
              <ul className="space-y-1 text-sm text-stone-700 dark:text-stone-300">
                {prevu.map((d) => (
                  <li key={d.id}>
                    <span className="font-medium">J{d.day}.</span> {d.title}
                  </li>
                ))}
              </ul>
            )}
          </AutoBlock>
          <AutoBlock title="Déroulé réel (mises à jour terrain)">
            {reel.length === 0 ? (
              <p className="text-xs text-stone-500 dark:text-stone-400">Aucune mise à jour publiée pendant le voyage.</p>
            ) : (
              <ul className="space-y-1 text-sm text-stone-700 dark:text-stone-300">
                {reel.map((u) => (
                  <li key={u.id}>{formatDate(u.createdAt)} — {u.message}</li>
                ))}
              </ul>
            )}
          </AutoBlock>
          <Field label="Écarts par rapport au programme prévu" multiline value={manual.ecartsProgramme ?? ""} disabled={disabled} onCommit={(v) => onManualCommit({ ecartsProgramme: v })} />
        </div>
      );
    }
    case "ENCADREMENT": {
      const stats = getGuideEngagementStats(trip);
      return (
        <div className="space-y-4">
          <AutoBlock title="Données automatiques">
            <Dl items={[{ label: "Guide", value: stats.guideName ?? "—" }, { label: "Mises à jour publiées", value: stats.updatesCount }]} />
          </AutoBlock>
          <Field label="Appréciation de l'encadrement" multiline value={manual.appreciationEncadrement ?? ""} disabled={disabled} onCommit={(v) => onManualCommit({ appreciationEncadrement: v })} />
        </div>
      );
    }
    case "RETOUR_SOUVENIRS":
      return (
        <div className="space-y-4">
          <AutoBlock title="Données automatiques">
            <Dl items={[{ label: "Photos dans l'album", value: photos.length }]} />
          </AutoBlock>
          <Field label="Commentaire" multiline value={manual.commentaireSouvenirs ?? ""} disabled={disabled} onCommit={(v) => onManualCommit({ commentaireSouvenirs: v })} />
        </div>
      );
    case "SATISFACTION_AVIS": {
      const agg = getFeedbackAggregation(trip);
      return (
        <div className="space-y-4">
          <AutoBlock title="Données automatiques">
            <Dl items={[{ label: "Note moyenne", value: agg.feedbacks.length > 0 ? agg.avg.toFixed(1) : "—" }, { label: "Nombre d'avis", value: agg.feedbacks.length }]} />
            <div className="space-y-1 border-t border-luxe-terracotta/10 pt-2">
              {agg.distribution
                .slice()
                .reverse()
                .map((d) => (
                  <div key={d.star} className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
                    <span className="w-6">{d.star}★</span>
                    <div className="h-1.5 flex-1 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                      <div
                        className="h-full bg-luxe-terracotta"
                        style={{ width: agg.feedbacks.length > 0 ? `${(d.count / agg.feedbacks.length) * 100}%` : "0%" }}
                      />
                    </div>
                    <span className="w-4 text-right">{d.count}</span>
                  </div>
                ))}
            </div>
          </AutoBlock>
          <Field label="Synthèse de satisfaction" multiline value={manual.syntheseSatisfaction ?? ""} disabled={disabled} onCommit={(v) => onManualCommit({ syntheseSatisfaction: v })} />
          <Field label="Réclamations" multiline value={manual.reclamations ?? ""} disabled={disabled} onCommit={(v) => onManualCommit({ reclamations: v })} />
        </div>
      );
    }
    case "BILAN_FINANCIER": {
      const summary = getFinancialSummary(trip);
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <KpiCard compact label="Budget prévu" value={formatXOF(summary.budgetPrevu)} icon={FileText} />
            <KpiCard compact label="Encaissé" value={formatXOF(summary.encaisse)} icon={FileText} />
            <KpiCard compact label="Impayé" value={formatXOF(summary.impaye)} icon={FileText} />
          </div>
          <Field label="Analyse des écarts financiers" multiline value={manual.analyseEcartsFinanciers ?? ""} disabled={disabled} onCommit={(v) => onManualCommit({ analyseEcartsFinanciers: v })} />
        </div>
      );
    }
    case "RECOMMANDATIONS":
      return (
        <div className="space-y-4">
          <Field label="Recommandations pour les prochains voyages" multiline value={manual.recommandations ?? ""} disabled={disabled} onCommit={(v) => onManualCommit({ recommandations: v })} />
          <div className="space-y-2 border-t border-stone-100 pt-3 dark:border-stone-800">
            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">Tâches d&apos;amélioration</p>
            {actionItems.map((item) => (
              <label key={item.id} className="flex items-center gap-2.5 text-sm text-stone-700 cursor-pointer dark:text-stone-300">
                <Checkbox checked={item.done} onCheckedChange={() => toggleReportActionItem(item.id)} disabled={disabled} />
                <span className={item.done ? "line-through text-stone-400 dark:text-stone-500" : ""}>{item.label}</span>
              </label>
            ))}
            {!disabled && (
              <div className="flex gap-2">
                <Input value={newAction} onChange={(e) => setNewAction(e.target.value)} placeholder="Nouvelle tâche d'amélioration..." />
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!newAction.trim()}
                  onClick={() => {
                    addReportActionItems(report.id, [newAction]);
                    setNewAction("");
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Créer les tâches d&apos;amélioration
                </Button>
              </div>
            )}
          </div>
        </div>
      );
    default:
      return null;
  }
}

function TripReportEditor({ tripId }: { tripId: string }) {
  const router = useRouter();
  const { user } = useAdminRole();
  const trips = useTrips();
  const trip = trips.find((t) => t.id === tripId);
  const report = useTripReport(tripId);
  const [activeKey, setActiveKey] = React.useState<TripReportSectionKey>("INFOS_GENERALES");
  const [finalizeOpen, setFinalizeOpen] = React.useState(false);
  const [exporting, setExporting] = React.useState<"pdf" | "docx" | null>(null);

  React.useEffect(() => {
    if (trip && trip.status === "COMPLETED") ensureTripReport(tripId);
  }, [trip, tripId]);

  if (!trip) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-10 text-center dark:border-stone-800 dark:bg-stone-900">
        <p className="text-stone-500 dark:text-stone-400">Voyage introuvable.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/admin/voyages"><ArrowLeft className="h-4 w-4" />Retour à la liste</Link>
        </Button>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/voyages/${trip.id}`)}>
          <ArrowLeft className="h-4 w-4" />Retour au voyage
        </Button>
        <div className="rounded-xl border border-stone-200 bg-white p-10 text-center dark:border-stone-800 dark:bg-stone-900">
          <p className="text-stone-500 dark:text-stone-400">
            Le rapport de voyage sera disponible une fois le voyage clôturé.
          </p>
        </div>
      </div>
    );
  }

  const finalized = report.status === "FINALIZED";
  const completions = REPORT_SECTIONS.map((s) => computeSectionCompletion(s, report.manual));
  const completeCount = completions.filter((c) => c === "COMPLETE").length;
  const progress = Math.round((completeCount / REPORT_SECTIONS.length) * 100);
  const activeSection = REPORT_SECTIONS.find((s) => s.key === activeKey)!;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/voyages/${trip.id}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-stone-800 dark:text-stone-100">Rapport de voyage — {trip.title}</h1>
            <StatusBadge status={report.status} label={finalized ? "Finalisé" : "Brouillon"} />
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400">{formatDate(trip.startDate)} au {formatDate(trip.endDate)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={exporting !== null}
            onClick={async () => {
              setExporting("pdf");
              try {
                await downloadTripReportPdf({ trip, report });
              } finally {
                setExporting(null);
              }
            }}
          >
            <FileDown className="h-3.5 w-3.5" />
            Exporter en PDF
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={exporting !== null}
            onClick={async () => {
              setExporting("docx");
              try {
                await downloadTripReportDocx({ trip, report });
              } finally {
                setExporting(null);
              }
            }}
          >
            <FileText className="h-3.5 w-3.5" />
            Exporter en Word
          </Button>
          {!finalized && (
            <Button size="sm" onClick={() => setFinalizeOpen(true)}>
              <Lock className="h-3.5 w-3.5" />
              Marquer comme finalisé
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
        <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5 dark:text-stone-400">
          <span>Progression du rapport</span>
          <span>{completeCount}/{REPORT_SECTIONS.length} rubriques complètes</span>
        </div>
        <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden dark:bg-stone-800">
          <div className="h-full bg-luxe-terracotta" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
        <div className="rounded-xl border border-stone-200 bg-white p-2 dark:border-stone-800 dark:bg-stone-900 lg:sticky lg:top-4 lg:self-start">
          <ReportSectionNav
            sections={REPORT_SECTIONS}
            activeKey={activeKey}
            onSelect={setActiveKey}
            statusFor={(key) => {
              const def = REPORT_SECTIONS.find((s) => s.key === key)!;
              return computeSectionCompletion(def, report.manual);
            }}
          />
        </div>

        <Card>
          <CardHeader><CardTitle className="text-sm">{activeSection.title}</CardTitle></CardHeader>
          <CardContent>
            <SectionContent
              sectionKey={activeKey}
              trip={trip}
              report={report}
              disabled={finalized}
              onManualCommit={(patch) => updateReportSection(trip.id, patch)}
            />
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={finalizeOpen}
        onOpenChange={setFinalizeOpen}
        title="Marquer ce rapport comme finalisé ?"
        description="Une fois finalisé, les champs manuels ne seront plus modifiables."
        confirmLabel="Finaliser"
        onConfirm={() => finalizeReport(trip.id, user.name)}
      />
    </div>
  );
}

export default function TripReportPage({ params }: { params: { id: string } }) {
  return (
    <RequireRole allowed={["SUPER_ADMIN", "AGENT"]}>
      <TripReportEditor tripId={params.id} />
    </RequireRole>
  );
}
