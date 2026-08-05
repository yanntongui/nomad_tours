"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatbotWidget from "@/components/ChatbotWidget";
import { QuoteModalProvider } from "@/context/QuoteModalContext";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <html lang="fr" className={`scroll-smooth ${fraunces.variable} ${inter.variable}`}>
      <head>
        <title>Nomad Tours | Agence de Tourisme au Bénin & Voyages Sur-Mesure</title>
        <meta
          name="description"
          content="Découvrez les trésors du Bénin (Ganvié, Ouidah, Pendjari, Abomey) et du monde avec Nomad Tours. Circuits touristiques, billetterie vols et assistance visa."
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF6F0] text-stone-800 antialiased">
        <QuoteModalProvider>
          {!isLandingPage && !isAdminRoute && <Header />}
          <main className="flex-grow">{children}</main>
          {!isLandingPage && !isAdminRoute && <Footer />}
          {!isAdminRoute && <ChatbotWidget />}
        </QuoteModalProvider>
      </body>
    </html>
  );
}
