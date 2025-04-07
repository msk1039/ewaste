import { NextResponse } from "next/server";
import { pool } from "@/app/lib/db";

export async function GET() {
  try {
    // Execute stored procedure to get educational content with view counts
    const [rows]: any = await pool.execute("CALL GetEducationalContentWithViews()");

    // MySQL procedures return results as an array, where the first element contains the actual rows
    const content = rows[0];

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error("Error fetching educational content:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch educational content" },
      { status: 500 }
    );
  }
}
