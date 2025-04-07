import { NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';

export async function GET() {
  try {
    // Execute stored procedure to get all recyclers
    const [rows]: any = await pool.execute('CALL GetAllRecyclers()');
    
    // MySQL procedures return results as an array, where the first element contains the actual rows
    const recyclers = rows[0];

    return NextResponse.json({ recyclers });
  } catch (error: any) {
    console.error('Error fetching recyclers:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch recyclers' }, { status: 500 });
  }
}