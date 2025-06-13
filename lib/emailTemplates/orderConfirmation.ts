import { OrderWithItems } from '../email';
import { formatCurrency } from '../utils';

interface EmailTemplate {
  subject: string;
  html: string;
}

/**
 * Genera il template per l'email di conferma ordine
 */
export const orderConfirmationTemplate = (order: OrderWithItems): EmailTemplate => {
  const orderDate = new Date(order.createdAt).toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Calcola il totale dell'ordine
  const totalAmount = order.total;
  
  // Genera le righe per ogni prodotto ordinato
  const orderItemsHtml = order.orderItems.map(item => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 12px 8px;">
        <div style="display: flex; align-items: center;">
          ${item.product.imageUrl ? 
            `<img src="${item.product.imageUrl}" alt="${item.product.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;" />` : 
            ''}
          <span style="font-weight: 500;">${item.product.name}</span>
        </div>
      </td>
      <td style="padding: 12px 8px; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px 8px; text-align: right;">${formatCurrency(item.price)}</td>
      <td style="padding: 12px 8px; text-align: right;">${formatCurrency(item.price * item.quantity)}</td>
    </tr>
  `).join('');
  
  // Soggetto dell'email
  const subject = `Conferma ordine #${order.id} – Elettronica Shop`;
  
  // HTML dell'email
  const html = `
    <!DOCTYPE html>
    <html lang="it">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Conferma Ordine</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Intestazione -->
        <div style="background-color: #3b82f6; padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Il tuo ordine è confermato!</h1>
          <p style="margin: 10px 0 0;">Grazie per il tuo acquisto su Elettronica Shop</p>
        </div>
        
        <!-- Informazioni principali -->
        <div style="background-color: #f9fafb; padding: 20px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
          <p>Gentile Cliente,</p>
          <p>abbiamo ricevuto il tuo ordine ed è attualmente in fase di elaborazione. Ti invieremo un'email quando il tuo ordine sarà spedito.</p>
          
          <div style="background-color: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <h2 style="margin-top: 0; font-size: 18px; color: #374151;">Dettagli dell'ordine</h2>
            <p><strong>Numero ordine:</strong> #${order.id}</p>
            <p><strong>Data:</strong> ${orderDate}</p>
            <p><strong>Stato:</strong> ${order.status}</p>
            <p><strong>Indirizzo di spedizione:</strong> ${order.shippingAddress || 'Non specificato'}</p>
            
            <!-- Tabella prodotti -->
            <h3 style="margin: 20px 0 10px; font-size: 16px; color: #374151;">Prodotti acquistati</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f3f4f6; border-bottom: 2px solid #e5e7eb;">
                  <th style="padding: 8px; text-align: left;">Prodotto</th>
                  <th style="padding: 8px; text-align: center;">Quantità</th>
                  <th style="padding: 8px; text-align: right;">Prezzo</th>
                  <th style="padding: 8px; text-align: right;">Totale</th>
                </tr>
              </thead>
              <tbody>
                ${orderItemsHtml}
              </tbody>
              <tfoot>
                <tr style="background-color: #f3f4f6;">
                  <td colspan="3" style="padding: 12px 8px; text-align: right; font-weight: bold;">Totale</td>
                  <td style="padding: 12px 8px; text-align: right; font-weight: bold;">${formatCurrency(totalAmount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <!-- Tracciamento ordine -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://elettronicashop.it'}/account/ordini/${order.id}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Traccia il tuo ordine
            </a>
          </div>
        </div>
        
        <!-- Ulteriori informazioni -->
        <div style="background-color: #f9fafb; padding: 20px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
          <h3 style="margin-top: 0; font-size: 16px; color: #374151;">Domande sul tuo ordine?</h3>
          <p>Per qualsiasi domanda o assistenza, puoi rispondere a questa email o contattarci al nostro servizio clienti:</p>
          <p style="margin-bottom: 0;"><a href="mailto:assistenza@elettronicashop.it" style="color: #3b82f6; text-decoration: none;">assistenza@elettronicashop.it</a></p>
          <p style="margin-top: 5px;"><a href="tel:+39123456789" style="color: #3b82f6; text-decoration: none;">+39 123 456 789</a> (Lun-Ven, 9:00-18:00)</p>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding-top: 20px; color: #6b7280; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Elettronica Shop. Tutti i diritti riservati.</p>
          <p>Via Roma 123, 00100 Roma - Italia</p>
          <p>P.IVA: 01234567890</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return { subject, html };
}; 