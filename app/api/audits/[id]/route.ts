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
  { params }: { params: { id: string } }
) {
  try {
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
        id: params.id,
        userId: dbUser.id
      },
      include: {
        auditResults: true,
        auditIssues: {
          orderBy: [
            { severity: 'desc' },
            { createdAt: 'desc' }
          ]
        },
        auditReports: true
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
      auditIssues: audit.auditIssues.map(issue => ({
        ...issue,
        createdAt: issue.createdAt.toISOString()
      })),
      auditResults: audit.auditResults.map(result => ({
        ...result,
        createdAt: result.createdAt.toISOString()
      })),
      auditReports: audit.auditReports.map(report => ({
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
  { params }: { params: { id: string } }
) {
  try {
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

    // Check if audit exists and belongs to user
    const audit = await prisma.siteAudit.findFirst({
      where: {
        id: params.id,
        userId: dbUser.id
      }
    })

    if (!audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
    }

    // Delete the audit (cascade will handle related records)
    await prisma.siteAudit.delete({
      where: { id: params.id }
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
  { params }: { params: { id: string } }
) {
  try {
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
    const { status, notes } = body

    // Check if audit exists and belongs to user
    const audit = await prisma.siteAudit.findFirst({
      where: {
        id: params.id,
        userId: dbUser.id
      }
    })

    if (!audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
    }

    // Update the audit
    const updatedAudit = await prisma.siteAudit.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        // Add notes field to schema if needed
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
