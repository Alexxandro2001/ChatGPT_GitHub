import nodemailer from 'nodemailer';

// Interfaccia per le opzioni dell'email
export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Interfaccia per i dati dell'account Ethereal
export interface EtherealAccount {
  user: string;
  pass: string;
  smtp: {
    host: string;
    port: number;
    secure: boolean;
  };
  previewUrl: string;
}

// Variabile per memorizzare l'account Ethereal
let etherealAccount: EtherealAccount | null = null;

/**
 * Crea un account Ethereal per il testing delle email
 */
export async function createEtherealAccount(): Promise<EtherealAccount> {
  // Se abbiamo già un account, lo riutilizziamo
  if (etherealAccount) {
    return etherealAccount;
  }

  // Altrimenti ne creiamo uno nuovo
  try {
    const testAccount = await nodemailer.createTestAccount();
    
    etherealAccount = {
      user: testAccount.user,
      pass: testAccount.pass,
      smtp: {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
      },
      previewUrl: nodemailer.getTestMessageUrl({ 
        from: testAccount.user,
        to: testAccount.user,
        subject: 'Test',
        text: 'Test',
      }) || ''
    };
    
    console.log('Account Ethereal creato per il testing delle email:');
    console.log(`- Email: ${etherealAccount.user}`);
    console.log(`- Password: ${etherealAccount.pass}`);
    
    return etherealAccount;
  } catch (error) {
    console.error('Errore durante la creazione dell\'account Ethereal:', error);
    throw error;
  }
}

/**
 * Crea un trasporto Nodemailer utilizzando Ethereal Email
 */
export async function createTransporter() {
  // Assicuriamoci di avere un account Ethereal
  const account = await createEtherealAccount();
  
  // Creiamo il trasporto
  return nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });
}

/**
 * Invia un'email utilizzando Ethereal Email
 */
export async function sendEmail(options: EmailOptions): Promise<string> {
  try {
    const transporter = await createTransporter();
    const account = await createEtherealAccount();
    
    // Invia l'email
    const info = await transporter.sendMail({
      from: `"PlanetStore" <${account.user}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    
    // Ottieni l'URL per visualizzare l'email
    const previewUrl = nodemailer.getTestMessageUrl(info);
    
    console.log(`Email inviata: ${info.messageId}`);
    console.log(`Anteprima URL: ${previewUrl}`);
    
    return previewUrl || '';
  } catch (error) {
    console.error('Errore durante l\'invio dell\'email:', error);
    throw error;
  }
} 