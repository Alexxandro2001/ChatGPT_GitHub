'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type OrderData = {
  orderNumber: string;
  date: string;
  total: number;
  email: string;
  shippingMethod: string;
  paymentMethod: string;
};

export default function OrderConfirmedPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Recupera i dati dell'ordine dal localStorage
    const orderDataStr = localStorage.getItem('lastOrder');
    
    if (!orderDataStr) {
      // Se non ci sono dati dell'ordine, reindirizza alla home
      router.push('/');
      return;
    }
    
    try {
      const data = JSON.parse(orderDataStr) as OrderData;
      setOrderData(data);
    } catch (error) {
      console.error('Errore nel parsing dei dati dell\'ordine', error);
    } finally {
      setLoading(false);
    }
  }, [router]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="animate-spin h-12 w-12 text-brand-orange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Caricamento...</h1>
        </div>
      </div>
    );
  }
  
  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Ordine non trovato</h1>
          <p className="mb-6 text-gray-600">Non è stato possibile trovare i dettagli dell'ordine.</p>
          <Link 
            href="/"
            className="px-6 py-3 bg-brand-orange text-white rounded-md font-medium hover:bg-opacity-90 transition"
          >
            Torna alla home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Ordine completato con successo!</h1>
          <p className="mb-6 text-gray-600">
            Grazie per il tuo acquisto! Ti abbiamo inviato una conferma all'indirizzo email fornito.
            <br />
            <span className="text-brand-orange">Controlla la tua email per i dettagli completi dell'ordine.</span>
            <br />La tua spedizione verrà preparata entro 24 ore.
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {orderData.orderNumber}
              </h2>
              <p className="text-gray-600">
                Ordine effettuato il {new Date(orderData.date).toLocaleDateString('it-IT', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium text-sm">
                Confermato
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Dettagli dell'ordine</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Metodo di spedizione:</p>
                  <p className="font-medium">
                    {orderData.shippingMethod === 'standard' ? 'Spedizione standard (3-5 giorni)' : 'Spedizione express (1-2 giorni)'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Metodo di pagamento:</p>
                  <p className="font-medium">
                    {orderData.paymentMethod === 'card' 
                      ? 'Carta di credito/debito'
                      : orderData.paymentMethod === 'cod'
                      ? 'Contrassegno (pagamento alla consegna)'
                      : 'PayPal'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Totale pagato:</span>
                <span className="text-brand-orange">€{orderData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/"
            className="px-6 py-3 bg-brand-orange text-white rounded-md font-medium hover:bg-opacity-90 transition text-center"
          >
            Continua lo shopping
          </Link>
          <Link 
            href="/account/ordini"
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition text-center"
          >
            I miei ordini
          </Link>
        </div>
      </div>
    </div>
  );
} 