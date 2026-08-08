"use server";

import { revalidatePath } from "next/cache";
import {
  createHomepageVersion,
  getHomepageVersion,
  updateHomepageContent,
} from "@/lib/server/homepage";
import type { Json, TablesUpdate } from "@/lib/server/types";
import { HomepageContent } from "@/lib/admin/types";

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Une erreur est survenue.";
}

function toContentPatch(content: HomepageContent): TablesUpdate<"homepage_content"> {
  return {
    hero: content.hero as unknown as Json,
    stats: content.stats as unknown as Json,
    services: content.services as unknown as Json,
    why_us: content.whyUs as unknown as Json,
    featured_circuit: content.featuredCircuit as unknown as Json,
    newsletter: content.newsletter as unknown as Json,
    footer: content.footer as unknown as Json,
    sections_order: content.sectionsOrder as unknown as Json,
    featured_destinations: content.featuredDestinations as unknown as Json,
    testimonials_config: content.testimonialsConfig as unknown as Json,
  };
}

export async function saveHomepageDraftAction(content: HomepageContent, actor: string) {
  try {
    const version = await createHomepageVersion({
      content: content as unknown as Json,
      status: "DRAFT",
      published_at: null,
      actor,
    });
    revalidatePath("/admin/contenu");
    return { data: version };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function publishHomepageAction(content: HomepageContent, actor: string) {
  try {
    await updateHomepageContent(toContentPatch(content));
    const version = await createHomepageVersion({
      content: content as unknown as Json,
      status: "PUBLISHED",
      published_at: new Date().toISOString(),
      actor,
    });
    revalidatePath("/admin/contenu");
    revalidatePath("/");
    return { data: version };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function rollbackHomepageVersionAction(versionId: string, actor: string) {
  try {
    const target = await getHomepageVersion(versionId);
    const content = target.content as unknown as HomepageContent;
    await updateHomepageContent(toContentPatch(content));
    const version = await createHomepageVersion({
      content: content as unknown as Json,
      status: "PUBLISHED",
      published_at: new Date().toISOString(),
      actor,
    });
    revalidatePath("/admin/contenu");
    revalidatePath("/");
    return { data: version };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}
