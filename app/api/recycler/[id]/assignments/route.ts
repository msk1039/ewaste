import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/app/lib/db';
import { getAuthSession } from '@/app/api/auth/me/route';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getAuthSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Allow recyclers to see their own assignments or admins to see any recycler's assignments
    if (session.user.role !== 'admin' && session.user.id !== parseInt(params.id)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Fetch recycler assignments using MySQL syntax
    const query = `
          SELECT 
        r.request_id,
        r.waste_type,
        r.description,
        r.date_submitted,
        r.date_resolved,
        r.status,
        r.service_area,
        d.name AS donor_name,
        d.email AS donor_email,
        d.phone_no AS donor_phone,
        ra.assignment_id,
        ra.recycler_id,
        ra.assigned_date
    FROM 
        Request r
    JOIN 
        Donor d ON r.donor_id = d.donor_id
    JOIN 
        Request_Recycler_Assignment ra ON r.request_id = ra.request_id
    WHERE 
        ra.recycler_id = ${params.id}
    ORDER BY 
        r.date_submitted DESC;
    `;
    
    const [assignments] = await executeQuery(query, [params.id]);
    
    return NextResponse.json({
      assignments: assignments
    });
  } catch (error) {
    console.error('Error fetching recycler assignments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}