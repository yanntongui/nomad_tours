"use client";
import * as React from "react";
import { useSettings, updateSettings } from "@/lib/admin/store/settings-store";

const STORAGE_KEY = "nomad-admin-dark-mode";

export function ThemeEffect() {
  const settings = useSettings();
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      updateSettings({ darkMode: stored === "true" });
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("dark", settings.darkMode);
    window.localStorage.setItem(STORAGE_KEY, String(settings.darkMode));
  }, [hydrated, settings.darkMode]);

  return null;
}
