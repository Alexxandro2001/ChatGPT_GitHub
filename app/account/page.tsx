'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Recupera i dati dell'utente dal localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  
  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Il tuo profilo</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="mb-2"><span className="font-medium">Nome:</span> {user.name}</p>
          <p><span className="font-medium">Email:</span> {user.email}</p>
        </div>
        <div className="mt-4">
          <Link 
            href="/account/dati-personali" 
            className="text-brand-orange hover:underline text-sm"
          >
            Modifica dati personali →
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
          <h3 className="text-lg font-semibold mb-2">I tuoi ordini</h3>
          <p className="text-gray-600 mb-4">Visualizza lo stato dei tuoi ordini e lo storico degli acquisti</p>
          <Link 
            href="/account/ordini"
            className="inline-block px-4 py-2 bg-brand-orange text-white rounded hover:bg-opacity-90 transition"
          >
            Visualizza ordini
          </Link>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
          <h3 className="text-lg font-semibold mb-2">I tuoi indirizzi</h3>
          <p className="text-gray-600 mb-4">Gestisci i tuoi indirizzi di spedizione e fatturazione</p>
          <Link 
            href="/account/indirizzi"
            className="inline-block px-4 py-2 bg-brand-orange text-white rounded hover:bg-opacity-90 transition"
          >
            Gestisci indirizzi
          </Link>
        </div>
      </div>
    </div>
  );
} 