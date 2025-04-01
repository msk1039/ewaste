import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "all";
    
    const query = "CALL GetProcessingEfficiency(?)";
    const [rows] = await executeQuery(query, [timeRange]);
    
    return NextResponse.json({ 
      success: true, 
      data: {
        avg_processing_days: parseFloat(rows[0][0]?.avg_processing_days || "0")
      }
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch processing efficiency data" }, { status: 500 });
  }
}