"use client";
import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  side?: "left" | "right";
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Drawer({ open, onOpenChange, title, description, side = "right", children, footer }: DrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={side} className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="flex-1 overflow-y-auto -mx-6 px-6">{children}</div>
        {footer && (
          <div className="mt-4 flex items-center justify-end gap-2 border-t border-stone-200 pt-4 dark:border-stone-800">
            {footer}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
