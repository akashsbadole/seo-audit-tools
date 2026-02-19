import { NextRequest, NextResponse } from 'next/server';

const mockNotifications = [
  { id: "1", type: "AUDIT_COMPLETE", message: "Your site audit has completed", read: false, createdAt: new Date().toISOString() },
  { id: "2", type: "KEYWORD_RANKING", message: "Keyword 'seo tools' moved to position 5", read: false, createdAt: new Date().toISOString() },
  { id: "3", type: "SYSTEM", message: "Welcome to SEOaudit Pro!", read: true, createdAt: new Date().toISOString() },
];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notification = mockNotifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }

    return NextResponse.json({ success: true, updated: !!notification });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return NextResponse.json(
      { error: 'Failed to mark notification as read' },
      { status: 500 }
    );
  }
}
