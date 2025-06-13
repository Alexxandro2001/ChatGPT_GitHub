'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import useCartStore from '@/store/cartStore';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  sku: string;
  category: string;
}

export default function ProductCard({ id, name, price, image, sku, category }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      id,
      name,
      price,
      image,
      sku
    });
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow flex flex-col overflow-hidden">
      <div className="relative w-full aspect-square bg-gray-100 flex items-center justify-center">
        <Image
          src={image}
          alt={name}
          width={300}
          height={300}
          className="object-contain w-full h-full"
        />
      </div>
      <div className="flex-1 flex flex-col p-4">
        <h3 className="text-black font-semibold text-base mb-2 line-clamp-2 min-h-[48px]">{name}</h3>
        <div className="text-lg font-bold text-black mb-4">{typeof price === 'number' ? price.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' }) : price}</div>
        <button
          onClick={handleAddToCart}
          className="mt-auto flex items-center justify-center gap-2 bg-[#f97316] hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.5 17h9a1 1 0 00.85-1.53L17 13M7 13V6a1 1 0 011-1h8a1 1 0 011 1v7" />
          </svg>
          Aggiungi al carrello
        </button>
      </div>
    </div>
  );
} 