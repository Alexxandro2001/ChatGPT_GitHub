'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica dell'autenticazione utente
    const checkAuth = async () => {
      try {
        // Verifica se l'utente è autenticato
        const userData = localStorage.getItem('user');
        const userLoggedIn = userData !== null;
        
        setIsAuthenticated(userLoggedIn);
        
        if (!userLoggedIn) {
          // Redirect alla pagina di login se non autenticato
          router.push('/login');
          return;
        }
        
        // Per lo sviluppo, se non esiste una pagina di login, creiamo un utente fittizio
        // In un'app reale, questa parte andrebbe rimossa
        if (process.env.NODE_ENV === 'development' && !userLoggedIn) {
          localStorage.setItem('user', JSON.stringify({
            id: 1,
            name: 'Utente Demo',
            email: 'demo@example.com'
          }));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Errore durante la verifica dell\'autenticazione:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
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

  if (!isAuthenticated) {
    return null; // Non mostriamo nulla e lasciamo che il redirect avvenga
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar per la navigazione dell'account */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Il mio account</h2>
            <nav className="space-y-2">
              <Link href="/account" 
                className="block py-2 px-3 rounded hover:bg-gray-100 transition">
                Dashboard
              </Link>
              <Link href="/account/ordini" 
                className="block py-2 px-3 rounded hover:bg-gray-100 transition">
                I miei ordini
              </Link>
              <Link href="/account/dati-personali" 
                className="block py-2 px-3 rounded hover:bg-gray-100 transition">
                Dati personali
              </Link>
              <Link href="/account/indirizzi" 
                className="block py-2 px-3 rounded hover:bg-gray-100 transition">
                Indirizzi
              </Link>
              <button 
                onClick={() => {
                  // Logout
                  localStorage.removeItem('user');
                  router.push('/');
                }}
                className="w-full text-left py-2 px-3 rounded text-red-600 hover:bg-red-50 transition"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
        
        {/* Contenuto principale */}
        <div className="md:col-span-3">
          {children}
        </div>
      </div>
    </div>
  );
} 