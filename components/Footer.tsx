import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="mb-4">
              <Image 
                src="/images/planetstore-logo.png" 
                alt="PlanetStore Logo" 
                width={180}
                height={42}
                className="object-contain"
              />
            </div>
            <p className="text-text-light">
              Il tuo negozio di elettronica di fiducia con prodotti di alta qualità
              e prezzi competitivi.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-text">Link Utili</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-text-light hover:text-brand-orange">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/prodotti" className="text-text-light hover:text-brand-orange">
                  Prodotti
                </Link>
              </li>
              <li>
                <Link href="/carrello" className="text-text-light hover:text-brand-orange">
                  Carrello
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-text">Contatti</h3>
            <ul className="space-y-2 text-text-light">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5 mr-2 text-brand-orange">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@planetstore.it
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5 mr-2 text-brand-orange">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +39 012 345 6789
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-text-light">
          <p>&copy; {new Date().getFullYear()} PlanetStore. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
} 