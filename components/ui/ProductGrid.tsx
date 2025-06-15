'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Tipi
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface FilterOption {
  name: string;
  count: number;
  checked?: boolean;
}

interface ProductGridProps {
  products?: Product[];
  onAddToCart?: (product: Product) => void;
}

// Dati di esempio
const sampleProducts = [
  {
    id: '1',
    name: 'Apple iPhone 14 Pro 512GB Gold (MQ233)',
    price: 1437,
    image: '/images/products/iphone-gold.jpg',
  },
  {
    id: '2',
    name: 'Apple iPhone 11 128GB White (MQ233)',
    price: 510,
    image: '/images/products/iphone-white.jpg',
  },
  {
    id: '3',
    name: 'Apple iPhone 11 128GB White (MQ233)',
    price: 550,
    image: '/images/products/iphone-white.jpg',
  },
  {
    id: '4',
    name: 'Apple iPhone 14 Pro 1TB Gold (MQ2V3)',
    price: 1499,
    image: '/images/products/iphone-gold.jpg',
  },
  {
    id: '5',
    name: 'Apple iPhone 14 Pro 1TB Gold (MQ2V3)',
    price: 1399,
    image: '/images/products/iphone-gold.jpg',
  },
  {
    id: '6',
    name: 'Apple iPhone 14 Pro 128GB Deep Purple (MQ0G3)',
    price: 1600,
    image: '/images/products/iphone-purple.jpg',
  },
  {
    id: '7',
    name: 'Apple iPhone 13 mini 128GB Pink (MLK23)',
    price: 850,
    image: '/images/products/iphone-pink.jpg',
  },
  {
    id: '8',
    name: 'Apple iPhone 14 Pro 256GB Space Black (MQ0T3)',
    price: 1399,
    image: '/images/products/iphone-black.jpg',
  }
];

// Dati di esempio per i filtri
const brandOptions: FilterOption[] = [
  { name: 'Apple', count: 110, checked: true },
  { name: 'Samsung', count: 95 },
  { name: 'Xiaomi', count: 65 },
  { name: 'Poco', count: 24 },
  { name: 'OPPO', count: 36 },
  { name: 'Honor', count: 10 },
  { name: 'Motorola', count: 34 },
  { name: 'Nokia', count: 22 },
  { name: 'Realme', count: 28 }
];

