"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Placeholder SVG logo inline
const Logo = () => (
  <div className="flex items-center">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#f97316" />
      <text x="20" y="25" textAnchor="middle" fontSize="16" fill="#fff" fontFamily="Arial">C</text>
    </svg>
    <span className="ml-2 text-xl font-bold text-black">cyber</span>
  </div>
);

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/prodotti", label: "Prodotti" },
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/contatti", label: "Contatti" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  // Badge statico per esempio, sostituire con stato carrello reale
  const cartCount = 2;

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-black hover:text-[#f97316] font-medium transition-colors duration-200 ${pathname === link.href ? "text-[#f97316]" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center space-x-4">
            {/* Profile icon */}
            <Link href="/account" className="p-2 text-black hover:text-[#f97316] transition-colors" aria-label="Profilo">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            {/* Cart icon */}
            <Link href="/carrello" className="relative p-2 text-black hover:text-[#f97316] transition-colors" aria-label="Carrello">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.5 17h9a1 1 0 00.85-1.53L17 13M7 13V6a1 1 0 011-1h8a1 1 0 011 1v7" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {/* Hamburger */}
            <button
              className="md:hidden p-2 text-black hover:text-[#f97316] transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 px-3 rounded-md text-black hover:text-[#f97316] hover:bg-orange-50 ${pathname === link.href ? "text-[#f97316] bg-orange-50" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
} 