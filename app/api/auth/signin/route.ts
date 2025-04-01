import { NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();
    
    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let query, params, idField;

    // Determine the appropriate table based on role
    switch (role) {
      case 'donor':
        query = 'SELECT donor_id, name, email, password FROM Donor WHERE email = ?';
        params = [email];
        idField = 'donor_id';
        break;
      case 'admin':
        query = 'SELECT admin_id, name, email, password FROM Admin WHERE email = ?';
        params = [email];
        idField = 'admin_id';
        break;
      case 'volunteer':
        // For volunteers, we need to check by name since they don't have emails in the schema
        query = 'SELECT volunteer_id, name FROM Volunteer WHERE name = ?';
        params = [email]; // Using email field for name (not ideal but working with the schema)
        idField = 'volunteer_id';
        break;
      default:
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const [rows]: any = await pool.execute(query, params);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const user = rows[0];

    // For volunteers we don't have passwords in the schema, so we skip password checking
    if (role !== 'volunteer') {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
    }

    // Create token with role information
    const token = jwt.sign({ 
      id: user[idField], 
      name: user.name, 
      email: user.email,
      role 
    }, SECRET_KEY, { expiresIn: '1h' });
    
    // Set cookie
    (await
      // Set cookie
      cookies()).set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      sameSite: 'strict',
    });

    return NextResponse.json({ 
      id: user[idField],
      name: user.name,
      email: user.email,
      role,
      message: 'Logged in successfully' 
    }, { status: 200 });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}