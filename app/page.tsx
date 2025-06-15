'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import useCartStore from '@/store/cartStore';
import FeaturedSection from '@/components/FeaturedSection';
import TestimonialSection from '@/components/TestimonialSection';
import HeroSection from '@/components/ui/HeroSection';
import ProductGrid from '@/components/ui/ProductGrid';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  
  const { addItem } = useCartStore();
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // In un'app reale, queste richieste andrebbero all'API
        // Per semplicità nell'esempio, simuliamo dati dal backend
        
        const mockProducts = [
          {
            id: '1',
            name: 'iPhone 14 Pro',
            price: 1299.99,
            description: 'Il più potente iPhone di sempre con Dynamic Island.',
            category: 'Smartphone',
            image: '/images/products/iphone.jpg',
            stock: 10,
            sku: 'IPHP-14-128',
          },
          {
            id: '2',
            name: 'MacBook Air M2',
            price: 1499.99,
            description: 'Potente, leggero e con batteria a lunga durata.',
            category: 'Laptop',
            image: '/images/products/macbook.jpg',
            stock: 5,
            sku: 'MBA-M2-256',
          },
          {
            id: '3',
            name: 'Smart TV Samsung 55"',
            price: 799.99,
            description: 'Immagini cristalline e colori vividi per un\'esperienza immersiva.',
            category: 'TV',
            image: '/images/products/tv.jpg',
            stock: 8,
            sku: 'STVSAM-55-4K',
          },
          {
            id: '4',
            name: 'Cuffie Sony WH-1000XM5',
            price: 349.99,
            description: 'Cancellazione del rumore leader del settore.',
            category: 'Audio',
            image: '/images/products/headphones.jpg',
            stock: 15,
            sku: 'SNY-WH1000XM5',
          },
          {
            id: '5',
            name: 'Galaxy Watch 5',
            price: 279.99,
            description: 'Smartwatch con monitoraggio salute avanzato.',
            category: 'Accessori',
            image: '/images/products/watch.jpg',
            stock: 12,
            sku: 'GW5-44MM-BLK',
          },
          {
            id: '6',
            name: 'iPad Air',
            price: 649.99,
            description: 'Potenza e versatilità in un design leggero.',
            category: 'Tablet',
            image: '/images/products/ipad.jpg',
            stock: 7,
            sku: 'IPAD-AIR-64',
          }
        ];
        
        setFeaturedProducts(mockProducts.slice(0, 3));
        setLatestProducts(mockProducts);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  // Gestisce l'aggiunta al carrello
  const handleAddToCart = (product: any) => {
    setAddingProductId(product.id);
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || '/images/placeholder-product.png',
      sku: product.sku
    });
    
    setTimeout(() => setAddingProductId(null), 500);
  };

  // Categorie principali
  const categories = [
    {
      id: 1,
      name: 'Smartphone',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      url: '/prodotti?categoria=smartphone'
    },
    {
      id: 2,
      name: 'Laptop',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      url: '/prodotti?categoria=laptop'
    },
    {
      id: 3,
      name: 'Tablet',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      url: '/prodotti?categoria=tablet'
    },
    {
      id: 4,
      name: 'TV',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      url: '/prodotti?categoria=tv'
    },
    {
      id: 5,
      name: 'Audio',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 010-7.072m-2.828 9.9a9 9 0 010-12.728" />
        </svg>
      ),
      url: '/prodotti?categoria=audio'
    },
    {
      id: 6,
      name: 'Accessori',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      url: '/prodotti?categoria=accessori'
    },
  ];
  
  // Helper per generare un placeholder colorato con l'iniziale del prodotto
  const getProductPlaceholder = (productName: string) => {
    return (
      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
        <span className="text-4xl text-gray-400">{productName.charAt(0)}</span>
      </div>
    );
  };
  
  // Filtra i prodotti in base alla ricerca
  const filteredProducts = latestProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <HeroSection />
      
      {/* Sezione Prodotti */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Prodotti in Evidenza
          </h2>
          <Link 
            href="/prodotti"
            className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-2"
          >
            Vedi tutti
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        <ProductGrid products={filteredProducts} onAddToCart={handleAddToCart} />
      </section>

      {/* Resto del contenuto */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categorie */}
        <section className="container mx-auto px-4 mb-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map(category => (
              <Link 
                key={category.id} 
                href={category.url}
                className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="mb-3">
                  {category.icon}
                </div>
                <span className="text-sm font-medium text-text">{category.name}</span>
              </Link>
            ))}
          </div>
        </section>
        
        {/* Features */}
        <section className="bg-gray-50 py-16 mb-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-md mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Spedizione Gratuita</h3>
                <p className="text-sm text-gray-600">Su ordini superiori a €50</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-md mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Pagamenti Sicuri</h3>
                <p className="text-sm text-gray-600">Transazioni 100% protette</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-md mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Facile Reso</h3>
                <p className="text-sm text-gray-600">14 giorni per cambiare idea</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-md mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Supporto 24/7</h3>
                <p className="text-sm text-gray-600">Assistenza sempre disponibile</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Marchi */}
        <section className="container mx-auto px-4 mb-16">
          <h2 className="text-2xl font-bold text-text mb-8 text-center">I marchi più amati</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {['Apple', 'Samsung', 'Sony', 'Microsoft', 'LG', 'HP'].map((brand, index) => (
              <div key={index} className="flex justify-center items-center h-16 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <span className="text-lg font-medium text-text-light">{brand}</span>
              </div>
            ))}
          </div>
        </section>
        
        {/* Newsletter */}
        <section className="bg-orange-500 py-12 mb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Iscriviti alla newsletter</h2>
              <p className="text-white text-opacity-90 mb-6">Ricevi offerte esclusive e scopri le ultime novità nel mondo dell'elettronica.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="La tua email" 
                  className="flex-grow px-4 py-3 rounded-md focus:outline-none text-text"
                />
                <button className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-colors">
                  Iscriviti ora
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 