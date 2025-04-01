import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "all";
    
    const query = "CALL GetAverageFeedbackRatings(?)";
    const [rows] = await executeQuery(query, [timeRange]);
    
    return NextResponse.json({ 
      success: true, 
      data: {
        average_rating: parseFloat(rows[0][0]?.average_rating || "0"),
        feedback_count: parseInt(rows[0][0]?.feedback_count || "0") 
      }
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch feedback ratings" }, { status: 500 });
  }
}