import { NextResponse } from 'next/server';
import { addSuggestion, isEmailExists } from '@/lib/db-suggestions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, comment } = body;

    if (!email || !comment) {
      return NextResponse.json(
        { error: 'Email and comment are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const emailExists = await isEmailExists(email);
    if (emailExists) {
      return NextResponse.json(
        { error: 'You have already submitted a suggestion with this email' },
        { status: 400 }
      );
    }

    const suggestion = await addSuggestion({ email, comment });
    return NextResponse.json(suggestion, { status: 201 });
  } catch (error) {
    console.error('Error in suggestions API:', error);
    return NextResponse.json(
      { error: 'Failed to add suggestion' },
      { status: 500 }
    );
  }
}