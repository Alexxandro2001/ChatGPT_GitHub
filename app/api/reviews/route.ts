import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Schema di validazione per la recensione
const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(3, "Il commento deve essere di almeno 3 caratteri")
});

export async function POST(req: NextRequest) {
  try {
    // Verifica l'autenticazione dell'utente
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Devi effettuare l\'accesso per lasciare una recensione' },
        { status: 401 }
      );
    }
    
    // Ottieni il body della richiesta
    const body = await req.json();
    
    // Valida i dati della recensione
    const validationResult = reviewSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Dati non validi', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { productId, rating, comment } = validationResult.data;

    // Verifica che il prodotto esista
    const product = await db.product.findUnique({
      where: { id: parseInt(productId) }
    });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Prodotto non trovato' },
        { status: 404 }
      );
    }
    
    // Verifica se l'utente ha già recensito questo prodotto
    const existingReview = await db.review.findFirst({
      where: {
        productId: parseInt(productId),
        userId: parseInt(session.user.id)
      }
    });
    
    if (existingReview) {
      // Aggiorna la recensione esistente
      const updatedReview = await db.review.update({
        where: { id: existingReview.id },
        data: {
          rating,
          comment,
        }
      });
      
      return NextResponse.json(updatedReview, { status: 200 });
    }
    
    // Crea una nuova recensione
    const newReview = await db.review.create({
      data: {
        productId: parseInt(productId),
        userId: parseInt(session.user.id),
        rating,
        comment,
      }
    });
    
    return NextResponse.json(newReview, { status: 201 });
    
  } catch (error) {
    console.error('Errore nella creazione della recensione:', error);
    return NextResponse.json(
      { error: 'Si è verificato un errore durante la creazione della recensione' },
      { status: 500 }
    );
  }
} 