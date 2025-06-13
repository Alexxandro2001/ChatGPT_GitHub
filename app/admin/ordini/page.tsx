'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';

type Order = {
  id: number;
  createdAt: string;
  user: {
    id: number;
    name: string | null;
    email: string;
  } | null;
  status: string;
  total: number;
  orderItems: {
    id: number;
    quantity: number;
    product: {
      id: number;
      name: string;
    };
  }[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 10;

  // Carica gli ordini dal database (simulato)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // In un'app reale, qui chiameremmo un'API
        // Per ora, usiamo dati simulati
        setTimeout(() => {
          // Genera 30 ordini di esempio
          const mockOrders: Order[] = Array.from({ length: 30 }, (_, i) => {
            const id = 123480 - i;
            const randomStatus = ['IN_ELABORAZIONE', 'SPEDITO', 'CONSEGNATO', 'ANNULLATO'][
              Math.floor(Math.random() * 4)
            ];
            const randomTotal = Math.floor(Math.random() * 1500) + 50;
            const daysAgo = Math.floor(Math.random() * 60) + 1;
            
            return {
              id,
              createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
              user: {
                id: 100 + i,
                name: ['Mario Rossi', 'Laura Bianchi', 'Giuseppe Verdi', 'Anna Neri', 'Paolo Gialli'][
                  Math.floor(Math.random() * 5)
                ],
                email: `user${100 + i}@example.com`,
              },
              status: randomStatus,
              total: randomTotal,
              orderItems: Array.from(
                { length: Math.floor(Math.random() * 3) + 1 },
                (_, j) => ({
                  id: id * 10 + j,
                  quantity: Math.floor(Math.random() * 3) + 1,
                  product: {
                    id: 1000 + j,
                    name: [
                      'Smartphone Galaxy S23',
                      'Laptop Pro 16',
                      'Cuffie Bluetooth',
                      'Smartwatch Pro',
                      'Tablet Air',
                      'Monitor 4K',
                    ][Math.floor(Math.random() * 6)],
                  },
                })
              ),
            };
          });
          
          setOrders(mockOrders);
          setTotalPages(Math.ceil(mockOrders.length / ordersPerPage));
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Errore durante il recupero degli ordini:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Funzione per aggiornare lo stato di un ordine
  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      // In un'app reale, qui chiameremmo un'API
      // Simula una chiamata API per l'aggiornamento dello stato
      const mockUserId = 1; // ID simulato dell'utente admin
      const mockEmail = "cliente@example.com"; // Email simulata del cliente

      // Simula una chiamata all'API
      console.log(`Aggiornamento stato ordine #${orderId} a ${newStatus}`);
      console.log("Invio email di notifica in corso...");
      
      // In un'app reale qui aggiorneremmo lo stato tramite API e invieremmo un'email
      // Per simulare ciò, semplicemente aggiorniamo lo stato locale
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      // Simuliamo l'invio dell'email mostrando un messaggio di successo
      setTimeout(() => {
        console.log(`Email di aggiornamento stato inviata a ${mockEmail}`);
        console.log("Anteprima email disponibile in: https://ethereal.email/message/XYZ123"); // URL simulato
        
        toast.success(`Stato dell'ordine #${orderId} aggiornato a ${newStatus.replace(/_/g, ' ')}`);
        toast.info("Email di notifica inviata al cliente", {
          autoClose: 5000,
          position: "bottom-right"
        });
      }, 1000);
    } catch (error) {
      console.error('Errore durante l\'aggiornamento dello stato dell\'ordine:', error);
      toast.error('Errore durante l\'aggiornamento dello stato dell\'ordine');
    }
  };

  // Funzione per filtrare gli ordini in base allo stato
  const getFilteredOrders = () => {
    if (statusFilter === 'all') {
      return orders;
    }
    return orders.filter((order) => order.status === statusFilter);
  };

  // Funzione per paginare gli ordini
  const getPaginatedOrders = () => {
    const filteredOrders = getFilteredOrders();
    setTotalPages(Math.ceil(filteredOrders.length / ordersPerPage));
    
    const startIndex = (currentPage - 1) * ordersPerPage;
    return filteredOrders.slice(startIndex, startIndex + ordersPerPage);
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
        <h1 className="text-2xl font-bold mb-6">Gestione Ordini</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-full mb-6"></div>
          <div className="h-12 bg-gray-100 rounded-t-lg w-full"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="border-t border-gray-200 p-4">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Gestione Ordini</h1>
        
        <div className="flex items-center gap-3">
          <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700">
            Filtra per stato:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-md border-gray-300 shadow-sm focus:border-brand-orange focus:ring focus:ring-brand-orange focus:ring-opacity-20"
          >
            <option value="all">Tutti gli stati</option>
            <option value="IN_ELABORAZIONE">In elaborazione</option>
            <option value="SPEDITO">Spedito</option>
            <option value="CONSEGNATO">Consegnato</option>
            <option value="ANNULLATO">Annullato</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="align-middle inline-block min-w-full">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prodotti
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Totale
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stato
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getPaginatedOrders().map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.user?.name || 'Cliente non registrato'}</div>
                      <div className="text-sm text-gray-500">{order.user?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.orderItems.map((item, index) => (
                          <div key={item.id} className="mb-1 last:mb-0">
                            {item.quantity}x {item.product.name}
                            {index < order.orderItems.length - 1 && ','}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      €{order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`text-xs py-1 px-2 border rounded-full ${getStatusBadgeClass(order.status)}`}
                      >
                        <option value="IN_ELABORAZIONE">In elaborazione</option>
                        <option value="SPEDITO">Spedito</option>
                        <option value="CONSEGNATO">Consegnato</option>
                        <option value="ANNULLATO">Annullato</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link 
                        href={`/admin/ordini/${order.id}`} 
                        className="text-brand-orange hover:text-orange-700"
                      >
                        Dettagli
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Paginazione */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Pagina <span className="font-medium">{currentPage}</span> di{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Paginazione">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Precedente</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = currentPage <= 3 
                    ? i + 1 
                    : currentPage >= totalPages - 2 
                      ? totalPages - 4 + i 
                      : currentPage - 2 + i;
                  
                  if (pageNumber <= 0 || pageNumber > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === pageNumber ? 'bg-brand-orange text-white z-10 border-brand-orange' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Successiva</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 