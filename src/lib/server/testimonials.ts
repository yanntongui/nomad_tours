import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesInsert, TablesUpdate } from "./types";

export type TestimonialRow = Tables<"testimonials">;

export async function listApprovedTestimonials() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("status", "APPROVED")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function listApprovedTestimonialsForDestination(
  destinationId: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("status", "APPROVED")
    .eq("destination_id", destinationId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function listAllTestimonials() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createTestimonial(
  testimonial: TablesInsert<"testimonials">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .insert(testimonial)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTestimonial(
  id: string,
  patch: TablesUpdate<"testimonials">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function moderateTestimonial(
  id: string,
  status: "APPROVED" | "REJECTED",
) {
  return updateTestimonial(id, { status });
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw error;
}
