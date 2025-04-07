import { NextResponse } from "next/server";
import { pool } from "@/app/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const {id} = await params;

  try {
    // First record the view
    await pool.execute("CALL RecordContentView(?)", [id]);
    
    // Then get the content with updated view count
    const [rows]:any = await pool.execute(
     "CALL GetEducationalContentWithViewById(?)",[id]
    );

    // MySQL stored procedure returns data in a nested array format
    // Access the first element of the first array to get the content
    const content = rows[0];
    
    if (!content || content.length === 0) {
      return NextResponse.json(
        { error: "Educational content not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ content }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch educational content" },
      { status: 500 }
    );
  }
}