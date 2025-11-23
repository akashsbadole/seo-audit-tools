import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.substring(7)
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
  } catch {
    return null
  }
}

interface AuditWithRelations {
  id: string;
  userId: string;
  url: string;
  type: string;
  score: number;
  status: string;
  createdAt: string;
  issues: {
    id: string;
    type: string;
    severity: string;
    description: string;
    status: string;
  }[];
  recommendations: {
    id: string;
    title: string;
    priority: string;
    status: string;
  }[];
}

export async function GET(request: NextRequest) {
  try {
    const tokenPayload = verifyToken(request)
    if (!tokenPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: tokenPayload.userId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get audits with issues and recommendations
    const audits = await prisma.audit.findMany({
      where: { userId: dbUser.id },
      include: {
        issues: true,
        recommendations: true,
      },
      orderBy: { createdAt: "desc" },
    }) as AuditWithRelations[];

    // Calculate audit trends
    const trends = {
      totalAudits: audits.length,
      averageScore: audits.reduce((acc: number, audit: AuditWithRelations) => acc + audit.score, 0) / audits.length || 0,
      criticalIssues: audits.reduce((acc: number, audit: AuditWithRelations) => 
        acc + audit.issues.filter((issue) => issue.severity === "CRITICAL").length, 0),
      resolvedIssues: audits.reduce((acc: number, audit: AuditWithRelations) => 
        acc + audit.issues.filter((issue) => issue.status === "RESOLVED").length, 0),
    };

    // Get recent improvements
    const recentImprovements = await prisma.recommendation.findMany({
      where: {
        audit: { userId: dbUser.id },
        status: "COMPLETED",
      },
      include: {
        audit: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
    });

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