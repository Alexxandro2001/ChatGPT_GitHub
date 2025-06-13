import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Schema di validazione per la richiesta di checkout
const checkoutSchema = z.object({
  cartItems: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
    })
  ),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

// Inizializza Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10', // Usa l'ultima versione disponibile
});

export async function POST(req: NextRequest) {
  try {
    // Verifica se l'utente è autenticato (opzionale)
    const session = await getServerSession(authOptions);
    
    // Ottieni il body della richiesta
    const body = await req.json();
    
    // Valida i dati
    const validationResult = checkoutSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Dati di checkout non validi', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { cartItems, successUrl, cancelUrl } = validationResult.data;
    
    // Verifica che ci siano articoli nel carrello
    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Il carrello è vuoto' },
        { status: 400 }
      );
    }
    
    // Crea la sessione di checkout Stripe
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      locale: 'it',
      
      // Oggetti di linea per ogni articolo nel carrello
      line_items: cartItems.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            // Puoi aggiungere immagini qui se disponibili
            // images: [item.image],
          },
          unit_amount: Math.round(item.price * 100), // Converte in centesimi
        },
        quantity: item.quantity,
      })),
      
      // URL di successo e cancellazione
      success_url: successUrl,
      cancel_url: cancelUrl,
      
      // Metadati per il collegamento con l'ordine
      metadata: {
        userId: session?.user?.id || 'guest',
      },
    });
    
    // Restituisci l'ID della sessione
    return NextResponse.json({ sessionId: stripeSession.id });
    
  } catch (error: any) {
    console.error('Errore durante la creazione della sessione Stripe:', error);
    
    return NextResponse.json(
      { error: 'Errore durante l\'elaborazione del pagamento', details: error.message },
      { status: 500 }
    );
  }
} 