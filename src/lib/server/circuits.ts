import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesInsert, TablesUpdate } from "./types";

export type CircuitRow = Tables<"circuits"> & {
  circuit_itinerary_days: Tables<"circuit_itinerary_days">[];
  circuit_price_tiers: Tables<"circuit_price_tiers">[];
  circuit_options: Tables<"circuit_options">[];
  circuit_departures: Tables<"circuit_departures">[];
};

const WITH_RELATIONS =
  "*, circuit_itinerary_days(*), circuit_price_tiers(*), circuit_options(*), circuit_departures(*)";

export async function listCircuits() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("circuits")
    .select(WITH_RELATIONS)
    .order("title");
  if (error) throw error;
  return data as CircuitRow[];
}

export async function listCircuitsByDestination(destinationId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("circuits")
    .select(WITH_RELATIONS)
    .eq("destination_id", destinationId)
    .order("title");
  if (error) throw error;
  return data as CircuitRow[];
}

export async function getCircuitBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("circuits")
    .select(WITH_RELATIONS)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as CircuitRow | null;
}

export async function getCircuit(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("circuits")
    .select(WITH_RELATIONS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as CircuitRow | null;
}

export async function createCircuit(circuit: TablesInsert<"circuits">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("circuits")
    .insert(circuit)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCircuit(
  id: string,
  patch: TablesUpdate<"circuits">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("circuits")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCircuit(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("circuits").delete().eq("id", id);
  if (error) throw error;
}

// Each "replace whole list" mutator below mirrors CircuitForm.tsx's editing
// pattern: the form edits a nested array locally, then Save overwrites the
// full child list in one round-trip rather than diffing individual rows.

export async function replaceItineraryDays(
  circuitId: string,
  days: Omit<TablesInsert<"circuit_itinerary_days">, "circuit_id">[],
) {
  const supabase = await createClient();
  const { error: deleteError } = await supabase
    .from("circuit_itinerary_days")
    .delete()
    .eq("circuit_id", circuitId);
  if (deleteError) throw deleteError;
  if (days.length === 0) return [];
  const { data, error } = await supabase
    .from("circuit_itinerary_days")
    .insert(days.map((day) => ({ ...day, circuit_id: circuitId })))
    .select();
  if (error) throw error;
  return data;
}

export async function replacePriceTiers(
  circuitId: string,
  tiers: Omit<TablesInsert<"circuit_price_tiers">, "circuit_id">[],
) {
  const supabase = await createClient();
  const { error: deleteError } = await supabase
    .from("circuit_price_tiers")
    .delete()
    .eq("circuit_id", circuitId);
  if (deleteError) throw deleteError;
  if (tiers.length === 0) return [];
  const { data, error } = await supabase
    .from("circuit_price_tiers")
    .insert(tiers.map((tier) => ({ ...tier, circuit_id: circuitId })))
    .select();
  if (error) throw error;
  return data;
}

export async function replaceOptions(
  circuitId: string,
  options: Omit<TablesInsert<"circuit_options">, "circuit_id">[],
) {
  const supabase = await createClient();
  const { error: deleteError } = await supabase
    .from("circuit_options")
    .delete()
    .eq("circuit_id", circuitId);
  if (deleteError) throw deleteError;
  if (options.length === 0) return [];
  const { data, error } = await supabase
    .from("circuit_options")
    .insert(options.map((option) => ({ ...option, circuit_id: circuitId })))
    .select();
  if (error) throw error;
  return data;
}

export async function replaceDepartures(
  circuitId: string,
  departures: Omit<TablesInsert<"circuit_departures">, "circuit_id">[],
) {
  const supabase = await createClient();
  const { error: deleteError } = await supabase
    .from("circuit_departures")
    .delete()
    .eq("circuit_id", circuitId);
  if (deleteError) throw deleteError;
  if (departures.length === 0) return [];
  const { data, error } = await supabase
    .from("circuit_departures")
    .insert(
      departures.map((departure) => ({ ...departure, circuit_id: circuitId })),
    )
    .select();
  if (error) throw error;
  return data;
}
