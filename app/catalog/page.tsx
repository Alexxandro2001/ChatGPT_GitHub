import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';

interface CatalogPageProps {
  searchParams: {
    page?: string;
    search?: string;
    category?: string;
  };
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const page = parseInt(searchParams.page || '1');
  const search = searchParams.search || '';
  const category = searchParams.category || '';
  
  const pageSize = 20;
  const skip = (page - 1) * pageSize;
  
  // Costruisci la query di filtro
  const where: Prisma.ProductWhereInput = {
    isDeleted: false,
  };
  
  if (search) {
    where.name = {
      contains: search,
      mode: 'insensitive',
    };
  }
  
  if (category) {
    where.category = category;
  }
  
  // Recupera i prodotti filtrati
  const products = await db.product.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  // Conta il numero totale di prodotti per la paginazione
  const totalProducts = await db.product.count({ where });
  const totalPages = Math.ceil(totalProducts / pageSize);
  
  // Recupera tutte le categorie disponibili
  const categories = await db.product.findMany({
    select: {
      category: true,
    },
    distinct: ['category'],
    where: {
      isDeleted: false,
      category: {
        not: null,
      },
    },
  });
  
  const uniqueCategories = categories.map(c => c.category).filter(Boolean) as string[];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Catalogo Prodotti</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar filtri */}
        <div className="w-full md:w-1/4">
          <FilterSidebar 
            categories={uniqueCategories} 
            initialSearch={search} 
            initialCategory={category}
          />
        </div>
        
        {/* Griglia prodotti */}
        <div className="w-full md:w-3/4">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nessun prodotto trovato.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          {/* Paginazione */}
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                search={search} 
                category={category} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 