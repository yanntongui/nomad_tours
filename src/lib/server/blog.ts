import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesInsert, TablesUpdate } from "./types";

export type BlogPostRow = Tables<"blog_posts">;

export async function listPublishedBlogPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "PUBLISHED")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function listAllBlogPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getBlogPost(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createBlogPost(post: TablesInsert<"blog_posts">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert(post)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateBlogPost(
  id: string,
  patch: TablesUpdate<"blog_posts">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw error;
}
