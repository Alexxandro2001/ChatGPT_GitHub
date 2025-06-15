'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HeroSection() {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="w-full bg-white py-6 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Logo e Menu per Mobile */}
        <div className="flex justify-between items-center mb-8 md:hidden">
          <div className="flex items-center">
            <svg width="40" height="40" viewBox="0 0 200 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 7C19.4036 7 25 12.5964 25 19.5C25 26.4036 19.4036 32 12.5 32C5.59644 32 0 26.4036 0 19.5C0 12.5964 5.59644 7 12.5 7Z" fill="#f97316"/>
              <path d="M8 20L12 24L17 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M36 15H40L43 29H45L48 15H52L47 35H41L36 15Z" fill="black"/>
              <path d="M55 15H59V35H55V15Z" fill="black"/>
              <path d="M64 15H68L78 29V15H82V35H78L68 21V35H64V15Z" fill="black"/>
              <path d="M85 15H96V19H89V23H95V27H89V31H96V35H85V15Z" fill="black"/>
              <path d="M100 15H104L107 29H109L112 15H116L111 35H105L100 15Z" fill="#f97316"/>
            </svg>
            <span className="ml-2 text-xl font-bold">cyber</span>
          </div>
          <button className="text-black">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Contenuto principale */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16">
          {/* Testo */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold text-black mb-4">
              Benvenuto su Cyber Store
            </h1>
            <p className="text-base md:text-xl text-gray-700 mb-8">
              Scopri le migliori offerte di elettronica, smartphone, computer e accessori. Qualità e convenienza per ogni esigenza!
            </p>
            <a
              href="/prodotti"
              className="inline-block px-8 py-3 rounded-full bg-[#f97316] text-white font-semibold text-lg shadow hover:bg-orange-600 transition-colors"
            >
              Scopri ora
            </a>
          </div>
          {/* Immagine laterale */}
          <div className="flex-1 flex justify-center md:justify-end mb-8 md:mb-0">
            <div className="w-64 h-64 md:w-80 md:h-80 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
              {imageError ? (
                // Fallback per l'immagine mancante
                <div className="w-full h-full bg-[#f97316] flex items-center justify-center text-white text-4xl font-bold">
                  HERO
                </div>
              ) : (
                <Image
                  src="/images/hero.png"
                  alt="Hero"
                  width={320}
                  height={320}
                  className="object-contain w-full h-full"
                  priority
                  onError={() => setImageError(true)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 