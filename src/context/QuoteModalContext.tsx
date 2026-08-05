"use client";
import React, { createContext, useContext, useState } from "react";
import QuoteModal from "@/components/QuoteModal";

interface QuoteModalContextType {
  openQuoteModal: (destinationId?: string, circuitId?: string) => void;
  closeQuoteModal: () => void;
}

const QuoteModalContext = createContext<QuoteModalContextType>({
  openQuoteModal: () => {},
  closeQuoteModal: () => {},
});

export function QuoteModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [destId, setDestId] = useState<string | undefined>();
  const [circId, setCircId] = useState<string | undefined>();

  const openQuoteModal = (dId?: string, cId?: string) => {
    setDestId(dId);
    setCircId(cId);
    setIsOpen(true);
  };

  const closeQuoteModal = () => setIsOpen(false);

  return (
    <QuoteModalContext.Provider value={{ openQuoteModal, closeQuoteModal }}>
      {children}
      <QuoteModal
        isOpen={isOpen}
        onClose={closeQuoteModal}
        initialDestinationId={destId}
        initialCircuitId={circId}
      />
    </QuoteModalContext.Provider>
  );
}

export const useQuoteModal = () => useContext(QuoteModalContext);
