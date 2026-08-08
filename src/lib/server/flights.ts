import { createClient } from "@/lib/supabase/server";
import type { TablesInsert, TablesUpdate } from "./types";

export async function listFlightBookingsForClient(clientId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("flight_bookings")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getFlightBooking(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("flight_bookings")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createFlightBooking(
  booking: TablesInsert<"flight_bookings">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("flight_bookings")
    .insert(booking)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateFlightBooking(
  id: string,
  patch: TablesUpdate<"flight_bookings">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("flight_bookings")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
