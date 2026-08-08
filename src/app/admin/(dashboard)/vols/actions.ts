"use server";

import { revalidatePath } from "next/cache";
import { createFlightBooking, updateFlightBooking } from "@/lib/server/flights";
import type { Tables, TablesInsert, TablesUpdate } from "@/lib/server/types";

function revalidateFlights() {
  revalidatePath("/admin/vols");
}

export async function createFlightBookingAction(input: TablesInsert<"flight_bookings">) {
  try {
    const data = await createFlightBooking(input);
    revalidateFlights();
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function updateFlightBookingAction(id: string, patch: TablesUpdate<"flight_bookings">) {
  try {
    const data = await updateFlightBooking(id, patch);
    revalidateFlights();
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function setFlightBookingStatusAction(id: string, status: Tables<"flight_bookings">["status"]) {
  try {
    const data = await updateFlightBooking(id, { status });
    revalidateFlights();
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}
