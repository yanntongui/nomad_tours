"use client";
import React, { useState } from "react";
import { FileCheck, Upload, CheckCircle2, Clock, ShieldCheck, AlertCircle, Send } from "lucide-react";

export default function VisasPage() {
  const [selectedCountry, setSelectedCountry] = useState("Bénin (e-Visa Touristique)");
  const [submitted, setSubmitted] = useState(false);

  const visaCountries = [
    {
      name: "Bénin (e-Visa Touristique / Affaires)",
      badge: "e-Visa 100% En Ligne",
      processingTime: "24 à 48 heures",
      feeXOF: 35000,
      documents: [
        "Scan lisible de la page d'identité du Passeport (Valide +6 mois)",
        "Photo d'identité récente sur fond blanc",
        "Copie du billet d'avion aller-retour ou réservation",
        "Adresse d'hébergement au Bénin (Hôtel ou certificat)"
      ]
    },
    {
      name: "Schengen / France (Assistance Constitution Dossier)",
      badge: "Visa Requis sur RDV",
      processingTime: "15 jours ouvrés",
      feeXOF: 75000,
      documents: [
        "Formulaire officiel de demande de visa signé",
        "Justificatifs de ressources financières (3 derniers relevés bancaires)",
        "Attestation d'assurance voyage couverture 30 000€",
        "Réservation d'hôtel ou lettre d'invitation officielle"
      ]
    },
    {
      name: "Afrique du Sud (e-Visa / Consulat)",
      badge: "Assistance Visa",
      processingTime: "7 à 10 jours",
      feeXOF: 50000,
      documents: [
        "Passeport en cours de validité avec au moins 2 pages vierges",
        "Relevé bancaire certifié récent",
        "Itinéraire de voyage détaillé fourni par Nomad Tours"
      ]
    }
  ];

  const currentCountryInfo = visaCountries.find((c) => c.name === selectedCountry) || visaCountries[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-600 to-nomad-terracotta text-white rounded-3xl p-8 sm:p-10 shadow-lg space-y-3">
        <span className="bg-white/20 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full backdrop-blur-sm">
          Pôle Administratif & Visas
        </span>
        <h1 className="text-3xl sm:text-4xl font-black">Assistance e-Visa & Visas Internationaux</h1>
        <p className="text-xs sm:text-sm text-stone-100">
          Nomad Tours s'occupe de la vérification de vos pièces, de la saisie des formulaires officiels et du suivi de statut auprès des ambassades.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Country Selector & Document Checklist */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selector */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
            <label className="text-xs font-bold text-stone-700 block">Choisissez la destination du Visa :</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm text-nomad-navy font-bold focus:ring-2 focus:ring-nomad-terracotta outline-none"
            >
              {visaCountries.map((c, i) => (
                <option key={i} value={c.name}>
                  {c.name} ({c.badge})
                </option>
              ))}
            </select>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-100 pb-4">
              <div>
                <span className="bg-nomad-navy text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full">
                  {currentCountryInfo.badge}
                </span>
                <h2 className="text-2xl font-black text-nomad-navy mt-1">{currentCountryInfo.name}</h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-stone-400 uppercase font-semibold block">Frais du service</span>
                <span className="text-xl font-black text-nomad-terracotta">
                  {currentCountryInfo.feeXOF.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-nomad-navy flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-nomad-terracotta" /> Documents Requis (Checklist Officielle) :
              </h3>
              <div className="space-y-2">
                {currentCountryInfo.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-stone-800 font-medium leading-relaxed">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Délai estimé de traitement :</strong> {currentCountryInfo.processingTime}.
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Notifications automatiques envoyées par WhatsApp & Email à chaque changement d'étape.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form: Document Upload Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-lg space-y-5 sticky top-28">
            <h3 className="text-xl font-black text-nomad-navy border-b border-stone-100 pb-3">
              Soumettre une Demande
            </h3>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-5 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm">Dossier Transmis !</h4>
                <p className="text-xs text-emerald-700">
                  Votre agent visa Nomad Tours vérifie vos fichiers sous 2h et lance la procédure officielle.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs underline font-bold text-emerald-800 pt-2"
                >
                  Autre demande
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-3"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Nom & Prénom du demandeur</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dossou Marc"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Numéro WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="+229 97 00 00 00"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Téléverser le Passeport (PDF / JPG)</label>
                  <div className="border-2 border-dashed border-stone-300 hover:border-nomad-terracotta rounded-xl p-4 text-center cursor-pointer bg-stone-50 transition">
                    <Upload className="w-6 h-6 text-stone-400 mx-auto mb-1" />
                    <span className="text-xs text-stone-600 font-medium">Cliquez pour sélectionner un fichier</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-nomad-terracotta hover:bg-nomad-terracotta-dark text-white font-bold py-3.5 rounded-xl shadow transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Envoyer mon Dossier
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
