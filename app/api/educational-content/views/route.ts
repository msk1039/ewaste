import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/app/lib/db";

export async function GET() {
  try {
    // Get all content view counts
    const [rows]: any = await pool.execute(`
      SELECT 
        ec.content_id,
        COUNT(cv.view_id) as view_count
      FROM 
        Educational_Content ec
      LEFT JOIN 
        Content_Views cv ON ec.content_id = cv.content_id
      GROUP BY 
        ec.content_id
    `);

    return NextResponse.json({ viewCounts: rows });
  } catch (error: any) {
    console.error("Error fetching content view counts:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch content view counts" },
      { status: 500 }
    );
  }
}