import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { OrderStatus } from '@prisma/client';

// Schema di validazione per l'aggiornamento dello stato
const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAGATO', 'SPEDITO', 'CONSEGNATO', 'ANNULLATO']),
});

// Controllo transizioni di stato valide
const validStatusTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['PAGATO', 'ANNULLATO'],
  PAGATO: ['SPEDITO', 'ANNULLATO'],
  SPEDITO: ['CONSEGNATO', 'ANNULLATO'],
  CONSEGNATO: [], // Stato finale
  ANNULLATO: [], // Stato finale
};

// Funzione per verificare che l'utente sia un amministratore
const isAdmin = async (userId: number | undefined) => {
  if (!userId) return false;
  
  try {
    const user = await db.user.findUnique({
      where: { id: userId }
    });
    
    return user?.isAdmin === true;
  } catch (error) {
    console.error('Errore durante la verifica dell\'utente admin:', error);
    return false;
  }
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verifica l'autenticazione e i permessi admin
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Non autorizzato. Richiesti permessi di amministratore.' },
        { status: 403 }
      );
    }
    
    // Ottieni l'ID dell'ordine dalla URL
    const orderId = parseInt(params.id, 10);
    
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'ID ordine non valido' },
        { status: 400 }
      );
    }
    
    // Verifica che l'ordine esista
    const existingOrder = await db.order.findUnique({
      where: { id: orderId },
    });
    
    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Ordine non trovato' },
        { status: 404 }
      );
    }
    
    // Estrai e valida i dati dalla richiesta
    const body = await req.json();
    const validationResult = updateOrderStatusSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Dati non validi', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { status: newStatus } = validationResult.data;
    const currentStatus = existingOrder.status as OrderStatus;
    
    // Controlla se la transizione di stato è valida
    const allowedTransitions = validStatusTransitions[currentStatus];
    if (!allowedTransitions.includes(newStatus)) {
      return NextResponse.json(
        {
          error: `Transizione di stato non valida da ${currentStatus} a ${newStatus}`,
          allowedTransitions,
        },
        { status: 400 }
      );
    }
    
    // Aggiorna lo stato dell'ordine
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: { 
        status: newStatus,
        updatedAt: new Date(),
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    
    // Qui si potrebbe aggiungere la logica per inviare una notifica email al cliente
    // utilizzando sendOrderConfirmationEmail da @/lib/email
    
    // Restituisci l'ordine aggiornato
    return NextResponse.json(updatedOrder);
    
  } catch (error: any) {
    console.error('Errore durante l\'aggiornamento dello stato dell\'ordine:', error);
    
    return NextResponse.json(
      { error: 'Errore durante l\'aggiornamento dello stato dell\'ordine', details: error.message },
      { status: 500 }
    );
  }
} 