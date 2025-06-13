'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  search?: string;
  category?: string;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  search = '', 
  category = '' 
}: PaginationProps) {
  const pathname = usePathname();
  
  // Crea l'URL per un dato numero di pagina
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    
    if (search) {
      params.set('search', search);
    }
    
    if (category) {
      params.set('category', category);
    }
    
    params.set('page', page.toString());
    
    return `${pathname}?${params.toString()}`;
  };
  
  // Determina quali numeri di pagina mostrare
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Mostra tutte le pagine se sono poche
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostra un sottoinsieme di pagine con '...'
      pages.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (startPage > 2) {
        pages.push(-1); // Rappresenta '...'
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages - 1) {
        pages.push(-2); // Rappresenta '...'
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  return (
    <nav className="flex justify-center">
      <ul className="flex items-center space-x-1">
        {/* Pulsante "Precedente" */}
        {currentPage > 1 && (
          <li>
            <Link
              href={createPageUrl(currentPage - 1)}
              className="px-3 py-2 border rounded-md hover:bg-gray-50 text-gray-600"
            >
              Precedente
            </Link>
          </li>
        )}
        
        {/* Numeri di pagina */}
        {getPageNumbers().map((page, index) => (
          <li key={index}>
            {page < 0 ? (
              <span className="px-3 py-2">...</span>
            ) : (
              <Link
                href={createPageUrl(page)}
                className={`px-3 py-2 border rounded-md ${
                  page === currentPage
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                {page}
              </Link>
            )}
          </li>
        ))}
        
        {/* Pulsante "Successiva" */}
        {currentPage < totalPages && (
          <li>
            <Link
              href={createPageUrl(currentPage + 1)}
              className="px-3 py-2 border rounded-md hover:bg-gray-50 text-gray-600"
            >
              Successiva
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
} 