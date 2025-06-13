import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Estrazione dei parametri di query
    const { searchParams } = new URL(request.url);
    
    const searchQuery = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '100000');
    
    // Costruzione della query Prisma
    const whereClause: any = {
      isDeleted: false,
    };
    
    // Filtro per nome
    if (searchQuery) {
      whereClause.name = {
        contains: searchQuery,
        mode: 'insensitive', // Case-insensitive search
      };
    }
    
    // Filtro per categoria
    if (category) {
      whereClause.category = {
        name: category,
      };
    }
    
    // Filtro per prezzo
    whereClause.price = {
      gte: minPrice,
      lte: maxPrice,
    };
    
    // Esecuzione della query
    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
      },
    });
    
    // Formattazione dei prodotti per la risposta
    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category?.name || 'Non categorizzato',
      image: product.image,
      stock: product.stock,
    }));
    
    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Errore durante il recupero dei prodotti:', error);
    return NextResponse.json(
      { error: 'Si è verificato un errore durante il recupero dei prodotti' },
      { status: 500 }
    );
  }
} 