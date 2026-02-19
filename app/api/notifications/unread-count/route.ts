import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({ count: 2 });
  } catch (error) {
    console.error('Unread count API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
