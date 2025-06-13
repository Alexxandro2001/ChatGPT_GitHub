import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id, 10);
    
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'ID ordine non valido' }, 
        { status: 400 }
      );
    }
    
    // Ottieni l'ID dell'utente dalla query
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId è obbligatorio' },
        { status: 400 }
      );
    }
    
    // Ottieni i dettagli dell'ordine
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        isDeleted: false
      },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });
    
    if (!order) {
      return NextResponse.json(
        { error: 'Ordine non trovato' }, 
        { status: 404 }
      );
    }
    
    // Verifica che l'ordine appartenga all'utente che sta facendo la richiesta
    if (order.userId !== parseInt(userId, 10)) {
      return NextResponse.json(
        { error: 'Non hai il permesso di visualizzare questo ordine' }, 
        { status: 403 }
      );
    }
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Errore durante il recupero dei dettagli dell\'ordine:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero dei dettagli dell\'ordine' }, 
      { status: 500 }
    );
  }
} 