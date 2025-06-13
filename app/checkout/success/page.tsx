'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import useCartStore from '@/store/cartStore';
import { sendOrderConfirmationEmail } from '@/lib/mail';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { items, clearCart } = useCartStore();
  
  const [isCreatingOrder, setIsCreatingOrder] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Calcola il totale
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.22;
  const shipping = 29;
  const total = subtotal + tax + shipping;

  // Crea l'ordine nel database e invia l'email di conferma
  useEffect(() => {
    const createOrder = async () => {
      try {
        if (!items.length || isCreatingOrder === false) return;

        // Crea l'ordine nel database tramite API
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items,
            totalAmount: total,
            shippingAddress: {
              address: '123 Via Roma',
              city: 'Roma',
              postCode: '00100',
              country: 'Italia',
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Errore nella creazione dell\'ordine');
        }

        const data = await response.json();
        setOrderId(data.orderId || 'ORD-' + Math.floor(100000 + Math.random() * 900000));
        
        // Invia email di conferma (in questo caso simulata)
        if (session?.user?.email) {
          await sendOrderConfirmationEmail({
            customerEmail: session.user.email,
            customerName: session.user.name || '',
            orderId: data.orderId,
            orderItems: items,
            totalAmount: total,
            shippingAddress: '123 Via Roma, Roma, 00100, Italia',
          });
        }

        // Svuota il carrello dopo aver creato con successo l'ordine
        clearCart();
        
      } catch (err: any) {
        console.error('Errore nella creazione dell\'ordine:', err);
        setError(err.message || 'Si è verificato un errore nella creazione dell\'ordine');
      } finally {
        setIsCreatingOrder(false);
      }
    };

    // Esegui solo se l'utente è autenticato o se è un guest checkout
    if (status !== 'loading') {
      createOrder();
    }
  }, [items, total, session, status, clearCart]);

  // Se non ci sono elementi nel carrello e nessun ordine è stato creato
  if (!isCreatingOrder && !orderId && !error && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Nessun ordine trovato</h1>
          <p className="text-gray-600 mb-6">
            Sembra che tu abbia raggiunto questa pagina direttamente.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-[#f97316] text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            Torna allo shop
          </Link>
        </div>
      </div>
    );
  }

  // Se c'è stato un errore nella creazione dell'ordine
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="rounded-full bg-red-100 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black mb-4">Si è verificato un errore</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-[#f97316] text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            Torna allo shop
          </Link>
        </div>
      </div>
    );
  }

  // Durante la creazione dell'ordine
  if (isCreatingOrder) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="flex justify-center mb-4">
            <svg className="animate-spin h-10 w-10 text-[#f97316]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black mb-4">Completamento dell'ordine in corso</h1>
          <p className="text-gray-600">
            Stiamo elaborando il tuo ordine. Non chiudere questa pagina...
          </p>
        </div>
      </div>
    );
  }

  // Pagina di successo con ordine creato (design ispirato a "Step 3.png")
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Indicatore di step */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center max-w-3xl w-full">
          <div className="flex flex-col items-center flex-1">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
              1
            </div>
            <span className="mt-2 text-sm text-gray-500">Address</span>
          </div>
          <div className="flex-1 h-px bg-gray-300"></div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
              2
            </div>
            <span className="mt-2 text-sm text-gray-500">Shipping</span>
          </div>
          <div className="flex-1 h-px bg-gray-300"></div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-sm text-white">
              3
            </div>
            <span className="mt-2 text-sm font-medium">Payment</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Messaggio di conferma */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#f97316] rounded-full mx-auto flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">Ordine Confermato!</h1>
            <p className="text-gray-600">
              Grazie per il tuo acquisto. Il tuo ordine è stato ricevuto e verrà elaborato al più presto.
            </p>
            {orderId && (
              <p className="mt-4 text-sm bg-gray-50 py-2 px-4 rounded inline-block">
                Numero ordine: <span className="font-semibold">{orderId}</span>
              </p>
            )}
          </div>

          {/* Riepilogo prodotti */}
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center bg-gray-50 p-3 rounded-lg">
                <div className="w-16 h-16 bg-white rounded flex items-center justify-center mr-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-black line-clamp-1">{item.name}</h3>
                  {item.sku && <p className="text-xs text-gray-500">#{item.sku}</p>}
                </div>
                <div className="text-right">
                  <p className="font-bold text-black">€{item.price}</p>
                  <p className="text-sm text-gray-500">Qtà: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotale</span>
              <span className="font-medium">€{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">IVA (22%)</span>
              <span className="font-medium">€{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Spedizione</span>
              <span className="font-medium">€{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
              <span className="text-lg font-bold">Totale</span>
              <span className="text-lg font-bold">€{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-[#f97316] text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Torna allo shop
            </Link>
          </div>
        </div>

        {/* Dettagli pagamento (visibile solo su desktop) */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-bold text-black mb-6">Payment</h2>
          
          <div className="flex border-b border-gray-200">
            <button className="px-4 py-2 border-b-2 border-black font-medium">Credit Card</button>
            <button className="px-4 py-2 text-gray-500">PayPal</button>
            <button className="px-4 py-2 text-gray-500">PayPal Credit</button>
          </div>
          
          <div className="mt-6">
            <div className="bg-black rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-6 bg-yellow-500 rounded"></div>
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path>
                </svg>
              </div>
              <div className="text-white text-xl tracking-wider mb-4 flex justify-between">
                <span>4085</span>
                <span>9536</span>
                <span>8475</span>
                <span>9530</span>
              </div>
              <div className="text-white text-sm">Cardholder</div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Cardholder Name</label>
              <div className="h-12 bg-gray-100 rounded-md"></div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Card Number</label>
              <div className="h-12 bg-gray-100 rounded-md"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Exp.Date</label>
                <div className="h-12 bg-gray-100 rounded-md"></div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">CVV</label>
                <div className="h-12 bg-gray-100 rounded-md"></div>
              </div>
            </div>
            
            <div className="flex items-center mb-6">
              <div className="w-5 h-5 bg-black rounded flex items-center justify-center mr-2"></div>
              <span className="text-sm">Same as billing address</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button className="py-3 border border-gray-300 rounded-md text-black font-medium">Back</button>
              <button className="py-3 bg-black rounded-md text-white font-medium">Pay</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 