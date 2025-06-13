import { create } from 'zustand';

export interface FilterState {
  searchQuery: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  setSearchQuery: (query: string) => void;
  setCategory: (category: string) => void;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  category: '',
  minPrice: 0,
  maxPrice: 10000,
  
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setCategory: (category: string) => set({ category }),
  setMinPrice: (price: number) => set({ minPrice: price }),
  setMaxPrice: (price: number) => set({ maxPrice: price }),
  resetFilters: () => set({ 
    searchQuery: '', 
    category: '', 
    minPrice: 0, 
    maxPrice: 10000 
  }),
})); 