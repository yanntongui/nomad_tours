"use client";
import React from "react";
import { Home, BedDouble, Building2, CheckCircle2, MessageSquare, ShieldCheck } from "lucide-react";

const offers = [
  {
    icon: BedDouble,
    title: "Réservation d'hôtels & Guest House",
    description: "Nous sélectionnons pour vous des hôtels et guest houses au Bénin et à l'international, adaptés à votre budget et à votre programme.",
  },
  {
    icon: Building2,
    title: "Location d'appartements & studios meublés",
    description: "Des appartements et studios meublés à Cotonou, idéals pour un séjour court, une mission professionnelle ou un long séjour.",
  },
];

export default function NomadHousePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-900 to-nomad-navy text-white rounded-3xl p-8 sm:p-10 shadow-lg space-y-3">
        <span className="bg-sky-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full">
          Nomad House — Feel Welcome
        </span>
        <h1 className="text-3xl sm:text-4xl font-black">Votre hébergement, où que vous soyez</h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-2xl">
          Réservation d&apos;hôtels et de Guest House, location d&apos;appartements et studios meublés — un point de chute pensé pour votre confort.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Offers */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-nomad-navy">Nos offres hébergement</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {offers.map((offer) => (
              <div key={offer.title} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
                  <offer.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-nomad-navy">{offer.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{offer.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-3 text-xs text-stone-700">
            <div className="flex items-center gap-2 text-nomad-navy font-bold text-sm border-b border-stone-100 pb-3 mb-1">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              Comment ça marche
            </div>
            <p>1. Indiquez vos dates, votre destination et le type de logement recherché.</p>
            <p>2. Nos conseillers vous proposent une sélection sous quelques heures.</p>
            <p>3. Réservation confirmée, paiement flexible (Mobile Money, virement, carte).</p>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-6">
          <div className="bg-emerald-900 text-white rounded-3xl p-6 shadow-md space-y-3 text-center">
            <MessageSquare className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-sm">Trouver un logement</h4>
            <p className="text-xs text-emerald-200">Parlez-nous de votre séjour, nos conseillers vous répondent sous peu.</p>
            <a
              href="https://wa.me/2290197247024"
              target="_blank"
              rel="noreferrer"
              className="block bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs shadow transition"
            >
              Discuter sur WhatsApp
            </a>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-2.5 text-xs text-stone-700">
            <div className="flex items-center gap-2 text-nomad-navy font-bold text-sm border-b border-stone-100 pb-3 mb-1">
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              <span className="flex items-center gap-1.5">
                <Home className="w-4 h-4 text-sky-600" /> Nomad House en un coup d&apos;œil
              </span>
            </div>
            <p>Hôtels, guest houses, appartements et studios meublés sélectionnés par nos équipes.</p>
            <p>Séjours courts ou longue durée, à Cotonou comme à l&apos;international.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
