import { NextResponse } from 'next/server';
import { executeQuery } from '@/app/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const requestId = parseInt(params.id);
    
    if (isNaN(requestId)) {
      return NextResponse.json(
        { error: 'Invalid request ID' },
        { status: 400 }
      );
    }

    // Fetch the status history from the table populated by our trigger
    const [history] = await executeQuery(
      `SELECT 
        history_id, 
        request_id, 
        old_status, 
        new_status, 
        change_date
      FROM 
        Request_Status_History
      WHERE 
        request_id = ?
      ORDER BY 
        change_date DESC`,
      [requestId]
    );

    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error fetching request status history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch request status history' },
      { status: 500 }
    );
  }
}