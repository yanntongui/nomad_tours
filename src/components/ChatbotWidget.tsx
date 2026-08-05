"use client";
import React, { useState } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Bonjour ! Je suis l'assistant virtuel Nomad Tours. Comment puis-je vous aider pour votre projet de voyage au Bénin ?",
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInput("");

    setTimeout(() => {
      let botReply =
        "Merci pour votre question ! Un conseiller Nomad Tours est disponible pour étudier votre projet. Souhaitez-vous recevoir un devis personnalisé ou discuter sur WhatsApp ?";
      const lower = userMsg.toLowerCase();
      if (lower.includes("ganvié") || lower.includes("ganvie")) {
        botReply =
          "Ganvié est la plus grande cité lacustre d'Afrique. Nous organisons des visites guidées en pirogue privée avec départ de Cotonou ou Abomey-Calavi.";
      } else if (lower.includes("ouidah") || lower.includes("vaudou")) {
        botReply =
          "À Ouidah, nous faisons découvrir le Temple des Pythons, la Route des Esclaves et le berceau de la culture Vaudou.";
      } else if (lower.includes("visa")) {
        botReply =
          "Nous assistons les voyageurs pour l'e-Visa Bénin (obtenu en 24-48h). Rendez-vous sur notre rubrique Visas pour soumettre vos pièces.";
      } else if (lower.includes("safari") || lower.includes("pendjari")) {
        botReply =
          "Le Safari Pendjari est idéal de Décembre à Avril pour observer lions et éléphants. Nos circuits 7 jours incluent véhicule 4x4 et guide ranger.";
      }

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-nomad-terracotta hover:bg-nomad-terracotta-dark text-white rounded-full shadow-2xl flex items-center justify-center group transition transform hover:scale-105"
        >
          <MessageSquare className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-nomad-gold rounded-full border-2 border-white animate-ping" />
        </button>
      ) : (
        <div className="w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col h-[460px] animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Chat Header */}
          <div className="bg-nomad-navy text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-nomad-terracotta flex items-center justify-center font-bold text-xs">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold">Assistant Nomad Tours</h4>
                <span className="text-[10px] text-emerald-400 font-medium">● En ligne à Cotonou</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-300 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "bot" && (
                  <div className="w-6 h-6 rounded-full bg-nomad-terracotta text-white flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                    m.sender === "user"
                      ? "bg-nomad-terracotta text-white rounded-tr-none"
                      : "bg-white border border-stone-200 text-stone-800 shadow-sm rounded-tl-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex gap-2">
            <input
              type="text"
              placeholder="Posez une question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-stone-100 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 outline-none"
            />
            <button
              type="submit"
              className="bg-nomad-terracotta text-white p-2 rounded-xl hover:bg-nomad-terracotta-dark transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
