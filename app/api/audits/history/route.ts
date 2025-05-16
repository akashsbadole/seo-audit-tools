import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

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

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
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