'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-hot-toast';

// Carica Stripe una sola volta all'esterno del componente
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CheckoutButtonProps {
  cartItems: CartItem[];
  successUrl: string;
  cancelUrl: string;
  className?: string;
  disabled?: boolean;
}

export default function CheckoutButton({
  cartItems,
  successUrl,
  cancelUrl,
  className = '',
  disabled = false
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    // Impedisci azioni multiple
    if (isLoading) return;
    
    // Verifica che ci siano articoli nel carrello
    if (cartItems.length === 0) {
      toast.error('Il carrello è vuoto');
      return;
    }

    try {
      setIsLoading(true);

      // Chiama l'API per creare una sessione di checkout
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          successUrl: `${window.location.origin}${successUrl}`,
          cancelUrl: `${window.location.origin}${cancelUrl}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Errore durante la creazione della sessione di checkout');
      }

      const { sessionId } = await response.json();
      
      // Reindirizza al checkout di Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Errore durante il caricamento di Stripe');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw new Error(error.message || 'Errore durante il reindirizzamento al checkout');
      }
      
    } catch (error: any) {
      console.error('Errore nel checkout:', error);
      toast.error(error.message || 'Si è verificato un errore durante il checkout');
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={disabled || isLoading || cartItems.length === 0}
      className={`px-6 py-3 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label="Procedi al pagamento"
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Elaborazione in corso...
        </>
      ) : (
        <>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
          </svg>
          Procedi al pagamento
        </>
      )}
    </button>
  );
} 