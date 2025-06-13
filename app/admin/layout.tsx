'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica che l'utente sia un amministratore
    const checkAdmin = async () => {
      try {
        // In un'app reale qui avremmo una verifica dell'utente con il backend
        // Per ora facciamo una simulazione
        const userData = localStorage.getItem('user');
        
        if (!userData) {
          router.push('/account');
          return;
        }
        
        const user = JSON.parse(userData);
        
        if (!user.isAdmin) {
          // Per scopi di sviluppo, impostiamo l'utente come admin
          // In produzione, questo andrebbe rimosso e gestito correttamente lato server
          user.isAdmin = true;
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        setIsAdmin(user.isAdmin);
        setIsLoading(false);
      } catch (error) {
        console.error('Errore durante la verifica dell\'utente admin:', error);
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="w-16 h-16 border-t-4 border-brand-orange border-solid rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Sidebar di amministrazione */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Amministrazione
            </h2>
            <nav className="space-y-2">
              <Link href="/admin" 
                className="block py-2 px-3 rounded hover:bg-gray-100 transition">
                Dashboard
              </Link>
              <Link href="/admin/ordini" 
                className="block py-2 px-3 rounded hover:bg-gray-100 transition">
                Gestione Ordini
              </Link>
              <Link href="/admin/prodotti" 
                className="block py-2 px-3 rounded hover:bg-gray-100 transition">
                Gestione Prodotti
              </Link>
              <Link href="/admin/categorie" 
                className="block py-2 px-3 rounded hover:bg-gray-100 transition">
                Gestione Categorie
              </Link>
              <Link href="/admin/utenti" 
                className="block py-2 px-3 rounded hover:bg-gray-100 transition">
                Gestione Utenti
              </Link>
              <hr className="my-3" />
              <Link href="/account" 
                className="block py-2 px-3 rounded text-gray-600 hover:bg-gray-100 transition">
                Torna all'account
              </Link>
              <Link href="/" 
                className="block py-2 px-3 rounded text-gray-600 hover:bg-gray-100 transition">
                Vai al negozio
              </Link>
            </nav>
          </div>
        </div>
        
        {/* Contenuto principale */}
        <div className="md:col-span-4">
          {isAdmin ? children : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-xl font-semibold mb-4">Accesso non autorizzato</h2>
              <p className="mb-4">Devi essere un amministratore per accedere a questa sezione.</p>
              <button 
                onClick={() => router.push('/')} 
                className="px-4 py-2 bg-brand-orange text-white rounded hover:bg-opacity-90 transition"
              >
                Torna alla home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 