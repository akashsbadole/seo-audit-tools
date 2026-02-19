import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const createAuditSchema = z.object({
  url: z.string().url("Invalid URL format"),
  type: z
    .enum([
      "FULL_AUDIT",
      "SEO_AUDIT",
      "ACCESSIBILITY_AUDIT",
      "PERFORMANCE_AUDIT",
    ])
    .optional()
    .default("FULL_AUDIT"),
});

export async function POST(req: Request) {
  try {
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const token = authHeader.substring(7);
    // TODO: Validate token and get user ID
    // For now, we'll use a placeholder user ID
    const userId = "temp-user-id";

    const body = await req.json();
    const validatedData = createAuditSchema.parse(body);

    // Check if user has available reports
    const dbUser = await prisma.user.findFirst({
      include: {
        SiteAudit: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
        },
      },
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (!dbUser.isPremium && dbUser.SiteAudit.length >= 10) {
      return new NextResponse("Daily audit limit reached", { status: 403 });
    }

    const auditId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const audit = await prisma.siteAudit.create({
      data: {
        id: auditId,
        userId: dbUser.id,
        url: validatedData.url,
        status: "PENDING",
        startedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Start the audit process (simulate for now)
    setTimeout(async () => {
      try {
        await simulateAuditProcess(audit.id, validatedData.url);
      } catch (error) {
        console.error("Audit simulation error:", error);
        await prisma.siteAudit.update({
          where: { id: audit.id },
          data: { status: "FAILED" },
        });
      }
    }, 1000);

    return NextResponse.json(audit);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[AUDITS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const token = authHeader.substring(7);
    // TODO: Validate token and get user ID
    // For now, we'll use a placeholder user ID
    const userId = "temp-user-id";

    const dbUser = await prisma.user.findFirst();

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    const where = {
      userId: dbUser.id,
      ...(status && { status: status as any }),
    };

    const [audits, total] = await Promise.all([
      prisma.siteAudit.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          AuditResult: {
            select: {
              category: true,
              score: true,
            },
          },
          AuditIssue: {
            select: {
              severity: true,
            },
          },
        },
      }),
      prisma.siteAudit.count({ where }),
    ]);

    return NextResponse.json({
      audits: audits.map((audit: any) => ({
        ...audit,
        createdAt: audit.createdAt.toISOString(),
        updatedAt: audit.updatedAt.toISOString(),
        startedAt: audit.startedAt?.toISOString(),
        completedAt: audit.completedAt?.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[AUDITS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// Simulate audit process (replace with real audit logic)
async function simulateAuditProcess(auditId: string, url: string) {
  // Update status to in progress
  await prisma.siteAudit.update({
    where: { id: auditId },
    data: {
      status: "IN_PROGRESS",
      updatedAt: new Date(),
    },
  });

  // Simulate audit delay
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Generate mock audit results
  const seoScore = Math.floor(Math.random() * 40) + 60; // 60-100
  const accessibilityScore = Math.floor(Math.random() * 30) + 70; // 70-100
  const performanceScore = Math.floor(Math.random() * 50) + 50; // 50-100
  const qualityScore = Math.floor(Math.random() * 35) + 65; // 65-100

  const digitalCertaintyIndex = Math.round(
    (seoScore + accessibilityScore + performanceScore + qualityScore) / 4
  );

  await prisma.siteAudit.update({
    where: { id: auditId },
    data: {
      status: "COMPLETED",
      digitalCertaintyIndex,
      seoScore,
      accessibilityScore,
      performanceScore,
      qualityScore,
      totalPages: Math.floor(Math.random() * 100) + 10,
      crawledPages: Math.floor(Math.random() * 100) + 10,
      totalIssues: Math.floor(Math.random() * 20) + 5,
      criticalIssues: Math.floor(Math.random() * 5),
      warningIssues: Math.floor(Math.random() * 10) + 2,
      infoIssues: Math.floor(Math.random() * 8) + 1,
      completedAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const timestamp = Date.now();
  const auditResults = [
    {
      id: `result_${timestamp}_1`,
      auditId,
      category: "SEO",
      subcategory: "Meta Tags",
      score: seoScore,
      maxScore: 100,
      data: { metaTags: "analyzed" } as any,
    },
    {
      id: `result_${timestamp}_2`,
      auditId,
      category: "Accessibility",
      subcategory: "WCAG Compliance",
      score: accessibilityScore,
      maxScore: 100,
      data: { wcagLevel: "AA" } as any,
    },
    {
      id: `result_${timestamp}_3`,
      auditId,
      category: "Performance",
      subcategory: "Core Web Vitals",
      score: performanceScore,
      maxScore: 100,
      data: { lcp: "2.1s", fid: "45ms", cls: "0.08" } as any,
    },
    {
      id: `result_${timestamp}_4`,
      auditId,
      category: "Quality",
      subcategory: "Content Quality",
      score: qualityScore,
      maxScore: 100,
      data: { contentAnalysis: "completed" } as any,
    },
  ];

  await prisma.auditResult.createMany({
    data: auditResults,
  });

  const sampleIssues = [
    {
      id: `issue_${timestamp}_1`,
      auditId,
      severity: "CRITICAL" as const,
      category: "SEO",
      title: "Missing meta description",
      description: "Several pages are missing meta descriptions",
      pageUrl: `${url}/page1`,
      suggestion: "Add unique meta descriptions to all pages",
    },
    {
      id: `issue_${timestamp}_2`,
      auditId,
      severity: "WARNING" as const,
      category: "Accessibility",
      title: "Images without alt text",
      description: "Some images are missing alternative text",
      pageUrl: `${url}/page2`,
      suggestion: "Add descriptive alt text to all images",
    },
  ];

  await prisma.auditIssue.createMany({
    data: sampleIssues,
  });
}
