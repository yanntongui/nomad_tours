"use client";
import { ShieldAlert } from "lucide-react";
import { useAdminRole } from "@/context/AdminRoleContext";

export function RequireSuperAdmin({ children }: { children: React.ReactNode }) {
  const { role } = useAdminRole();

  if (role !== "SUPER_ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white py-24 text-center px-6 dark:border-stone-700 dark:bg-stone-900">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 mb-4 dark:bg-red-900/40 dark:text-red-400">
          <ShieldAlert className="h-7 w-7" />
        </span>
        <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100">Accès réservé</h2>
        <p className="mt-2 max-w-md text-sm text-stone-500 dark:text-stone-400">
          Cette section est réservée aux Super Admins. Changez de rôle depuis la barre supérieure pour y accéder.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
