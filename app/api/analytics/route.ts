import { NextResponse } from "next/server";
import { executeQuery } from "@/app/lib/db";

export async function GET() {
  try {
    // Just a health check for the analytics API
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}