'use client';

import { useState, useEffect } from 'react';
import { useFilterStore } from '../store/filterStore';

// Definisco l'interfaccia per le categorie
interface Category {
  id: number;
  name: string;
}

interface ProductFiltersProps {
  categories: Category[];
  minProductPrice: number;
  maxProductPrice: number;
  className?: string;
  isSidebar?: boolean;
}

export default function ProductFilters({ 
  categories, 
  minProductPrice = 0, 
  maxProductPrice = 10000,
  className = '',
  isSidebar = true
}: ProductFiltersProps) {
  const { 
    searchQuery, 
    category, 
    minPrice, 
    maxPrice, 
    setSearchQuery, 
    setCategory, 
    setMinPrice, 
    setMaxPrice,
    resetFilters
  } = useFilterStore();

  // Utilizzo degli state locali per gestire l'input prima dell'aggiornamento dello store
  const [localMinPrice, setLocalMinPrice] = useState(minPrice.toString());
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice.toString());

  // Aggiorna i valori locali quando cambiano i valori nello store
  useEffect(() => {
    setLocalMinPrice(minPrice.toString());
    setLocalMaxPrice(maxPrice.toString());
  }, [minPrice, maxPrice]);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMinPrice(e.target.value);
    // Aggiorna lo store solo con valori numerici validi
    if (!isNaN(parseFloat(e.target.value))) {
      setMinPrice(parseFloat(e.target.value));
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMaxPrice(e.target.value);
    // Aggiorna lo store solo con valori numerici validi
    if (!isNaN(parseFloat(e.target.value))) {
      setMaxPrice(parseFloat(e.target.value));
    }
  };

  // Layout per sidebar (verticale)
  if (isSidebar) {
    return (
      <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
        <h2 className="text-lg font-bold mb-4 text-text">Filtri</h2>
        
        {/* Ricerca per nome */}
        <div className="mb-6">
          <label htmlFor="search" className="block text-sm font-medium text-text-light mb-2">
            Cerca prodotti
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca per nome..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
        </div>
        
        {/* Filtro per categoria */}
        <div className="mb-6">
          <label htmlFor="category" className="block text-sm font-medium text-text-light mb-2">
            Categoria
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            <option value="">Tutte le categorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Filtro per prezzo */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-light mb-2">
            Fascia di prezzo
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="minPrice" className="block text-xs text-text-light mb-1">
                Min €
              </label>
              <input
                type="number"
                id="minPrice"
                value={localMinPrice}
                onChange={handleMinPriceChange}
                min={minProductPrice}
                max={maxPrice}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-xs text-text-light mb-1">
                Max €
              </label>
              <input
                type="number"
                id="maxPrice"
                value={localMaxPrice}
                onChange={handleMaxPriceChange}
                min={minPrice}
                max={maxProductPrice}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
          </div>
          
          {/* Slider per il prezzo (opzionale) */}
          <div className="mt-4">
            <input
              type="range"
              min={minProductPrice}
              max={maxProductPrice}
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
            />
            <div className="flex justify-between text-xs text-text-light mt-1">
              <span>€{minProductPrice}</span>
              <span>€{maxProductPrice}</span>
            </div>
          </div>
        </div>
        
        {/* Pulsante reset */}
        <button
          onClick={resetFilters}
          className="w-full bg-gray-100 text-text-light py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
        >
          Resetta filtri
        </button>
      </div>
    );
  }
  
  // Layout orizzontale (per visualizzazione in alto)
  return (
    <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Ricerca per nome */}
        <div className="flex-grow">
          <label htmlFor="search" className="block text-sm font-medium text-text-light mb-1">
            Cerca prodotti
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca per nome..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
        </div>
        
        {/* Filtro per categoria */}
        <div className="w-full md:w-1/4">
          <label htmlFor="category" className="block text-sm font-medium text-text-light mb-1">
            Categoria
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            <option value="">Tutte le categorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Filtro per prezzo - versione compatta */}
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-text-light mb-1">
            Fascia di prezzo
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={localMinPrice}
              onChange={handleMinPriceChange}
              min={minProductPrice}
              max={maxPrice}
              className="w-20 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
              placeholder="Min"
            />
            <span className="text-text-light">-</span>
            <input
              type="number"
              value={localMaxPrice}
              onChange={handleMaxPriceChange}
              min={minPrice}
              max={maxProductPrice}
              className="w-20 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
              placeholder="Max"
            />
            <button
              onClick={resetFilters}
              className="ml-2 bg-gray-100 text-text-light py-2 px-3 rounded-md hover:bg-gray-200 transition-colors text-sm"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 