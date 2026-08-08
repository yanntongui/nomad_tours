import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, User, ChevronRight } from "lucide-react";
import { getBlogPostBySlug } from "@/lib/server/blog";
import { BlogQuoteCta } from "./BlogQuoteCta";

interface BlogPostPageProps {
  params: { slug: string };
}

function formatPublishedDate(publishedAt: string | null) {
  if (!publishedAt) return "";
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(publishedAt)
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-nomad-navy">Article introuvable</h2>
        <Link href="/blog" className="inline-block bg-nomad-terracotta text-white font-bold px-6 py-2.5 rounded-xl">
          Retour aux articles
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <Link href="/" className="hover:text-nomad-terracotta">Accueil</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/blog" className="hover:text-nomad-terracotta">Blog</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-nomad-navy font-bold line-clamp-1">{post.title}</span>
      </div>

      {/* Header Info */}
      <div className="space-y-4">
        <span className="bg-nomad-terracotta text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase">
          {post.category}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-nomad-navy leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-2 border-t border-stone-200">
          <span className="flex items-center gap-1 font-semibold text-nomad-navy">
            <User className="w-4 h-4 text-nomad-terracotta" /> {post.author_name}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-nomad-gold" /> {formatPublishedDate(post.published_at)}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-nomad-terracotta" /> {post.read_time_minutes} min de lecture
          </span>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative h-[380px] rounded-3xl overflow-hidden shadow-lg bg-stone-900">
        <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
      </div>

      {/* Article Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6 text-stone-800 leading-relaxed text-sm sm:text-base whitespace-pre-line">
        {post.content}
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-nomad-navy to-nomad-navy-light text-white rounded-3xl p-8 text-center space-y-4 shadow-xl">
        <h3 className="text-2xl font-black">Envie d&apos;explorer le Bénin par vous-même ?</h3>
        <p className="text-xs text-stone-300 max-w-md mx-auto">
          Nos conseillers locaux organisent votre itinéraire sur-mesure au meilleur tarif.
        </p>
        <BlogQuoteCta />
      </div>
    </div>
  );
}
