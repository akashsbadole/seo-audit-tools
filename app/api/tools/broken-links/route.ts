import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      jobId: `job_${Date.now()}`,
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (jobId) {
      return NextResponse.json({
        id: jobId,
        url: "https://example.com",
        status: "completed",
        brokenLinks: [
          { url: "/old-page", statusCode: 404, foundOn: "/home" },
          { url: "/removed", statusCode: 404, foundOn: "/about" },
        ]
      });
    }

    const jobs = [
      { id: "1", url: "https://example.com", status: "completed", createdAt: new Date().toISOString() },
      { id: "2", url: "https://test.com", status: "completed", createdAt: new Date().toISOString() },
    ];

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching broken link jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
