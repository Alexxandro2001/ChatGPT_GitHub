"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

// Logo Cyber
const Logo = () => (
  <div className="flex items-center">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span className="ml-2 text-lg font-bold">cyber</span>
  </div>
);

// Categorie nella navbar
const categories = [
  { id: "phones", label: "Phones", icon: "phone" },
  { id: "computers", label: "Computers", icon: "computer" },
  { id: "smart-watches", label: "Smart Watches", icon: "watch" },
  { id: "cameras", label: "Cameras", icon: "camera" },
  { id: "headphones", label: "Headphones", icon: "headphone" },
  { id: "gaming", label: "Gaming", icon: "gaming" }
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Funzione per renderizzare le icone delle categorie
  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'phone':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
        );
      case 'computer':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        );
      case 'watch':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="7" />
            <polyline points="12 9 12 12 13.5 13.5" />
            <path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83" />
          </svg>
        );
      case 'camera':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        );
      case 'headphone':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
          </svg>
        );
      case 'gaming':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <line x1="6" y1="12" x2="10" y2="12" />
            <line x1="8" y1="10" x2="8" y2="14" />
            <circle cx="16" cy="12" r="1" />
            <circle cx="18" cy="10" r="1" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Header principale */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-16 px-4">
            {/* Logo */}
            <Link href="/" className="flex items-center text-black">
              <Logo />
            </Link>

            {/* Barra di ricerca - visibile solo su desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#f97316] focus:border-[#f97316]"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Menu desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className={`text-sm font-medium ${pathname === '/' ? 'text-[#f97316]' : 'text-black hover:text-[#f97316]'}`}>
                Home
              </Link>
              <Link href="/about" className={`text-sm font-medium ${pathname === '/about' ? 'text-[#f97316]' : 'text-black hover:text-[#f97316]'}`}>
                About
              </Link>
              <Link href="/contact-us" className={`text-sm font-medium ${pathname === '/contact-us' ? 'text-[#f97316]' : 'text-black hover:text-[#f97316]'}`}>
                Contact Us
              </Link>
              <Link href="/blog" className={`text-sm font-medium ${pathname === '/blog' ? 'text-[#f97316]' : 'text-black hover:text-[#f97316]'}`}>
                Blog
              </Link>
            </nav>

            {/* Icone a destra */}
            <div className="flex items-center space-x-4">
              {/* Icona cuore/wishlist */}
              <Link href="/wishlist" className="text-black hover:text-[#f97316]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>

              {/* Icona carrello */}
              <Link href="/carrello" className="text-black hover:text-[#f97316]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </Link>

              {/* Icona profilo */}
              <Link href="/account" className="text-black hover:text-[#f97316]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>

              {/* Hamburger menu per mobile */}
              <button
                className="md:hidden text-black hover:text-[#f97316]"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Menu mobile */}
          {menuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 px-4 py-2">
              {/* Barra di ricerca mobile */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#f97316] focus:border-[#f97316]"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Links del menu mobile */}
              <nav className="space-y-2">
                <Link href="/" className={`block py-2 text-sm font-medium ${pathname === '/' ? 'text-[#f97316]' : 'text-black hover:text-[#f97316]'}`}>
                  Home
                </Link>
                <Link href="/about" className={`block py-2 text-sm font-medium ${pathname === '/about' ? 'text-[#f97316]' : 'text-black hover:text-[#f97316]'}`}>
                  About
                </Link>
                <Link href="/contact-us" className={`block py-2 text-sm font-medium ${pathname === '/contact-us' ? 'text-[#f97316]' : 'text-black hover:text-[#f97316]'}`}>
                  Contact Us
                </Link>
                <Link href="/blog" className={`block py-2 text-sm font-medium ${pathname === '/blog' ? 'text-[#f97316]' : 'text-black hover:text-[#f97316]'}`}>
                  Blog
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Barra delle categorie */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between overflow-x-auto py-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="flex flex-col items-center px-4 py-2 text-black hover:text-[#f97316] min-w-[80px]"
              >
                <div className="mb-1">
                  {renderIcon(category.icon)}
                </div>
                <span className="text-xs font-medium">{category.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
} 