"use client";
import { useSyncExternalStore } from "react";
import { CLIENTS as INITIAL_CLIENTS, CLIENT_NOTES as INITIAL_NOTES } from "@/lib/admin/mock/clients";
import { Client, ClientNote, ContactMethod, VipTier } from "@/lib/admin/types";

interface State {
  clients: Client[];
  notes: ClientNote[];
}

let state: State = {
  clients: [...INITIAL_CLIENTS],
  notes: [...INITIAL_NOTES],
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

export function useClientsStore() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state
  );
}

export function getClient(id: string) {
  return state.clients.find((c) => c.id === id);
}

export function updateClient(id: string, patch: Partial<Omit<Client, "id" | "createdAt">>, actor: string) {
  state.clients = state.clients.map((c) => (c.id === id ? { ...c, ...patch } : c));
  emit();
}

export function addClientNote(clientId: string, content: string, actor: string) {
  state.notes = [
    { id: nextId("cn"), clientId, author: actor, content, createdAt: new Date().toISOString() },
    ...state.notes,
  ];
  emit();
}

export function createClient(input: {
  name: string;
  email: string;
  phone: string;
  address?: string;
  preferredContact: ContactMethod;
  vipTier: VipTier;
}): Client {
  const client: Client = {
    id: nextId("cl"),
    name: input.name,
    email: input.email,
    phone: input.phone,
    address: input.address,
    tags: [],
    preferredContact: input.preferredContact,
    vipTier: input.vipTier,
    createdAt: new Date().toISOString(),
  };
  state.clients = [client, ...state.clients];
  emit();
  return client;
}
