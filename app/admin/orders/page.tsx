import { Suspense } from 'react';
import { db } from '@/lib/db';
import OrderList from '@/components/admin/OrderList';
import { OrderStatus } from '@prisma/client';

// Tipi per i parametri di ricerca
export type OrderFilters = {
  page?: number;
  status?: OrderStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
};

// Tipo per i dati di paginazione
export type PaginationData = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
};

// Funzione di ricerca degli ordini con filtri e paginazione
async function getOrders(filters: OrderFilters) {
  const {
    page = 1,
    status,
    dateFrom,
    dateTo,
    search,
  } = filters;

  // Numero di ordini per pagina
  const perPage = 10;
  const skip = (page - 1) * perPage;

  // Costruisci i filtri Prisma
  const where: any = {};

  // Filtro per stato
  if (status) {
    where.status = status;
  }

  // Filtro per data
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) {
      where.createdAt.gte = new Date(dateFrom);
    }
    if (dateTo) {
      // Aggiungi un giorno alla data finale per includere tutto il giorno
      const endDate = new Date(dateTo);
      endDate.setDate(endDate.getDate() + 1);
      where.createdAt.lte = endDate;
    }
  }

  // Filtro per ricerca (id ordine o email utente)
  if (search) {
    // Verifica se la ricerca è un numero (per id ordine)
    const isNumeric = /^\d+$/.test(search);
    
    if (isNumeric) {
      where.id = parseInt(search, 10);
    } else {
      // Cerca per email utente
      where.OR = [
        {
          user: {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }
  }

  // Esegui query per conteggio totale
  const totalItems = await db.order.count({ where });
  const totalPages = Math.ceil(totalItems / perPage);

  // Esegui query per gli ordini
  const orders = await db.order.findMany({
    where,
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
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip,
    take: perPage,
  });

  // Prepara i dati di paginazione
  const paginationData: PaginationData = {
    currentPage: page,
    totalPages,
    totalItems,
    perPage,
  };

  return { orders, paginationData };
}

// Componente principale
export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Estrai i parametri dalla URL
  const page = searchParams.page ? parseInt(searchParams.page as string, 10) : 1;
  const status = searchParams.status as OrderStatus | undefined;
  const dateFrom = searchParams.dateFrom as string | undefined;
  const dateTo = searchParams.dateTo as string | undefined;
  const search = searchParams.search as string | undefined;

  // Prepara i filtri
  const filters: OrderFilters = {
    page,
    status,
    dateFrom,
    dateTo,
    search,
  };

  // Ottieni gli ordini con i filtri applicati
  const { orders, paginationData } = await getOrders(filters);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Gestione Ordini</h1>
      
      <Suspense fallback={<div>Caricamento ordini...</div>}>
        <OrderList 
          orders={orders} 
          paginationData={paginationData} 
          initialFilters={filters} 
        />
      </Suspense>
    </div>
  );
} 