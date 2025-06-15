'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number | string;
  image: string;
  onAddToCart?: () => void;
}

export default function ProductCard({ id, name, price, image, onAddToCart }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const formattedPrice = typeof price === 'number' 
    ? `$${price}` 
    : price;

  return (
    <div className="bg-white rounded-lg overflow-hidden flex flex-col relative">
      {/* Favorite Button */}
      <button 
        onClick={handleToggleFavorite}
        className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center"
        aria-label={isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
      >
        {isFavorite ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f97316" className="w-6 h-6">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        )}
      </button>

      {/* Product Image */}
      <Link href={`/prodotti/${id}`} className="block relative w-full aspect-square bg-gray-50">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-2"
        />
      </Link>

      {/* Product Info */}
      <div className="p-3 flex flex-col flex-grow">
        <Link href={`/prodotti/${id}`} className="block">
          <h3 className="text-sm font-medium text-black line-clamp-2 mb-1">{name}</h3>
        </Link>
        <div className="mt-auto">
          <p className="text-lg font-bold text-black mb-2">{formattedPrice}</p>
          <button
            onClick={onAddToCart}
            className="w-full py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
} 