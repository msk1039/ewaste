import { NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';


const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const [rows]: any = await pool.execute('CALL LoginUser(?)', [username]);

    if (!rows[0] || rows[0].length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const { id, password_hash } = rows[0][0];

    const isMatch = await bcrypt.compare(password, password_hash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ id, username }, SECRET_KEY, { expiresIn: '1h' });
    
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
      id,
      username, 
      message: 'Logged in successfully' 
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}