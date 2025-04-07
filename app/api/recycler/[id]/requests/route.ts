import { NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const recyclerId = params.id;
    
    // Execute stored procedure to get requests assigned to this recycler
    const [rows]: any = await pool.execute('CALL GetRecyclerRequests(?)', [recyclerId]);
    
    // MySQL procedures return results as an array, where the first element contains the actual rows
    const requests = rows[0];

    return NextResponse.json({ requests });
  } catch (error: any) {
    console.error('Error fetching recycler requests:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch recycler requests',
      details: error.sqlMessage || null 
    }, { status: 500 });
  }
}