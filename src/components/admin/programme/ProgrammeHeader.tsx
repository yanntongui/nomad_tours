"use client";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationsBell } from "@/components/admin/programme/NotificationsBell";
import { SalesOpeningRecommendation } from "@/lib/admin/programme-annuel";

export function ProgrammeHeader({
  onExportPng,
  onExportPdf,
  exporting,
  recommendations,
  atRiskCount,
  onViewRisk,
}: {
  onExportPng: () => void;
  onExportPdf: () => void;
  exporting: boolean;
  recommendations: SalesOpeningRecommendation[];
  atRiskCount: number;
  onViewRisk: () => void;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-stone-900 dark:text-stone-100">Programme annuel</h1>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Vue d&apos;ensemble des départs de circuits sur l&apos;année, pour repérer les mois creux et préparer vos campagnes.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={exporting}>
              {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
              Exporter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={onExportPng}>Image (PNG)</DropdownMenuItem>
            <DropdownMenuItem onSelect={onExportPdf}>Document (PDF)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <NotificationsBell recommendations={recommendations} atRiskCount={atRiskCount} onViewRisk={onViewRisk} />
      </div>
    </div>
  );
}
