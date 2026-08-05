"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ADMIN_USERS } from "@/lib/admin/mock/users";
import { AdminRole, AdminUser } from "@/lib/admin/types";

interface AdminRoleContextType {
  role: AdminRole;
  user: AdminUser;
  setRole: (role: AdminRole) => void;
}

const STORAGE_KEY = "nomad-admin-role";

const AdminRoleContext = createContext<AdminRoleContextType>({
  role: "SUPER_ADMIN",
  user: ADMIN_USERS[0],
  setRole: () => {},
});

export function AdminRoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<AdminRole>("SUPER_ADMIN");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as AdminRole | null;
    if (stored) setRoleState(stored);
  }, []);

  const setRole = (next: AdminRole) => {
    setRoleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const user = ADMIN_USERS.find((u) => u.role === role) ?? ADMIN_USERS[0];

  return <AdminRoleContext.Provider value={{ role, user, setRole }}>{children}</AdminRoleContext.Provider>;
}

export const useAdminRole = () => useContext(AdminRoleContext);
