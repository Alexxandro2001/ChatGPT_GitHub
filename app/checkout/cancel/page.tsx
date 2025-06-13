'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutCancelPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-yellow-500 p-6 text-white text-center">
          <div className="rounded-full bg-white p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Pagamento annullato</h1>
          <p className="mt-2">Il processo di pagamento è stato interrotto o annullato.</p>
        </div>
        
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cosa puoi fare ora?</h2>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>
                  Il tuo carrello è ancora salvato e puoi riprovare il pagamento quando preferisci.
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>
                  Se hai riscontrato problemi con il pagamento, puoi contattare il nostro servizio clienti per assistenza.
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>
                  Puoi anche modificare gli articoli nel tuo carrello o continuare lo shopping.
                </span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/carrello"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
            >
              Torna al carrello
            </Link>
            <Link
              href="/catalog"
              className="inline-block px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-center"
            >
              Continua lo shopping
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Hai domande o problemi con l'ordine?{' '}
              <Link href="/contact" className="text-blue-600 hover:text-blue-800 font-medium">
                Contattaci
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 