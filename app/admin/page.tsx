'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type StatCount = {
  orders: number;
  products: number;
  users: number;
  revenue: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatCount | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In un'app reale, qui chiameremmo le API per ottenere i dati
    const fetchDashboardData = async () => {
      try {
        // Simulazione caricamento dati
        setTimeout(() => {
          setStats({
            orders: 126,
            products: 45,
            users: 87,
            revenue: 12450.75
          });
          
          setRecentOrders([
            { 
              id: 123456, 
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              customer: "Mario Rossi",
              total: 849.98,
              status: "IN_ELABORAZIONE"
            },
            { 
              id: 123455, 
              date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              customer: "Laura Bianchi",
              total: 1299.99,
              status: "SPEDITO"
            },
            { 
              id: 123454, 
              date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              customer: "Giuseppe Verdi",
              total: 159.98,
              status: "CONSEGNATO"
            },
            { 
              id: 123453, 
              date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              customer: "Anna Neri",
              total: 499.95,
              status: "SPEDITO"
            },
            { 
              id: 123452, 
              date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              customer: "Paolo Gialli",
              total: 79.99,
              status: "CONSEGNATO"
            }
          ]);
          
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Errore durante il recupero dei dati della dashboard:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Funzione per formattare la data
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
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
        <h1 className="text-2xl font-bold mb-6">Dashboard Amministrazione</h1>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="border border-gray-200 rounded-lg">
            <div className="h-10 bg-gray-100 rounded-t-lg w-full"></div>
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
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Amministrazione</h1>
      
      {/* Statistiche */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-600 text-sm font-medium">Ordini Totali</p>
              <h3 className="text-2xl font-bold mt-1">{stats?.orders}</h3>
            </div>
            <div className="bg-blue-200 rounded-full p-2">
              <svg className="w-5 h-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <p className="text-blue-600 text-xs mt-4">
            <Link href="/admin/ordini" className="flex items-center">
              <span>Visualizza tutti</span>
              <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-600 text-sm font-medium">Prodotti</p>
              <h3 className="text-2xl font-bold mt-1">{stats?.products}</h3>
            </div>
            <div className="bg-green-200 rounded-full p-2">
              <svg className="w-5 h-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
          </div>
          <p className="text-green-600 text-xs mt-4">
            <Link href="/admin/prodotti" className="flex items-center">
              <span>Gestisci prodotti</span>
              <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-600 text-sm font-medium">Utenti</p>
              <h3 className="text-2xl font-bold mt-1">{stats?.users}</h3>
            </div>
            <div className="bg-purple-200 rounded-full p-2">
              <svg className="w-5 h-5 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <p className="text-purple-600 text-xs mt-4">
            <Link href="/admin/utenti" className="flex items-center">
              <span>Gestisci utenti</span>
              <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-amber-600 text-sm font-medium">Fatturato</p>
              <h3 className="text-2xl font-bold mt-1">€{stats?.revenue.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</h3>
            </div>
            <div className="bg-amber-200 rounded-full p-2">
              <svg className="w-5 h-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-amber-600 text-xs mt-4">
            <span className="flex items-center">
              <span>Periodo: Ultimi 30 giorni</span>
            </span>
          </p>
        </div>
      </div>
      
      {/* Ordini recenti */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Ordini recenti</h2>
          <Link 
            href="/admin/ordini" 
            className="text-brand-orange hover:underline text-sm font-medium flex items-center"
          >
            Vedi tutti gli ordini
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
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
                      Totale
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stato
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Azioni
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        €{order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          href={`/admin/ordini/${order.id}`} 
                          className="text-brand-orange hover:text-orange-800"
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
      </div>
    </div>
  );
} 