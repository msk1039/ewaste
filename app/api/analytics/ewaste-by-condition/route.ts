import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET() {
  try {
    const query = "CALL GetEWasteByCondition()";
    const [rows] = await executeQuery(query, []);
    
    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch e-waste condition data" }, { status: 500 });
  }
}