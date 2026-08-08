"use client";
import * as React from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface DateRange {
  from?: Date;
  to?: Date;
}

interface CalendarProps {
  mode?: "single" | "range";
  selected?: Date | DateRange;
  onSelect?: (value: Date | DateRange | undefined) => void;
  className?: string;
  markedDates?: Date[];
}

export function Calendar({ mode = "single", selected, onSelect, className, markedDates }: CalendarProps) {
  const initial =
    mode === "single" ? (selected as Date) : (selected as DateRange | undefined)?.from;
  const [month, setMonth] = React.useState(initial ?? new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  });

  const range = mode === "range" ? (selected as DateRange | undefined) : undefined;
  const single = mode === "single" ? (selected as Date | undefined) : undefined;

  function handleClick(day: Date) {
    if (mode === "single") {
      onSelect?.(day);
      return;
    }
    if (!range?.from || (range.from && range.to)) {
      onSelect?.({ from: day, to: undefined });
    } else if (isBefore(day, range.from)) {
      onSelect?.({ from: day, to: range.from });
    } else {
      onSelect?.({ from: range.from, to: day });
    }
  }

  return (
    <div className={cn("select-none", className)}>
      <div className="flex items-center justify-between mb-3">
        <Button variant="ghost" size="icon" onClick={() => setMonth(subMonths(month, 1))} type="button">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm font-semibold capitalize text-stone-800 dark:text-stone-100">
          {format(month, "MMMM yyyy", { locale: fr })}
        </span>
        <Button variant="ghost" size="icon" onClick={() => setMonth(addMonths(month, 1))} type="button">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-stone-400 dark:text-stone-500 mb-1">
        {["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const inMonth = isSameMonth(day, month);
          const isSelected =
            mode === "single"
              ? single && isSameDay(day, single)
              : range?.from && range?.to
              ? isWithinInterval(day, { start: range.from, end: range.to })
              : range?.from && isSameDay(day, range.from);
          const isEdge =
            mode === "range" && (
              (range?.from && isSameDay(day, range.from)) || (range?.to && isSameDay(day, range.to))
            );
          const isMarked = markedDates?.some((d) => isSameDay(d, day));
          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => handleClick(day)}
              className={cn(
                "relative h-8 w-8 rounded-md text-xs transition-colors",
                inMonth ? "text-stone-700 dark:text-stone-300" : "text-stone-300 dark:text-stone-700",
                isSelected && !isEdge && "bg-luxe-terracotta/15 text-luxe-terracotta-dark dark:text-luxe-terracotta",
                isEdge && "bg-luxe-terracotta text-white font-semibold",
                !isSelected && "hover:bg-stone-100 dark:hover:bg-stone-800"
              )}
            >
              {format(day, "d")}
              {isMarked && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-luxe-terracotta" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
