"use client";
import * as React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell } from "recharts";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemporalStatus } from "@/lib/admin/programme-annuel";

const STATUS_COLOR: Record<TemporalStatus, string> = {
  PAST: "#A8A29E",
  CURRENT: "#C4633A",
  UPCOMING: "#E8B9A2",
};

export interface DensityChartDatum {
  monthIndex: number;
  label: string;
  count: number;
  prevCount: number;
  status: TemporalStatus;
  inWindow: boolean;
}

export function DensityChart({
  data,
  currentMonth,
  compareYoY,
  onMonthClick,
}: {
  data: DensityChartDatum[];
  currentMonth: number;
  compareYoY: boolean;
  onMonthClick: (monthIndex: number) => void;
}) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const currentLabel = data[currentMonth]?.label ?? "";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Densité des départs par mois</CardTitle>
      </CardHeader>
      <CardContent className="h-80 pl-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            onMouseLeave={() => setHovered(null)}
          >
            <defs>
              <pattern id="prevYearHatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                <rect width="6" height="6" fill="#D6D3D1" opacity={0.35} />
                <line x1="0" y1="0" x2="0" y2="6" stroke="#78716C" strokeWidth="2" />
              </pattern>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#EFEAE3" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#78716c" }} axisLine={{ stroke: "#E7E2DA" }} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#78716c" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
              formatter={(value: any, name: any) => [value, name === "prevCount" ? "Année précédente" : "Départs"] as [number, string]}
            />
            <ReferenceLine
              x={currentLabel}
              stroke="#C4633A"
              strokeDasharray="4 4"
              label={{ value: "Aujourd'hui", position: "top", fontSize: 11, fill: "#C4633A" }}
            />
            {compareYoY && (
              <Bar dataKey="prevCount" name="prevCount" fill="url(#prevYearHatch)" radius={[4, 4, 0, 0]} barSize={14} />
            )}
            <Bar
              dataKey="count"
              name="count"
              radius={[4, 4, 0, 0]}
              onClick={(entry: any) => onMonthClick(entry.monthIndex)}
              onMouseEnter={(entry: any) => setHovered(entry.monthIndex)}
              style={{ cursor: "pointer" }}
            >
              {data.map((d) => (
                <Cell
                  key={d.monthIndex}
                  fill={STATUS_COLOR[d.status]}
                  fillOpacity={hovered === d.monthIndex ? 0.8 : 1}
                  stroke={d.inWindow ? "#1C1917" : "transparent"}
                  strokeWidth={d.inWindow ? 1.5 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function buildDensityData(
  buckets: Map<number, { date: string }[]>,
  prevYearCounts: number[],
  currentMonth: number,
  windowMonths: number[],
  year: number
): DensityChartDatum[] {
  const windowSet = new Set(windowMonths);
  return Array.from({ length: 12 }, (_, m) => {
    const status: TemporalStatus = m < currentMonth ? "PAST" : m === currentMonth ? "CURRENT" : "UPCOMING";
    return {
      monthIndex: m,
      label: format(new Date(year, m, 1), "MMM", { locale: fr }),
      count: buckets.get(m)?.length ?? 0,
      prevCount: prevYearCounts[m] ?? 0,
      status,
      inWindow: windowSet.has(m),
    };
  });
}
