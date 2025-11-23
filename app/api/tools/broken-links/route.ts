import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { url, depth = 3, maxPages = 100 } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Check user's usage limits
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isPremium: true, usageLimit: true }
    });

    if (!user?.isPremium) {
      const today = new Date();
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      
      const currentUsage = await prisma.usageTracking.count({
        where: {
          user: { email: session.user.email },
          feature: 'broken-links',
          createdAt: { gte: monthStart }
        }
      });

      if (currentUsage >= 10) {
        return NextResponse.json({ 
          error: 'Monthly limit reached. Upgrade to Premium for unlimited access.' 
        }, { status: 429 });
      }
    }

    // Create broken link check job
    const job = await prisma.brokenLinkCheck.create({
      data: {
        url,
        depth,
        maxPages,
        status: 'pending',
        user: {
          connect: {
            email: session.user.email
          }
        }
      }
    });

    // Track usage for free users
    if (!user?.isPremium) {
      await prisma.usageTracking.create({
        data: {
          feature: 'broken-links',
          user: {
            connect: {
              email: session.user.email
            }
          }
        }
      });
    }

    // Start the broken link checking process in background
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
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (jobId) {
      // Get specific job results
      const job = await prisma.brokenLinkCheck.findFirst({
        where: {
          id: jobId,
          user: { email: session.user.email }
        },
        include: {
          brokenLinks: true
        }
      });

      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
      }

      return NextResponse.json(job);
    } else {
      // Get all jobs for user
      const jobs = await prisma.brokenLinkCheck.findMany({
        where: {
          user: { email: session.user.email }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 20
      });

      return NextResponse.json(jobs);
    }

  } catch (error) {
    console.error('Get broken link check error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch broken link check results' },
      { status: 500 }
    );
  }
}

// Background function to check broken links
async function checkBrokenLinks(jobId: string, baseUrl: string, maxDepth: number, maxPages: number) {
  try {
    const visited = new Set<string>();
    const queue: { url: string; depth: number }[] = [{ url: baseUrl, depth: 0 }];
    const brokenLinks: Array<{
      url: string;
      statusCode: number;
      error?: string;
      sourceUrl: string;
    }> = [];

    const updateJobStatus = async (status: string, progress?: number) => {
      await prisma.brokenLinkCheck.update({
        where: { id: jobId },
        data: { 
          status,
          progress,
          updatedAt: new Date()
        }
      });
    };

    while (queue.length > 0 && brokenLinks.length < 1000) {
      const { url, depth } = queue.shift()!;
      
      if (visited.has(url) || depth > maxDepth) continue;
      visited.add(url);

      try {
        const response = await fetch(url, { 
          method: 'HEAD',
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });

        if (!response.ok) {
          brokenLinks.push({
            url,
            statusCode: response.status,
            error: response.statusText,
            sourceUrl: baseUrl
          });
        }

        // If it's an HTML page and we haven't reached max depth/pages, extract links
        if (response.ok && response.headers.get('content-type')?.includes('text/html') && 
            depth < maxDepth && visited.size < maxPages) {
          
          const html = await fetch(url).then(r => r.text());
          const links = extractLinks(html, new URL(url).origin);
          
          for (const link of links) {
            if (!visited.has(link)) {
              queue.push({ url: link, depth: depth + 1 });
            }
          }
        }

        // Update progress
        const progress = Math.round((visited.size / Math.min(maxPages, 500)) * 100);
        await updateJobStatus('running', progress);

      } catch (error) {
        brokenLinks.push({
          url,
          statusCode: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
          sourceUrl: baseUrl
        });
      }
    }

    // Save results
    await prisma.brokenLinkCheck.update({
      where: { id: jobId },
      data: {
        status: 'completed',
        progress: 100,
        completedAt: new Date(),
        brokenLinks: {
          create: brokenLinks.map(link => ({
            url: link.url,
            statusCode: link.statusCode,
            error: link.error,
            sourceUrl: link.sourceUrl
          }))
        }
      }
    });

  } catch (error) {
    console.error('Background broken link check error:', error);
    await prisma.brokenLinkCheck.update({
      where: { id: jobId },
      data: {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        completedAt: new Date()
      }
    });
  }
}

// Extract links from HTML content
function extractLinks(html: string, baseOrigin: string): string[] {
  const linkRegex = /<a\s+(?:[^>]*?)href\s*=\s*(['"])(.*?)\1/gi;
  const links: string[] = [];
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    let href = match[2];
    
    // Skip empty links, anchors, javascript, and mailto
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) {
      continue;
    }

    // Convert relative URLs to absolute
    if (href.startsWith('/')) {
      href = baseOrigin + href;
    } else if (!href.startsWith('http')) {
      href = baseOrigin + '/' + href;
    }

    // Only include same-origin links
    if (href.startsWith(baseOrigin)) {
      links.push(href.split('#')[0]); // Remove anchor fragments
    }
  }

  return [...new Set(links)]; // Remove duplicates
}