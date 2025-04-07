import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/app/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contentId = parseInt(params.id);
    
    if (isNaN(contentId)) {
      return NextResponse.json(
        { error: "Invalid content ID" },
        { status: 400 }
      );
    }

    // Record a view in the Content_Views table
    await pool.execute(
      "INSERT INTO Content_Views (content_id) VALUES (?)",
      [contentId]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error recording content view:", error);
    return NextResponse.json(
      { error: error.message || "Failed to record content view" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contentId = parseInt(params.id);
    
    if (isNaN(contentId)) {
      return NextResponse.json(
        { error: "Invalid content ID" },
        { status: 400 }
      );
    }

    // Get the view count for this content
    const [rows]: any = await pool.execute(
      "SELECT COUNT(*) as viewCount FROM Content_Views WHERE content_id = ?",
      [contentId]
    );

    return NextResponse.json({ viewCount: rows[0].viewCount });
  } catch (error: any) {
    console.error("Error fetching content views:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch content view count" },
      { status: 500 }
    );
  }
}