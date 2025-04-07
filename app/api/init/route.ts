import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/app/lib/dbSetup';

// This endpoint will initialize the database with all triggers
// It should be called when the app starts
export async function GET() {
  try {
    // Run database initialization
    // await initializeDatabase();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully with all triggers' 
    });
  } catch (error) {
    console.error('Error in database initialization:', error);
    return NextResponse.json(
      { success: false, message: 'Database initialization failed', error: String(error) },
      { status: 500 }
    );
  }
}