import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Routes that don't require authentication
const publicRoutes = ['/signin', '/signup', '/api/auth/signin', '/api/auth/signup'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Allow public routes
  if (publicRoutes.some(route => path.startsWith(route))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  try {
    // Verify token (using jose instead of jsonwebtoken in middleware)
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    await jwtVerify(token, secretKey);
    return NextResponse.next();
  } catch (error) {
    // Token is invalid or expired
    return NextResponse.redirect(new URL('/signin', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};