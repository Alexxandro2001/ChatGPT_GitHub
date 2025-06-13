'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import useCartStore from '@/store/cartStore';
import { useSearchStore } from '@/store/searchStore';
import CartSidebar from './CartSidebar';

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const cartStore = useCartStore();
  const { searchQuery, setSearchQuery } = useSearchStore();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const totalItems = isMounted ? cartStore.getTotalItems() : 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <Logo className="h-10 w-auto" />
              </Link>
            </div>

            {/* Navbar: Desktop Version */}
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className={`text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200 ${
                  pathname === '/' ? 'text-orange-500' : ''
                }`}
              >
                Home
              </Link>
              <Link
                href="/prodotti"
                className={`text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200 ${
                  pathname === '/prodotti' ? 'text-orange-500' : ''
                }`}
              >
                Prodotti
              </Link>
              <Link
                href="/chi-siamo"
                className={`text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200 ${
                  pathname === '/chi-siamo' ? 'text-orange-500' : ''
                }`}
              >
                Chi siamo
              </Link>
              <Link
                href="/contatti"
                className={`text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200 ${
                  pathname === '/contatti' ? 'text-orange-500' : ''
                }`}
              >
                Contatti
              </Link>
            </nav>

            {/* Right Section: Search, Cart, Profile */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:block relative">
                <input
                  type="text"
                  placeholder="Cerca prodotti..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-64 pl-10 pr-4 py-2 rounded-full bg-gray-50 text-gray-900 border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all duration-200"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Profile Button */}
              <button
                className="hidden md:flex items-center justify-center p-2 text-gray-700 hover:text-orange-500 transition-colors duration-200"
                aria-label="Profilo utente"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>

              {/* Cart Button */}
              <button
                onClick={toggleCart}
                className="relative p-2 text-gray-700 hover:text-orange-500 transition-colors duration-200"
                aria-label="Carrello"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {isMounted && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-gray-700 hover:text-orange-500 transition-colors duration-200"
                aria-expanded={isMobileMenuOpen}
                aria-label="Menu principale"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 pt-2 pb-4 space-y-1">
              <Link
                href="/"
                className={`block py-2 px-3 rounded-md text-gray-700 hover:text-orange-500 hover:bg-gray-50 ${
                  pathname === '/' ? 'text-orange-500 bg-orange-50' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/prodotti"
                className={`block py-2 px-3 rounded-md text-gray-700 hover:text-orange-500 hover:bg-gray-50 ${
                  pathname === '/prodotti' ? 'text-orange-500 bg-orange-50' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Prodotti
              </Link>
              <Link
                href="/chi-siamo"
                className={`block py-2 px-3 rounded-md text-gray-700 hover:text-orange-500 hover:bg-gray-50 ${
                  pathname === '/chi-siamo' ? 'text-orange-500 bg-orange-50' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Chi siamo
              </Link>
              <Link
                href="/contatti"
                className={`block py-2 px-3 rounded-md text-gray-700 hover:text-orange-500 hover:bg-gray-50 ${
                  pathname === '/contatti' ? 'text-orange-500 bg-orange-50' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contatti
              </Link>
            </div>
          </div>
        )}

        {/* Cart Sidebar */}
        <CartSidebar isOpen={isCartOpen} onClose={toggleCart} />
      </header>
    </>
  );
} 