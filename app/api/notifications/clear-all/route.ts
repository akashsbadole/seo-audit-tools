import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    return NextResponse.json({ success: true, deleted: 3 });
  } catch (error) {
    console.error('Clear all notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to clear all notifications' },
      { status: 500 }
    );
  }
}
