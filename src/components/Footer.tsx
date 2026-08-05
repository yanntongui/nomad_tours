"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Globe, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-nomad-navy text-stone-300 pt-16 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white p-1 shadow">
                <Image src="/nomad-logo.jpg" alt="Nomad Tours" width={40} height={40} className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-2xl font-black text-white font-sans">
                  NOMAD<span className="text-nomad-terracotta">TOURS</span>
                </span>
                <span className="block text-[9px] uppercase tracking-widest text-stone-400 font-semibold -mt-1">
                  Agence de voyages & Tourisme au Bénin
                </span>
              </div>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed pr-4">
              Nomad Tours est votre agence de tourisme de référence au Bénin. Nous créons des expériences authentiques sur-mesure pour les voyageurs exigeants, les entreprises et les familles.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-stone-400">
              <span className="flex items-center gap-1 text-nomad-gold font-medium">
                <ShieldCheck className="w-4 h-4" />
                Agence Agréée Ministère du Tourisme Bénin
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base tracking-wide border-b border-stone-800 pb-2">
              Nos Destinations
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/destinations/ganvie-venise-afrique" className="hover:text-nomad-terracotta transition-colors">
                  Ganvié (Venise d'Afrique)
                </Link>
              </li>
              <li>
                <Link href="/destinations/ouidah-histoire-vaudou" className="hover:text-nomad-terracotta transition-colors">
                  Ouidah & Route des Esclaves
                </Link>
              </li>
              <li>
                <Link href="/destinations/parc-national-pendjari" className="hover:text-nomad-terracotta transition-colors">
                  Parc National de la Pendjari
                </Link>
              </li>
              <li>
                <Link href="/destinations/abomey-palais-royaux" className="hover:text-nomad-terracotta transition-colors">
                  Palais Royaux d'Abomey
                </Link>
              </li>
              <li>
                <Link href="/destinations/grand-popo-bouche-du-roy" className="hover:text-nomad-terracotta transition-colors">
                  Grand-Popo & Bouche du Roy
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base tracking-wide border-b border-stone-800 pb-2">
              Nos Services
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="text-stone-300">Circuits Touristiques Sur-Mesure</li>
              <li className="text-stone-300">Billetterie & Réservation de Vols</li>
              <li className="text-stone-300">Assistance e-Visa Bénin & International</li>
              <li className="text-stone-300">Événementiel & Séminaires d'Entreprise</li>
              <li className="text-stone-300">Accompagnement & Guides Professionnels</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base tracking-wide border-b border-stone-800 pb-2">
              Contact & Agence
            </h4>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-nomad-terracotta shrink-0 mt-1" />
                <span>Avenue Jean-Paul II, Haie Vive, Cotonou, Bénin</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-nomad-terracotta shrink-0" />
                <span>+229 01 97 00 00 00 / +229 95 00 00 00</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-nomad-terracotta shrink-0" />
                <span>contact@nomadtours.bj</span>
              </div>
              <div className="pt-2">
                <span className="text-xs text-stone-400 block mb-1 font-semibold">Paiements acceptés :</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="bg-stone-800 text-[10px] text-stone-200 px-2 py-1 rounded border border-stone-700">MTN Mobile Money</span>
                  <span className="bg-stone-800 text-[10px] text-stone-200 px-2 py-1 rounded border border-stone-700">Moov Money</span>
                  <span className="bg-stone-800 text-[10px] text-stone-200 px-2 py-1 rounded border border-stone-700">FedaPay</span>
                  <span className="bg-stone-800 text-[10px] text-stone-200 px-2 py-1 rounded border border-stone-700">Visa / Card</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Nomad Tours Bénin. Tous droits réservés.</p>
          <p className="flex items-center gap-1">
            Conçu avec <Heart className="w-3.5 h-3.5 text-nomad-terracotta fill-nomad-terracotta" /> pour la promotion du tourisme au Bénin.
          </p>
        </div>
      </div>
    </footer>
  );
}
