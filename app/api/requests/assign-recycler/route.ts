import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, getConnection } from '@/app/lib/db';
import { getAuthSession } from '@/app/api/auth/me/route';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getAuthSession();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { requestId, recyclerId, adminId } = await request.json();
    
    if (!requestId || !recyclerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    try {
      // Check if request exists and is in pending status
      const [requestCheck] = await executeQuery(
        'SELECT status FROM requests WHERE request_id = ?',
        [requestId]
      );
      
      if (!requestCheck || requestCheck.length === 0) {
        return NextResponse.json({ error: 'Request not found' }, { status: 404 });
      }
      
      if (requestCheck[0].status !== 'pending') {
        return NextResponse.json({ error: 'Request is not in pending status' }, { status: 400 });
      }
      
      // Check if recycler exists
      const [recyclerCheck] = await executeQuery(
        'SELECT recycler_id FROM recyclers WHERE recycler_id = ?',
        [recyclerId]
      );
      
      if (!recyclerCheck || recyclerCheck.length === 0) {
        return NextResponse.json({ error: 'Recycler not found' }, { status: 404 });
      }
      
      // Start a transaction
      const connection = await getConnection();
      try {
        await connection.beginTransaction();
        
        // Update request status to processing
        await connection.execute(
          'UPDATE requests SET status = ? WHERE request_id = ?',
          ['processing', requestId]
        );
        
        // Create recycler assignment
        await connection.execute(
          `INSERT INTO recycler_assignments 
          (request_id, recycler_id, assigned_by, assigned_date) 
          VALUES (?, ?, ?, NOW())`,
          [requestId, recyclerId, adminId]
        );
        
        await connection.commit();
        
        return NextResponse.json({ 
          success: true, 
          message: 'Recycler assigned successfully' 
        }, { status: 200 });
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error: any) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to assign recycler' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in assign-recycler route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}