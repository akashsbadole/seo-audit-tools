import { NextResponse } from 'next/server';

async function fetchYouTubeSuggestions(keyword: string): Promise<string[]> {
  try {
    const response = await fetch(
      `http://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=${encodeURIComponent(keyword)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      }
    );
    const text = await response.text();
    // Handle JSONP response by extracting the JSON part
    const jsonStr = text.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
    const data = JSON.parse(jsonStr);
    return data[1] || [];
  } catch (error) {
    console.error('Error fetching YouTube suggestions:', error);
    return [];
  }
}

async function fetchGoogleSuggestions(keyword: string): Promise<string[]> {
  try {
    const response = await fetch(
      `http://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(keyword)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      }
    );
    const data = await response.json();
    return data[1] || [];
  } catch (error) {
    console.error('Error fetching Google suggestions:', error);
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');
  const platform = searchParams.get('platform');

  if (!keyword) {
    return NextResponse.json(
      { error: 'Keyword parameter is required' },
      { status: 400 }
    );
  }

  let suggestions: string[] = [];

  switch (platform) {
    case 'youtube':
      suggestions = await fetchYouTubeSuggestions(keyword);
      break;
    case 'google':
      suggestions = await fetchGoogleSuggestions(keyword);
      break;
    // Add more platform cases here as needed
    default:
      suggestions = await fetchGoogleSuggestions(keyword);
  }

  // Ensure we return at least 20 related keywords by combining with Google suggestions if needed
  if (suggestions.length < 20 && platform !== 'google') {
    const googleSuggestions = await fetchGoogleSuggestions(keyword);
    const combinedSuggestions = new Set([...suggestions, ...googleSuggestions]);
    suggestions = Array.from(combinedSuggestions);
  }

  return NextResponse.json({ suggestions });
} 