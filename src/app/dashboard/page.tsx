"use client";
import React from "react";
import Link from "next/link";
import {
  User,
  Compass,
  Clock,
  FileText,
  MessageSquare,
  Award,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Download,
} from "lucide-react";

export default function ClientDashboardPage() {
  const user = {
    name: "Amina Dossou",
    email: "a.dossou@gmail.com",
    phone: "+229 97 45 12 00",
    role: "CLIENT",
    loyaltyPoints: 450,
    tier: "Voyageur Privilège Gold",
  };

  const activeBookings = [
    {
      id: "bk-982",
      type: "CIRCUIT",
      title: "Trésors du Sud-Bénin (5 Jours)",
      dates: "12 Octobre - 17 Octobre 2026",
      status: "CONFIRMED",
      paymentStatus: "PARTIAL",
      totalPriceXOF: 245000,
      paidAmountXOF: 100000,
      tripId: "trip-benin-2026",
    },
  ];

  const pastBookings = [
    {
      id: "bk-412",
      type: "FLIGHT",
      title: "Vol Air France Cotonou - Paris",
      dates: "15 Janvier 2026",
      status: "COMPLETED",
      totalPriceXOF: 590000,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Welcome Banner */}
      <div className="bg-gradient-to-r from-nomad-navy to-nomad-navy-light text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-nomad-terracotta text-white font-black text-2xl flex items-center justify-center shadow-lg shrink-0">
            {user.name.charAt(0)}
          </div>
          <div>
            <span className="bg-nomad-gold/30 text-nomad-gold border border-nomad-gold/40 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full">
              ★ {user.tier}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">Bonjour, {user.name}</h1>
            <p className="text-xs text-stone-300">{user.email} • {user.phone}</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-right shrink-0">
          <span className="text-[10px] text-stone-300 uppercase font-semibold block">Points de Fidélité Nomad</span>
          <div className="flex items-center gap-1.5 justify-end">
            <Award className="w-5 h-5 text-nomad-gold fill-nomad-gold" />
            <span className="text-2xl font-black text-nomad-gold">{user.loyaltyPoints} pts</span>
          </div>
        </div>
      </div>

      {/* Dashboard Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active Trips & History */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Trip Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs font-bold text-nomad-terracotta uppercase tracking-wider block">
                  🟢 Voyage Réaffirmé / Prochain Départ
                </span>
                <h2 className="text-2xl font-black text-nomad-navy">Votre Voyage Actif</h2>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                Confirmé
              </span>
            </div>

            {activeBookings.map((b) => (
              <div key={b.id} className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-nomad-navy">{b.title}</h3>
                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-nomad-gold" /> {b.dates}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">Restant à payer</span>
                    <span className="text-sm font-black text-nomad-terracotta">
                      {(b.totalPriceXOF - b.paidAmountXOF).toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="text-xs text-stone-600">
                    Accompagnement pré-départ & carnet de voyage prêts.
                  </div>
                  <Link
                    href={`/voyages/${b.tripId}`}
                    className="w-full sm:w-auto bg-nomad-navy hover:bg-nomad-navy-light text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow transition flex items-center justify-center gap-1.5"
                  >
                    Accéder à mon Espace Voyage <ArrowRight className="w-4 h-4 text-nomad-gold" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Past Bookings */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-nomad-navy border-b border-stone-100 pb-3">
              Historique des Réservations
            </h3>
            <div className="space-y-3">
              {pastBookings.map((pb) => (
                <div key={pb.id} className="p-4 border border-stone-200 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-nomad-navy">{pb.title}</h4>
                    <p className="text-stone-500">{pb.dates}</p>
                  </div>
                  <span className="bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full font-bold">
                    Clôturé
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Documents & Support */}
        <div className="space-y-6">
          {/* Travel Documents */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-nomad-navy border-b border-stone-100 pb-3">
              Documents de Voyage
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 border border-stone-200 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-nomad-terracotta" />
                  <span>Voucher Hôtel & Circuit.pdf</span>
                </div>
                <Download className="w-4 h-4 text-stone-400 hover:text-nomad-navy cursor-pointer" />
              </div>
              <div className="p-3 border border-stone-200 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-nomad-terracotta" />
                  <span>Guide Pratique Bénin 2026.pdf</span>
                </div>
                <Download className="w-4 h-4 text-stone-400 hover:text-nomad-navy cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Agency Chat Support */}
          <div className="bg-stone-900 text-white rounded-3xl p-6 shadow-lg space-y-3">
            <div className="flex items-center gap-2 text-nomad-gold font-bold text-xs">
              <MessageSquare className="w-4 h-4" />
              Messagerie Agence 24/7
            </div>
            <p className="text-xs text-stone-300">
              Une question sur votre voyage ? Votre agent dédié répond directement via WhatsApp ou message.
            </p>
            <a
              href="https://wa.me/2290197247024"
              target="_blank"
              rel="noreferrer"
              className="block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow transition"
            >
              Discuter avec mon Conseiller
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
