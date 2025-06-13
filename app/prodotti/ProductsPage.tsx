'use client';

import { ProductCardProps } from '../../components/ProductCard';
import ProductsGrid from '../../components/ProductsGrid';
import ProductFilters from '../../components/ProductFilters';

interface Category {
  id: number;
  name: string;
}

interface ProductsPageProps {
  products: ProductCardProps[];
  categories: Category[];
  minProductPrice: number;
  maxProductPrice: number;
}

export default function ProductsPage({
  products,
  categories,
  minProductPrice,
  maxProductPrice
}: ProductsPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-text">Tutti i prodotti</h1>
      
      {/* Layout desktop: sidebar a sinistra, prodotti a destra */}
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Sidebar con filtri per desktop */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <ProductFilters 
              categories={categories} 
              minProductPrice={minProductPrice} 
              maxProductPrice={maxProductPrice} 
              isSidebar={true}
            />
          </div>
        </div>
        
        {/* Contenuto principale */}
        <div className="lg:col-span-3">
          {/* Filtri per mobile/tablet (orizzontali) */}
          <div className="lg:hidden mb-6">
            <ProductFilters 
              categories={categories} 
              minProductPrice={minProductPrice} 
              maxProductPrice={maxProductPrice} 
              isSidebar={false}
            />
          </div>
          
          {/* Griglia prodotti */}
          <ProductsGrid products={products} />
        </div>
      </div>
    </div>
  );
} 