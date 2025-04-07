import { NextResponse } from 'next/server';
import { executeQuery } from '@/app/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const notificationId = parseInt(params.id);
    
    if (isNaN(notificationId)) {
      return NextResponse.json(
        { error: 'Invalid notification ID' },
        { status: 400 }
      );
    }

    // Update the notification to mark it as sent
    await executeQuery(
      'UPDATE Content_Notifications SET is_sent = TRUE WHERE notification_id = ?',
      [notificationId]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Notification marked as sent' 
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}