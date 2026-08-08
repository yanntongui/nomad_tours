"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckSquare,
  Square,
  Clock,
  MessageSquare,
  Camera,
  Star,
  AlertCircle,
  Download,
  Send,
  CheckCircle2,
  Sparkles,
  MapPin,
  PhoneCall,
} from "lucide-react";

export default function TripLifecyclePage() {
  const [activeTab, setActiveTab] = useState<"before" | "during" | "after">("before");

  // Checklist state
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Passeport valide +6 mois après retour", done: true },
    { id: 2, text: "Vaccin Fièvre Jaune à jour (Carnet Jaune)", done: true },
    { id: 3, text: "e-Visa Bénin approuvé & téléchargé", done: true },
    { id: 4, text: "Assurance voyage internationale", done: false },
    { id: 5, text: "Monnaie locale (FCFA) ou carte bancaire", done: false },
  ]);

  // Feed updates during trip
  const [updates, setUpdates] = useState([
    {
      id: 1,
      author: "Guide Rodrigue (Nomad Tours)",
      time: "Aujourd'hui à 08:30",
      message: "Bonjour à tous les participants ! Le bus safari part à 09h00 devant l'hôtelChez M à Ganvié. N'oubliez pas vos appareils photo !",
    },
    {
      id: 2,
      author: "Guide Rodrigue (Nomad Tours)",
      time: "Hier à 18:45",
      message: "Excellente arrivée du groupe à Cotonou. Demain matin nous naviguons vers la cité lacustre de Ganvié.",
    },
  ]);

  // Media wall
  const [mediaWall, setMediaWall] = useState([
    "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80",
  ]);

  // Feedback rating
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const toggleChecklist = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-nomad-navy via-nomad-navy-light to-stone-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-nomad-terracotta text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full">
            Module Transverse Voyage
          </span>
          <span className="bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] uppercase font-bold px-3 py-1 rounded-full">
            Statut : En cours / Confirmé
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black">Accompagnement & Suivi de Voyage</h1>
        <p className="text-xs sm:text-sm text-stone-300">
          Bienvenue dans votre espace voyage interactif. Suivez vos démarches avant le départ, l&apos;actualité sur place et votre retour.
        </p>
      </div>

      {/* Tabs Switcher (Avant / Pendant / Après) */}
      <div className="flex items-center gap-2 bg-white rounded-2xl p-2 border border-stone-200 shadow-sm max-w-xl mx-auto">
        <button
          onClick={() => setActiveTab("before")}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
            activeTab === "before"
              ? "bg-nomad-terracotta text-white shadow-md"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          🟠 Avant le Départ
        </button>
        <button
          onClick={() => setActiveTab("during")}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
            activeTab === "during"
              ? "bg-emerald-700 text-white shadow-md"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          🟢 Pendant le Voyage
        </button>
        <button
          onClick={() => setActiveTab("after")}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
            activeTab === "after"
              ? "bg-nomad-navy text-white shadow-md"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          🔵 Après le Voyage
        </button>
      </div>

      {/* TAB 1: AVANT LE DÉPART */}
      {activeTab === "before" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checklist */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs font-bold text-nomad-terracotta uppercase">Auto-Vérification</span>
                <h2 className="text-2xl font-black text-nomad-navy">Checklist Pré-Départ Personnalisée</h2>
              </div>
              <span className="text-xs font-bold text-stone-500">
                {checklist.filter((c) => c.done).length} / {checklist.length} complétés
              </span>
            </div>

            <div className="space-y-3">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-center gap-3 ${
                    item.done
                      ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                      : "bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100"
                  }`}
                >
                  {item.done ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-stone-400 shrink-0" />
                  )}
                  <span className={`text-xs sm:text-sm font-medium ${item.done ? "line-through opacity-80" : ""}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Schedule & Kit */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-nomad-navy border-b border-stone-100 pb-3">
                Échéancier de Paiement
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="font-bold text-emerald-900 block">Acompte N°1 (40%)</span>
                    <span className="text-emerald-700 text-[10px]">Payé le 05/07/2026</span>
                  </div>
                  <span className="font-black text-emerald-800">100 000 FCFA</span>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="font-bold text-amber-900 block">Solde Restant (60%)</span>
                    <span className="text-amber-700 text-[10px]">Échéance : 01/10/2026</span>
                  </div>
                  <span className="font-black text-amber-800">145 000 FCFA</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
              <h3 className="text-lg font-bold text-nomad-navy">Kit de Voyage Numérique</h3>
              <p className="text-xs text-stone-600">Téléchargez votre carnet de voyage hors-ligne.</p>
              <button className="w-full bg-nomad-terracotta text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Télécharger mon Kit (PDF)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PENDANT LE VOYAGE */}
      {activeTab === "during" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="border-b border-stone-100 pb-3">
                <span className="text-xs font-bold text-emerald-700 uppercase">Fil d&apos;Actualité en Direct</span>
                <h2 className="text-2xl font-black text-nomad-navy">Mises à Jour du Guide & du Groupe</h2>
              </div>

              <div className="space-y-4">
                {updates.map((u) => (
                  <div key={u.id} className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-nomad-navy">{u.author}</span>
                      <span className="text-[10px] text-stone-400">{u.time}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">{u.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Sharing Wall */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-nomad-navy flex items-center gap-2">
                <Camera className="w-5 h-5 text-nomad-terracotta" /> Mur Photo des Participants
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {mediaWall.map((img, idx) => (
                  <div key={idx} className="relative h-32 rounded-xl overflow-hidden bg-stone-100">
                    <Image src={img} alt="Participant photo" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency Button Sidebar */}
          <div className="space-y-6">
            <div className="bg-rose-900 text-white rounded-3xl p-6 shadow-xl space-y-3 text-center">
              <AlertCircle className="w-10 h-10 text-rose-300 mx-auto" />
              <h3 className="text-lg font-black">Assistance & Urgence 24h/24</h3>
              <p className="text-xs text-rose-200">
                Un problème durant le circuit ? Contactez immédiatement l&apos;agence ou le responsable local.
              </p>
              <a
                href="tel:+2290197000000"
                className="block bg-white text-rose-900 font-extrabold py-3 rounded-xl text-xs shadow transition"
              >
                Appeler l&apos;Urgence Nomad (+229)
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: APRÈS LE VOYAGE */}
      {activeTab === "after" && (
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-lg max-w-2xl mx-auto space-y-6 text-center">
          <div className="w-14 h-14 bg-nomad-terracotta-light text-nomad-terracotta rounded-full flex items-center justify-center mx-auto font-black text-xl">
            ★
          </div>
          <h2 className="text-2xl font-black text-nomad-navy">Questionnaire de Satisfaction Post-Voyage</h2>
          <p className="text-xs text-stone-600">
            Merci d&apos;avoir voyagé avec Nomad Tours ! Votre avis compte énormément pour continuer d&apos;améliorer nos prestations au Bénin.
          </p>

          {feedbackSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-5">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <h4 className="font-bold text-sm">Merci pour votre retour d&apos;expérience !</h4>
              <p className="text-xs text-emerald-700 mt-1">
                <strong>+50 points de fidélité</strong> ont été automatiquement crédités sur votre compte Nomad.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setFeedbackSubmitted(true);
              }}
              className="space-y-4 text-left"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Note globale du voyage</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFeedbackRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= feedbackRating
                            ? "fill-nomad-gold text-nomad-gold"
                            : "text-stone-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Votre commentaire ou suggestion</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Partagez vos impressions sur le guide, les hôtels, les repas..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-nomad-navy hover:bg-nomad-navy-light text-white font-bold py-3.5 rounded-xl shadow transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Envoyer mon Témoignage
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
