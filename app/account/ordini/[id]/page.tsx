'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Definizione dei tipi
interface OrderItem {
  id: number;
  productId: number;
  product: {
    id: number;
    name: string;
    image: string | null;
    description?: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  createdAt: string;
  status: string;
  total: number;
  shippingAddress?: string;
  shippingCity?: string;
  shippingPostCode?: string;
  shippingCountry?: string;
  paymentMethod?: string;
  orderItems: OrderItem[];
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const orderId = parseInt(params.id, 10);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Recupera i dettagli dell'ordine
    const fetchOrderDetails = async () => {
      try {
        // Verifica l'autenticazione dell'utente
        const userData = localStorage.getItem('user');
        if (!userData) {
          router.push('/account');
          return;
        }
        
        const user = JSON.parse(userData);
        
        // Chiamata API per ottenere i dettagli dell'ordine
        const response = await fetch(`/api/orders/${orderId}?userId=${user.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            // Ordine non trovato, reindirizza alla lista ordini
            router.push('/account/ordini');
            return;
          }
          throw new Error('Errore durante il recupero dei dettagli dell\'ordine');
        }
        
        const orderData = await response.json();
        setOrder(orderData);
        setLoading(false);
      } catch (error) {
        console.error('Errore durante il recupero dei dettagli dell\'ordine:', error);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [router, orderId]);

  // Funzione per formattare la data
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('it-IT', options);
  };
  
  // Funzione per ottenere la classe del badge in base allo stato
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'IN_ELABORAZIONE':
        return 'bg-blue-100 text-blue-800';
      case 'SPEDITO':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONSEGNATO':
        return 'bg-green-100 text-green-800';
      case 'ANNULLATO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Funzione per ottenere la versione leggibile dello stato
  const getReadableStatus = (status: string) => {
    switch (status) {
      case 'IN_ELABORAZIONE':
        return 'In elaborazione';
      case 'SPEDITO':
        return 'Spedito';
      case 'CONSEGNATO':
        return 'Consegnato';
      case 'ANNULLATO':
        return 'Annullato';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          
          <div className="h-6 bg-gray-200 rounded mt-8 mb-4 w-1/4"></div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex">
              <div className="w-16 h-16 bg-gray-200 rounded mr-4"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-2xl font-bold mb-4">Ordine non trovato</h1>
        <p className="text-gray-600 mb-6">L'ordine che stai cercando non esiste o non è accessibile.</p>
        <Link 
          href="/account/ordini" 
          className="px-4 py-2 bg-brand-orange text-white rounded hover:bg-opacity-90 transition"
        >
          Torna agli ordini
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dettagli Ordine #{order.id}</h1>
          <p className="text-gray-600">Effettuato il {formatDate(order.createdAt)}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(order.status)}`}>
          {getReadableStatus(order.status)}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Informazioni di spedizione */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Indirizzo di spedizione</h2>
          <address className="not-italic">
            {order.shippingAddress}<br />
            {order.shippingCity}, {order.shippingPostCode}<br />
            {order.shippingCountry}
          </address>
        </div>
        
        {/* Informazioni di pagamento */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Riepilogo pagamento</h2>
          <p><span className="font-medium">Metodo:</span> {order.paymentMethod}</p>
          <p className="mt-2"><span className="font-medium">Totale:</span> €{order.total.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">IVA inclusa</p>
        </div>
      </div>
      
      {/* Prodotti ordinati */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Prodotti ordinati</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prodotto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prezzo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantità
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Totale
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.orderItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-gray-100 rounded flex-shrink-0 mr-4 relative overflow-hidden">
                          {item.product.image ? (
                            <Image 
                              src={item.product.image} 
                              alt={item.product.name}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.product.name}</div>
                          {item.product.description && (
                            <div className="text-sm text-gray-500 max-w-md truncate">{item.product.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">€{item.price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">€{(item.price * item.quantity).toFixed(2)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-right font-medium">
                    Totale
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-brand-orange">
                    €{order.total.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      
      {/* Pulsanti azione */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link 
          href="/account/ordini" 
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Torna alla lista ordini
        </Link>
        
        <div className="space-x-4">
          <button 
            onClick={() => window.print()} 
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Stampa ordine
          </button>
          
          <Link 
            href={`mailto:supporto@planetstore.it?subject=Richiesta%20informazioni%20ordine%20${order.id}`}
            className="px-4 py-2 bg-brand-orange text-white rounded-md hover:bg-opacity-90 transition"
          >
            Contatta assistenza
          </Link>
        </div>
      </div>

      {/* Aggiungo una nota riguardo le email di aggiornamento nella pagina di dettaglio ordine */}
      <div className="p-4 bg-gray-50 rounded-lg mt-4 text-sm">
        <p className="flex items-center">
          <svg className="w-5 h-5 text-brand-orange mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            Riceverai una notifica via email quando lo stato del tuo ordine cambierà.
          </span>
        </p>
      </div>
    </div>
  );
} 