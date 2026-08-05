"use client";
import * as React from "react";
import { BlogForm } from "@/components/admin/BlogForm";
import { createEmptyPost } from "@/lib/admin/store/blog-store";

export default function NewBlogPostPage() {
  const [initial] = React.useState(createEmptyPost);
  return <BlogForm initial={initial} mode="create" />;
}
