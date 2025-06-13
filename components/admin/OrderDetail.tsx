'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { OrderStatus } from '@prisma/client';
import { toast } from 'react-hot-toast';

// Interfacce per i tipi di dati
interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string | null;
  description?: string | null;
}

interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product: Product;
}

interface User {
  id: number;
  name: string | null;
  email: string;
}

interface Order {
  id: number;
  userId: number | null;
  status: OrderStatus;
  total: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  shippingAddress: string | null;
  shippingCity?: string | null;
  shippingPostCode?: string | null;
  shippingCountry?: string | null;
  paymentMethod: string | null;
  paymentStatus: string | null;
  user: User | null;
  orderItems: OrderItem[];
}

interface OrderDetailProps {
  order: Order;
  showStatusChangeForm?: boolean;
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

// Stati disponibili per le transizioni
const availableStatusTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['PAGATO', 'ANNULLATO'],
  PAGATO: ['SPEDITO', 'ANNULLATO'],
  SPEDITO: ['CONSEGNATO', 'ANNULLATO'],
  CONSEGNATO: [], // Stato finale
  ANNULLATO: [], // Stato finale
};

export default function OrderDetail({ order, showStatusChangeForm = false }: OrderDetailProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
  const [showStatusForm, setShowStatusForm] = useState(showStatusChangeForm);
  
  // Formatta la data
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Gestisce il cambio di stato
  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (newStatus === currentStatus) {
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/update-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Errore durante l\'aggiornamento dello stato');
      }
      
      const updatedOrder = await response.json();
      
      // Aggiorna lo stato locale
      setCurrentStatus(updatedOrder.status);
      setShowStatusForm(false);
      
      // Mostra toast di successo
      toast.success(`Stato aggiornato a: ${statusLabels[updatedOrder.status]}`);
      
      // Aggiorna la pagina per riflettere i cambiamenti
      router.refresh();
    } catch (error: any) {
      console.error('Errore durante l\'aggiornamento dello stato:', error);
      toast.error(error.message || 'Si è verificato un errore');
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Determina gli stati a cui è possibile passare
  const possibleNextStatuses = availableStatusTransitions[currentStatus];
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Intestazione con informazioni di base */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Ordine #{order.id}</h2>
            <p className="text-sm text-gray-500">
              Creato il {formatDate(order.createdAt)}
            </p>
          </div>
          
          <div className="mt-2 sm:mt-0 flex items-center">
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusColors[currentStatus].bg} ${statusColors[currentStatus].text} mr-4`}>
              {statusLabels[currentStatus]}
            </span>
            
            {!showStatusForm && possibleNextStatuses.length > 0 && (
              <button
                onClick={() => setShowStatusForm(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Cambia stato
              </button>
            )}
          </div>
        </div>
        
        {/* Form per cambio stato */}
        {showStatusForm && possibleNextStatuses.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Cambia stato ordine</h3>
            <div className="flex flex-wrap gap-2">
              {possibleNextStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={isUpdating}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    statusColors[status].bg.replace('bg-', 'bg-opacity-50 bg-')
                  } ${statusColors[status].text} hover:bg-opacity-75 transition-colors`}
                >
                  {statusLabels[status]}
                </button>
              ))}
              <button
                onClick={() => setShowStatusForm(false)}
                disabled={isUpdating}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Annulla
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Informazioni cliente e spedizione */}
      <div className="p-6 border-b border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Informazioni cliente</h3>
          {order.user ? (
            <div>
              <p className="text-gray-700 font-medium">{order.user.name || 'N/D'}</p>
              <p className="text-gray-600">{order.user.email}</p>
              <p className="text-gray-500 text-sm mt-1">ID Cliente: {order.user.id}</p>
            </div>
          ) : (
            <p className="text-gray-500">Ordine effettuato come ospite</p>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Indirizzo di spedizione</h3>
          {order.shippingAddress ? (
            <div>
              <p className="text-gray-700">{order.shippingAddress}</p>
              {order.shippingCity && <p className="text-gray-600">{order.shippingCity}</p>}
              {order.shippingPostCode && <p className="text-gray-600">{order.shippingPostCode}</p>}
              {order.shippingCountry && <p className="text-gray-600">{order.shippingCountry}</p>}
            </div>
          ) : (
            <p className="text-gray-500">Nessun indirizzo di spedizione specificato</p>
          )}
        </div>
      </div>
      
      {/* Informazioni pagamento */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Informazioni pagamento</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Metodo di pagamento</p>
            <p className="text-gray-700">{order.paymentMethod || 'Non specificato'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Stato pagamento</p>
            <p className="text-gray-700 font-medium">
              {order.paymentStatus === 'paid' ? 'Pagato' : order.paymentStatus || 'Non specificato'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Prodotti ordinati */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Prodotti ordinati</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prodotto
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantità
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prezzo
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Totale
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.orderItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.product.imageUrl && (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="h-10 w-10 object-cover rounded-md mr-3"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                        <p className="text-xs text-gray-500">ID: {item.product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                  Totale ordine:
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                  {formatCurrency(order.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      {/* Pulsanti azioni */}
      <div className="p-6 flex flex-col sm:flex-row gap-3 justify-end">
        <Link
          href="/admin/orders"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-center"
        >
          Torna alla lista
        </Link>
        
        {/* Altri pulsanti per azioni specifiche */}
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Stampa ordine
        </button>
      </div>
    </div>
  );
} 