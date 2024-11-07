import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { mode, duration } = await request.json();

  console.log(`Timer completed: ${mode} for ${duration} minutes`);

  return NextResponse.json({ success: true });
}
