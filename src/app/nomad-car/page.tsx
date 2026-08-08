"use client";
import React from "react";
import { Car, Bus, MapPin, Users, CheckCircle2, MessageSquare, Briefcase, PartyPopper } from "lucide-react";

const fleet = [
  {
    icon: Car,
    title: "Berlines & SUV citadins",
    description: "Pour vos déplacements en ville, rendez-vous d'affaires ou transferts aéroport, avec ou sans chauffeur.",
  },
  {
    icon: Bus,
    title: "Minibus & Bus de groupe",
    description: "Toute capacité pour vos groupes : familles, délégations, équipes en séminaire ou voyage organisé.",
  },
  {
    icon: Briefcase,
    title: "Toute marque, tout besoin",
    description: "Un parc de véhicules variés — nous adaptons le véhicule à votre programme, pas l'inverse.",
  },
];

const useCases = [
  { icon: MapPin, label: "Courses en ville à Cotonou" },
  { icon: Car, label: "Voyages & liaisons inter-villes" },
  { icon: PartyPopper, label: "Événements, mariages & séminaires" },
  { icon: Users, label: "Transferts de groupe & délégations" },
];

export default function NomadCarPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-nomad-navy to-nomad-navy-light text-white rounded-3xl p-8 sm:p-10 shadow-lg space-y-3">
        <span className="bg-nomad-terracotta text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full">
          Nomad Car — Location de Véhicules
        </span>
        <h1 className="text-3xl sm:text-4xl font-black">Vous avez une sortie aujourd&apos;hui ?</h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-2xl">
          Courses en ville, voyages, événements — nous disposons de bus et véhicules de toute marque parfaitement adaptés à vos besoins.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fleet */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-nomad-navy">Notre flotte</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {fleet.map((item) => (
              <div key={item.title} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-nomad-terracotta/10 text-nomad-terracotta flex items-center justify-center">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-nomad-navy">{item.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-nomad-navy border-b border-stone-100 pb-3">
              Pour quelles occasions ?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {useCases.map((u) => (
                <div key={u.label} className="flex items-center gap-3 bg-stone-50 rounded-2xl p-4 border border-stone-200">
                  <u.icon className="w-4 h-4 text-nomad-gold shrink-0" />
                  <span className="text-xs font-semibold text-nomad-navy">{u.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-6">
          <div className="bg-emerald-900 text-white rounded-3xl p-6 shadow-md space-y-3 text-center">
            <MessageSquare className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-sm">Réserver un véhicule</h4>
            <p className="text-xs text-emerald-200">Décrivez votre besoin (dates, trajet, nombre de personnes) à nos conseillers.</p>
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
              <CheckCircle2 className="w-4 h-4 text-nomad-terracotta" />
              Nomad Car en un coup d&apos;œil
            </div>
            <p>Véhicules de toute marque, entretenus et adaptés à chaque sortie.</p>
            <p>Chauffeurs disponibles sur demande pour vos trajets en ville ou longue distance.</p>
            <p>Devis rapide par téléphone ou WhatsApp, sans engagement.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
