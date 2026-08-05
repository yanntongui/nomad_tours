import React from "react";
import { AdminRoleProvider } from "@/context/AdminRoleContext";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
import { ThemeEffect } from "@/components/admin/ThemeEffect";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminRoleProvider>
      <ThemeEffect />
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
