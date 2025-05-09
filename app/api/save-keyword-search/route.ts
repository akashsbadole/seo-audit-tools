import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { checkUsageLimit, incrementUsage } from '@/lib/middleware/usageLimit';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Create a single Prisma client instance
const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const usageCheck = await checkUsageLimit('search');
  if (!usageCheck.allowed) {
    return NextResponse.json(
      { error: usageCheck.message },
      { status: 403 }
    );
  }

  const recaptchaToken = request.headers.get('X-Recaptcha-Token');

  if (!recaptchaToken) {
    return NextResponse.json(
      { error: 'reCAPTCHA token is required' },
      { status: 400 }
    );
  }

  const isValidRecaptcha = await verifyRecaptcha(recaptchaToken);
  if (!isValidRecaptcha) {
    return NextResponse.json(
      { error: 'Invalid reCAPTCHA token' },
      { status: 403 }
    );
  }

  try {
    // Log the request headers for debugging
    // console.log('Request headers:', Object.fromEntries(request.headers.entries()));

    const body = await request.json();
    console.log('Raw request body:', body);

    // Validate required fields
    const { keyword, platform, searchType, country, language, results } = body;

    if (!keyword || !platform || !searchType || !country || !language || !results) {
      return NextResponse.json(
        { error: 'Missing required fields', receivedData: body },
        { status: 400 }
      );
    }

    if (!Array.isArray(results)) {
      return NextResponse.json(
        { error: 'Results must be an array', receivedResults: results },
        { status: 400 }
      );
    }

    // Save to database
    const savedSearch = await prisma.keywordSearch.create({
      data: {
        keyword: String(keyword),
        platform: String(platform),
        searchType: String(searchType),
        country: String(country),
        language: String(language),
        results: results,
        userId: parseInt(session.user.id)
      }
    });

    // Increment usage after successful save
    await incrementUsage('search', parseInt(session.user.id));

    return NextResponse.json({
      success: true,
      data: savedSearch
    });
  } catch (error) {
    // Log the full error details
    console.error('Detailed error saving keyword search:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    // Return a proper JSON response with error details
    return NextResponse.json(
      { 
        error: 'Failed to save keyword search',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
} 