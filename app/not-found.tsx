import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Pagina non trovata</h1>
      <p className="text-gray-600 mb-8">
        Ci dispiace, la pagina o il prodotto che stai cercando non esiste o è stato rimosso.
      </p>
      <div className="flex justify-center space-x-4">
        <Link 
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Torna alla home
        </Link>
        <Link 
          href="/catalog"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Sfoglia il catalogo
        </Link>
      </div>
    </div>
  );
} 