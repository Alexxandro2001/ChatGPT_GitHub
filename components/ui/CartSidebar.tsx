"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useCartStore from "@/store/cartStore";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice } = useCartStore();

  // Blocca lo scroll quando la sidebar è aperta
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay scuro */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[450px] bg-white z-50 transform transition-transform duration-300 ease-in-out overflow-hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-black">Il tuo carrello</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Chiudi"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenuto carrello */}
        <div className="h-[calc(100%-180px)] overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500 text-lg mb-4">Il tuo carrello è vuoto</p>
              <button onClick={onClose} className="text-[#f97316] font-medium">
                Continua lo shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex border-b border-gray-200 pb-6">
                  {/* Immagine prodotto */}
                  <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="object-contain w-full h-full"
                    />
                  </div>

                  {/* Dettagli prodotto */}
                  <div className="flex-1 ml-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-base font-medium text-black line-clamp-2">{item.name}</h3>
                        {item.sku && <p className="text-xs text-gray-500 mt-1">#{item.sku}</p>}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Rimuovi"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Controlli quantità e prezzo */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 font-medium text-lg"
                          aria-label="Diminuisci quantità"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 border-x border-gray-300 min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 font-medium text-lg"
                          aria-label="Aumenta quantità"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold text-black">
                        €{item.price.toLocaleString('it-IT', { minimumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Riepilogo e checkout */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-5">
            {/* Riepilogo ordine */}
            <div className="space-y-3 mb-5">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotale</span>
                <span className="font-bold text-black">
                  €{getTotalPrice().toLocaleString('it-IT', { minimumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tasse stimate</span>
                <span className="font-bold text-black">
                  €{(getTotalPrice() * 0.22).toLocaleString('it-IT', { minimumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="text-lg font-medium">Totale</span>
                <span className="text-lg font-bold text-black">
                  €{(getTotalPrice() * 1.22).toLocaleString('it-IT', { minimumFractionDigits: 0 })}
                </span>
              </div>
            </div>

            {/* Pulsante checkout */}
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full bg-[#f97316] hover:bg-orange-600 text-white text-center py-3 px-4 rounded-md font-medium transition-colors"
            >
              Vai al checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
} 