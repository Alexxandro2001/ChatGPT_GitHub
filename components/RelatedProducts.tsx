'use client';

import { Product } from '@prisma/client';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
  products: Array<{
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    stock: number;
    category: string | null;
  }>;
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products.length) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Potrebbero interessarti</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product as Product} 
          />
        ))}
      </div>
    </div>
  );
} 