import { db } from '@/lib/db';
import StatsCardGrid from '@/components/admin/StatsCardGrid';
import { formatCurrency } from '@/lib/utils';

// Tipo per le statistiche
export interface DashboardStats {
  revenueToday: number;
  revenueMonth: number;
  ordersByStatus: {
    PENDING: number;
    PAGATO: number;
    SPEDITO: number;
    CONSEGNATO: number;
    ANNULLATO: number;
  };
  topProducts: {
    id: number;
    name: string;
    totalQuantity: number;
    totalRevenue: number;
  }[];
}

// Funzione per ottenere le statistiche
async function getStats(): Promise<DashboardStats> {
  // Data di oggi e inizio mese
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  // Calcolo delle entrate di oggi
  const ordersToday = await db.order.findMany({
    where: {
      createdAt: {
        gte: today,
      },
      status: {
        not: 'ANNULLATO',
      },
    },
    select: {
      total: true,
    },
  });
  
  const revenueToday = ordersToday.reduce((sum, order) => sum + order.total, 0);
  
  // Calcolo delle entrate del mese
  const ordersMonth = await db.order.findMany({
    where: {
      createdAt: {
        gte: startOfMonth,
      },
      status: {
        not: 'ANNULLATO',
      },
    },
    select: {
      total: true,
    },
  });
  
  const revenueMonth = ordersMonth.reduce((sum, order) => sum + order.total, 0);
  
  // Conteggio degli ordini per stato
  const orderCounts = await db.$queryRaw<{ status: string; count: bigint }[]>`
    SELECT status, COUNT(*) as count 
    FROM "Order" 
    GROUP BY status
  `;
  
  const ordersByStatus = {
    PENDING: 0,
    PAGATO: 0,
    SPEDITO: 0,
    CONSEGNATO: 0,
    ANNULLATO: 0,
  };
  
  orderCounts.forEach(({ status, count }) => {
    if (status in ordersByStatus) {
      ordersByStatus[status as keyof typeof ordersByStatus] = Number(count);
    }
  });
  
  // Recupero dei top 5 prodotti per quantità venduta
  const topProducts = await db.$queryRaw<{
    id: number;
    name: string;
    totalQuantity: bigint;
    totalRevenue: number;
  }[]>`
    SELECT 
      p.id,
      p.name,
      SUM(oi.quantity) as "totalQuantity",
      SUM(oi.quantity * oi.price) as "totalRevenue"
    FROM "OrderItem" oi
    JOIN "Product" p ON oi.productId = p.id
    JOIN "Order" o ON oi.orderId = o.id
    WHERE o.status != 'ANNULLATO'
    GROUP BY p.id, p.name
    ORDER BY "totalQuantity" DESC
    LIMIT 5
  `;
  
  return {
    revenueToday,
    revenueMonth,
    ordersByStatus,
    topProducts: topProducts.map(item => ({
      ...item,
      totalQuantity: Number(item.totalQuantity),
    })),
  };
}

export default async function DashboardPage() {
  const stats = await getStats();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <StatsCardGrid stats={stats} />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Informazioni generali</h2>
        <p className="text-gray-700">
          Benvenuto nella dashboard amministrativa. Da qui puoi monitorare le vendite, gestire gli ordini 
          e tenere sotto controllo le prestazioni del tuo negozio.
        </p>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Vendite totali</h3>
            <p className="text-gray-700">
              Le vendite di questo mese sono <span className="font-medium">{formatCurrency(stats.revenueMonth)}</span>, 
              con <span className="font-medium">{formatCurrency(stats.revenueToday)}</span> solo oggi.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Ordini in corso</h3>
            <p className="text-gray-700">
              Hai <span className="font-medium">{stats.ordersByStatus.PENDING}</span> ordini in attesa,&nbsp;
              <span className="font-medium">{stats.ordersByStatus.PAGATO}</span> ordini pagati e&nbsp;
              <span className="font-medium">{stats.ordersByStatus.SPEDITO}</span> ordini spediti.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 