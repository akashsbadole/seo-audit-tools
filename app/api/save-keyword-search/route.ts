import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRecaptcha } from '@/lib/recaptcha';

export async function POST(request: Request) {
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
    const body = await request.json();
    console.log('Raw request body:', body);

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

    const savedSearch = await prisma.keywordSearch.create({
      data: {
        keyword: String(keyword),
        platform: String(platform),
        searchType: String(searchType),
        country: String(country),
        language: String(language),
        results: results
      }
    });

    return NextResponse.json({
      success: true,
      data: savedSearch
    });
  } catch (error) {
    console.error('Detailed error saving keyword search:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

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
