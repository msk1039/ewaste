import { NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, phone, address, password, role, donorType, age, occupation } = await req.json();
    
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    // Begin transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Register based on role
      if (role === 'donor') {
        await connection.execute(
          'INSERT INTO Donor (name, email, phone_no, address, donor_type, password) VALUES (?, ?, ?, ?, ?, ?)',
          [name, email, phone || null, address || null, donorType, passwordHash]
        );
      } else if (role === 'volunteer') {
        // First check if age and occupation are provided
        if (!age || !occupation) {
          throw new Error('Age and occupation are required for volunteers');
        }
        
        await connection.execute(
          'INSERT INTO Volunteer (name, age, address, occupation) VALUES (?, ?, ?, ?)',
          [name, age, address || null, occupation]
        );
      } else if (role === 'admin') {
        await connection.execute(
          'INSERT INTO Admin (name, email, password) VALUES (?, ?, ?)',
          [name, email, passwordHash]
        );
      } else {
        throw new Error('Invalid role');
      }

      await connection.commit();
      await connection.release();

      return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch (error: any) {
      await connection.rollback();
      await connection.release();
      throw error;
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      error: error.message || 'Registration failed',
      details: error.sqlMessage || null
    }, { status: 500 });
  }
}