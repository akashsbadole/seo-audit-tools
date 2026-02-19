import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7);
    
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const stats = {
      totalAnalyses: 15,
      premiumAnalyses: 8,
      savedReports: 5,
      apiCalls: 42,
      lastAnalysis: new Date().toISOString(),
      recentActivity: [
        { tool: 'Site Audit', url: 'https://example.com', date: new Date().toISOString(), status: 'completed', score: 85 },
        { tool: 'Keyword Research', url: 'seo tools', date: new Date().toISOString(), status: 'completed', score: null },
      ],
      usageStats: {
        apiUsage: { used: 42, limit: 'Unlimited' },
        storageUsed: { used: 512, total: 10240, percentage: 5 },
        reportsGenerated: 5
      },
      user: {
        id: "user_1",
        name: "Demo User",
        email: "demo@example.com",
        isPremium: true,
        createdAt: new Date().toISOString()
      }
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('User stats API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    )
  }
}
