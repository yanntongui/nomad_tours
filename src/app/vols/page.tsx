"use client";
import React, { useState } from "react";
import { Plane, Calendar, Users, ArrowRight, ShieldCheck, CheckCircle2, Clock } from "lucide-react";

export default function FlightBookingPage() {
  const [origin, setOrigin] = useState("Cotonou (COO)");
  const [destination, setDestination] = useState("Paris (CDG)");
  const [departDate, setDepartDate] = useState("2026-09-15");
  const [returnDate, setReturnDate] = useState("2026-09-30");
  const [passengers, setPassengers] = useState(1);
  const [flightClass, setFlightClass] = useState("ECONOMY");
  const [searched, setSearched] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<any>(null);
  const [step, setStep] = useState<"search" | "passengers" | "payment" | "confirmed">("search");

  const mockFlights = [
    {
      id: "fl-1",
      airline: "Air France",
      logo: "AF",
      departTime: "23:45 COO",
      arrivalTime: "06:15+1 CDG",
      duration: "6h 30m (Vol direct)",
      priceXOF: 590000,
      priceEUR: 900,
    },
    {
      id: "fl-2",
      airline: "Brussels Airlines",
      logo: "SN",
      departTime: "22:10 COO",
      arrivalTime: "07:30+1 BRU",
      duration: "7h 20m (Vol direct)",
      priceXOF: 540000,
      priceEUR: 823,
    },
    {
      id: "fl-3",
      airline: "Royal Air Maroc",
      logo: "AT",
      departTime: "05:20 COO",
      arrivalTime: "15:40 CDG",
      duration: "9h 20m (1 escale Casa)",
      priceXOF: 440000,
      priceEUR: 670,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Banner */}
      <div className="bg-gradient-to-r from-nomad-navy to-stone-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg space-y-3">
        <span className="bg-nomad-terracotta text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full">
          Billetterie & Vols Internationaux
        </span>
        <h1 className="text-3xl sm:text-4xl font-black">Réservez vos Billets d&apos;Avion avec Nomad Tours</h1>
        <p className="text-xs sm:text-sm text-stone-300">
          Comparez les tarifs des meilleures compagnies (Air France, Corsair, Brussels Airlines, Royal Air Maroc, Ethiopian).
        </p>
      </div>

      {/* Flight Search Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearched(true);
            setStep("search");
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end text-left"
        >
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Ville de départ</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 focus:ring-2 focus:ring-nomad-terracotta outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Ville d&apos;arrivée</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 focus:ring-2 focus:ring-nomad-terracotta outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Date aller</label>
            <input
              type="date"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-stone-800 focus:ring-2 focus:ring-nomad-terracotta outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Date retour</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-stone-800 focus:ring-2 focus:ring-nomad-terracotta outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-nomad-terracotta hover:bg-nomad-terracotta-dark text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow transition flex items-center justify-center gap-2"
          >
            <Plane className="w-4 h-4" /> Rechercher des vols
          </button>
        </form>
      </div>

      {/* Results Section */}
      {searched && step === "search" && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-nomad-navy">
            Vols disponibles : {origin} → {destination}
          </h2>
          <div className="space-y-3">
            {mockFlights.map((flight) => (
              <div
                key={flight.id}
                className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-stone-100 font-black text-nomad-navy flex items-center justify-center text-sm border border-stone-200 shrink-0">
                    {flight.logo}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-nomad-navy">{flight.airline}</h3>
                    <p className="text-xs text-stone-500">{flight.duration}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs font-mono font-semibold text-stone-700">
                      <span>{flight.departTime}</span> → <span>{flight.arrivalTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
                  <div className="text-right">
                    <span className="text-xl font-black text-nomad-navy">
                      {flight.priceXOF.toLocaleString("fr-FR")} FCFA
                    </span>
                    <span className="text-xs text-stone-400 block font-normal">(~{flight.priceEUR} €)</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFlight(flight);
                      setStep("passengers");
                    }}
                    className="bg-nomad-navy hover:bg-nomad-navy-light text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow"
                  >
                    Sélectionner
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Passenger Details */}
      {step === "passengers" && selectedFlight && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-nomad-navy border-b border-stone-100 pb-3">
            Étape 1 sur 2 : Informations Passager
          </h2>
          <div className="bg-stone-50 p-4 rounded-2xl text-xs text-stone-700 space-y-1 border border-stone-200">
            <p className="font-bold text-nomad-navy">Vol sélectionné : {selectedFlight.airline}</p>
            <p>Départ : {origin} | Arrivée : {destination}</p>
            <p className="font-mono font-bold text-nomad-terracotta">
              Prix total : {selectedFlight.priceXOF.toLocaleString("fr-FR")} FCFA
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Nom & Prénom (comme sur le passeport)</label>
              <input
                type="text"
                placeholder="Ex: KOFFI KOSSI"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Numéro de Passeport</label>
                <input
                  type="text"
                  placeholder="N° Passeport"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Téléphone Mobile / WhatsApp</label>
                <input
                  type="tel"
                  placeholder="+229 97 00 00 00"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 outline-none"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep("payment")}
            className="w-full bg-nomad-terracotta text-white font-bold py-3 rounded-xl shadow transition"
          >
            Continuer vers le Paiement / Option
          </button>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === "payment" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-nomad-navy border-b border-stone-100 pb-3">
            Étape 2 sur 2 : Mode de Règlement
          </h2>
          <div className="space-y-3">
            <div className="border border-stone-200 rounded-2xl p-4 flex items-center justify-between hover:bg-stone-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xs">
                  MM
                </div>
                <div>
                  <h4 className="text-xs font-bold text-nomad-navy">Mobile Money (MTN / Moov Bénin)</h4>
                  <p className="text-[10px] text-stone-500">Paiement sécurisé via FedaPay</p>
                </div>
              </div>
              <input type="radio" name="pay" defaultChecked />
            </div>

            <div className="border border-stone-200 rounded-2xl p-4 flex items-center justify-between hover:bg-stone-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                  CB
                </div>
                <div>
                  <h4 className="text-xs font-bold text-nomad-navy">Carte Bancaire (Visa / Mastercard)</h4>
                  <p className="text-[10px] text-stone-500">Paiement international en ligne</p>
                </div>
              </div>
              <input type="radio" name="pay" />
            </div>
          </div>

          <button
            onClick={() => setStep("confirmed")}
            className="w-full bg-nomad-navy text-white font-bold py-3.5 rounded-xl shadow transition"
          >
            Confirmer l&apos;Option de Billet
          </button>
        </div>
      )}

      {/* Step 4: Confirmed */}
      {step === "confirmed" && (
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-lg text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-nomad-navy">Réservation Enregistrée !</h2>
          <p className="text-xs text-stone-600">
            Votre option de billet d&apos;avion a été transmise à notre pôle Billetterie à Cotonou. Un conseiller vous contactera par WhatsApp pour finaliser l&apos;émission du billet PNR.
          </p>
          <button
            onClick={() => setStep("search")}
            className="bg-stone-100 text-stone-800 font-bold px-6 py-2.5 rounded-xl text-xs"
          >
            Nouvelle recherche
          </button>
        </div>
      )}
    </div>
  );
}
