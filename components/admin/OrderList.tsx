'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { OrderFilters, PaginationData } from '@/app/admin/orders/page';
import { formatCurrency } from '@/lib/utils';
import { OrderStatus } from '@prisma/client';

// Definizione delle interfacce
interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    price: number;
  };
}

interface Order {
  id: number;
  userId: number | null;
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
  shippingAddress: string | null;
  paymentMethod: string | null;
  paymentStatus: string | null;
  user: {
    id: number;
    name: string | null;
    email: string;
  } | null;
  orderItems: OrderItem[];
}

interface OrderListProps {
  orders: Order[];
  paginationData: PaginationData;
  initialFilters: OrderFilters;
}

// Helper per i colori dei badge di stato
const statusColors: Record<OrderStatus, { bg: string; text: string }> = {
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  PAGATO: { bg: 'bg-green-100', text: 'text-green-800' },
  SPEDITO: { bg: 'bg-blue-100', text: 'text-blue-800' },
  CONSEGNATO: { bg: 'bg-purple-100', text: 'text-purple-800' },
  ANNULLATO: { bg: 'bg-red-100', text: 'text-red-800' },
};

// Helper per le traduzioni degli stati
const statusLabels: Record<OrderStatus, string> = {
  PENDING: 'In attesa',
  PAGATO: 'Pagato',
  SPEDITO: 'Spedito',
  CONSEGNATO: 'Consegnato',
  ANNULLATO: 'Annullato',
};

export default function OrderList({ orders, paginationData, initialFilters }: OrderListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Stati locali per i filtri
  const [filters, setFilters] = useState<OrderFilters>(initialFilters);
  const [isFilterChanged, setIsFilterChanged] = useState(false);
  
  // Gestione del cambio di filtri
  const handleFilterChange = (name: keyof OrderFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      // Reset alla prima pagina quando cambiano i filtri
      ...(name !== 'page' ? { page: 1 } : {}),
    }));
    setIsFilterChanged(true);
  };
  
  // Applicazione dei filtri all'URL
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    // Aggiungi solo i filtri con valore
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, String(value));
      }
    });
    
    // Aggiorna l'URL con i nuovi parametri
    router.push(`${pathname}?${params.toString()}`);
    setIsFilterChanged(false);
  };
  
  // Resetta i filtri
  const resetFilters = () => {
    setFilters({
      page: 1,
    });
    setIsFilterChanged(true);
  };
  
  // Aggiorna l'URL quando cambiano i filtri
  useEffect(() => {
    if (isFilterChanged) {
      applyFilters();
    }
  }, [filters.page]); // Applica immediatamente solo per cambi di pagina
  
  // Formatta la data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Calcola gli indici per la paginazione
  const { currentPage, totalPages, totalItems, perPage } = paginationData;
  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalItems);
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Filtri */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Stato</label>
            <select
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
            >
              <option value="">Tutti gli stati</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Data da</label>
            <input
              type="date"
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filters.dateFrom || ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value || undefined)}
            />
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Data a</label>
            <input
              type="date"
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filters.dateTo || ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value || undefined)}
            />
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ricerca</label>
            <input
              type="text"
              placeholder="ID ordine o email"
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
            />
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            onClick={resetFilters}
          >
            Resetta filtri
          </button>
          
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={applyFilters}
            disabled={!isFilterChanged}
          >
            Applica filtri
          </button>
        </div>
      </div>
      
      {/* Tabella ordini */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Ordine
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Totale
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stato
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  Nessun ordine trovato con i filtri selezionati
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const statusColor = statusColors[order.status];
                
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.user ? (
                        <>
                          <div>{order.user.name || 'N/D'}</div>
                          <div className="text-xs">{order.user.email}</div>
                        </>
                      ) : (
                        'Cliente non registrato'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColor.bg} ${statusColor.text}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Visualizza
                      </Link>
                      <Link
                        href={`/admin/orders/${order.id}?action=change-status`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Cambia stato
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Paginazione */}
      {totalPages > 0 && (
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handleFilterChange('page', Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Precedente
              </button>
              <button
                onClick={() => handleFilterChange('page', Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Successiva
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Visualizzando <span className="font-medium">{startItem}</span> a{' '}
                  <span className="font-medium">{endItem}</span> di{' '}
                  <span className="font-medium">{totalItems}</span> risultati
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handleFilterChange('page', Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Precedente</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  
                  {/* Pagine */}
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    // Logica per mostrare pagine attorno alla pagina corrente
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handleFilterChange('page', pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        } text-sm font-medium`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handleFilterChange('page', Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Successiva</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 