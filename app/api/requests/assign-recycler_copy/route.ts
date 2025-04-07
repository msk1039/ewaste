import { NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';

export async function POST(req: Request) {
  try {
    // const { requestId, volunteerId, adminId } = await req.json();
    const { requestId, recyclerId, adminId } = await req.json();
    
    // Basic validation
    if (!requestId || !recyclerId || !adminId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Execute stored procedure to assign volunteer to request
    const [result]: any = await pool.execute(
      'CALL AssignRecyclerToRequest(?, ?, ?)',
      [requestId, recyclerId, adminId]
    );
    
    return NextResponse.json({ 
      message: 'recycler assigned successfully',
      success: true
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error assigning recycler:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to assign volunteer',
      details: error.sqlMessage || null,
      success: false
    }, { status: 500 });
  }
}