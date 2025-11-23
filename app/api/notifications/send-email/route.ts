import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth-helpers';
import { sendEmailNotification } from '@/lib/email-notifications';

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateUser(request);
    
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { user } = auth;
    const body = await request.json();
    const { type, title, message, category, actionUrl, actionLabel, targetUserId } = body;

    // Use provided targetUserId or current user's ID
    const userId = targetUserId || user.id;

    // Send email notification
    const result = await sendEmailNotification({
      userId,
      type,
      title,
      message,
      category,
      actionUrl,
      actionLabel
    });

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Email notification sent successfully' 
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send email notification' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Send email notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Admin endpoint to send emails to any user
export async function PUT(request: NextRequest) {
  try {
    const auth = await authenticateUser(request);
    
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { user } = auth;
    
    // Check if user is admin (you might want to add an admin role to your user model)
    if (!user.isPremium) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, type, title, message, category, actionUrl, actionLabel } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Send email notification to specified user
    const result = await sendEmailNotification({
      userId,
      type,
      title,
      message,
      category,
      actionUrl,
      actionLabel
    });

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Email notification sent successfully' 
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send email notification' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Admin send email notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}