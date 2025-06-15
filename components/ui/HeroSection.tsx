'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HeroSection() {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16">
        {/* Testo */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-4">
            Benvenuto su Cyber Store
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
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
              <div className="w-full h-full bg-orange-500 flex items-center justify-center text-white text-4xl font-bold">
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
    </section>
  );
} 