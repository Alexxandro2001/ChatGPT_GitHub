import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const productId = params.productId;
    
    // Verifica che il productId sia valido
    if (!productId || isNaN(parseInt(productId))) {
      return NextResponse.json(
        { error: 'ID prodotto non valido' },
        { status: 400 }
      );
    }

    // Ottieni tutte le recensioni per il prodotto, incluse le informazioni dell'utente
    const reviews = await db.review.findMany({
      where: {
        productId: parseInt(productId),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calcola la media delle valutazioni
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    return NextResponse.json({
      reviews,
      totalReviews,
      averageRating,
    });
    
  } catch (error) {
    console.error('Errore nel recupero delle recensioni:', error);
    return NextResponse.json(
      { error: 'Si è verificato un errore durante il recupero delle recensioni' },
      { status: 500 }
    );
  }
} 