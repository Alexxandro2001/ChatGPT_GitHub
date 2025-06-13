import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/ui/Header';
import Footer from '@/components/Footer';
import Providers from './providers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Elettronica Shop - I migliori prodotti di elettronica',
  description: 'Il tuo negozio online di elettronica di fiducia. Acquista smartphone, computer, accessori e molto altro a prezzi competitivi.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="it">
      <body className={inter.className}>
        <Providers session={session}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
} 