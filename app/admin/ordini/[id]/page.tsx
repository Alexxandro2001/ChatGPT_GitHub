'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';

// Definizione dei tipi
interface OrderItem {
  id: number;
  productId: number;
  product: {
    id: number;
    name: string;
    image: string | null;
    description?: string;
    sku: string;
  };
  quantity: number;
  price: number;
}

interface User {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
}

interface Order {
  id: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  total: number;
  shippingAddress?: string;
  shippingCity?: string;
  shippingPostCode?: string;
  shippingCountry?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  user: User | null;
  orderItems: OrderItem[];
}

// Definizione dei possibili stati dell'ordine
const ORDER_STATUSES = [
  { value: "IN_ELABORAZIONE", label: "In elaborazione" },
  { value: "SPEDITO", label: "Spedito" },
  { value: "CONSEGNATO", label: "Consegnato" },
  { value: "ANNULLATO", label: "Annullato" }
];

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const orderId = parseInt(params.id, 10);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  
  useEffect(() => {
    // In un'app reale, qui chiameresti un'API per ottenere i dettagli dell'ordine
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        
        // Simuliamo una chiamata API
        setTimeout(() => {
          if (orderId === 12345) {
            setOrder({
              id: 12345,
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              status: "IN_ELABORAZIONE",
              total: 299.99,
              shippingAddress: "Via Roma 123",
              shippingCity: "Milano",
              shippingPostCode: "20100",
              shippingCountry: "Italia",
              paymentMethod: "Carta di credito",
              paymentStatus: "paid",
              user: {
                id: 1,
                name: "Mario Rossi",
                email: "mario@example.com",
                phone: "+39 123 456 7890"
              },
              orderItems: [
                {
                  id: 1,
                  productId: 101,
                  product: {
                    id: 101,
                    name: "Smartphone Galaxy S23",
                    description: "Ultimo modello di Samsung con fotocamera avanzata",
                    image: "/images/products/smartphone.jpg",
                    sku: "SMG-S23-128-BLK"
                  },
                  quantity: 1,
                  price: 299.99
                }
              ]
            });
          } else {
            // Ordine non trovato
            router.push('/admin/ordini');
          }
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Errore durante il recupero dei dettagli dell\'ordine:', error);
        setLoading(false);
        toast.error('Errore durante il recupero dei dettagli dell\'ordine');
      }
    };

    fetchOrderDetails();
  }, [orderId, router]);

  // Funzione per aggiornare lo stato dell'ordine
  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;
    
    try {
      setStatusUpdating(true);
      
      // In un'app reale, qui chiameremmo un'API
      // Simula una chiamata API per l'aggiornamento dello stato
      const mockUserId = 1; // ID simulato dell'utente admin
      const mockEmail = order.user?.email || "cliente@example.com"; // Email del cliente o email simulata
      
      // Simula una chiamata all'API
      console.log(`Aggiornamento stato ordine #${order.id} a ${newStatus}`);
      console.log(`Invio email di notifica a ${mockEmail} in corso...`);
      
      // Simuliamo una risposta ritardata dall'API
      setTimeout(() => {
        // Aggiorna lo stato locale
        setOrder((prevOrder) => 
          prevOrder ? { ...prevOrder, status: newStatus } : null
        );
        
        console.log(`Email di aggiornamento stato inviata a ${mockEmail}`);
        console.log("Anteprima email disponibile in: https://ethereal.email/message/XYZ123"); // URL simulato
        
        toast.success(`Stato dell'ordine #${order.id} aggiornato a ${newStatus.replace(/_/g, ' ')}`);
        toast.info("Email di notifica inviata al cliente", {
          autoClose: 5000,
          position: "bottom-right"
        });
        
        setStatusUpdating(false);
      }, 1000);
    } catch (error) {
      console.error('Errore durante l\'aggiornamento dello stato dell\'ordine:', error);
      toast.error('Errore durante l\'aggiornamento dello stato dell\'ordine');
      setStatusUpdating(false);
    }
  };

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
          href="/admin/ordini" 
          className="px-4 py-2 bg-brand-orange text-white rounded hover:bg-opacity-90 transition"
        >
          Torna alla lista ordini
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dettagli Ordine #{order.id}</h1>
          <p className="text-gray-600">Effettuato il {formatDate(order.createdAt)}</p>
          <p className="text-gray-500 text-sm">Ultima modifica: {formatDate(order.updatedAt)}</p>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center mb-3">
            <span className="mr-2">Stato:</span>
            <select
              value={order.status}
              onChange={(e) => updateOrderStatus(e.target.value)}
              disabled={statusUpdating}
              className={`py-1 px-3 border rounded-md ${getStatusBadgeClass(order.status)} border-transparent focus:border-brand-orange focus:ring focus:ring-orange-200 min-w-[150px]`}
            >
              {ORDER_STATUSES.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          
          {statusUpdating && (
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-4 h-4 border-t-2 border-brand-orange border-solid rounded-full animate-spin mr-2"></div>
              Aggiornamento in corso...
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Informazioni cliente */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Informazioni cliente</h2>
          {order.user ? (
            <div>
              <p className="mb-1"><span className="font-medium">Nome:</span> {order.user.name || 'N/D'}</p>
              <p className="mb-1"><span className="font-medium">Email:</span> {order.user.email}</p>
              <p><span className="font-medium">Telefono:</span> {order.user.phone || 'N/D'}</p>
            </div>
          ) : (
            <p className="text-gray-500">Informazioni cliente non disponibili</p>
          )}
        </div>
        
        {/* Informazioni di spedizione */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Indirizzo di spedizione</h2>
          {order.shippingAddress ? (
            <address className="not-italic">
              {order.shippingAddress}<br />
              {order.shippingCity}, {order.shippingPostCode}<br />
              {order.shippingCountry}
            </address>
          ) : (
            <p className="text-gray-500">Indirizzo di spedizione non disponibile</p>
          )}
        </div>
        
        {/* Informazioni di pagamento */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Informazioni di pagamento</h2>
          <p className="mb-1"><span className="font-medium">Metodo:</span> {order.paymentMethod || 'N/D'}</p>
          <p className="mb-1"><span className="font-medium">Stato pagamento:</span> {
            order.paymentStatus === 'paid' ? (
              <span className="text-green-600">Pagato</span>
            ) : order.paymentStatus === 'pending' ? (
              <span className="text-yellow-600">In attesa</span>
            ) : order.paymentStatus === 'failed' ? (
              <span className="text-red-600">Fallito</span>
            ) : (
              <span className="text-gray-600">N/D</span>
            )
          }</p>
          <p className="mt-2"><span className="font-medium">Totale:</span> €{order.total.toFixed(2)}</p>
        </div>
        
        {/* Azioni amministrative */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Azioni amministrative</h2>
          <div className="space-y-2">
            <button 
              onClick={() => window.print()} 
              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded transition flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Stampa ordine
            </button>
            
            <button 
              onClick={() => {
                if (window.confirm('Sei sicuro di voler annullare questo ordine?')) {
                  updateOrderStatus('ANNULLATO');
                }
              }}
              disabled={order.status === 'ANNULLATO' || statusUpdating}
              className={`w-full py-2 px-4 text-white rounded transition flex items-center justify-center ${
                order.status === 'ANNULLATO' || statusUpdating 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Annulla ordine
            </button>
            
            <button 
              onClick={() => {
                // Qui in un'app reale invieresti una email di conferma
                toast.success('Email di conferma inviata al cliente');
              }}
              className="w-full py-2 px-4 bg-brand-orange hover:bg-opacity-90 text-white rounded transition flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Invia email di conferma
            </button>
          </div>
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
                    SKU
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
                            <div className="text-sm text-gray-500 max-w-xs truncate">{item.product.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.product.sku}</div>
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
                  <td colSpan={4} className="px-6 py-4 text-right font-medium">
                    Totale ordine
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
      
      {/* Pulsanti di navigazione */}
      <div className="flex justify-between">
        <Link 
          href="/admin/ordini" 
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Torna alla lista ordini
        </Link>
      </div>
    </div>
  );
} 