import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

function verifyToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const tokenPayload = verifyToken(authHeader);
    
    if (!tokenPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const audits = [
      { id: "1", url: "https://example.com", score: 85, status: "COMPLETED", createdAt: new Date().toISOString() },
      { id: "2", url: "https://test.com", score: 72, status: "COMPLETED", createdAt: new Date().toISOString() },
    ];

    const trends = {
      totalAudits: audits.length,
      averageScore: 78,
      criticalIssues: 3,
      resolvedIssues: 12,
    };

    const recentImprovements = [
      { id: "1", title: "Fixed meta description", priority: "HIGH", status: "COMPLETED" },
      { id: "2", title: "Optimized images", priority: "MEDIUM", status: "COMPLETED" },
    ];

    return NextResponse.json({
      audits,
      trends,
      recentImprovements,
    });
  } catch (error) {
    console.error("[AUDIT_HISTORY_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
