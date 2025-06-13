'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CartItem from '@/components/CartItem';
import useCartStore from '@/store/cartStore';
import { toast } from 'react-toastify';

export default function Cart() {
  const cartStore = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  
  // Risolve il problema di idratazione con Zustand
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calcola il totale del carrello
  const items = isMounted ? cartStore.items : [];
  const subtotal = isMounted ? cartStore.getTotalPrice() : 0;
  const shippingCost = subtotal > 0 ? 9.99 : 0;
  const total = subtotal + shippingCost;

  const handleClearCart = () => {
    cartStore.clearCart();
    toast.success('Carrello svuotato con successo');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-text">Carrello</h1>
      
      {isMounted && items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista articoli */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              {/* Intestazione */}
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold text-text">Articoli nel carrello ({items.length})</h2>
                <button 
                  onClick={handleClearCart}
                  className="text-sm text-gray-500 hover:text-red-500 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Svuota carrello
                </button>
              </div>
              
              {/* Lista articoli */}
              <div className="divide-y">
                {items.map(item => (
                  <CartItem 
                    key={item.id}
                    item={item}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Riepilogo */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4 border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-text">Riepilogo ordine</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-text-light">Subtotale</span>
                  <span className="text-text">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-light">Spedizione</span>
                  <span className="text-text">€{shippingCost.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span className="text-text">Totale (IVA inclusa)</span>
                  <span className="text-orange-500 text-xl">€{total.toFixed(2)}</span>
                </div>
              </div>
              
              <Link
                href="/checkout"
                className="w-full block bg-orange-500 text-white py-3 px-4 rounded-md text-center font-medium hover:bg-orange-600 transition-colors"
              >
                Procedi al checkout
              </Link>
              
              <div className="mt-4">
                <Link
                  href="/prodotti"
                  className="text-orange-500 hover:text-orange-600 text-sm flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continua lo shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-16 w-16 mx-auto text-text-light mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-2xl font-semibold mb-2 text-text">Il tuo carrello è vuoto</h2>
          <p className="text-text-light mb-6">Aggiungi alcuni prodotti al tuo carrello per procedere all'acquisto.</p>
          <Link
            href="/prodotti"
            className="bg-orange-500 text-white py-2 px-6 rounded-md inline-block font-medium hover:bg-orange-600 transition-colors"
          >
            Sfoglia i prodotti
          </Link>
        </div>
      )}
    </div>
  );
} 