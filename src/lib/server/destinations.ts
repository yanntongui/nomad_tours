import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesInsert, TablesUpdate } from "./types";

export type PointOfInterestRow = Tables<"destination_points_of_interest">;
export type DestinationRow = Tables<"destinations"> & {
  destination_points_of_interest: PointOfInterestRow[];
};

const WITH_POIS = "*, destination_points_of_interest(*)";

export async function listDestinations() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("destinations")
    .select(WITH_POIS)
    .order("name");
  if (error) throw error;
  return data as DestinationRow[];
}

export async function getDestinationBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("destinations")
    .select(WITH_POIS)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as DestinationRow | null;
}

export async function getDestination(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("destinations")
    .select(WITH_POIS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as DestinationRow | null;
}

export async function createDestination(
  destination: TablesInsert<"destinations">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("destinations")
    .insert(destination)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateDestination(
  id: string,
  patch: TablesUpdate<"destinations">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("destinations")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteDestination(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("destinations").delete().eq("id", id);
  if (error) throw error;
}

export async function replacePointsOfInterest(
  destinationId: string,
  points: Omit<TablesInsert<"destination_points_of_interest">, "destination_id">[],
) {
  const supabase = await createClient();
  const { error: deleteError } = await supabase
    .from("destination_points_of_interest")
    .delete()
    .eq("destination_id", destinationId);
  if (deleteError) throw deleteError;

  if (points.length === 0) return [];

  const { data, error } = await supabase
    .from("destination_points_of_interest")
    .insert(
      points.map((point, index) => ({
        ...point,
        destination_id: destinationId,
        position: point.position ?? index,
      })),
    )
    .select();
  if (error) throw error;
  return data;
}
