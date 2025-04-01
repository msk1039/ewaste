import { NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const { donorId, wasteType, description, serviceArea } = await req.json();
    
    // Basic validation
    if (!donorId || !wasteType || !description || !serviceArea) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Execute stored procedure to create a new donation request
    const [result]: any = await pool.execute(
      'CALL CreateDonationRequest(?, ?, ?, ?)',
      [donorId, wasteType, description, serviceArea]
    );
    
    // The stored procedure returns the ID of the newly created request
    const requestId = result[0][0].request_id;

    return NextResponse.json({ 
      message: 'Donation request created successfully',
      requestId
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating donation request:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to create donation request',
      details: error.sqlMessage || null 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Execute stored procedure to get all requests
    const [rows]: any = await pool.execute('CALL GetAllRequests()');
    
    // MySQL procedures return results as an array, where the first element contains the actual rows
    const requests = rows[0];

    return NextResponse.json({ requests });
  } catch (error: any) {
    console.error('Error fetching requests:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch requests' }, { status: 500 });
  }
}