import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { pool } from '@/app/lib/db';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Email, password and role are required' }, { status: 400 });
    }

    let user: any;
    let procedureName: string;

    // Choose the right login procedure based on role
    switch (role) {
      case 'donor':
        procedureName = 'LoginDonor';
        break;
      case 'admin':
        procedureName = 'LoginAdmin';
        break;
      case 'volunteer':
        procedureName = 'LoginVolunteer';
        break;
      case 'recycler':
        procedureName = 'LoginRecycler';
        break;
      default:
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Execute the appropriate login procedure
    const [rows]: any = await pool.execute(`CALL ${procedureName}(?)`, [email]);

    if (!rows || !rows[0] || rows[0].length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Get the first (and should be only) user record
    user = rows[0][0];

    // Verify password
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Determine ID field name based on role (e.g., donor_id, admin_id)
    const idField = `${role}_id`;

    // Create JWT token
    const token = sign(
      { 
        id: user[idField], 
        email: user.email, 
        name: user.name,
        role: role 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Set cookie with the token
    (await
      // Set cookie with the token
      cookies()).set({
      name: 'authToken',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'strict'
    });

    // Return success with user info (without password)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user[idField],
        name: user.name,
        email: user.email,
        role: role
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 });
  }
}