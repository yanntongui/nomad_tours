"use client";
import React, { useState } from "react";
import { X, Send, CheckCircle2, Calendar, Users, Mail, Phone, User, Sparkles } from "lucide-react";
import { DESTINATIONS } from "@/lib/data/destinations";
import { CIRCUITS } from "@/lib/data/circuits";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDestinationId?: string;
  initialCircuitId?: string;
}

export default function QuoteModal({
  isOpen,
  onClose,
  initialDestinationId,
  initialCircuitId,
}: QuoteModalProps) {
  const [destinationId, setDestinationId] = useState(initialDestinationId || "");
  const [circuitId, setCircuitId] = useState(initialCircuitId || "");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [passengersCount, setPassengersCount] = useState(2);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-stone-200 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={resetForm}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-nomad-navy">Demande transmise avec succès !</h3>
            <p className="text-sm text-stone-600 max-w-md mx-auto">
              Merci <strong>{fullName}</strong>. Votre conseiller Nomad Tours à Cotonou étudie vos souhaits de voyage et vous enverra un devis détaillé sous <strong>24h</strong>.
            </p>
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs text-stone-600 space-y-1 text-left">
              <p className="font-bold text-nomad-navy flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-nomad-gold" /> Récapitulatif de votre demande :
              </p>
              <p>• Destination : {DESTINATIONS.find((d) => d.id === destinationId)?.name || "Sur-mesure"}</p>
              <p>• Nombre de voyageurs : {passengersCount} personne(s)</p>
              <p>• Date souhaitée : {startDate || "Flexible"}</p>
              <p>• Contact : {email} ({phone})</p>
            </div>
            <button
              onClick={resetForm}
              className="bg-nomad-terracotta text-white font-bold px-8 py-3 rounded-xl hover:bg-nomad-terracotta-dark shadow transition mt-4"
            >
              Fermer la fenêtre
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-xs font-bold text-nomad-terracotta uppercase tracking-wider block">
                Nomad Tours • Bénin & International
              </span>
              <h3 className="text-2xl font-black text-nomad-navy">Demander un Devis Sur-Mesure</h3>
              <p className="text-xs text-stone-500 mt-1">
                Gratuit et sans engagement. Nos experts préparent votre itinéraire personnalisé.
              </p>
            </div>

            {/* Select Destination */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Destination souhaitée</label>
              <select
                value={destinationId}
                onChange={(e) => setDestinationId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-800 focus:ring-2 focus:ring-nomad-terracotta outline-none"
              >
                <option value="">Sélectionner une destination...</option>
                {DESTINATIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.country})
                  </option>
                ))}
              </select>
            </div>

            {/* Circuit Option */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Circuit (optionnel)</label>
              <select
                value={circuitId}
                onChange={(e) => setCircuitId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-800 focus:ring-2 focus:ring-nomad-terracotta outline-none"
              >
                <option value="">Création d&apos;itinéraire sur-mesure</option>
                {CIRCUITS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.durationDays} Jours)
                  </option>
                ))}
              </select>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-nomad-terracotta" /> Nom complet *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Koffi Mensah"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-800 focus:ring-2 focus:ring-nomad-terracotta outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-nomad-terracotta" /> Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-800 focus:ring-2 focus:ring-nomad-terracotta outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-nomad-terracotta" /> Téléphone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+229 97 00 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-800 focus:ring-2 focus:ring-nomad-terracotta outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-nomad-terracotta" /> Date souhaitée
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-sm text-stone-800 focus:ring-2 focus:ring-nomad-terracotta outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-nomad-terracotta" /> Voyageurs
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={passengersCount}
                  onChange={(e) => setPassengersCount(parseInt(e.target.value) || 1)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-800 focus:ring-2 focus:ring-nomad-terracotta outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Remarques ou besoins particuliers</label>
              <textarea
                rows={2}
                placeholder="Type d'hébergement, préférences alimentaires, activités souhaitées..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-800 focus:ring-2 focus:ring-nomad-terracotta outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-nomad-terracotta hover:bg-nomad-terracotta-dark text-white font-bold text-base py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Envoyer ma demande de devis
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
