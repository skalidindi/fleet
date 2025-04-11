import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface TimeRow extends RowDataPacket {
  now: Date;
}

export async function GET() {
  try {
    // For MySQL
    const results = await query<TimeRow[]>("SELECT NOW() as now");

    return NextResponse.json({
      success: true,
      message: "Database connected successfully!",
      serverTime: results[0].now,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to database",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
