"use server";

import { revalidatePath } from "next/cache";
import {
  createDestination,
  updateDestination,
  deleteDestination,
  getDestination,
  replacePointsOfInterest,
} from "@/lib/server/destinations";
import type { TablesInsert, TablesUpdate } from "@/lib/server/types";

type PoiInput = Omit<TablesInsert<"destination_points_of_interest">, "destination_id">[];

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Une erreur est survenue.";
}

export async function createDestinationAction(input: TablesInsert<"destinations">, pois: PoiInput) {
  try {
    const destination = await createDestination(input);
    await replacePointsOfInterest(destination.id, pois);
    revalidatePath("/admin/destinations");
    return { data: destination };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function updateDestinationAction(
  id: string,
  patch: TablesUpdate<"destinations">,
  pois: PoiInput
) {
  try {
    const destination = await updateDestination(id, patch);
    await replacePointsOfInterest(id, pois);
    revalidatePath("/admin/destinations");
    revalidatePath(`/admin/destinations/${id}`);
    return { data: destination };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function deleteDestinationAction(id: string) {
  try {
    await deleteDestination(id);
    revalidatePath("/admin/destinations");
    return {};
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function duplicateDestinationAction(id: string) {
  try {
    const source = await getDestination(id);
    if (!source) return { error: "Destination introuvable." };
    const { id: _id, created_at, updated_at, destination_points_of_interest, ...rest } = source;
    const copy = await createDestination({
      ...rest,
      name: `${rest.name} (copie)`,
      slug: `${rest.slug}-copie-${Date.now()}`,
    });
    await replacePointsOfInterest(
      copy.id,
      destination_points_of_interest.map(({ id: _poiId, destination_id: _destId, ...poi }) => poi)
    );
    revalidatePath("/admin/destinations");
    return { data: copy };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

type ImportRow = Pick<
  TablesInsert<"destinations">,
  "name" | "country" | "region" | "is_international" | "is_featured" | "climate" | "best_period"
>;

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function importDestinationsAction(rows: ImportRow[]) {
  let count = 0;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      await createDestination({
        ...row,
        slug: `${slugify(row.name) || "destination"}-${Date.now()}-${i}`,
        description: "",
      });
      count += 1;
    } catch {
      continue;
    }
  }
  revalidatePath("/admin/destinations");
  return { count };
}
