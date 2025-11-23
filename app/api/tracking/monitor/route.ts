import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

interface MonitorRequest {
  url: string;
  checkInterval?: number;
}

interface StatusCheck {
  statusCode: number;
  responseTime: number;
  isOnline: boolean;
  timestamp: Date;
}

async function checkWebsiteStatus(url: string): Promise<StatusCheck> {
  const startTime = Date.now();
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    const responseTime = Date.now() - startTime;
    const isOnline = response.ok;
    
    return {
      statusCode: response.status,
      responseTime,
      isOnline,
      timestamp: new Date()
    };
  } catch (error) {
    return {
      statusCode: 0,
      responseTime: 10000,
      isOnline: false,
      timestamp: new Date()
    };
  }
}

function getUserFromToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
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

    const body: MonitorRequest = await request.json();
    const { url, checkInterval = 300 } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Check user's usage limits
    const usageLimit = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { usage: true }
    });

    const monitorCount = await prisma.websiteMonitor.count({
      where: { userId: user.userId }
    });

    // Free users can monitor up to 3 websites
    if (!usageLimit?.isPremium && monitorCount >= 3) {
      return NextResponse.json(
        { error: 'You have reached the limit of 3 monitors. Upgrade to premium for unlimited monitoring.' },
        { status: 429 }
      );
    }

    // Create or update monitor
    const existingMonitor = await prisma.websiteMonitor.findFirst({
      where: { 
        userId: user.userId,
        url 
      }
    });

    if (existingMonitor) {
      // Update existing monitor
      await prisma.websiteMonitor.update({
        where: { id: existingMonitor.id },
        data: { 
          checkInterval,
          status: 'active'
        }
      });
    } else {
      // Create new monitor
      await prisma.websiteMonitor.create({
        data: {
          id: `monitor_${Date.now()}`,
          userId: user.userId,
          url,
          checkInterval,
          status: 'active',
          lastCheck: new Date()
        }
      });
    }

    // Perform initial status check
    const initialStatus = await checkWebsiteStatus(url);

    // Save status to history
    await prisma.statusHistory.create({
      data: {
        id: `status_${Date.now()}`,
        monitorId: existingMonitor?.id || `monitor_${Date.now()}`,
        statusCode: initialStatus.statusCode,
        responseTime: initialStatus.responseTime,
        checkedAt: initialStatus.timestamp
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Website monitoring started',
      monitor: {
        url,
        checkInterval,
        status: 'active',
        lastCheck: initialStatus.timestamp
      },
      initialStatus
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

    const monitors = await prisma.websiteMonitor.findMany({
      where: { userId: user.userId },
      include: {
        statusHistory: {
          take: 10,
          orderBy: { checkedAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      monitors: monitors.map(monitor => ({
        id: monitor.id,
        url: monitor.url,
        checkInterval: monitor.checkInterval,
        status: monitor.status,
        lastCheck: monitor.lastCheck,
        statusHistory: monitor.statusHistory
      }))
    });

  } catch (error) {
    console.error('Monitor fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monitors' },
      { status: 500 }
    );
  }
}