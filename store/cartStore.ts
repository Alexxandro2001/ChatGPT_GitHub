import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'react-toastify';

// Definizione dei tipi
export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  sku?: string;
}

interface CartStore {
  // Stato
  items: CartItem[];
  
  // Getter
  cartCount: number;
  
  // Azioni
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// Creazione dello store con persistenza
const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      // Computed property per il conteggio articoli
      get cartCount() {
        return get().getTotalItems();
      },
      
      // Aggiunge un articolo al carrello
      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(i => i.id === item.id);
        
        if (existingItem) {
          // Se l'articolo esiste, aggiorna la quantità
          set({
            items: currentItems.map(i => 
              i.id === item.id 
                ? { ...i, quantity: i.quantity + (item.quantity || 1) } 
                : i
            )
          });
          toast.success(`Quantità aggiornata: ${existingItem.name}`);
        } else {
          // Aggiungi nuovo articolo
          set({ 
            items: [...currentItems, { ...item, quantity: item.quantity || 1 }] 
          });
          toast.success(`Aggiunto al carrello: ${item.name}`);
        }
      },
      
      // Rimuove un articolo dal carrello
      removeItem: (id) => {
        const currentItems = get().items;
        const itemToRemove = currentItems.find(i => i.id === id);
        
        if (itemToRemove) {
          set({ 
            items: currentItems.filter(i => i.id !== id) 
          });
          toast.info(`Rimosso dal carrello: ${itemToRemove.name}`);
        }
      },
      
      // Aggiorna la quantità di un articolo
      updateQuantity: (id, quantity) => {
        const currentItems = get().items;
        
        if (quantity <= 0) {
          // Se la quantità è zero o negativa, rimuovi l'articolo
          get().removeItem(id);
        } else {
          // Altrimenti aggiorna la quantità
          set({
            items: currentItems.map(i => 
              i.id === id ? { ...i, quantity } : i
            )
          });
        }
      },
      
      // Svuota il carrello
      clearCart: () => {
        set({ items: [] });
      },
      
      // Calcola il numero totale di articoli
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      // Calcola il prezzo totale
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'cart-storage', // Nome della chiave in localStorage
      storage: createJSONStorage(() => localStorage), // Usa localStorage
      partialize: (state) => ({ items: state.items }), // Salva solo gli articoli
      
      // Gestisce gli errori in modo più robusto
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('Carrello ripristinato da localStorage');
        } else {
          console.error('Errore nel ripristino del carrello');
          // Se ci sono problemi, inizializza con un array vuoto
          return { items: [] };
        }
      }
    }
  )
);

export default useCartStore; 