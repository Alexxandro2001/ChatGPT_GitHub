import { create } from 'zustand';

// Definizione dell'interfaccia per lo stato
interface SearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
}

// Creazione dello store
export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  isSearching: false,
  setIsSearching: (isSearching) => set({ isSearching }),
})); 