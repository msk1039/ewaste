import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get stored procedures
    const [procedures] = await executeQuery(
      `SELECT ROUTINE_NAME as name, ROUTINE_TYPE as type, ROUTINE_DEFINITION as definition
       FROM INFORMATION_SCHEMA.ROUTINES
       WHERE ROUTINE_SCHEMA = 'myapp' AND (ROUTINE_TYPE = 'PROCEDURE' OR ROUTINE_TYPE = 'FUNCTION')`
    );

    // Get triggers
    const [triggers] = await executeQuery(
      `SELECT TRIGGER_NAME as name, ACTION_TIMING as timing, EVENT_MANIPULATION as event, 
              EVENT_OBJECT_TABLE as table_name, ACTION_STATEMENT as definition
       FROM INFORMATION_SCHEMA.TRIGGERS
       WHERE TRIGGER_SCHEMA = 'myapp'`
    );

    return NextResponse.json({
      procedures,
      triggers
    });
  } catch (error) {
    console.error('Error fetching database procedures and triggers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch database procedures and triggers' },
      { status: 500 }
    );
  }
}
