'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@prisma/client';
import useCartStore from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';

// Estendi il tipo Product con i campi aggiuntivi
interface ExtendedProduct extends Product {
  imageUrls: string[];
  specifications: Record<string, string | number | boolean>;
}

interface ProductDetailProps {
  product: ExtendedProduct;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [mainImage, setMainImage] = useState<string>(product.imageUrls[0] || '/images/placeholder.jpg');
  const [quantity, setQuantity] = useState<number>(1);
  const [specsOpen, setSpecsOpen] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  
  const { addItem } = useCartStore();
  
  // Gestisce l'aggiunta al carrello
  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrls[0] || '/images/placeholder.jpg',
      quantity: quantity
    });
    
    // Mostra il toast di conferma
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  
  // Gestisce il cambio della quantità
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else if (value > (product.stock || 1)) {
      setQuantity(product.stock || 1);
    } else {
      setQuantity(value);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        {/* Galleria immagini */}
        <div className="space-y-4">
          {/* Immagine principale */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-contain"
              priority
            />
          </div>
          
          {/* Miniature */}
          {product.imageUrls.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.imageUrls.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(image)}
                  className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                    mainImage === image ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - immagine ${index + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Dettagli prodotto */}
        <div className="flex flex-col space-y-6">
          {/* Intestazione prodotto */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            
            {/* SKU */}
            {product.sku && (
              <p className="text-sm text-gray-500 mt-1">
                Codice articolo: {product.sku}
              </p>
            )}
            
            {/* Prezzo */}
            <div className="mt-4">
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(product.price)}
              </span>
            </div>
            
            {/* Badge disponibilità */}
            <div className="mt-2">
              {product.stock > 0 ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
                  <svg className="mr-1.5 h-2 w-2 text-green-500" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                  Disponibile
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-red-100 text-red-800">
                  <svg className="mr-1.5 h-2 w-2 text-red-500" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                  Esaurito
                </span>
              )}
              
              {product.stock > 0 && (
                <span className="ml-2 text-sm text-gray-500">
                  {product.stock} disponibili
                </span>
              )}
            </div>
          </div>
          
          {/* Descrizione */}
          {product.description && (
            <div className="prose prose-sm max-w-none text-gray-700">
              <h3 className="text-xl font-semibold mb-2">Descrizione</h3>
              <div className="whitespace-pre-line">{product.description}</div>
            </div>
          )}
          
          {/* Specifiche tecniche */}
          {Object.keys(product.specifications).length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setSpecsOpen(!specsOpen)}
                className="flex justify-between items-center w-full px-4 py-3 bg-gray-50 text-left"
              >
                <span className="text-lg font-medium">Specifiche tecniche</span>
                <svg
                  className={`w-5 h-5 transition-transform ${specsOpen ? 'transform rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {specsOpen && (
                <div className="px-4 py-3">
                  <dl className="divide-y divide-gray-200">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="py-3 grid grid-cols-3 gap-4">
                        <dt className="text-sm font-medium text-gray-500">{key}</dt>
                        <dd className="text-sm text-gray-900 col-span-2">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          )}
          
          {/* Selettore quantità e aggiungi al carrello */}
          <div className="mt-auto pt-4">
            {product.stock > 0 ? (
              <>
                <div className="flex items-center space-x-4 mb-4">
                  <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                    Quantità:
                  </label>
                  <div className="relative flex items-center">
                    <button
                      type="button"
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50"
                    >
                      <span className="sr-only">Diminuisci</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-16 border-gray-300 text-center focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => quantity < product.stock && setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50"
                    >
                      <span className="sr-only">Aumenta</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Aggiungi al carrello
                </button>
              </>
            ) : (
              <button
                disabled
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-400 cursor-not-allowed"
              >
                Non disponibile
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Toast di conferma */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Prodotto aggiunto al carrello
        </div>
      )}
    </div>
  );
} 