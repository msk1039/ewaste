import { NextResponse } from 'next/server';
import { executeQuery } from '@/app/lib/db';

// Get notifications from our trigger-populated table
export async function GET() {
  try {
    const [notifications] = await executeQuery(
      `SELECT 
        notification_id, 
        content_id, 
        title, 
        created_at, 
        is_sent 
      FROM 
        Content_Notifications
      ORDER BY 
        created_at DESC
      LIMIT 20`
    );

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Error fetching content notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}