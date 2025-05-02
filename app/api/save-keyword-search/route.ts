import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

// Create a single Prisma client instance
const prisma = new PrismaClient();

export async function POST(request: Request) {
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
        results: results
      }
    });

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