import { Order } from '@prisma/client';
import { sendEmail } from './mail-config';
import { generateOrderConfirmationEmail, generateOrderStatusUpdateEmail, OrderWithItems } from './templates';

/**
 * Invia l'email di conferma dell'ordine
 */
export async function sendOrderConfirmationEmail(order: OrderWithItems, customerEmail: string): Promise<string> {
  try {
    console.log(`Invio email di conferma ordine #${order.id} a ${customerEmail}...`);
    
    const html = generateOrderConfirmationEmail(order, customerEmail);
    const previewUrl = await sendEmail({
      to: customerEmail,
      subject: `Conferma ordine #${order.id} - PlanetStore`,
      html
    });
    
    console.log(`Email di conferma ordine #${order.id} inviata con successo!`);
    return previewUrl;
  } catch (error) {
    console.error(`Errore durante l'invio dell'email di conferma ordine #${order.id}:`, error);
    throw error;
  }
}

/**
 * Invia l'email di aggiornamento dello stato dell'ordine
 */
export async function sendOrderStatusUpdateEmail(order: Order, customerEmail: string): Promise<string> {
  try {
    console.log(`Invio email di aggiornamento stato ordine #${order.id} a ${customerEmail}...`);
    
    const html = generateOrderStatusUpdateEmail(order, customerEmail);
    const previewUrl = await sendEmail({
      to: customerEmail,
      subject: `Aggiornamento stato ordine #${order.id} - PlanetStore`,
      html
    });
    
    console.log(`Email di aggiornamento stato ordine #${order.id} inviata con successo!`);
    return previewUrl;
  } catch (error) {
    console.error(`Errore durante l'invio dell'email di aggiornamento stato ordine #${order.id}:`, error);
    throw error;
  }
} 