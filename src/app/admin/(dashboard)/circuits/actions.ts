"use server";

import { revalidatePath } from "next/cache";
import {
  createCircuit,
  updateCircuit,
  deleteCircuit,
  getCircuit,
  replaceItineraryDays,
  replacePriceTiers,
  replaceOptions,
  replaceDepartures,
} from "@/lib/server/circuits";
import type { TablesInsert, TablesUpdate } from "@/lib/server/types";

type ItineraryInput = Omit<TablesInsert<"circuit_itinerary_days">, "circuit_id">[];
type PriceTiersInput = Omit<TablesInsert<"circuit_price_tiers">, "circuit_id">[];
type OptionsInput = Omit<TablesInsert<"circuit_options">, "circuit_id">[];
type DeparturesInput = Omit<TablesInsert<"circuit_departures">, "circuit_id">[];

interface ChildCollections {
  itinerary: ItineraryInput;
  priceTiers: PriceTiersInput;
  options: OptionsInput;
  departures: DeparturesInput;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Une erreur est survenue.";
}

async function replaceChildren(circuitId: string, children: ChildCollections) {
  await Promise.all([
    replaceItineraryDays(circuitId, children.itinerary),
    replacePriceTiers(circuitId, children.priceTiers),
    replaceOptions(circuitId, children.options),
    replaceDepartures(circuitId, children.departures),
  ]);
}

export async function createCircuitAction(input: TablesInsert<"circuits">, children: ChildCollections) {
  try {
    const circuit = await createCircuit(input);
    await replaceChildren(circuit.id, children);
    revalidatePath("/admin/circuits");
    return { data: circuit };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function updateCircuitAction(
  id: string,
  patch: TablesUpdate<"circuits">,
  children: ChildCollections
) {
  try {
    const circuit = await updateCircuit(id, patch);
    await replaceChildren(id, children);
    revalidatePath("/admin/circuits");
    revalidatePath(`/admin/circuits/${id}`);
    return { data: circuit };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function deleteCircuitAction(id: string) {
  try {
    await deleteCircuit(id);
    revalidatePath("/admin/circuits");
    return {};
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function duplicateCircuitAction(id: string) {
  try {
    const source = await getCircuit(id);
    if (!source) return { error: "Circuit introuvable." };
    const {
      id: _id,
      created_at,
      updated_at,
      circuit_itinerary_days,
      circuit_price_tiers,
      circuit_options,
      circuit_departures,
      ...rest
    } = source;
    const copy = await createCircuit({
      ...rest,
      title: `${rest.title} (copie)`,
      slug: `${rest.slug}-copie-${Date.now()}`,
    });
    await replaceChildren(copy.id, {
      itinerary: circuit_itinerary_days.map(({ id: _dayId, circuit_id: _cid, ...day }) => day),
      priceTiers: circuit_price_tiers.map(({ id: _tierId, circuit_id: _cid, ...tier }) => tier),
      options: circuit_options.map(({ id: _optId, circuit_id: _cid, ...opt }) => opt),
      departures: [],
    });
    revalidatePath("/admin/circuits");
    return { data: copy };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

type ImportRow = Pick<
  TablesInsert<"circuits">,
  "title" | "destination_id" | "theme" | "duration_days" | "price_xof" | "is_featured" | "category"
>;

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function importCircuitsAction(rows: ImportRow[]) {
  let count = 0;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      await createCircuit({
        ...row,
        slug: `${slugify(row.title) || "circuit"}-${Date.now()}-${i}`,
      });
      count += 1;
    } catch {
      continue;
    }
  }
  revalidatePath("/admin/circuits");
  return { count };
}
