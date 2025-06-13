import nodemailer from 'nodemailer';
import { Order, OrderItem } from '@prisma/client';
import { orderConfirmationTemplate } from './emailTemplates/orderConfirmation';

// Tipo per estendere Order con relazioni
export interface OrderWithItems extends Order {
  orderItems: (OrderItem & {
    product: {
      id: number;
      name: string;
      price: number;
      imageUrl?: string | null;
    };
  })[];
}

// Configurazione del trasporto email
const createTransporter = () => {
  // In ambiente di sviluppo, usa ethereal.email (servizio di test)
  if (process.env.NODE_ENV === 'development' && !process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.ETHEREAL_EMAIL || 'ethereal.user@ethereal.email',
        pass: process.env.ETHEREAL_PASSWORD || 'ethereal_password'
      }
    });
  }

  // In produzione, usa le credenziali SMTP configurate
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

/**
 * Invia un'email di conferma ordine
 * @param to Email del destinatario
 * @param order Oggetto ordine con items
 * @returns Promise con info sull'invio o URL anteprima (in dev)
 */
export const sendOrderConfirmationEmail = async (
  to: string,
  order: OrderWithItems
): Promise<{ success: boolean; info?: any; previewUrl?: string }> => {
  try {
    const transporter = createTransporter();
    
    // Genera il template dell'email
    const { subject, html } = orderConfirmationTemplate(order);
    
    // Invia l'email
    const info = await transporter.sendMail({
      from: `"Elettronica Shop" <${process.env.SMTP_USER || 'noreply@elettronicashop.it'}>`,
      to,
      subject,
      html
    });
    
    // Se siamo in sviluppo, restituisci l'URL dell'anteprima (se disponibile)
    if (process.env.NODE_ENV === 'development' && info.messageId) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('Anteprima email disponibile:', previewUrl);
      return { success: true, info, previewUrl };
    }
    
    return { success: true, info };
  } catch (error) {
    console.error('Errore nell\'invio dell\'email di conferma:', error);
    return { success: false };
  }
}; 