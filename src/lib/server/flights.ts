import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesInsert, TablesUpdate } from "./types";

type FlightClientRef = Pick<Tables<"clients">, "id" | "name" | "email" | "phone">;

export type FlightBookingRow = Tables<"flight_bookings"> & {
  clients: FlightClientRef | null;
};

const LIST_RELATIONS = "*, clients(id,name,email,phone)";

export async function listFlightBookings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("flight_bookings")
    .select(LIST_RELATIONS)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as FlightBookingRow[];
}

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
