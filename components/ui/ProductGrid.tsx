'use client';

import ProductCard from './ProductCard';

// Dati di esempio
const sampleProducts = [
  {
    id: '1',
    name: 'iPhone 14 Pro Max - 256GB - Deep Purple',
    price: 1299.99,
    image: '/images/products/iphone.jpg',
    sku: 'IPHP-14-256-PUR',
    category: 'Smartphone'
  },
  {
    id: '2',
    name: 'MacBook Air M2 - 16GB RAM - 512GB SSD',
    price: 1499.99,
    image: '/images/products/macbook.jpg',
    sku: 'MBA-M2-16-512',
    category: 'Laptop'
  },
  {
    id: '3',
    name: 'Samsung Galaxy Watch 5 Pro - 45mm',
    price: 449.99,
    image: '/images/products/watch.jpg',
    sku: 'GW5-PRO-45',
    category: 'Smartwatch'
  },
  {
    id: '4',
    name: 'Sony WH-1000XM5 - Cuffie Wireless',
    price: 399.99,
    image: '/images/products/headphones.jpg',
    sku: 'SNY-WH1000XM5',
    category: 'Audio'
  },
  {
    id: '5',
    name: 'iPad Pro 12.9" - 256GB - Wi-Fi + Cellular',
    price: 1299.99,
    image: '/images/products/ipad.jpg',
    sku: 'IPAD-PRO-12-256',
    category: 'Tablet'
  },
  {
    id: '6',
    name: 'Samsung 55" QLED 4K Smart TV',
    price: 899.99,
    image: '/images/products/tv.jpg',
    sku: 'TV-SAM-55-Q4K',
    category: 'TV'
  },
  {
    id: '7',
    name: 'Nintendo Switch OLED - White',
    price: 349.99,
    image: '/images/products/switch.jpg',
    sku: 'NSW-OLED-WHT',
    category: 'Console'
  },
  {
    id: '8',
    name: 'DJI Mini 3 Pro - Drone',
    price: 799.99,
    image: '/images/products/drone.jpg',
    sku: 'DJI-MINI3-PRO',
    category: 'Droni'
  }
];

interface Product {
  id: string | number;
  image: string;
  name: string;
  price: number | string;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          image={product.image}
          name={product.name}
          price={product.price}
          onAddToCart={onAddToCart ? () => onAddToCart(product) : undefined}
        />
      ))}
    </div>
  );
} 