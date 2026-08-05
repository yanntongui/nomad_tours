"use client";
import React, { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryModalProps {
  isOpen: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
  title?: string;
}

export default function GalleryModal({
  isOpen,
  images,
  initialIndex = 0,
  onClose,
  title = "Galerie Photos",
}: GalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!isOpen || images.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative max-w-5xl w-full h-[80vh] flex flex-col items-center justify-between">
        <div className="text-center text-white space-y-1 mb-2">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-xs text-stone-400">
            Photo {currentIndex + 1} sur {images.length}
          </p>
        </div>

        {/* Main Image */}
        <div className="relative w-full h-full max-h-[65vh] rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={images[currentIndex]}
            alt={`Photo ${currentIndex + 1}`}
            fill
            className="object-contain"
          />

          {/* Prev/Next buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition backdrop-blur-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition backdrop-blur-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto p-2 mt-4 max-w-full">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                idx === currentIndex ? "border-nomad-terracotta scale-105" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img} alt="thumb" fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
