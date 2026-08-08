"use server";

import { revalidatePath } from "next/cache";
import { updateAgencySettings } from "@/lib/server/settings";
import type { TablesUpdate } from "@/lib/server/types";

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Une erreur est survenue.";
}

export async function updateAgencySettingsAction(patch: TablesUpdate<"agency_settings">) {
  try {
    const settings = await updateAgencySettings(patch);
    revalidatePath("/admin/parametres");
    return { data: settings };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}
