import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { pool } from '@/app/lib/db';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  try {
    console.log('API route /api/auth/me called');
    // Fix: Changed 'auth-token' to 'authToken' to match the cookie name set in signin route
    const token = (await cookies()).get('authToken')?.value;
    
    console.log('Token found:', !!token);
    
    if (!token) {
      console.log('No token found, returning 401');
      return NextResponse.json({ error: 'Not authenticated' }, { 
        status: 401,
        headers,
      });
    }
    
    try {
      const decoded: any = jwt.verify(token, SECRET_KEY);
      console.log('Token verified successfully:', decoded);
      
      // Get additional user information based on role
      let additionalInfo = {};
      
      if (decoded.role === 'donor') {
        const [rows]: any = await pool.execute(
          'SELECT donor_type FROM Donor WHERE donor_id = ?',
          [decoded.id]
        );
        if (rows && rows.length > 0) {
          additionalInfo = { donorType: rows[0].donor_type };
        }
      } else if (decoded.role === 'volunteer') {
        const [rows]: any = await pool.execute(
          'SELECT age, occupation, program_id FROM Volunteer WHERE volunteer_id = ?',
          [decoded.id]
        );
        if (rows && rows.length > 0) {
          additionalInfo = { 
            age: rows[0].age,
            occupation: rows[0].occupation,
            programId: rows[0].program_id
          };
        }
      }
      
      return NextResponse.json({ 
        user: {
          ...decoded,
          ...additionalInfo
        } 
      }, { headers });
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


// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import jwt from 'jsonwebtoken';
// import { pool } from '@/app/lib/db';

// const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export async function getAuthSession() {
  const token = (await cookies()).get('authToken')?.value;
  
  if (!token) {
    return null;
  }
  
  try {
    const decoded: any = jwt.verify(token, SECRET_KEY);
    return {
      user: decoded
    };
  } catch (error) {
    return null;
  }
}