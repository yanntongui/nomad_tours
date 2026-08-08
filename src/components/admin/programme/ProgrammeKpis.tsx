import { CalendarCheck2, CheckCircle2, PlayCircle, Hourglass, AlertTriangle } from "lucide-react";
import { KpiCard } from "@/components/admin/KpiCard";
import { YearKpis } from "@/lib/admin/programme-annuel";

export function ProgrammeKpis({ kpis }: { kpis: YearKpis }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <KpiCard label="Départs programmés" value={String(kpis.total)} icon={CalendarCheck2} helper="cette année" />
      <KpiCard label="Réalisés" value={String(kpis.completed)} icon={CheckCircle2} helper="déjà effectués" />
      <KpiCard label="En cours" value={String(kpis.ongoing)} icon={PlayCircle} helper="ce mois-ci" />
      <KpiCard label="À venir" value={String(kpis.upcoming)} icon={Hourglass} helper="restants" />
      <KpiCard label="Départs à risque" value={String(kpis.atRisk)} icon={AlertTriangle} helper="remplissage faible" />
    </div>
  );
}
