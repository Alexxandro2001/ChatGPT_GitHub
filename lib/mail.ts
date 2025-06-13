import { CartItem } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

interface OrderConfirmationEmailParams {
  customerEmail: string;
  customerName: string;
  orderId: string;
  orderItems: CartItem[];
  totalAmount: number;
  shippingAddress: string;
}

/**
 * Funzione per inviare email
 * In un ambiente reale, qui si userebbe un servizio come SendGrid, Mailgun, ecc.
 * Per ora, simuliamo l'invio di email con un log
 */
export const sendEmail = async ({ to, subject, html }: SendEmailParams): Promise<boolean> => {
  try {
    // Simula l'invio di email (in produzione, usa un servizio email)
    console.log(`[EMAIL SERVICE] Invio email a ${to}`);
    console.log(`[EMAIL SERVICE] Oggetto: ${subject}`);
    console.log(`[EMAIL SERVICE] Contenuto HTML: ${html.substring(0, 150)}...`);
    
    // Qui in produzione useresti un servizio reale come:
    // await sgMail.send({ to, from: 'store@example.com', subject, html });
    
    return true;
  } catch (error) {
    console.error('Errore nell\'invio dell\'email:', error);
    return false;
  }
};

/**
 * Crea e invia un'email di conferma ordine
 */
export const sendOrderConfirmationEmail = async ({
  customerEmail,
  customerName,
  orderId,
  orderItems,
  totalAmount,
  shippingAddress,
}: OrderConfirmationEmailParams): Promise<boolean> => {
  const subject = `Elettronica Shop - Conferma Ordine #${orderId}`;
  
  // Crea il contenuto HTML dell'email
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f3f4f6; padding: 20px; text-align: center;">
        <h1 style="color: #1f2937;">Grazie per il tuo ordine!</h1>
      </div>
      
      <div style="padding: 20px;">
        <p>Ciao ${customerName || 'Cliente'},</p>
        <p>Grazie per il tuo ordine presso Elettronica Shop. Ecco un riepilogo del tuo acquisto:</p>
        
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #4b5563; margin-top: 0;">Dettagli Ordine #${orderId}</h2>
          <p><strong>Data:</strong> ${new Date().toLocaleDateString('it-IT')}</p>
          <p><strong>Indirizzo di spedizione:</strong> ${shippingAddress}</p>
          
          <h3 style="color: #4b5563;">Articoli</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <th style="text-align: left; padding: 8px;">Prodotto</th>
                <th style="text-align: right; padding: 8px;">Quantità</th>
                <th style="text-align: right; padding: 8px;">Prezzo</th>
                <th style="text-align: right; padding: 8px;">Totale</th>
              </tr>
            </thead>
            <tbody>
              ${orderItems.map(item => `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px;">${item.name}</td>
                  <td style="text-align: right; padding: 8px;">${item.quantity}</td>
                  <td style="text-align: right; padding: 8px;">${formatCurrency(item.price)}</td>
                  <td style="text-align: right; padding: 8px;">${formatCurrency(item.price * item.quantity)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="text-align: right; padding: 8px; font-weight: bold;">Totale</td>
                <td style="text-align: right; padding: 8px; font-weight: bold;">${formatCurrency(totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <p>Riceverai presto un'email con le informazioni di spedizione.</p>
        <p>Per qualsiasi domanda, non esitare a contattarci rispondendo a questa email o tramite il nostro servizio clienti.</p>
        
        <p>Cordiali saluti,<br>Il team di Elettronica Shop</p>
      </div>
      
      <div style="background-color: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
        <p>© ${new Date().getFullYear()} Elettronica Shop. Tutti i diritti riservati.</p>
        <p>Via Roma 123, 00100 Roma - Italia</p>
      </div>
    </div>
  `;
  
  return sendEmail({
    to: customerEmail,
    subject,
    html,
  });
}; 