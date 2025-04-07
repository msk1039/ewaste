import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../../lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, adminId } = body;

    // Validate input
    if (!title || !description || !adminId) {
      return NextResponse.json(
        { error: "Title, description, and admin ID are required" },
        { status: 400 }
      );
    }

    // Call the stored procedure to create content
    const [result] = await executeQuery(
      "CALL CreateEducationalContent(?, ?, ?)",
      [title, description, adminId]
    );

    // Get the ID of the newly created content
    const contentId = result[0].content_id;

    return NextResponse.json({ 
      success: true, 
      message: "Educational content created successfully",
      contentId: contentId
    }, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to create educational content" },
      { status: 500 }
    );
  }
}