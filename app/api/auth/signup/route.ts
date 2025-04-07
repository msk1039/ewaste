import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs'; // Changed from bcrypt to bcryptjs
import { pool } from '@/app/lib/db';

export async function POST(req: Request) {
  try {
    // Add explicit try/catch for JSON parsing
    let requestData;
    try {
      requestData = await req.json();
    } catch (jsonError) {
      console.error('Error parsing request body as JSON:', jsonError);
      return NextResponse.json({ 
        error: 'Invalid JSON in request body',
        details: 'The request body could not be parsed as JSON. Please ensure you\'re sending properly formatted JSON data.'
      }, { status: 400 });
    }
    
    console.log('Signup request data:', requestData);
    
    const { 
      name, 
      email, 
      password, 
      role, 
      phone, 
      address,
      donorType, 
      age, 
      occupation,
      serviceArea
    } = requestData;

    // Basic validation
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);
    console.log(`Attempting to register ${role} with email: ${email}`);

    let result: any;

    try {
      // Based on role, call different stored procedures
      if (role === 'donor') {
        if (!donorType) {
          return NextResponse.json({ error: 'Donor type is required' }, { status: 400 });
        }

        console.log('Registering donor with parameters:', { name, email, phone, address, donorType });
        // Register as donor
        [result] = await pool.execute(
          'CALL RegisterDonor(?, ?, ?, ?, ?, ?)',
          [name, email, phone || null, address || null, donorType, hashedPassword]
        );
        console.log('Donor registration result:', result);
      } 
      else if (role === 'volunteer') {
        if (!age || !occupation) {
          return NextResponse.json({ error: 'Age and occupation are required for volunteers' }, { status: 400 });
        }

        console.log('Registering volunteer with parameters:', { name, age, address, occupation });
        // Register as volunteer
        [result] = await pool.execute(
          'CALL RegisterVolunteer(?, ?, ?, ?, ?)',
          [name, Number(age), address || null, occupation, hashedPassword]
        );
        console.log('Volunteer registration result:', result);
      } 
      else if (role === 'admin') {
        console.log('Registering admin with parameters:', { name, email });
        // Register as admin
        [result] = await pool.execute(
          'CALL RegisterAdmin(?, ?, ?)',
          [name, email, hashedPassword]
        );
        console.log('Admin registration result:', result);
      }
      else if (role === 'recycler') {
        if (!serviceArea || !phone) {
          return NextResponse.json({ error: 'Service area and phone number are required for recyclers' }, { status: 400 });
        }

        console.log('Registering recycler with parameters:', { name, email, phone, serviceArea });
        // Register as recycler
        [result] = await pool.execute(
          'CALL RegisterRecycler(?, ?, ?, ?, ?)',
          [name, email, phone, serviceArea, hashedPassword]
        );
        console.log('Recycler registration result:', result);
      }
      else {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
      }
    } catch (dbError: any) {
      console.error(`Database error when registering ${role}:`, dbError);
      return NextResponse.json({ 
        error: `Database error when registering ${role}`,
        details: {
          message: dbError.message,
          sqlMessage: dbError.sqlMessage,
          sqlState: dbError.sqlState,
          errno: dbError.errno,
          code: dbError.code
        }
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'User registered successfully',
      role
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error registering user:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to register user',
      details: error.sqlMessage || null 
    }, { status: 500 });
  }
}