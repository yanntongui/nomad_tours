"use client";
import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WorkflowStep {
  key: string;
  label: string;
  tone?: "default" | "danger";
}

interface StatusWorkflowBarProps {
  steps: WorkflowStep[];
  current: string;
  onAdvance?: (key: string) => void;
}

export function StatusWorkflowBar({ steps, current, onAdvance }: StatusWorkflowBarProps) {
  const currentIndex = steps.findIndex((s) => s.key === current);

  return (
    <div className="flex items-start">
      {steps.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isNext = i === currentIndex + 1;
        const isDanger = step.tone === "danger";
        const clickable = Boolean(onAdvance) && isNext;

        return (
          <React.Fragment key={step.key}>
            {i > 0 && (
              <div
                className={cn(
                  "mt-4 h-0.5 flex-1 min-w-[24px]",
                  isDone || isCurrent ? (isDanger && (isCurrent || isDone) ? "bg-red-400" : "bg-luxe-terracotta") : "bg-stone-200 dark:bg-stone-800"
                )}
              />
            )}
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onAdvance!(step.key)}
              className={cn("group flex flex-col items-center gap-1.5 shrink-0", clickable && "cursor-pointer")}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                  isDone && (isDanger ? "border-red-500 bg-red-500 text-white" : "border-luxe-terracotta bg-luxe-terracotta text-white"),
                  isCurrent && (isDanger ? "border-red-500 bg-red-50 text-red-600 dark:bg-red-900/40 dark:text-red-400" : "border-luxe-terracotta bg-luxe-terracotta/10 text-luxe-terracotta"),
                  !isDone && !isCurrent && "border-stone-200 bg-white text-stone-400 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-500",
                  clickable && "group-hover:border-luxe-terracotta group-hover:text-luxe-terracotta"
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className={cn("text-xs font-medium whitespace-nowrap", isCurrent ? "text-stone-800 dark:text-stone-100" : "text-stone-400 dark:text-stone-500")}>
                {step.label}
              </span>
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
