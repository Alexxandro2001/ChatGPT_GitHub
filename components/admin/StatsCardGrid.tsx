'use client';

import { DashboardStats } from '@/app/admin/dashboard/page';
import { formatCurrency } from '@/lib/utils';

interface StatsCardGridProps {
  stats: DashboardStats;
}

// Componente per una singola card
function StatCard({
  title,
  value,
  icon,
  color,
  footer,
}: {
  title: string;
  value: string | number;
  icon: JSX.Element;
  color: string;
  footer?: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>{icon}</div>
        </div>
        {footer && <p className="mt-3 text-xs text-gray-500">{footer}</p>}
      </div>
    </div>
  );
}

export default function StatsCardGrid({ stats }: StatsCardGridProps) {
  const {
    revenueToday,
    revenueMonth,
    ordersByStatus,
    topProducts,
  } = stats;

  // Calcola le percentuali per i badge di stato
  const totalOrders = Object.values(ordersByStatus).reduce((sum, count) => sum + count, 0);
  const getPercentage = (count: number) => totalOrders === 0 ? 0 : Math.round((count / totalOrders) * 100);

  return (
    <div className="space-y-8">
      {/* Prima riga - Statistiche finanziarie */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Entrate oggi"
          value={formatCurrency(revenueToday)}
          icon={
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          color="bg-green-500"
          footer="Entrate generate oggi"
        />

        <StatCard
          title="Entrate mensili"
          value={formatCurrency(revenueMonth)}
          icon={
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
          color="bg-blue-500"
          footer={`Entrate del mese di ${new Date().toLocaleDateString('it-IT', { month: 'long' })}`}
        />

        <StatCard
          title="Ordini in attesa"
          value={ordersByStatus.PENDING}
          icon={
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          color="bg-yellow-500"
          footer={`${getPercentage(ordersByStatus.PENDING)}% del totale ordini`}
        />

        <StatCard
          title="Ordini spediti"
          value={ordersByStatus.SPEDITO}
          icon={
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          }
          color="bg-indigo-500"
          footer={`${getPercentage(ordersByStatus.SPEDITO)}% del totale ordini`}
        />
      </div>

      {/* Seconda riga - Statistiche ordini */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden lg:col-span-2">
          <div className="p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stato degli ordini</h3>
            <div className="space-y-4">
              {Object.entries(ordersByStatus).map(([status, count]) => {
                const percent = getPercentage(count);
                let color;
                let label;

                switch (status) {
                  case 'PENDING':
                    color = 'bg-yellow-500';
                    label = 'In attesa';
                    break;
                  case 'PAGATO':
                    color = 'bg-green-500';
                    label = 'Pagato';
                    break;
                  case 'SPEDITO':
                    color = 'bg-blue-500';
                    label = 'Spedito';
                    break;
                  case 'CONSEGNATO':
                    color = 'bg-purple-500';
                    label = 'Consegnato';
                    break;
                  case 'ANNULLATO':
                    color = 'bg-red-500';
                    label = 'Annullato';
                    break;
                  default:
                    color = 'bg-gray-500';
                    label = status;
                }

                return (
                  <div key={status}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600">{label}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {count} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${color}`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden lg:col-span-3">
          <div className="p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prodotti più venduti</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prodotto
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantità
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entrate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topProducts.length > 0 ? (
                    topProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                          {product.totalQuantity}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                          {formatCurrency(product.totalRevenue)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-3 py-3 text-sm text-gray-500 text-center">
                        Nessun prodotto venduto
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 