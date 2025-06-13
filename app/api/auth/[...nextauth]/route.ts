import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Esporta l'handler per la gestione delle richieste di autenticazione
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 