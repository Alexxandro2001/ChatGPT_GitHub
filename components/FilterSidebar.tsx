'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface FilterSidebarProps {
  categories: string[];
  initialSearch?: string;
  initialCategory?: string;
}

export default function FilterSidebar({ 
  categories, 
  initialSearch = '', 
  initialCategory = '' 
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  
  // Aggiorna l'URL con i parametri di filtro
  const updateFilters = (newSearch: string, newCategory: string) => {
    const params = new URLSearchParams();
    
    if (newSearch) {
      params.set('search', newSearch);
    }
    
    if (newCategory) {
      params.set('category', newCategory);
    }
    
    // Reset della pagina quando cambiano i filtri
    params.set('page', '1');
    
    // Aggiorna l'URL senza ricaricare la pagina
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl);
  };
  
  // Gestisce il debounce della ricerca per evitare troppe richieste
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedSearch !== initialSearch) {
        updateFilters(debouncedSearch, category);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [debouncedSearch, category]);
  
  // Gestisce il cambio della categoria
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    updateFilters(search, newCategory);
  };
  
  // Gestisce il cambio del testo di ricerca
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    setDebouncedSearch(newSearch);
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Filtri</h2>
      
      {/* Ricerca per nome */}
      <div className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Cerca prodotti
        </label>
        <input
          type="text"
          id="search"
          value={search}
          onChange={handleSearchChange}
          placeholder="Nome prodotto..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* Filtro per categoria */}
      <div className="mb-6">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Categoria
        </label>
        <select
          id="category"
          value={category}
          onChange={handleCategoryChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tutte le categorie</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      
      {/* Pulsante per resettare i filtri */}
      {(search || category) && (
        <button
          onClick={() => {
            setSearch('');
            setDebouncedSearch('');
            setCategory('');
            router.push(pathname);
          }}
          className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Rimuovi filtri
        </button>
      )}
    </div>
  );
} 