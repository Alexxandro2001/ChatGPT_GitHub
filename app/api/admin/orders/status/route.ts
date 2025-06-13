import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    const { orderId, status } = await request.json();
    
    // Verifica che orderId e status siano validi
    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'ID ordine e stato sono obbligatori' }, 
        { status: 400 }
      );
    }
    
    // Verifica che lo stato sia valido
    const validStatuses = ['IN_ELABORAZIONE', 'SPEDITO', 'CONSEGNATO', 'ANNULLATO'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Stato non valido' }, 
        { status: 400 }
      );
    }
    
    // Aggiorna lo stato dell'ordine
    const updatedOrder = await prisma.order.update({
      where: {
        id: Number(orderId),
      },
      data: {
        status,
        updatedAt: new Date(),
      },
    });
    
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Errore durante l\'aggiornamento dello stato dell\'ordine:', error);
    return NextResponse.json(
      { error: 'Errore durante l\'aggiornamento dello stato dell\'ordine' }, 
      { status: 500 }
    );
  }
} 