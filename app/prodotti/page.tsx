import { PrismaClient } from '@prisma/client';
import ProductsPage from './ProductsPage';

const prisma = new PrismaClient();

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        category: true,
      },
    });
    return products;
  } catch (error) {
    console.error('Errore nel caricamento dei prodotti:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return categories;
  } catch (error) {
    console.error('Errore nel caricamento delle categorie:', error);
    return [];
  }
}

export default async function Page() {
  const products = await getProducts();
  const categories = await getCategories();
  
  // Trasformo i prodotti nel formato richiesto
  const formattedProducts = products.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category?.name || 'Non categorizzato',
    image: product.image,
    stock: product.stock,
  }));
  
  // Calcolo il prezzo minimo e massimo per il filtro
  const prices = products.map(product => product.price);
  const minProductPrice = Math.min(...prices, 0);
  const maxProductPrice = Math.max(...prices, 1000);
  
  return (
    <ProductsPage 
      products={formattedProducts} 
      categories={categories}
      minProductPrice={minProductPrice}
      maxProductPrice={maxProductPrice}
    />
  );
} 