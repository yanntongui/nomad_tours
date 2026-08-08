import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesInsert, TablesUpdate } from "./types";

export type ClientRow = Tables<"clients"> & {
  client_notes: Tables<"client_notes">[];
};

export async function listClients() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("name");
  if (error) throw error;
  return data;
}

export async function getClient(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*, client_notes(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as ClientRow | null;
}

export async function createClientRecord(client: TablesInsert<"clients">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .insert(client)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateClient(id: string, patch: TablesUpdate<"clients">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteClient(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) throw error;
}

export async function addClientNote(
  clientId: string,
  author: string,
  content: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("client_notes")
    .insert({ client_id: clientId, author, content })
    .select()
    .single();
  if (error) throw error;
  return data;
}
