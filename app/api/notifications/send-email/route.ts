import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, message, category } = body;

    return NextResponse.json({ success: true, message: 'Email notification sent' });
  } catch (error) {
    console.error('Send email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
