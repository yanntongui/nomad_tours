"use client";
import { useSyncExternalStore } from "react";
import { ADMIN_USERS as INITIAL_USERS } from "@/lib/admin/mock/users";
import { AdminRole, AdminUser } from "@/lib/admin/types";

interface State {
  users: AdminUser[];
}

let state: State = {
  users: [...INITIAL_USERS],
};

const listeners = new Set<() => void>();
function emit() {
  state = { ...state };
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

let seq = 1000;
function nextId(prefix: string) {
  seq += 1;
  return `${prefix}-${seq}`;
}

const AVATAR_COLORS = ["#C4633A", "#1B4332", "#C9A227", "#2563EB", "#DB2777", "#7C3AED", "#0891B2"];

export function useUsersStore() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state
  );
}

export function getUser(id: string) {
  return state.users.find((u) => u.id === id);
}

export function getAgents() {
  return state.users.filter((u) => u.active && (u.role === "AGENT" || u.role === "SUPER_ADMIN"));
}

export function getGuides() {
  return state.users.filter((u) => u.active && u.role === "GUIDE");
}

export function useAgents() {
  const store = useUsersStore();
  return store.users.filter((u) => u.active && (u.role === "AGENT" || u.role === "SUPER_ADMIN"));
}

export function useGuides() {
  const store = useUsersStore();
  return store.users.filter((u) => u.active && u.role === "GUIDE");
}

export interface UserInput {
  name: string;
  email: string;
  phone?: string;
  role: AdminRole;
}

export function addUser(input: UserInput) {
  const user: AdminUser = {
    id: nextId("u"),
    name: input.name,
    email: input.email,
    phone: input.phone,
    role: input.role,
    avatarColor: AVATAR_COLORS[state.users.length % AVATAR_COLORS.length],
    active: true,
  };
  state.users = [user, ...state.users];
  emit();
  return user;
}

export function updateUser(id: string, input: UserInput) {
  state.users = state.users.map((u) => (u.id === id ? { ...u, ...input } : u));
  emit();
}

export function toggleUserActive(id: string) {
  state.users = state.users.map((u) => (u.id === id ? { ...u, active: !u.active } : u));
  emit();
}
