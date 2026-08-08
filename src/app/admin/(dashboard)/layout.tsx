import React from "react";
import { redirect } from "next/navigation";
import { AdminRoleProvider } from "@/context/AdminRoleContext";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
import { ThemeEffect } from "@/components/admin/ThemeEffect";
import { CommandPalette } from "@/components/admin/CommandPalette";
import { getCurrentAdminProfile } from "@/lib/server/users";
import { AdminUser } from "@/lib/admin/types";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentAdminProfile();
  if (!profile) redirect("/admin/login");

  if (!profile.active) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-admin-bg px-4 text-center dark:bg-stone-950">
        <div className="max-w-sm space-y-2">
          <h1 className="text-lg font-semibold text-stone-800 dark:text-stone-100">Compte en attente d&apos;activation</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Votre compte a bien été créé mais n&apos;est pas encore actif. Contactez un administrateur pour qu&apos;il l&apos;active depuis
            Utilisateurs &amp; Rôles.
          </p>
        </div>
      </div>
    );
  }

  const user: AdminUser = {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    phone: profile.phone ?? undefined,
    role: profile.role,
    avatarColor: profile.avatar_color,
    active: profile.active,
  };

  return (
    <AdminRoleProvider initialUser={user}>
      <ThemeEffect />
      <CommandPalette />
      <div className="flex min-h-screen bg-admin-bg dark:bg-stone-950">
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar />
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </AdminRoleProvider>
  );
}
