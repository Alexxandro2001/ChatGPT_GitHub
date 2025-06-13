'use client';

import { useEffect, useState } from 'react';
import { useFilterStore } from '../store/filterStore';
import ProductCard, { ProductCardProps } from './ProductCard';

interface ProductsGridProps {
  products: ProductCardProps[];
  className?: string;
}

export default function ProductsGrid({ products, className = '' }: ProductsGridProps) {
  const { searchQuery, category, minPrice, maxPrice } = useFilterStore();
  const [filteredProducts, setFilteredProducts] = useState<ProductCardProps[]>(products);
  
  // Applica i filtri quando cambiano
  useEffect(() => {
    const filtered = products.filter((product) => {
      // Filtro per nome
      const nameMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filtro per categoria
      const categoryMatch = category === '' || product.category === category;
      
      // Filtro per prezzo
      const priceMatch = product.price >= minPrice && product.price <= maxPrice;
      
      return nameMatch && categoryMatch && priceMatch;
    });
    
    setFilteredProducts(filtered);
  }, [products, searchQuery, category, minPrice, maxPrice]);
  
  return (
    <div className={className}>
      {filteredProducts.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium mt-4 mb-2 text-text">Nessun prodotto trovato</h3>
          <p className="text-text-light">Prova a modificare i filtri per trovare ciò che stai cercando.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
      
      <div className="mt-4 text-text-light text-sm">
        {filteredProducts.length} prodotti trovati
      </div>
    </div>
  );
} 