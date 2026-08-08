import { createClient } from "@/lib/supabase/server";
import type { TablesInsert, TablesUpdate } from "./types";

export async function listActiveLoyaltyOffers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("loyalty_offers")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function listAllLoyaltyOffers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("loyalty_offers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createLoyaltyOffer(offer: TablesInsert<"loyalty_offers">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("loyalty_offers")
    .insert(offer)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateLoyaltyOffer(
  id: string,
  patch: TablesUpdate<"loyalty_offers">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("loyalty_offers")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteLoyaltyOffer(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("loyalty_offers").delete().eq("id", id);
  if (error) throw error;
}
