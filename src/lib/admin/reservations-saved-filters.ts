"use client";
import * as React from "react";

export interface ReservationsFilterValues {
  search: string;
  type: string;
  status: string;
  paymentStatus: string;
  agent: string;
  quickFilter: string;
}

export interface SavedReservationsView {
  id: string;
  name: string;
  filters: ReservationsFilterValues;
  createdAt: string;
}

const STORAGE_KEY = "nomad-admin-reservations-filters";

function readAll(): SavedReservationsView[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedReservationsView[]) : [];
  } catch {
    return [];
  }
}

function writeAll(views: SavedReservationsView[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(views));
}

export function useSavedReservationsViews() {
  const [views, setViews] = React.useState<SavedReservationsView[]>([]);

  React.useEffect(() => {
    setViews(readAll());
  }, []);

  const saveView = (name: string, filters: ReservationsFilterValues) => {
    const view: SavedReservationsView = {
      id: `view-${Date.now()}`,
      name,
      filters,
      createdAt: new Date().toISOString(),
    };
    const next = [...readAll(), view];
    writeAll(next);
    setViews(next);
  };

  const deleteView = (id: string) => {
    const next = readAll().filter((v) => v.id !== id);
    writeAll(next);
    setViews(next);
  };

  return { views, saveView, deleteView };
}
