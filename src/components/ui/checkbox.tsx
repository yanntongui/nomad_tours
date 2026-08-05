"use client";
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded border border-stone-300 bg-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxe-terracotta/40 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-luxe-terracotta data-[state=checked]:border-luxe-terracotta data-[state=checked]:text-white data-[state=indeterminate]:bg-luxe-terracotta data-[state=indeterminate]:border-luxe-terracotta data-[state=indeterminate]:text-white dark:border-stone-700 dark:bg-stone-900",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      {props.checked === "indeterminate" ? <Minus className="h-3 w-3" /> : <Check className="h-3 w-3" />}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
