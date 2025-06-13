import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatta un numero come valuta in Euro
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Tronca un testo a una lunghezza specificata
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Controlla se un valore è un numero valido
 */
export function isValidNumber(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * Genera un ID univoco semplice
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
} 