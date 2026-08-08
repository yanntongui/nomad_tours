import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesInsert, TablesUpdate } from "./types";

type BookingClientRef = Pick<Tables<"clients">, "id" | "name" | "email" | "phone">;
type BookingAgentRef = Pick<Tables<"admin_profiles">, "id" | "name">;

export type BookingListRow = Tables<"bookings"> & {
  clients: BookingClientRef | null;
  admin_profiles: BookingAgentRef | null;
  payment_schedules: Pick<Tables<"payment_schedules">, "id" | "status" | "due_date" | "amount_xof">[];
};

export type BookingRow = Tables<"bookings"> & {
  clients: BookingClientRef | null;
  admin_profiles: BookingAgentRef | null;
  payments: Tables<"payments">[];
  payment_schedules: Tables<"payment_schedules">[];
  booking_timeline: Tables<"booking_timeline">[];
  booking_messages: Tables<"booking_messages">[];
  booking_notes: Tables<"booking_notes">[];
  booking_documents: Tables<"booking_documents">[];
};

const LIST_RELATIONS =
  "*, clients(id,name,email,phone), admin_profiles(id,name), payment_schedules(id,status,due_date,amount_xof)";

const WITH_RELATIONS =
  "*, clients(id,name,email,phone), admin_profiles(id,name), payments(*), payment_schedules(*), booking_timeline(*), booking_messages(*), booking_notes(*), booking_documents(*)";

export async function listBookings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(LIST_RELATIONS)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as BookingListRow[];
}

export async function listBookingsForClient(clientId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getBooking(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(WITH_RELATIONS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as BookingRow | null;
}

type PaymentBookingRef = Pick<Tables<"bookings">, "id" | "booking_number"> & {
  clients: Pick<Tables<"clients">, "id" | "name"> | null;
};

export type PaymentListRow = Tables<"payments"> & { bookings: PaymentBookingRef | null };
export type PaymentScheduleListRow = Tables<"payment_schedules"> & { bookings: PaymentBookingRef | null };

export async function listPayments() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .select("*, bookings(id, booking_number, clients(id,name))")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as PaymentListRow[];
}

export async function listPaymentSchedules() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payment_schedules")
    .select("*, bookings(id, booking_number, clients(id,name))")
    .order("due_date");
  if (error) throw error;
  return data as PaymentScheduleListRow[];
}

export async function createBooking(booking: TablesInsert<"bookings">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .insert(booking)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateBookingStatus(
  id: string,
  status: Tables<"bookings">["status"],
  actor: string,
  detail?: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  await logBookingTimeline(id, actor, `Statut changé: ${status}`, detail);
  return data;
}

export async function updateBooking(id: string, patch: TablesUpdate<"bookings">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function logBookingTimeline(
  bookingId: string,
  actor: string,
  label: string,
  detail?: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("booking_timeline")
    .insert({ booking_id: bookingId, actor, label, detail })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function addBookingMessage(
  bookingId: string,
  author: string,
  content: string,
  fromClient: boolean,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("booking_messages")
    .insert({ booking_id: bookingId, author, content, from_client: fromClient })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function addBookingNote(
  bookingId: string,
  author: string,
  content: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("booking_notes")
    .insert({ booking_id: bookingId, author, content })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function addBookingDocument(
  bookingId: string,
  document: Omit<TablesInsert<"booking_documents">, "booking_id">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("booking_documents")
    .insert({ ...document, booking_id: bookingId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function addPayment(
  bookingId: string,
  payment: Omit<TablesInsert<"payments">, "booking_id">,
  actor: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .insert({ ...payment, booking_id: bookingId })
    .select()
    .single();
  if (error) throw error;
  await logBookingTimeline(
    bookingId,
    actor,
    `Paiement enregistré (${payment.amount_xof} XOF)`,
  );
  await recomputeBookingPaidAmount(bookingId);
  return data;
}

async function recomputeBookingPaidAmount(bookingId: string) {
  const supabase = await createClient();
  const [{ data: booking, error: bookingError }, { data: payments, error: paymentsError }] = await Promise.all([
    supabase.from("bookings").select("total_price_xof").eq("id", bookingId).single(),
    supabase.from("payments").select("amount_xof").eq("booking_id", bookingId).eq("status", "PAID"),
  ]);
  if (bookingError) throw bookingError;
  if (paymentsError) throw paymentsError;

  const paidXof = (payments ?? []).reduce((sum, p) => sum + p.amount_xof, 0);
  const paymentStatus: Tables<"bookings">["payment_status"] =
    paidXof >= booking.total_price_xof && paidXof > 0
      ? "PAID"
      : paidXof > 0
        ? "PARTIAL"
        : "PENDING";

  const { error } = await supabase
    .from("bookings")
    .update({ paid_xof: paidXof, payment_status: paymentStatus })
    .eq("id", bookingId);
  if (error) throw error;
}

export async function updatePaymentStatus(
  paymentId: string,
  status: Tables<"payments">["status"],
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .update({ status, paid_at: status === "PAID" ? new Date().toISOString() : null })
    .eq("id", paymentId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function addPaymentSchedule(
  bookingId: string,
  schedule: Omit<TablesInsert<"payment_schedules">, "booking_id">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payment_schedules")
    .insert({ ...schedule, booking_id: bookingId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function markScheduleAsPaid(scheduleId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payment_schedules")
    .update({ status: "PAID", paid_at: new Date().toISOString() })
    .eq("id", scheduleId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
