"use client";
import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, Compass } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Demande d'information");
  const [message, setMessage] = useState("");

  const faqs = [
    {
      q: "Où se situe l'agence Nomad Tours à Cotonou ?",
      a: "Notre agence principale est située à l'Avenue Jean-Paul II, quartier Haie Vive à Cotonou (Bénin), à 5 minutes de l'aéroport international Cadjehoun.",
    },
    {
      q: "Quels sont vos horaires d'ouverture ?",
      a: "Nos bureaux sont ouverts du Lundi au Samedi de 08h00 à 19h00. Notre service d'assistance par WhatsApp est disponible 24h/24 et 7j/7 pour les clients en voyage.",
    },
    {
      q: "Combien de temps à l'avance faut-il réserver un circuit ?",
      a: "Pour les circuits au Bénin, nous recommandons de réserver au moins 2 semaines à l'avance (particulièrement pour le Safari Pendjari et le Festival Vaudou de Janvier).",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-nomad-navy to-nomad-navy-light text-white rounded-3xl p-8 sm:p-10 shadow-lg space-y-3">
        <span className="bg-nomad-terracotta text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full">
          Service Client & Agence
        </span>
        <h1 className="text-3xl sm:text-4xl font-black">Contactez Nomad Tours Cotonou</h1>
        <p className="text-xs sm:text-sm text-stone-300">
          Nos conseillers en voyage vous répondent par message, téléphone ou vous accueillent directement à notre agence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Contact Infos & FAQ */}
        <div className="lg:col-span-1 space-y-6">
          {/* Agency Details */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-nomad-navy border-b border-stone-100 pb-3">
              Nos Coordonnées
            </h3>
            <div className="space-y-3 text-xs text-stone-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-nomad-terracotta shrink-0 mt-1" />
                <div>
                  <span className="font-bold text-nomad-navy block">Agence Cotonou</span>
                  <span>Avenue Jean-Paul II, Haie Vive, Cotonou, Bénin</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-nomad-terracotta shrink-0" />
                <div>
                  <span className="font-bold text-nomad-navy block">Téléphone & WhatsApp</span>
                  <span>+229 01 97 00 00 00 / +229 95 00 00 00</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-nomad-terracotta shrink-0" />
                <div>
                  <span className="font-bold text-nomad-navy block">Email Général</span>
                  <span>contact@nomadtours.bj</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-nomad-gold shrink-0" />
                <div>
                  <span className="font-bold text-nomad-navy block">Horaires Bureau</span>
                  <span>Lun - Sam : 08h00 - 19h00 (WAT)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Action */}
          <div className="bg-emerald-900 text-white rounded-3xl p-6 shadow-md space-y-3 text-center">
            <MessageSquare className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-sm">Discuter sur WhatsApp</h4>
            <p className="text-xs text-emerald-200">Réponse immédiate de nos agents de garde à Cotonou.</p>
            <a
              href="https://wa.me/2290197000000"
              target="_blank"
              rel="noreferrer"
              className="block bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs shadow transition"
            >
              Ouvrir WhatsApp
            </a>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-black text-nomad-navy border-b border-stone-100 pb-3">
            Envoyer un Message à l'Équipe
          </h2>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-6 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-xl font-bold">Message Reçu !</h3>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                Merci <strong>{name}</strong>. Notre équipe a bien enregistré votre message et vous répondra à l'adresse <strong>{email}</strong> sous quelques heures.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-nomad-navy text-white text-xs font-bold px-6 py-2.5 rounded-xl"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Nom & Prénom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Armel Sagbo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Adresse Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="armel@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Sujet de votre demande</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 outline-none"
                >
                  <option value="Demande d'information">Demande d'information générale</option>
                  <option value="Circuit sur-mesure">Circuit touristique sur-mesure</option>
                  <option value="Billetterie vol">Billetterie & Réservation vol</option>
                  <option value="Visa">Assistance Visa</option>
                  <option value="Partenariat">Partenariat & Agence</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Votre message *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Décrivez votre projet de voyage ou votre question..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-stone-800 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-nomad-terracotta hover:bg-nomad-terracotta-dark text-white font-bold text-sm py-3.5 rounded-xl shadow transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Envoyer le Message
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <h2 className="text-2xl font-black text-nomad-navy border-b border-stone-100 pb-3">
          Foire Aux Questions (FAQ)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-2">
              <h4 className="text-xs font-bold text-nomad-navy flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-nomad-terracotta shrink-0" /> {faq.q}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