const memoryOptions: FilterOption[] = [
  { name: '16GB', count: 58 },
  { name: '32GB', count: 123 },
  { name: '64GB', count: 48 },
  { name: '128GB', count: 50 },
  { name: '256GB', count: 24 },
  { name: '512GB', count: 8 }
];

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [apiError, setApiError] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1299 });
  const [expandedFilters, setExpandedFilters] = useState({
    price: true,
    brand: true,
    memory: true,
    protection: false,
    screenDiagonal: false,
    screenType: false,
    batteryCapacity: false
  });

  // Gestione dell'espansione/collasso delle sezioni filtro
  const toggleFilter = (filterName: keyof typeof expandedFilters) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  useEffect(() => {
    // Se products è undefined o vuoto, usa i dati di esempio
    if (!products || products.length === 0) {
      setDisplayProducts(sampleProducts);
      
      // Se products è undefined, probabilmente c'è un problema con l'API
      if (products === undefined) {
        setApiError(true);
      }
    } else {
      setDisplayProducts(products);
      setApiError(false);
    }
  }, [products]);

  if (displayProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Nessun prodotto trovato</p>
      </div>
    );
  }

  // Componente per i filtri mobile
  const MobileFilters = () => (
    <div className={`fixed inset-0 bg-white z-50 overflow-auto ${showFilters ? 'block' : 'hidden'}`}>
      <div className="sticky top-0 bg-white p-4 border-b">
        <div className="flex items-center">
          <button 
            onClick={() => setShowFilters(false)}
            className="mr-4"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-medium">Filters</h2>
        </div>
      </div>

      <div className="p-4">
        {/* Filtro prezzo */}
        <div className="mb-6">
          <div 
            className="flex justify-between items-center mb-4 cursor-pointer"
            onClick={() => toggleFilter('price')}
          >
            <h3 className="font-medium">Price</h3>
            <ChevronDownIcon className={`h-5 w-5 transition-transform ${expandedFilters.price ? 'rotate-180' : ''}`} />
          </div>
          
          {expandedFilters.price && (
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">From</span>
                <span className="text-sm text-gray-500">To</span>
              </div>
              <div className="flex gap-3 mb-4">
                <input 
                  type="text" 
                  value={priceRange.min} 
                  onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                  className="w-full border rounded p-2 text-center"
                />
                <input 
                  type="text" 
                  value={priceRange.max} 
                  onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                  className="w-full border rounded p-2 text-center"
                />
              </div>
              <div className="relative h-1 bg-gray-200 rounded-full mb-4">
                <div className="absolute h-1 bg-gray-500 rounded-full" style={{left: '0%', right: '50%'}}></div>
                <div className="absolute w-3 h-3 bg-black rounded-full top-1/2 transform -translate-y-1/2" style={{left: '0%'}}></div>
                <div className="absolute w-3 h-3 bg-black rounded-full top-1/2 transform -translate-y-1/2" style={{left: '50%'}}></div>
              </div>
            </div>
          )}
        </div>

        {/* Filtro brand */}
        <div className="mb-6">
          <div 
            className="flex justify-between items-center mb-4 cursor-pointer"
            onClick={() => toggleFilter('brand')}
          >
            <h3 className="font-medium">Brand</h3>
            <ChevronDownIcon className={`h-5 w-5 transition-transform ${expandedFilters.brand ? 'rotate-180' : ''}`} />
          </div>
          
          {expandedFilters.brand && (
            <div>
              <div className="relative mb-3">
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-full border rounded-md pl-8 pr-3 py-2 text-sm"
                />
                <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {brandOptions.map((brand, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={`brand-${index}`} 
                        checked={brand.checked} 
                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                      />
                      <label htmlFor={`brand-${index}`} className="ml-2 text-sm">{brand.name}</label>
                    </div>
                    <span className="text-xs text-gray-500">{brand.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filtro memoria */}
        <div className="mb-6">
          <div 
            className="flex justify-between items-center mb-4 cursor-pointer"
            onClick={() => toggleFilter('memory')}
          >
            <h3 className="font-medium">Built-in memory</h3>
            <ChevronDownIcon className={`h-5 w-5 transition-transform ${expandedFilters.memory ? 'rotate-180' : ''}`} />
          </div>
          
          {expandedFilters.memory && (
            <div>
              <div className="relative mb-3">
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-full border rounded-md pl-8 pr-3 py-2 text-sm"
                />
                <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {memoryOptions.map((memory, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={`memory-${index}`} 
                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                      />
                      <label htmlFor={`memory-${index}`} className="ml-2 text-sm">{memory.name}</label>
                    </div>
                    <span className="text-xs text-gray-500">{memory.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Altri filtri collassati */}
        {['protection', 'screenDiagonal', 'screenType', 'batteryCapacity'].map((filter) => (
          <div key={filter} className="mb-6">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleFilter(filter as keyof typeof expandedFilters)}
            >
              <h3 className="font-medium">
                {filter === 'protection' ? 'Protection class' : 
                 filter === 'screenDiagonal' ? 'Screen diagonal' : 
                 filter === 'screenType' ? 'Screen type' : 'Battery capacity'}
              </h3>
              <ChevronDownIcon className={`h-5 w-5 transition-transform ${expandedFilters[filter as keyof typeof expandedFilters] ? 'rotate-180' : ''}`} />
            </div>
          </div>
        ))}

        {/* Pulsante Apply */}
        <button 
          onClick={() => setShowFilters(false)}
          className="w-full bg-black text-white py-3 rounded font-medium mt-4"
        >
          Apply
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {apiError && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p className="font-bold">Attenzione</p>
          <p>Il server prodotti non risponde. Visualizzazione dati di esempio.</p>
        </div>
      )}

      {/* Filtri mobile e intestazione */}
      <div className="md:hidden mb-6">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => setShowFilters(true)}
            className="flex items-center space-x-2 px-4 py-2 border rounded-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span>Filters</span>
          </button>
          <div className="flex items-center space-x-2">
            <span>By rating</span>
            <ChevronDownIcon className="h-5 w-5" />
          </div>
        </div>
        <div className="font-medium mb-4">
          Products Result - <span>85</span>
        </div>
      </div>

      {/* Griglia prodotti */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {displayProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id.toString()}
            image={product.image}
            name={product.name}
            price={product.price}
            onAddToCart={onAddToCart ? () => onAddToCart(product) : undefined}
          />
        ))}
      </div>

      {/* Paginazione */}
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button className="p-2 border rounded-md">
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-md">1</button>
        <button className="w-8 h-8 flex items-center justify-center border rounded-md">2</button>
        <button className="w-8 h-8 flex items-center justify-center border rounded-md">3</button>
        <span className="px-2">...</span>
        <button className="w-8 h-8 flex items-center justify-center border rounded-md">12</button>
        <button className="p-2 border rounded-md">
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Filtri mobile */}
      <MobileFilters />
    </div>
  );
} 