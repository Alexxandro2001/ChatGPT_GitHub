import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Funzione per verificare che l'utente sia un amministratore
const isAdmin = async (userId: number | undefined) => {
  if (!userId) return false;
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    return user?.isAdmin === true;
  } catch (error) {
    console.error('Errore durante la verifica dell\'utente admin:', error);
    return false;
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const status = searchParams.get('status');
    
    // Verifica che l'utente sia un amministratore
    const adminCheck = await isAdmin(userId ? parseInt(userId, 10) : undefined);
    if (!adminCheck) {
      return NextResponse.json(
        { error: 'Non autorizzato' }, 
        { status: 403 }
      );
    }
    
    // Calcola il numero di elementi da saltare per la paginazione
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    
    // Prepara i filtri per la query
    let whereClause: any = { isDeleted: false };
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    
    // Ottieni il conteggio totale degli ordini (per la paginazione)
    const totalOrders = await prisma.order.count({
      where: whereClause
    });
    
    // Ottieni gli ordini filtrati e paginati
    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: parseInt(limit, 10)
    });
    
    // Calcola il numero totale di pagine
    const totalPages = Math.ceil(totalOrders / parseInt(limit, 10));
    
    return NextResponse.json({
      orders,
      pagination: {
        currentPage: parseInt(page, 10),
        totalPages,
        totalItems: totalOrders,
        itemsPerPage: parseInt(limit, 10)
      }
    });
  } catch (error) {
    console.error('Errore durante il recupero degli ordini:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero degli ordini' }, 
      { status: 500 }
    );
  }
} 