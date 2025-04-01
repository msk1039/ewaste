import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "all";
    
    const query = "CALL GetRequestsByServiceArea(?)";
    const [rows] = await executeQuery(query, [timeRange]);
    
    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch service area data" }, { status: 500 });
  }
}