import { NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
  
) {
  try {
    const { id } = params;
    
    // Execute stored procedure to get request by ID
    const [rows]: any = await pool.execute('CALL GetRequestById(?)', [id]);
    
    // MySQL procedures return results as an array, where the first element contains the actual rows
    const requestData = rows[0][0];
    
    if (!requestData) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json({ request: requestData });
  } catch (error: any) {
    console.error('Error fetching request:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch request' }, { status: 500 });
  }
}