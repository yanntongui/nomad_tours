"use server";

import { revalidatePath } from "next/cache";
import { createLoyaltyOffer, updateLoyaltyOffer, deleteLoyaltyOffer } from "@/lib/server/loyalty";
import type { TablesInsert, TablesUpdate } from "@/lib/server/types";

export async function createLoyaltyOfferAction(offer: TablesInsert<"loyalty_offers">) {
  try {
    const data = await createLoyaltyOffer(offer);
    revalidatePath("/admin/fidelite");
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function updateLoyaltyOfferAction(id: string, patch: TablesUpdate<"loyalty_offers">) {
  try {
    const data = await updateLoyaltyOffer(id, patch);
    revalidatePath("/admin/fidelite");
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function deleteLoyaltyOfferAction(id: string) {
  try {
    await deleteLoyaltyOffer(id);
    revalidatePath("/admin/fidelite");
    return { data: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}
