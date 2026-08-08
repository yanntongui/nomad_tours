"use client";
import React, { useState } from "react";
import { PartyPopper, Users, Calendar, Sparkles, CheckCircle2, Send, ArrowRight, Building, Heart, Award } from "lucide-react";

export default function EventsPage() {
  const [step, setStep] = useState(1);
  const [eventType, setEventType] = useState("Séminaire / Team Building");
  const [guestCount, setGuestCount] = useState(30);
  const [budget, setBudget] = useState(1500000);
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "Lieu & Hébergement",
    "Restauration & Traiteur",
  ]);
  const [eventDate, setEventDate] = useState("2026-11-20");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const servicesList = [
    "Lieu & Hébergement sur-mesure",
    "Restauration & Traiteur gastronomique",
    "Animation musicale & DJ pro",
    "Décoration thématique & Scénographie",
    "Photographe & Vidéaste Drone",
    "Transport VIP & Navettes invités",
  ];

  const toggleService = (serv: string) => {
    setSelectedServices((prev) =>
      prev.includes(serv) ? prev.filter((s) => s !== serv) : [...prev, serv]
    );
  };

  const estimatedQuoteXOF = guestCount * 35000 + selectedServices.length * 150000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-nomad-navy text-white rounded-3xl p-8 sm:p-10 shadow-lg space-y-3">
        <span className="bg-white/20 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full backdrop-blur-sm">
          Pôle Événementiel & MICE Bénin
        </span>
        <h1 className="text-3xl sm:text-4xl font-black">Organisation d&apos;Événements d&apos;Exception</h1>
        <p className="text-xs sm:text-sm text-stone-200">
          Séminaires d&apos;entreprise, mariages d&apos;exception, team-building en bord de mer et soirées privées.
        </p>
      </div>

      {/* Configurator Wizard */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-lg space-y-8 max-w-3xl mx-auto">
        <div className="flex justify-between items-center border-b border-stone-100 pb-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Configurateur Interactif</span>
            <h2 className="text-2xl font-black text-nomad-navy">Concevez votre Événement</h2>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
            Étape {step} sur 3
          </span>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-nomad-navy">Devis Événementiel Généré !</h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              Merci <strong>{fullName}</strong>. Votre devis estimatif d&apos;un montant d&apos;environ <strong>{estimatedQuoteXOF.toLocaleString("fr-FR")} FCFA</strong> a été envoyé à l&apos;équipe Nomad Events.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setStep(1);
              }}
              className="bg-nomad-navy text-white font-bold px-6 py-2.5 rounded-xl text-xs"
            >
              Configurer un autre événement
            </button>
          </div>
        ) : (
          <>
            {/* Step 1: Event type & Guests */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-700">Type d&apos;Événement</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      "Séminaire / Team Building",
                      "Mariage d'Exception",
                      "Anniversaire & Fête Privée",
                      "Lancement de Produit / Gala",
                    ].map((type, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setEventType(type)}
                        className={`p-4 rounded-2xl border text-left text-xs font-bold transition flex items-center justify-between ${
                          eventType === type
                            ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm ring-2 ring-emerald-600/30"
                            : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
                        }`}
                      >
                        <span>{type}</span>
                        {eventType === type && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Nombre d&apos;Invités Estimé</label>
                    <input
                      type="number"
                      min={5}
                      max={1000}
                      value={guestCount}
                      onChange={(e) => setGuestCount(parseInt(e.target.value) || 10)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Date souhaitée</label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-stone-800 outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl shadow transition flex items-center justify-center gap-2"
                >
                  Étape Suivante (Services & Prestations) <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: Services Selection */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-700">Sélectionnez les prestations souhaitées :</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {servicesList.map((serv, idx) => {
                      const isSelected = selectedServices.includes(serv);
                      return (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => toggleService(serv)}
                          className={`p-3.5 rounded-2xl border text-left text-xs font-bold transition flex items-center justify-between ${
                            isSelected
                              ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm"
                              : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
                          }`}
                        >
                          <span>{serv}</span>
                          <input type="checkbox" checked={isSelected} readOnly className="rounded text-emerald-600" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs flex justify-between items-center">
                  <span className="font-bold text-stone-700">Estimation automatique du devis :</span>
                  <span className="text-lg font-black text-emerald-700">
                    {estimatedQuoteXOF.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="w-1/3 bg-stone-100 text-stone-700 font-bold py-3 rounded-xl text-xs"
                  >
                    Retour
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="w-2/3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow transition"
                  >
                    Recevoir mon Devis Officiel
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Contact & Submit */}
            {step === 3 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Nom & Prénom du responsable</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Bio Salifou"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Email professionnel</label>
                    <input
                      type="email"
                      required
                      placeholder="bio@entreprise.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Téléphone / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      placeholder="+229 97 00 00 00"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl shadow transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Transmettre ma demande d&apos;événement
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
