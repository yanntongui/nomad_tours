"use server";

import { revalidatePath } from "next/cache";
import { createBlogPost, updateBlogPost } from "@/lib/server/blog";
import { moderateTestimonial } from "@/lib/server/testimonials";
import { updateCmsSeoSettings } from "@/lib/server/cms-settings";
import type { TablesInsert, TablesUpdate } from "@/lib/server/types";

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Une erreur est survenue.";
}

export async function createBlogPostAction(input: TablesInsert<"blog_posts">) {
  try {
    const post = await createBlogPost(input);
    revalidatePath("/admin/contenu");
    return { data: post };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function updateBlogPostAction(id: string, patch: TablesUpdate<"blog_posts">) {
  try {
    const post = await updateBlogPost(id, patch);
    revalidatePath("/admin/contenu");
    revalidatePath(`/admin/contenu/blog/${id}`);
    return { data: post };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function approveTestimonialAction(id: string) {
  try {
    await moderateTestimonial(id, "APPROVED");
    revalidatePath("/admin/contenu");
    return {};
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function rejectTestimonialAction(id: string) {
  try {
    await moderateTestimonial(id, "REJECTED");
    revalidatePath("/admin/contenu");
    return {};
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function updateCmsSeoSettingsAction(patch: TablesUpdate<"cms_seo_settings">) {
  try {
    const settings = await updateCmsSeoSettings(patch);
    revalidatePath("/admin/contenu");
    return { data: settings };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}
