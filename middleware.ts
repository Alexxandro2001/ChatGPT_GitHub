import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Proteggi le rotte admin
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    // Verifica se l'utente è admin
    const isAdmin = token?.isAdmin;
    
    // Se non è admin o non è autenticato, reindirizza alla login
    if (!token || !isAdmin) {
      return NextResponse.redirect(new URL('/login?error=unauthorized&redirectTo=' + pathname, request.url));
    }
  }
  
  return NextResponse.next();
}

// Configura i percorsi su cui deve essere eseguito il middleware
export const config = {
  matcher: ['/admin/:path*']
}; 