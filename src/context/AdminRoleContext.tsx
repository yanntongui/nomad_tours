"use client";
import React, { createContext, useContext } from "react";
import { AdminRole, AdminUser } from "@/lib/admin/types";

interface AdminRoleContextType {
  role: AdminRole;
  user: AdminUser;
}

const AdminRoleContext = createContext<AdminRoleContextType | null>(null);

export function AdminRoleProvider({ initialUser, children }: { initialUser: AdminUser; children: React.ReactNode }) {
  return <AdminRoleContext.Provider value={{ role: initialUser.role, user: initialUser }}>{children}</AdminRoleContext.Provider>;
}

export function useAdminRole() {
  const ctx = useContext(AdminRoleContext);
  if (!ctx) throw new Error("useAdminRole must be used within AdminRoleProvider");
  return ctx;
}
