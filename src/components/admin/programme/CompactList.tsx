import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DepartureWithCircuit, TemporalStatus, computeFillRate, getTemporalStatus } from "@/lib/admin/programme-annuel";

const STATUS_LABEL: Record<TemporalStatus, { label: string; className: string }> = {
  PAST: { label: "Terminé", className: "bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400" },
  CURRENT: { label: "En cours", className: "bg-luxe-terracotta/10 text-luxe-terracotta-dark dark:text-luxe-terracotta" },
  UPCOMING: { label: "À venir", className: "bg-stone-900/5 text-stone-900 dark:bg-white/10 dark:text-stone-100" },
};

export function CompactList({ departures, now }: { departures: DepartureWithCircuit[]; now: Date }) {
  const sorted = [...departures].sort((a, b) => a.date.localeCompare(b.date));

  if (sorted.length === 0) {
    return <p className="py-10 text-center text-sm text-stone-400">Aucun départ pour cette période.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Circuit</TableHead>
          <TableHead>Destination</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Remplissage</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((d) => {
          const status = getTemporalStatus(new Date(d.date), now);
          const fillRate = Math.round(computeFillRate(d) * 100);
          const s = STATUS_LABEL[status];
          return (
            <TableRow key={d.id}>
              <TableCell className="whitespace-nowrap">{format(new Date(d.date), "d MMM yyyy", { locale: fr })}</TableCell>
              <TableCell className="font-medium text-stone-900 dark:text-stone-100">{d.circuit.title}</TableCell>
              <TableCell>{d.circuit.destinationName}</TableCell>
              <TableCell>
                <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", s.className)}>{s.label}</span>
              </TableCell>
              <TableCell>{fillRate}%</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
