'use client';

import Image from 'next/image';
import useCartStore, { CartItem as CartItemType } from '@/store/cartStore';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const cartStore = useCartStore();
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      cartStore.updateQuantity(item.id, newQuantity);
    }
  };
  
  const handleRemove = () => {
    cartStore.removeItem(item.id);
  };
  
  const imageSrc = item.image || '/images/placeholder-product.png';

  return (
    <div className="flex border border-gray-100 rounded-lg overflow-hidden bg-white p-4">
      {/* Immagine prodotto */}
      <div className="flex-shrink-0 w-24 h-24 relative">
        <Image
          src={imageSrc}
          alt={item.name}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>
      
      {/* Dettagli prodotto */}
      <div className="flex-grow pl-4 flex flex-col">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-text line-clamp-1">{item.name}</h3>
          <button 
            onClick={handleRemove}
            className="text-gray-500 hover:text-red-500 transition-colors"
            aria-label="Rimuovi dal carrello"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {item.sku && <span className="text-xs text-gray-500 mb-1">SKU: {item.sku}</span>}
        
        <div className="mt-auto flex justify-between items-center">
          <div className="flex items-center rounded-md overflow-hidden">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              aria-label="Diminuisci quantità"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <span className="w-8 text-center text-sm bg-white">{item.quantity}</span>
            
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              aria-label="Aumenta quantità"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          <div className="font-medium text-orange-500">
            €{(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
} 