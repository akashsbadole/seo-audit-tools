import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tokenPayload = verifyToken(request)
    if (!tokenPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: tokenPayload.userId },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const audit = await prisma.siteAudit.findFirst({
      where: {
        id,
        userId: dbUser.id
      },
      include: {
        AuditResult: true,
        AuditIssue: {
          orderBy: [
            { severity: 'desc' },
            { createdAt: 'desc' }
          ]
        },
        AuditReport: true
      }
    })

    if (!audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...audit,
      createdAt: audit.createdAt.toISOString(),
      updatedAt: audit.updatedAt.toISOString(),
      startedAt: audit.startedAt?.toISOString(),
      completedAt: audit.completedAt?.toISOString(),
      AuditIssue: audit.AuditIssue.map((issue: { id: string; severity: string; category: string; title: string; description: string; suggestion: string | null; pageUrl: string | null; element: string | null; isFixed: boolean; createdAt: Date }) => ({
        ...issue,
        createdAt: issue.createdAt.toISOString()
      })),
      AuditResult: audit.AuditResult.map((result: { id: string; category: string; subcategory: string; score: number; maxScore: number; data: unknown; createdAt: Date }) => ({
        ...result,
        createdAt: result.createdAt.toISOString()
      })),
      AuditReport: audit.AuditReport.map((report: { id: string; title: string; description: string | null; reportType: string; format: string; filePath: string | null; isPublic: boolean; createdAt: Date }) => ({
        ...report,
        createdAt: report.createdAt.toISOString()
      }))
    })

  } catch (error) {
    console.error('Get audit details error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audit details' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tokenPayload = verifyToken(request)
    if (!tokenPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: tokenPayload.userId },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const audit = await prisma.siteAudit.findFirst({
      where: {
        id,
        userId: dbUser.id
      }
    })

    if (!audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
    }

    await prisma.siteAudit.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Audit deleted successfully' })

  } catch (error) {
    console.error('Delete audit error:', error)
    return NextResponse.json(
      { error: 'Failed to delete audit' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tokenPayload = verifyToken(request)
    if (!tokenPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: tokenPayload.userId },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { status } = body

    const audit = await prisma.siteAudit.findFirst({
      where: {
        id,
        userId: dbUser.id
      }
    })

    if (!audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
    }

    const updatedAudit = await prisma.siteAudit.update({
      where: { id },
      data: {
        ...(status && { status }),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      ...updatedAudit,
      createdAt: updatedAudit.createdAt.toISOString(),
      updatedAt: updatedAudit.updatedAt.toISOString(),
      startedAt: updatedAudit.startedAt?.toISOString(),
      completedAt: updatedAudit.completedAt?.toISOString()
    })

  } catch (error) {
    console.error('Update audit error:', error)
    return NextResponse.json(
      { error: 'Failed to update audit' },
      { status: 500 }
    )
  }
}
