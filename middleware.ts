import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Routes that don't require authentication
const publicRoutes = [
  '/signin', '/signup', '/api/auth/signin', '/api/auth/signup',
  '/', 
  '/api/auth/me'  // Add this to make it accessible for auth checking
];

// Static assets that should always be accessible
const staticAssetPaths = [
  '/_next/',
  '/favicon.ico',
  '/images/',
  '/fonts/',
  '/index.html',
  '/international-e-waste-day.webp', // Add the specific image path
  '.webp',  // Allow all webp files
  '.jpg',   // Allow all jpg files
  '.jpeg',  // Allow all jpeg files
  '.png',   // Allow all png files
  '.svg',   // Allow all svg files
  '.gif'    // Allow all gif files
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  console.log('Middleware processing path:', path); // Debug logging
  
  // Always allow root path
  if(path==='/database/data' || path==='/database/procedures'){
    return NextResponse.next();
  }

  if (path === '/') {
    return NextResponse.next();
  }
  if (path === '') {
    return NextResponse.next();
  }
  
  // Allow static assets including image files
  if (staticAssetPaths.some(prefix => 
    path.startsWith(prefix) || 
    path === prefix || 
    path.endsWith(prefix)
  )) {
    console.log('Allowing static asset:', path);
    return NextResponse.next();
  }
  
  // Allow public routes
  if (publicRoutes.some(route => path === route || path.startsWith(route + '/'))) {
    return NextResponse.next();
  }
  
  // Allow all API routes that begin with /api/
  if (path.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Changed from 'auth-token' to 'authToken' to match the cookie name in signin route
  const token = request.cookies.get('authToken')?.value;
  
  console.log('Auth token found:', !!token);

  if (!token) {
    // Don't redirect for image files
    if (path.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      return NextResponse.next();
    }
    console.log('No token found, redirecting to signin');
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  try {
    // Verify token (using jose instead of jsonwebtoken in middleware)
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    await jwtVerify(token, secretKey);
    return NextResponse.next();
  } catch (error) {
    // Token is invalid or expired
    console.log('Token verification failed:', error);
    return NextResponse.redirect(new URL('/signin', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};