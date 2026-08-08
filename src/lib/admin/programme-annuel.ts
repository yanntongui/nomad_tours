import { Circuit, CircuitCategory, CircuitDeparture } from "@/lib/admin/types";

export const CATEGORY_LABELS: Record<CircuitCategory, string> = {
  ESCAPADE_LOCALE: "Escapade locale",
  GRAND_CIRCUIT_BENIN: "Grand circuit Bénin",
  REGIONAL: "Régional",
  INTERNATIONAL: "International",
  EVENEMENTIEL: "Événementiel",
};

export type TemporalStatus = "PAST" | "CURRENT" | "UPCOMING";

export type DepartureWithCircuit = CircuitDeparture & { circuit: Circuit };

export function getAllDepartures(circuits: Circuit[]): DepartureWithCircuit[] {
  return circuits.flatMap((circuit) => circuit.departures.map((d) => ({ ...d, circuit })));
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getTemporalStatus(date: Date, now: Date): TemporalStatus {
  const day = startOfDay(date).getTime();
  const today = startOfDay(now).getTime();
  if (day < today) return "PAST";
  if (day > today) return "UPCOMING";
  return "CURRENT";
}

export function getMonthStatus(month: number, year: number, now: Date): TemporalStatus {
  if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth())) return "PAST";
  if (year === now.getFullYear() && month === now.getMonth()) return "CURRENT";
  return "UPCOMING";
}

export type Granularity = "ANNEE" | "SEMESTRE" | "TRIMESTRE" | "MOIS";

export function getWindowMonths(granularity: Granularity, selectedWindow: number): number[] {
  switch (granularity) {
    case "SEMESTRE":
      return Array.from({ length: 6 }, (_, i) => selectedWindow * 6 + i);
    case "TRIMESTRE":
      return Array.from({ length: 3 }, (_, i) => selectedWindow * 3 + i);
    case "MOIS":
      return [selectedWindow];
    case "ANNEE":
    default:
      return Array.from({ length: 12 }, (_, i) => i);
  }
}

export function bucketDeparturesByMonth(
  departures: DepartureWithCircuit[],
  year: number
): Map<number, DepartureWithCircuit[]> {
  const buckets = new Map<number, DepartureWithCircuit[]>();
  for (let m = 0; m < 12; m += 1) buckets.set(m, []);
  for (const dep of departures) {
    const date = new Date(dep.date);
    if (date.getFullYear() !== year) continue;
    buckets.get(date.getMonth())!.push(dep);
  }
  return buckets;
}

export function computeFillRate(departure: CircuitDeparture): number {
  if (departure.seatsTotal <= 0) return 0;
  return departure.seatsBooked / departure.seatsTotal;
}

export function getDaysUntil(dateStr: string, now: Date): number {
  const target = startOfDay(new Date(dateStr)).getTime();
  const today = startOfDay(now).getTime();
  return Math.round((target - today) / 86400000);
}

export interface RiskOptions {
  daysThreshold?: number;
  fillThreshold?: number;
}

export function isAtRisk(
  departure: CircuitDeparture,
  now: Date,
  { daysThreshold = 30, fillThreshold = 0.5 }: RiskOptions = {}
): boolean {
  const daysUntil = getDaysUntil(departure.date, now);
  if (daysUntil < 0 || daysUntil > daysThreshold) return false;
  if (departure.status === "COMPLET") return false;
  return computeFillRate(departure) < fillThreshold;
}

export interface YearKpis {
  total: number;
  completed: number;
  ongoing: number;
  upcoming: number;
  atRisk: number;
}

export function computeYearKpis(departures: DepartureWithCircuit[], now: Date, year: number): YearKpis {
  const inYear = departures.filter((d) => new Date(d.date).getFullYear() === year);
  let completed = 0;
  let ongoing = 0;
  let upcoming = 0;
  let atRisk = 0;
  for (const dep of inYear) {
    const status = getTemporalStatus(new Date(dep.date), now);
    if (status === "PAST") completed += 1;
    else if (status === "CURRENT") ongoing += 1;
    else upcoming += 1;
    if (isAtRisk(dep, now)) atRisk += 1;
  }
  return { total: inYear.length, completed, ongoing, upcoming, atRisk };
}

const SALES_OPENING_RULES: Record<CircuitCategory, number> = {
  EVENEMENTIEL: 4,
  INTERNATIONAL: 4,
  REGIONAL: 3,
  GRAND_CIRCUIT_BENIN: 2,
  ESCAPADE_LOCALE: 1,
};

export interface SalesOpeningRecommendation {
  departure: DepartureWithCircuit;
  monthsBefore: number;
}

export function getSalesOpeningRecommendations(
  departures: DepartureWithCircuit[],
  now: Date
): SalesOpeningRecommendation[] {
  const recommendations: SalesOpeningRecommendation[] = [];
  for (const dep of departures) {
    const monthsBefore = SALES_OPENING_RULES[dep.circuit.category];
    const daysUntil = getDaysUntil(dep.date, now);
    const windowDays = monthsBefore * 30;
    if (daysUntil >= 0 && daysUntil <= windowDays && computeFillRate(dep) < 0.2) {
      recommendations.push({ departure: dep, monthsBefore });
    }
  }
  return recommendations;
}

/** Synthetic N-1 comparison — no real historical data exists, so counts are seeded from this year's data. */
export function getPreviousYearComparison(departures: DepartureWithCircuit[], year: number): number[] {
  const buckets = bucketDeparturesByMonth(departures, year);
  return Array.from({ length: 12 }, (_, m) => {
    const count = buckets.get(m)?.length ?? 0;
    const seed = (m * 31 + count * 17) % 7;
    const factor = 0.7 + seed / 10;
    return Math.max(0, Math.round(count * factor));
  });
}
