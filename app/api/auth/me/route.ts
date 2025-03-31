import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

// Make sure this is properly exported as a GET handler
export async function GET() {
  // Add headers to ensure JSON response
  const headers = {
    'Content-Type': 'application/json',
  };
  
  try {
    console.log('API route /api/auth/me called');
    const token = (await cookies()).get('auth-token')?.value;
    
    console.log('Token found:', !!token);
    
    if (!token) {
      console.log('No token found, returning 401');
      return NextResponse.json({ error: 'Not authenticated' }, { 
        status: 401,
        headers,
      });
    }
    
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      console.log('Token verified successfully:', decoded);
      return NextResponse.json({ user: decoded }, { headers });
    } catch (error) {
      console.log('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid token' }, { 
        status: 401,
        headers,
      });
    }
  } catch (error: any) {
    console.error('Server error in /api/auth/me:', error);
    return NextResponse.json({ error: error.message }, { 
      status: 500,
      headers,
    });
  }
}