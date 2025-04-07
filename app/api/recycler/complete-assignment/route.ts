import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, getConnection } from '@/app/lib/db';
import { getAuthSession } from '@/app/api/auth/me/route';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getAuthSession();
    
    if (!session || session.user.role !== 'recycler') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse request body more carefully
    let body;
    try {
      body = await request.json();
      console.log("Received request body:", body); // Debug log
    } catch (err) {
      console.error("Failed to parse request body:", err);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    
    const { assignmentId, requestId } = body;
    
    if (!assignmentId || !requestId) {
      console.error("Missing fields:", { assignmentId, requestId }); // Debug log
      return NextResponse.json({ 
        error: 'Missing required fields',
        received: { assignmentId, requestId } 
      }, { status: 400 });
    }
    
    try {
      // First verify that the assignment belongs to this recycler
      const [verifyResult] = await executeQuery(
        `SELECT recycler_id 
         FROM Request_Recycler_Assignment 
         WHERE assignment_id = ?`,
        [assignmentId]
      );
      
      if (!verifyResult || verifyResult.length === 0) {
        return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
      }
      
      if (verifyResult[0].recycler_id !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      // Call the procedure to complete the assignment
      await executeQuery(
        'CALL CompleteRecyclerAssignment(?, ?)',
        [assignmentId, requestId]
      );
      
      return NextResponse.json({ 
        success: true, 
        message: 'Assignment marked as complete' 
      }, { status: 200 });
      
    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to complete assignment' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in complete-assignment route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}