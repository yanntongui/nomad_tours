"use client";
import React from "react";
import { useQuoteModal } from "@/context/QuoteModalContext";

export function BlogQuoteCta() {
  const { openQuoteModal } = useQuoteModal();
  return (
    <button
      onClick={() => openQuoteModal()}
      className="bg-nomad-terracotta hover:bg-nomad-terracotta-dark text-white font-bold text-sm px-6 py-3 rounded-xl shadow transition"
    >
      Demander un Devis Gratuit
    </button>
  );
}
