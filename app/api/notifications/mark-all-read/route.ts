import { NextResponse } from "next/server";

export async function POST() {
  try {
    return NextResponse.json({ success: true, updated: 2 });
  } catch (error) {
    console.error('Mark all as read error:', error);
    return NextResponse.json(
      { error: 'Failed to mark all notifications as read' },
      { status: 500 }
    );
  }
}
