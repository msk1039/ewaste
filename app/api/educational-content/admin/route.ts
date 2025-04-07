import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../../lib/db";

export async function GET(
  request: NextRequest
) {
  const searchParams = request.nextUrl.searchParams;
  const adminId = searchParams.get('adminId');

  if (!adminId) {
    return NextResponse.json(
      { error: "Admin ID is required" },
      { status: 400 }
    );
  }

  try {
    const [result] = await executeQuery(
      "CALL GetEducationalContentByAdminId(?)",
      [adminId]
    );

    // MySQL stored procedure returns data in a nested array format
    const content = result[0];
    
    return NextResponse.json({ content }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch educational content" },
      { status: 500 }
    );
  }
}