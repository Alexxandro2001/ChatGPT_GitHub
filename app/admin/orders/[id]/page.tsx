import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import OrderDetail from '@/components/admin/OrderDetail';

// Parametri per la pagina
interface OrderDetailPageProps {
  params: {
    id: string;
  };
  searchParams: {
    action?: string;
  };
}

// Funzione per ottenere un ordine per ID
async function getOrderById(id: number) {
  const order = await db.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
              description: true,
            },
          },
        },
      },
    },
  });
  
  if (!order) {
    return null;
  }
  
  return order;
}

// Componente principale della pagina
export default async function OrderDetailPage({ params, searchParams }: OrderDetailPageProps) {
  const orderId = parseInt(params.id, 10);
  
  // Gestisci ID non valido
  if (isNaN(orderId)) {
    notFound();
  }
  
  // Ottieni l'ordine dal database
  const order = await getOrderById(orderId);
  
  // Se l'ordine non esiste, mostra la pagina 404
  if (!order) {
    notFound();
  }
  
  // Flag per indicare se mostrare direttamente la modifica dello stato
  const showStatusChangeForm = searchParams.action === 'change-status';
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dettaglio Ordine #{order.id}</h1>
      
      <OrderDetail order={order} showStatusChangeForm={showStatusChangeForm} />
    </div>
  );
} 