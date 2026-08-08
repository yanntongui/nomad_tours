"use server";

import { revalidatePath } from "next/cache";
import { updateAdminProfile } from "@/lib/server/users";
import type { TablesUpdate } from "@/lib/server/types";

export async function updateAdminProfileAction(
  id: string,
  patch: Pick<TablesUpdate<"admin_profiles">, "name" | "phone" | "role">,
) {
  try {
    const data = await updateAdminProfile(id, patch);
    revalidatePath("/admin/utilisateurs");
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function setAdminProfileActiveAction(id: string, active: boolean) {
  try {
    const data = await updateAdminProfile(id, { active });
    revalidatePath("/admin/utilisateurs");
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}
