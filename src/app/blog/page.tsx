"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Clock, Calendar, ArrowRight, User, Search } from "lucide-react";
import { BLOG_POSTS } from "@/lib/data/blog-posts";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-nomad-navy to-nomad-navy-light text-white rounded-3xl p-8 sm:p-10 shadow-lg space-y-3">
        <span className="bg-nomad-terracotta text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full">
          Blog & Guides de Voyage
        </span>
        <h1 className="text-3xl sm:text-4xl font-black">Conseils, Culture & Incontournables au Bénin</h1>
        <p className="text-xs sm:text-sm text-stone-300">
          Préparez votre séjour avec les secrets de nos guides locaux et découvrez le patrimoine culturel du Bénin.
        </p>
      </div>

      {/* Search & Categories */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un article..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3.5 py-2 text-xs text-stone-800 outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
          {["ALL", "Conseils de Voyage", "Culture & Histoire", "Safari & Nature"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                selectedCategory === cat
                  ? "bg-nomad-terracotta text-white shadow"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {cat === "ALL" ? "Tous les articles" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="relative h-48 w-full bg-stone-100">
                <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                <span className="absolute top-3 left-3 bg-nomad-navy text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                  {post.category}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-3 text-[11px] text-stone-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-nomad-gold" /> {post.publishedAt}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-nomad-terracotta" /> {post.readTimeMinutes} min de lecture
                  </span>
                </div>
                <h3 className="text-base font-bold text-nomad-navy leading-snug hover:text-nomad-terracotta transition">
                  {post.title}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-stone-100 mt-4 flex items-center justify-between">
              <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                <User className="w-3 h-3 text-nomad-terracotta" /> {post.authorName}
              </span>
              <Link
                href={`/blog/${post.slug}`}
                className="text-xs font-bold text-nomad-terracotta flex items-center gap-1 hover:underline"
              >
                Lire <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
