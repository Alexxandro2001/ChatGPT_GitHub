import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendOrderConfirmationEmail } from '@/lib/mail';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { CartItem } from '@/store/cartStore';

const prisma = new PrismaClient();

// Schema di validazione per la richiesta di creazione ordine
const orderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  image: z.string().optional(),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema),
  totalAmount: z.number().positive(),
  shippingAddress: z.object({
    address: z.string(),
    city: z.string(),
    postCode: z.string(),
    country: z.string(),
  }),
  customerEmail: z.string().email().nullable().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { error: 'userId è obbligatorio' },
      { status: 400 }
    );
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: parseInt(userId),
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Errore durante il recupero degli ordini:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero degli ordini' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verifica l'autenticazione dell'utente
    const session = await getServerSession(authOptions);
    
    // Ottieni il body della richiesta
    const body = await req.json();
    
    // Valida i dati
    const validationResult = createOrderSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Dati dell\'ordine non validi', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { items, totalAmount, shippingAddress, customerEmail } = validationResult.data;
    
    // Verifica che ci siano articoli nell'ordine
    if (items.length === 0) {
      return NextResponse.json(
        { error: 'Nessun articolo nell\'ordine' },
        { status: 400 }
      );
    }
    
    // Crea l'indirizzo di spedizione formattato come stringa
    const formattedAddress = `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postCode}, ${shippingAddress.country}`;
    
    // Crea l'ordine nel database
    const order = await db.order.create({
      data: {
        userId: session?.user?.id ? parseInt(session.user.id) : null,
        status: 'PAGATO', // Stato iniziale dopo il pagamento
        total: totalAmount,
        shippingAddress: formattedAddress,
        // Altri campi di spedizione
        shippingCity: shippingAddress.city,
        shippingPostCode: shippingAddress.postCode,
        shippingCountry: shippingAddress.country,
        paymentMethod: 'Carta di credito',
        paymentStatus: 'paid',
      },
    });
    
    // Crea gli elementi dell'ordine
    const orderItemsPromises = items.map(async (item) => {
      // Ottieni il prodotto dal database per riferimento
      const product = await db.product.findUnique({
        where: { id: parseInt(item.id) },
      });
      
      if (!product) {
        throw new Error(`Prodotto con ID ${item.id} non trovato`);
      }
      
      // Crea l'elemento dell'ordine
      return db.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          quantity: item.quantity,
          price: item.price,
        },
      });
    });
    
    // Attendi il completamento di tutte le promesse
    const orderItems = await Promise.all(orderItemsPromises);
    
    // Recupera l'ordine completo con tutti i dettagli necessari per l'email
    const completeOrder = await db.order.findUnique({
      where: { id: order.id },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true
              }
            }
          }
        }
      }
    });
    
    let emailResult = null;
    let emailPreviewUrl = null;
    
    // Invia l'email di conferma se c'è un'email disponibile
    if (completeOrder && (customerEmail || session?.user?.email)) {
      const email = customerEmail || session?.user?.email;
      
      if (email) {
        try {
          const result = await sendOrderConfirmationEmail(email, completeOrder);
          emailResult = result.success;
          emailPreviewUrl = result.previewUrl;
          
          // Log del risultato dell'invio dell'email
          if (result.success) {
            console.log(`Email di conferma inviata con successo a ${email}`);
          } else {
            console.warn(`Errore nell'invio dell'email di conferma a ${email}`);
          }
        } catch (emailError) {
          console.error('Errore durante l\'invio dell\'email:', emailError);
          // Non blocchiamo la risposta per errori di email
        }
      }
    }
    
    // Restituisci l'ID dell'ordine creato e informazioni sull'email
    return NextResponse.json({ 
      orderId: order.id.toString(),
      status: 'success',
      emailSent: emailResult,
      emailPreviewUrl: process.env.NODE_ENV === 'development' ? emailPreviewUrl : undefined
    });
    
  } catch (error: any) {
    console.error('Errore durante la creazione dell\'ordine:', error);
    
    return NextResponse.json(
      { error: 'Errore durante la creazione dell\'ordine', details: error.message },
      { status: 500 }
    );
  }
} 