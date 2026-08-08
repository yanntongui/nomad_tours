"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Compass, Calendar, Menu, X, Plane, FileCheck, Send, User, LogIn, Car, Home } from "lucide-react";
import { useQuoteModal } from "@/context/QuoteModalContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openQuoteModal } = useQuoteModal();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-nomad-navy text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-stone-200">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-nomad-gold" />
              Agence basée à Cotonou, Bénin
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-nomad-gold" />
              +229 01 97 24 70 24 / WhatsApp
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="bg-nomad-terracotta text-white px-2 py-0.5 rounded-full font-medium text-[11px]">
              ★ Spécialiste Bénin & International
            </span>
            <span className="text-stone-300 font-light">FR | EN</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform">
              <Image src="/nomad-logo.jpg" alt="Nomad Tours" width={48} height={48} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-nomad-navy font-sans">
                NOMAD<span className="text-nomad-terracotta">TOURS</span>
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-stone-500 font-semibold -mt-1">
                Voyages & Expériences Bénin
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 font-medium text-stone-700 text-xs xl:text-sm">
            <Link href="/" className="hover:text-nomad-terracotta transition-colors py-1">
              Accueil
            </Link>
            <Link href="/destinations" className="hover:text-nomad-terracotta transition-colors py-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-nomad-terracotta" />
              Destinations
            </Link>
            <Link href="/circuits" className="hover:text-nomad-terracotta transition-colors py-1 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-nomad-gold" />
              Circuits
            </Link>
            <Link href="/vols" className="hover:text-nomad-terracotta transition-colors py-1 flex items-center gap-1">
              <Plane className="w-3.5 h-3.5 text-blue-600" />
              Vols
            </Link>
            <Link href="/visas" className="hover:text-nomad-terracotta transition-colors py-1 flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5 text-amber-600" />
              Visas
            </Link>
            <Link href="/nomad-car" className="hover:text-nomad-terracotta transition-colors py-1 flex items-center gap-1">
              <Car className="w-3.5 h-3.5 text-nomad-terracotta" />
              Nomad Car
            </Link>
            <Link href="/nomad-house" className="hover:text-nomad-terracotta transition-colors py-1 flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-sky-600" />
              Nomad House
            </Link>
            <Link href="/evenements" className="hover:text-nomad-terracotta transition-colors py-1">
              Événements
            </Link>
            <Link href="/dashboard" className="hover:text-nomad-terracotta transition-colors py-1 font-bold text-nomad-navy flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-nomad-terracotta" />
              Espace Client
            </Link>
            <Link href="/admin" className="text-stone-400 hover:text-stone-700 text-xs px-2.5 py-1 bg-stone-100 rounded-lg flex items-center gap-1">
              <LogIn className="w-3 h-3" />
              Connexion
            </Link>
          </nav>

          {/* CTA & Actions */}
          <div className="hidden xl:flex items-center gap-3">
            <button
              onClick={() => openQuoteModal()}
              className="bg-nomad-terracotta hover:bg-nomad-terracotta-dark text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Demander un devis
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-nomad-navy hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-3 text-sm">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-800 font-medium hover:text-nomad-terracotta"
          >
            Accueil
          </Link>
          <Link
            href="/destinations"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-800 font-medium hover:text-nomad-terracotta"
          >
            Destinations Bénin & International
          </Link>
          <Link
            href="/circuits"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-800 font-medium hover:text-nomad-terracotta"
          >
            Circuits Touristiques
          </Link>
          <Link
            href="/vols"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-800 font-medium hover:text-nomad-terracotta"
          >
            Billetterie & Vols
          </Link>
          <Link
            href="/visas"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-800 font-medium hover:text-nomad-terracotta"
          >
            Assistance e-Visa
          </Link>
          <Link
            href="/nomad-car"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-800 font-medium hover:text-nomad-terracotta"
          >
            Nomad Car — Location de Véhicules
          </Link>
          <Link
            href="/nomad-house"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-800 font-medium hover:text-nomad-terracotta"
          >
            Nomad House — Hébergement
          </Link>
          <Link
            href="/evenements"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-800 font-medium hover:text-nomad-terracotta"
          >
            Événementiel & MICE
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-nomad-navy font-bold hover:text-nomad-terracotta"
          >
            Espace Client (Dashboard)
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-500 font-medium hover:text-nomad-navy flex items-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5" />
            Connexion (personnel)
          </Link>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openQuoteModal();
            }}
            className="w-full mt-3 bg-nomad-terracotta text-white py-3 rounded-xl font-semibold text-center flex items-center justify-center gap-2 shadow"
          >
            <Send className="w-4 h-4" />
            Demander un devis sur-mesure
          </button>
        </div>
      )}
    </header>
  );
}
