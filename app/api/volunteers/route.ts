import { NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';

export async function GET() {
  try {
    // Execute stored procedure to get all volunteers
    const [rows]: any = await pool.execute('CALL GetAllVolunteers()');
    
    // MySQL procedures return results as an array, where the first element contains the actual rows
    const volunteers = rows[0];

    return NextResponse.json({ volunteers });
  } catch (error: any) {
    console.error('Error fetching volunteers:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch volunteers' }, { status: 500 });
  }
}