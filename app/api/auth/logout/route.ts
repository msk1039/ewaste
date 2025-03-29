import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Clear the auth token from cookies
    (await
          // Clear the auth token from cookies
          cookies()).delete('auth-token');
    
    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}