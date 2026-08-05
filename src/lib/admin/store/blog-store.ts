"use client";
import { useSyncExternalStore } from "react";
import { ADMIN_BLOG_POSTS as INITIAL } from "@/lib/admin/mock/blog";
import { AdminBlogPost } from "@/lib/admin/types";

let posts: AdminBlogPost[] = [...INITIAL];
const listeners = new Set<() => void>();
function emit() {
  posts = [...posts];
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
let seq = 1;
function nextId(prefix: string) {
  seq += 1;
  return `${prefix}-${Date.now()}-${seq}`;
}

export function useBlogPosts() {
  return useSyncExternalStore(subscribe, () => posts, () => posts);
}

export function getBlogPost(id: string) {
  return posts.find((p) => p.id === id);
}

export function createEmptyPost(): AdminBlogPost {
  return {
    id: nextId("post"),
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "",
    authorName: "",
    publishedAt: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }),
    readTimeMinutes: 5,
    status: "DRAFT",
  };
}

export function upsertPost(post: AdminBlogPost) {
  const exists = posts.some((p) => p.id === post.id);
  posts = exists ? posts.map((p) => (p.id === post.id ? post : p)) : [post, ...posts];
  emit();
  return post;
}

export function deletePost(id: string) {
  posts = posts.filter((p) => p.id !== id);
  emit();
}
