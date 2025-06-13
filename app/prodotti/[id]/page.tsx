import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import ProductDetail from '@/components/ProductDetail';
import RelatedProducts from '@/components/RelatedProducts';
import ProductReviews from '@/components/ProductReviews';

interface ProductPageProps {
  params: {
    id: string;
  };
}

// Funzione per generare i metadati dinamici
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await db.product.findUnique({
    where: {
      id: parseInt(params.id),
      isDeleted: false,
    },
  });

  if (!product) {
    return {
      title: 'Prodotto non trovato - Elettronica Shop',
    };
  }

  // Limita la descrizione a 150 caratteri
  const description = product.description 
    ? product.description.substring(0, 150) + (product.description.length > 150 ? '...' : '')
    : 'Dettagli del prodotto su Elettronica Shop';

  return {
    title: `${product.name} – Elettronica Shop`,
    description,
    openGraph: {
      title: `${product.name} – Elettronica Shop`,
      description,
      images: product.imageUrl ? [product.imageUrl] : [],
      url: `https://elettronica-shop.it/prodotti/${product.id}`,
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Recupera il prodotto dal database
  const product = await db.product.findUnique({
    where: {
      id: parseInt(params.id),
      isDeleted: false,
    },
  });

  // Se il prodotto non esiste o è stato eliminato, mostra 404
  if (!product) {
    notFound();
  }

  // Gestisci le immagini (singola o array)
  const imageUrls = product.imageUrls 
    ? Array.isArray(product.imageUrls) 
      ? product.imageUrls 
      : [product.imageUrls]
    : product.imageUrl 
      ? [product.imageUrl] 
      : [];

  // Assicurati che le specifiche siano un oggetto
  const specifications = product.specifications 
    ? typeof product.specifications === 'string' 
      ? JSON.parse(product.specifications) 
      : product.specifications
    : {};

  // Prepara il prodotto completo da passare al componente
  const productData = {
    ...product,
    imageUrls,
    specifications,
  };

  // Recupera prodotti correlati della stessa categoria (massimo 6)
  const relatedProducts = await db.product.findMany({
    where: {
      id: {
        not: parseInt(params.id) // Escludi il prodotto corrente
      },
      category: product.category, // Stessa categoria
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      price: true,
      imageUrl: true,
      stock: true,
      category: true,
    },
    take: 6,
    orderBy: {
      // Ordine casuale per variare i prodotti mostrati
      id: 'asc'
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetail product={productData} />
      
      {/* Recensioni del prodotto */}
      <ProductReviews productId={params.id} />
      
      {/* Prodotti correlati */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <RelatedProducts products={relatedProducts} />
        </div>
      )}
    </div>
  );
} 