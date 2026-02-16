import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, depth = 3, maxPages = 100 } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const job = await prisma.brokenLinkCheck.create({
      data: {
        url,
        depth,
        maxPages,
        status: 'pending'
      }
    });

    checkBrokenLinks(job.id, url, depth, maxPages);

    return NextResponse.json({ 
      success: true, 
      jobId: job.id,
      message: 'Broken link check started. Results will be available shortly.' 
    });

  } catch (error) {
    console.error('Broken link check error:', error);
    return NextResponse.json(
      { error: 'Failed to start broken link check' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (jobId) {
      const job = await prisma.brokenLinkCheck.findUnique({
        where: { id: jobId },
        include: { brokenLinks: true }
      });

      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
      }

      return NextResponse.json(job);
    }

    const jobs = await prisma.brokenLinkCheck.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching broken link jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

async function checkBrokenLinks(jobId: string, url: string, depth: number, maxPages: number) {
  // Placeholder - implement the actual broken link checking logic
  await prisma.brokenLinkCheck.update({
    where: { id: jobId },
    data: { status: 'completed' }
  });
}
