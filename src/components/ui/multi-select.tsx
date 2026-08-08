"use client";
import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({ options, selected, onChange, placeholder = "Sélectionner...", className }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const selectedOptions = options.filter((o) => selected.includes(o.value));

  function toggle(value: string) {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  }

  function remove(value: string, e: React.MouseEvent) {
    e.stopPropagation();
    onChange(selected.filter((v) => v !== value));
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("w-full justify-between font-normal min-h-9 h-auto", className)}
        >
          {selectedOptions.length === 0 ? (
            <span className="text-stone-400 dark:text-stone-500">{placeholder}</span>
          ) : (
            <span className="flex flex-wrap items-center gap-1">
              {selectedOptions.map((o) => (
                <span
                  key={o.value}
                  className="flex items-center gap-1 rounded bg-luxe-terracotta/10 px-1.5 py-0.5 text-xs text-luxe-terracotta-dark dark:text-luxe-terracotta"
                >
                  {o.label}
                  <X className="h-3 w-3 cursor-pointer" onClick={(e) => remove(o.value, e)} />
                </span>
              ))}
            </span>
          )}
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-stone-400 dark:text-stone-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-1 max-h-64 overflow-y-auto">
        {options.length === 0 && <p className="px-2 py-1.5 text-sm text-stone-400 dark:text-stone-500">Aucune option.</p>}
        {options.map((o) => {
          const checked = selected.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => toggle(o.value)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              <Checkbox checked={checked} className="pointer-events-none" />
              <span className="flex-1 text-left">{o.label}</span>
              {checked && <Check className="h-3.5 w-3.5 text-luxe-terracotta" />}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
