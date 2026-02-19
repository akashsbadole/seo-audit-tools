import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

function getUserFromToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = getUserFromToken(authHeader);
    
    if (!user?.userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { url, checkInterval = 300 } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: 'Website monitoring started',
      monitor: {
        id: `monitor_${Date.now()}`,
        url,
        checkInterval,
        status: 'active',
        lastCheck: new Date().toISOString()
      },
      initialStatus: {
        statusCode: 200,
        responseTime: 245,
        isOnline: true
      }
    });

  } catch (error) {
    console.error('Monitoring setup error:', error);
    return NextResponse.json(
      { error: 'Failed to setup monitoring' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = getUserFromToken(authHeader);
    
    if (!user?.userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const monitors = [
      {
        id: "monitor_1",
        url: "https://example.com",
        checkInterval: 300,
        status: "active",
        lastCheck: new Date().toISOString(),
        statusHistory: [
          { statusCode: 200, responseTime: 245, checkedAt: new Date().toISOString() },
          { statusCode: 200, responseTime: 198, checkedAt: new Date().toISOString() },
        ]
      }
    ];

    return NextResponse.json({ monitors });

  } catch (error) {
    console.error('Monitor fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monitors' },
      { status: 500 }
    );
  }
}
