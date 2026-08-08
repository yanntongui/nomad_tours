"use client";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { TripReportSectionDef, SectionCompletionStatus } from "@/lib/admin/reports/section-defs";
import { TripReportSectionKey } from "@/lib/admin/types";

function StatusDot({ status }: { status: SectionCompletionStatus }) {
  if (status === "COMPLETE") {
    return (
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-luxe-terracotta text-white">
        <Check className="h-2.5 w-2.5" />
      </span>
    );
  }
  if (status === "IN_PROGRESS") {
    return <span className="h-4 w-4 shrink-0 rounded-full border-2 border-amber-400 bg-amber-100 dark:bg-amber-900/40" />;
  }
  return <span className="h-4 w-4 shrink-0 rounded-full border-2 border-stone-300 dark:border-stone-700" />;
}

export function ReportSectionNav({
  sections,
  activeKey,
  onSelect,
  statusFor,
}: {
  sections: TripReportSectionDef[];
  activeKey: TripReportSectionKey;
  onSelect: (key: TripReportSectionKey) => void;
  statusFor: (key: TripReportSectionKey) => SectionCompletionStatus;
}) {
  return (
    <nav className="space-y-0.5">
      {sections.map((section) => {
        const active = section.key === activeKey;
        return (
          <button
            key={section.key}
            type="button"
            onClick={() => onSelect(section.key)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
              active
                ? "bg-luxe-terracotta/10 text-luxe-terracotta-dark dark:text-luxe-terracotta"
                : "text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
            )}
          >
            <StatusDot status={statusFor(section.key)} />
            <span className="truncate">{section.title}</span>
          </button>
        );
      })}
    </nav>
  );
}
