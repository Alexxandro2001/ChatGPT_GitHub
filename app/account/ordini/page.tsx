'use client';

import { useEffect, useState } from 'react';
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
  };
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  createdAt: string;
  status: string;
  total: number;
  orderItems: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  
  // Espandi/collassa un ordine
  const toggleOrder = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };
  
  useEffect(() => {
    // Recupera gli ordini dell'utente
    const getUserOrders = async () => {
      try {
        // Ottieni l'ID utente
        const userData = localStorage.getItem('user');
        if (!userData) {
          setLoading(false);
          return;
        }
        
        const user = JSON.parse(userData);
        
        // Chiamata API per ottenere gli ordini dell'utente
        const response = await fetch(`/api/orders?userId=${user.id}`);
        
        if (!response.ok) {
          throw new Error('Errore durante il recupero degli ordini');
        }
        
        const ordersData = await response.json();
        setOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error('Errore durante il recupero degli ordini:', error);
        setLoading(false);
      }
    };

    getUserOrders();
  }, []);

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
        <h1 className="text-2xl font-bold mb-6">I miei ordini</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="h-6 bg-gray-200 rounded mb-4 w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">I miei ordini</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">Nessun ordine trovato</h2>
          <p className="text-gray-600 mb-6">Non hai ancora effettuato ordini.</p>
          <Link 
            href="/" 
            className="px-4 py-2 bg-brand-orange text-white rounded hover:bg-opacity-90 transition"
          >
            Inizia lo shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Intestazione dell'ordine */}
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Ordine #{order.id}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(order.status)}`}>
                        {getReadableStatus(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Effettuato il {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold">
                      Totale: €{order.total.toFixed(2)}
                    </p>
                    <button
                      onClick={() => toggleOrder(order.id)}
                      className="text-brand-orange hover:text-orange-700 text-sm font-medium flex items-center gap-1"
                    >
                      {expandedOrder === order.id ? (
                        <>
                          <span>Nascondi dettagli</span>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </>
                      ) : (
                        <>
                          <span>Mostra dettagli</span>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Dettagli dell'ordine (espandibili) */}
              {expandedOrder === order.id && (
                <div className="p-4">
                  <h4 className="font-medium mb-3">Prodotti acquistati</h4>
                  <div className="divide-y divide-gray-200">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="py-4 flex items-start">
                        <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 mr-3 relative overflow-hidden">
                          {item.product.image ? (
                            <Image 
                              src={item.product.image} 
                              alt={item.product.name}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium">{item.product.name}</h5>
                          <p className="text-sm text-gray-500">Quantità: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-medium">€{item.price.toFixed(2)}</span>
                          <p className="text-sm text-gray-500">€{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Link ai dettagli completi dell'ordine */}
                  <div className="mt-4 text-right">
                    <Link 
                      href={`/account/ordini/${order.id}`}
                      className="text-brand-orange hover:underline text-sm font-medium"
                    >
                      Visualizza dettagli completi →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 