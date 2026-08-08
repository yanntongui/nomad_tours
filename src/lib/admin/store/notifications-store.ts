"use client";
import { useSyncExternalStore } from "react";
import { NOTIFICATIONS as INITIAL } from "@/lib/admin/mock/notifications";
import { AdminNotification } from "@/lib/admin/types";

let notifications: AdminNotification[] = [...INITIAL];
const listeners = new Set<() => void>();
function emit() {
  notifications = [...notifications];
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
let seq = 1;
function nextId() {
  seq += 1;
  return `notif-${Date.now()}-${seq}`;
}

export function useNotifications() {
  return useSyncExternalStore(subscribe, () => notifications, () => notifications);
}

export function useUnreadCount() {
  const list = useNotifications();
  return list.filter((n) => !n.read).length;
}

export function pushNotification(input: { title: string; description?: string; href?: string }) {
  notifications = [
    {
      id: nextId(),
      title: input.title,
      description: input.description,
      href: input.href,
      read: false,
      createdAt: new Date().toISOString(),
    },
    ...notifications,
  ];
  emit();
}

export function markRead(id: string) {
  notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  emit();
}

export function markAllRead() {
  notifications = notifications.map((n) => ({ ...n, read: true }));
  emit();
}
