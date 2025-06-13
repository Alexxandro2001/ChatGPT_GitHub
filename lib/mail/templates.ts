import { Order, OrderItem, Product } from '@prisma/client';

// Tipo per gli OrderItem con informazioni sul prodotto
type OrderItemWithProduct = OrderItem & {
  product: Product;
};

// Tipo per l'ordine con OrderItem che includono Product
export type OrderWithItems = Order & {
  orderItems: OrderItemWithProduct[];
};

// Funzione per formattare la data in italiano
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Funzione per formattare il prezzo in euro
function formatPrice(price: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

// Funzione per formattare lo stato dell'ordine
function formatOrderStatus(status: string): string {
  switch (status) {
    case 'IN_ELABORAZIONE':
      return 'In elaborazione';
    case 'SPEDITO':
      return 'Spedito';
    case 'CONSEGNATO':
      return 'Consegnato';
    case 'ANNULLATO':
      return 'Annullato';
    default:
      return status;
  }
}

// Funzione per ottenere il colore in base allo stato dell'ordine
function getStatusColor(status: string): string {
  switch (status) {
    case 'IN_ELABORAZIONE':
      return '#3b82f6'; // Blu
    case 'SPEDITO':
      return '#f59e0b'; // Giallo
    case 'CONSEGNATO':
      return '#10b981'; // Verde
    case 'ANNULLATO':
      return '#ef4444'; // Rosso
    default:
      return '#6b7280'; // Grigio
  }
}

// Template HTML di base per tutte le email
function baseTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html lang="it">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PlanetStore</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 3px solid #F7931E;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #F7931E;
        }
        .content {
          padding: 20px 0;
        }
        .footer {
          margin-top: 30px;
          padding: 20px 0;
          border-top: 1px solid #eaeaea;
          text-align: center;
          font-size: 12px;
          color: #777;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th {
          background-color: #f3f4f6;
          text-align: left;
          padding: 10px;
          border-bottom: 1px solid #e5e7eb;
        }
        td {
          padding: 10px;
          border-bottom: 1px solid #e5e7eb;
        }
        .button {
          display: inline-block;
          background-color: #F7931E;
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 4px;
          font-weight: bold;
          margin-top: 20px;
        }
        .status-badge {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 14px;
          font-weight: bold;
          color: white;
        }
        .total-row {
          font-weight: bold;
          background-color: #f9fafb;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">PlanetStore</div>
          <div>Il tuo negozio di elettronica</div>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>PlanetStore &copy; ${new Date().getFullYear()}</p>
          <p>Questo è un messaggio automatico, si prega di non rispondere.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Template per la conferma dell'ordine
export function generateOrderConfirmationEmail(order: OrderWithItems, customerEmail: string): string {
  // Calcola il totale degli articoli
  const orderTotal = order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Crea la tabella dei prodotti acquistati
  const itemsTable = `
    <table>
      <thead>
        <tr>
          <th>Prodotto</th>
          <th>Quantità</th>
          <th>Prezzo</th>
          <th>Totale</th>
        </tr>
      </thead>
      <tbody>
        ${order.orderItems.map(item => `
          <tr>
            <td>${item.product.name}</td>
            <td>${item.quantity}</td>
            <td>${formatPrice(item.price)}</td>
            <td>${formatPrice(item.price * item.quantity)}</td>
          </tr>
        `).join('')}
        <tr class="total-row">
          <td colspan="3">Totale</td>
          <td>${formatPrice(orderTotal)}</td>
        </tr>
      </tbody>
    </table>
  `;
  
  // Crea il corpo dell'email
  const content = `
    <h1>Conferma Ordine #${order.id}</h1>
    <p>Gentile Cliente,</p>
    <p>grazie per il tuo acquisto su PlanetStore! Abbiamo ricevuto il tuo ordine e lo stiamo elaborando.</p>
    
    <h2>Dettagli Ordine</h2>
    <p>
      <strong>Numero ordine:</strong> #${order.id}<br>
      <strong>Data:</strong> ${formatDate(order.createdAt)}<br>
      <strong>Stato:</strong> <span class="status-badge" style="background-color: ${getStatusColor(order.status)};">${formatOrderStatus(order.status)}</span>
    </p>
    
    <h2>Prodotti Acquistati</h2>
    ${itemsTable}
    
    <h2>Indirizzo di Spedizione</h2>
    <p>
      ${order.shippingAddress || ''}<br>
      ${order.shippingCity || ''}, ${order.shippingPostCode || ''}<br>
      ${order.shippingCountry || ''}
    </p>
    
    <p>Puoi controllare lo stato del tuo ordine in qualsiasi momento dalla sezione "I miei ordini" del tuo account.</p>
    
    <a href="http://localhost:3000/account/ordini/${order.id}" class="button">Visualizza Ordine</a>
    
    <p>Grazie per aver scelto PlanetStore!</p>
  `;
  
  return baseTemplate(content);
}

// Template per l'aggiornamento dello stato dell'ordine
export function generateOrderStatusUpdateEmail(order: Order, customerEmail: string): string {
  // Crea il corpo dell'email
  const content = `
    <h1>Aggiornamento Stato Ordine #${order.id}</h1>
    <p>Gentile Cliente,</p>
    <p>ti informiamo che lo stato del tuo ordine #${order.id} è stato aggiornato.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <p style="font-size: 18px;">Il tuo ordine è ora:</p>
      <p>
        <span class="status-badge" style="background-color: ${getStatusColor(order.status)}; font-size: 20px; padding: 10px 20px;">
          ${formatOrderStatus(order.status)}
        </span>
      </p>
    </div>
    
    <h2>Dettagli Ordine</h2>
    <p>
      <strong>Numero ordine:</strong> #${order.id}<br>
      <strong>Data ordine:</strong> ${formatDate(order.createdAt)}<br>
      <strong>Data aggiornamento:</strong> ${formatDate(order.updatedAt)}
    </p>
    
    ${order.status === 'SPEDITO' ? `
      <p>Il tuo ordine è stato spedito! Potrai seguire la consegna tramite il tuo account.</p>
    ` : order.status === 'CONSEGNATO' ? `
      <p>Il tuo ordine è stato consegnato! Speriamo che i prodotti siano di tuo gradimento.</p>
    ` : order.status === 'ANNULLATO' ? `
      <p>Il tuo ordine è stato annullato. Se hai domande, contatta il nostro servizio clienti.</p>
    ` : `
      <p>Stiamo lavorando sul tuo ordine. Riceverai presto aggiornamenti.</p>
    `}
    
    <a href="http://localhost:3000/account/ordini/${order.id}" class="button">Visualizza Ordine</a>
    
    <p>Grazie per aver scelto PlanetStore!</p>
  `;
  
  return baseTemplate(content);
} 