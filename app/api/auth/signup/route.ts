import { NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await pool.execute('CALL RegisterUser(?, ?)', [username, passwordHash]);

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}