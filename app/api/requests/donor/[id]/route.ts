import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';

// Correct Next.js 15 route handler format for dynamic routes
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const donorId = params.id;
    
    if (!donorId) {
      return NextResponse.json({ error: 'Donor ID is required' }, { status: 400 });
    }

    // Execute stored procedure to get donor requests
    const [rows]: any = await pool.execute('CALL GetDonorRequests(?)', [donorId]);
    
    // MySQL procedures return results as an array, where the first element contains the actual rows
    const requests = rows[0];

    return NextResponse.json({ requests });
  } catch (error: any) {
    console.error('Error fetching donor requests:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch requests' }, { status: 500 });
  }
}