'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@prisma/client';
import useCartStore from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const cartStore = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  
  // Gestisce l'aggiunta del prodotto al carrello
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Previene la navigazione se il pulsante è all'interno di un link
    e.stopPropagation();
    
    setIsAdding(true);
    
    cartStore.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl || '/images/placeholder.jpg',
      sku: product.sku || '',
    });
    
    setTimeout(() => setIsAdding(false), 500);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg flex flex-col min-h-[420px]">
      {/* Immagine prodotto */}
      <div className="relative h-48 bg-gray-100">
        <Link href={`/prodotti/${product.id}`}>
          <Image
            src={product.imageUrl || '/images/placeholder.jpg'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </Link>
        
        {/* Badge disponibilità */}
        <div className="absolute top-2 left-2">
          {product.stock <= 0 ? (
            <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded-md font-medium">
              Esaurito
            </span>
          ) : (
            <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-md font-medium">
              Disponibile
            </span>
          )}
        </div>
      </div>
      
      {/* Dettagli prodotto */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Categoria */}
        {product.category && (
          <div className="text-xs text-orange-500 font-medium mb-1">{product.category}</div>
        )}
        
        {/* Nome prodotto */}
        <Link href={`/prodotti/${product.id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-orange-500 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        {/* Descrizione troncata (se disponibile) */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {product.description}
          </p>
        )}
        
        {/* Spazio flessibile per mantenere il layout allineato */}
        <div className="flex-grow"></div>
        
        {/* Prezzo */}
        <div className="flex justify-between items-center mt-4 mb-3">
          <span className="text-xl font-bold">{formatCurrency(product.price)}</span>
        </div>
        
        {/* Pulsante aggiungi al carrello */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-3 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-all flex items-center justify-center gap-2 font-medium ${
            isAdding ? 'animate-pulse' : ''
          } ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
          aria-label={`Aggiungi ${product.name} al carrello`}
          disabled={product.stock <= 0}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
          <span>Aggiungi al carrello</span>
        </button>
      </div>
    </div>
  );
} 