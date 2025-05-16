import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import * as cheerio from 'cheerio';

interface HeaderTag {
  level: number;
  text: string;
  hasKeyword: boolean;
  issues: string[];
}

interface InternalLink {
  url: string;
  sourceUrl: string;
  anchorText: string;
  statusCode: number;
  error?: string;
  isInternal?: boolean;
}

interface RobotsTxtConfig {
  userAgents: string[];
  allowPaths: string[];
  disallowPaths: string[];
  sitemapUrl: string;
  crawlDelay: number;
  customRules: string[];
}

interface MetaTagsResult {
  title: string;
  description: string;
  keywords: string[];
}

interface KeywordDensityResult {
  keywords: Array<{
    word: string;
    count: number;
    density: number;
  }>;
}

interface HeaderTagsResult {
  headers: HeaderTag[];
}

interface InternalLinksResult {
  links: InternalLink[];
}

interface AltTextResult {
  images: {
    src: string;
    alt: string | null;
    issues: string[];
  }[];
}

interface RobotsTxtResult {
  content: string;
}

interface SitemapResult {
  content: string;
  source: string;
  urlCount?: number;
}

interface SEOScoreResult {
  score: {
    overall: number;
    categories: {
      technical: number;
      content: number;
      performance: number;
      accessibility: number;
    };
    issues: {
      critical: string[];
      warning: string[];
      info: string[];
    };
  };
}

interface ReadabilityResult {
  score: {
    overall: number;
    metrics: {
      fleschKincaid: number;
      gunningFog: number;
      colemanLiau: number;
      smog: number;
      automatedReadability: number;
    };
    suggestions: string[];
    wordCount: number;
    sentenceCount: number;
    paragraphCount: number;
    averageWordsPerSentence: number;
  };
}

interface PreviewResult {
  preview: {
    title?: string;
    description?: string;
    length: number;
    issues: string[];
    preview: {
      desktop: string;
      mobile: string;
    };
    sentiment: {
      score: number;
      label: string;
    };
    keywords: {
      word: string;
      count: number;
      density: number;
    }[];
    readability: {
      score: number;
      level: string;
    };
  };
}

interface StructuredDataResult {
  validation: {
    valid: boolean;
    type: string;
    issues: Array<{
      severity: string;
      message: string;
      path: string;
    }>;
    preview: {
      json: any;
      formatted: string;
    };
  };
}

interface CanonicalURLResult {
  check: {
    hasCanonical: boolean;
    canonicalUrl: string | null;
    isSelfReferencing: boolean;
    isAbsolute: boolean;
    matchesCurrentUrl: boolean;
    issues: Array<{
      severity: string;
      message: string;
    }>;
  };
}

type ToolResult =
  | MetaTagsResult
  | KeywordDensityResult
  | HeaderTagsResult
  | InternalLinksResult
  | AltTextResult
  | RobotsTxtResult
  | SitemapResult
  | SEOScoreResult
  | ReadabilityResult
  | PreviewResult
  | StructuredDataResult
  | CanonicalURLResult;

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Rate limiting and retry configuration
const RATE_LIMIT_DELAY = 1000; // 1 second delay between requests
const MAX_RETRIES = 3; // Maximum number of retries per URL
const RETRY_DELAY = 2000; // 2 seconds delay between retries

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<Response> {
  try {
    const response = await fetch(url);
    if (response.status === 429) { // Too Many Requests
      if (retries > 0) {
        console.log(`Rate limited, retrying in ${RETRY_DELAY}ms... (${retries} retries left)`);
        await delay(RETRY_DELAY);
        return fetchWithRetry(url, retries - 1);
      }
      throw new Error('Rate limit exceeded after all retries');
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      console.log(`Failed to fetch, retrying in ${RETRY_DELAY}ms... (${retries} retries left)`);
      await delay(RETRY_DELAY);
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { toolType, url, customTitle, customDescription, customJson, config } = await request.json();

    if (!toolType || !url) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Validate tool type
    const validToolTypes = [
      "META_TAGS",
      "KEYWORD_DENSITY",
      "HEADER_TAGS",
      "INTERNAL_LINKS",
      "ALT_TEXT",
      "BROKEN_LINKS",
      "ROBOTS_TXT",
      "SITEMAP",
      "SEO_SCORE",
      "READABILITY",
      "TITLE_PREVIEW",
      "DESCRIPTION_PREVIEW",
      "STRUCTURED_DATA",
      "CANONICAL_URL",
      "MOBILE_FRIENDLY"
    ];

    if (!validToolTypes.includes(toolType)) {
      return new Response("Invalid tool type", { status: 400 });
    }

    // Validate URL
    if (!url || !isValidUrl(url)) {
      return new Response("Invalid URL", { status: 400 });
    }

    // Process the tool request
    let result: ToolResult;
    switch (toolType) {
      case "META_TAGS":
        result = await processMetaTags(url, customTitle, customDescription);
        break;
      case "KEYWORD_DENSITY":
        result = await processKeywordDensity(url);
        break;
      case "HEADER_TAGS":
        result = await processHeaderTags(url);
        break;
      case "INTERNAL_LINKS":
        result = await processInternalLinks(url);
        break;
      case "ALT_TEXT":
        result = await processAltText(url);
        break;
      case "BROKEN_LINKS":
        result = await processBrokenLinks(url);
        break;
      case "ROBOTS_TXT":
        result = await processRobotsTxt(url, config);
        break;
      case "SITEMAP":
        result = await processSitemap(url);
        break;
      case "SEO_SCORE":
        result = await processSEOScore(url);
        break;
      case "READABILITY":
        result = await processReadability(url);
        break;
      case "TITLE_PREVIEW":
        result = await processTitlePreview(url, customTitle);
        break;
      case "DESCRIPTION_PREVIEW":
        result = await processDescriptionPreview(url, customDescription, config?.sitemapUrl, config);
        break;
      case "STRUCTURED_DATA":
        result = await processStructuredData(url, customJson);
        break;
      case "CANONICAL_URL":
        result = await processCanonicalURL(url);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid tool type" },
          { status: 400 }
        );
    }

    // Return the result directly without saving to database
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing tool request:", error);
    return new Response("Internal server error", { status: 500 });
  }
}

// Tool processing functions
async function processMetaTags(url: string, customTitle?: string, customDescription?: string) {
  // TODO: Implement meta tag analysis
  return {
    title: "Sample Title",
    description: "Sample Description",
    keywords: ["sample", "keywords"],
  };
}

async function processKeywordDensity(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();

    // Remove HTML tags and convert to lowercase
    const text = html.replace(/<[^>]*>/g, ' ').toLowerCase();

    // Split into words and remove special characters
    const words = text.split(/\W+/).filter(word => word.length > 2);

    // Count word frequency
    const wordCount: { [key: string]: number } = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // Calculate density
    const totalWords = words.length;
    const keywords = Object.entries(wordCount)
      .map(([word, count]) => ({
        word,
        count,
        density: (count / totalWords) * 100
      }))
      .filter(item => item.count > 1) // Only include words that appear more than once
      .sort((a, b) => b.count - a.count) // Sort by frequency
      .slice(0, 20); // Get top 20 keywords

    return { keywords };
  } catch (error) {
    console.error("Error processing keyword density:", error);
    throw new Error("Failed to analyze keyword density");
  }
}

async function processHeaderTags(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();

    // Use cheerio instead of DOMParser
    const cheerio = require('cheerio');
    const $ = cheerio.load(html);

    // Get all header tags
    const headers: HeaderTag[] = [];
    let previousLevel = 0;

    // Process headers in document order
    $('h1, h2, h3, h4, h5, h6').each((i: number, element: any) => {
      const tagName = element.tagName.toLowerCase();
      const level = parseInt(tagName.substring(1));
      const text = $(element).text().trim();
      const issues: string[] = [];

      // Check for common issues
      if (text.length === 0) {
        issues.push("Empty header");
      }
      if (text.length > 70) {
        issues.push("Header is too long");
      }
      if (level === 1 && headers.filter(h => h.level === 1).length > 0) {
        issues.push("Multiple H1 tags found");
      }
      if (level > 1 && level > previousLevel + 1) {
        issues.push("Header hierarchy is broken (skipped level)");
      }

      headers.push({
        level,
        text,
        hasKeyword: false, // This could be enhanced with keyword checking
        issues
      });

      previousLevel = level;
    });

    return { headers };
  } catch (error) {
    console.error("Error processing header tags:", error);
    throw new Error("Failed to analyze header tags");
  }
}

async function processInternalLinks(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const links: InternalLink[] = [];
    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (!href) return;

      try {
        const absoluteUrl = href.startsWith('http') ? href : new URL(href, url).href;
        const isInternal = new URL(absoluteUrl).hostname === new URL(url).hostname;

        links.push({
          url: absoluteUrl,
          sourceUrl: url,
          anchorText: $(element).text().trim(),
          statusCode: 200,
          isInternal
        });
      } catch (error) {
        links.push({
          url: href,
          sourceUrl: url,
          anchorText: $(element).text().trim(),
          statusCode: 0,
          error: error instanceof Error ? error.message : 'Invalid URL'
        });
      }
    });

    return { links };
  } catch (error) {
    console.error("Error processing internal links:", error);
    throw new Error("Failed to analyze internal links");
  }
}

async function processAltText(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();

    // Use cheerio instead of DOMParser
    const cheerio = require('cheerio');
    const $ = cheerio.load(html);

    // Get all images
    const images = $('img').map((i: number, img: any) => {
      const $img = $(img);
      const src = $img.attr('src') || '';
      const alt = $img.attr('alt') || '';
      const width = $img.attr('width') ? parseInt($img.attr('width')) : undefined;
      const height = $img.attr('height') ? parseInt($img.attr('height')) : undefined;

      const issues: string[] = [];
      if (!alt) issues.push("Missing alt text");
      if (alt.length < 3) issues.push("Alt text too short");
      if (alt.length > 125) issues.push("Alt text too long");
      if (!width || !height) issues.push("Missing dimensions");

      return {
        src,
        alt,
        width,
        height,
        hasAlt: !!alt,
        isDecorative: alt === '' && $img.attr('role') === 'presentation',
        issues
      };
    }).get();

    return { images };
  } catch (error) {
    console.error("Error processing alt text:", error);
    throw new Error("Failed to analyze image alt text");
  }
}

async function processBrokenLinks(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);

    // Get all links
    const links = $('a').map((_, element) => {
      const $link = $(element);
      const href = $link.attr('href');
      const text = $link.text().trim();

      return {
        url: href || '',
        sourceUrl: url,
        anchorText: text,
        isInternal: href?.startsWith('/') || href?.startsWith(url),
        statusCode: 0,
        error: ''
      };
    }).get().filter(link => link.url); // Remove links without URLs

    // Check each link
    const checkedLinks = await Promise.all(
      links.map(async (link) => {
        if (!link.url) return null;
        try {
          const fullUrl = link.url.startsWith('/')
            ? new URL(link.url, url).toString()
            : link.url;

          const response = await fetch(fullUrl);
          if (!response.ok) {
            return {
              ...link,
              statusCode: response.status,
              error: `HTTP ${response.status}: ${response.statusText}`
            };
          }
          return null; // Skip working links
        } catch (error) {
          return {
            ...link,
            statusCode: 0,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      })
    );

    // Filter out null values (working links)
    const brokenLinks = checkedLinks.filter((link): link is NonNullable<typeof link> => link !== null);

    return { links: brokenLinks };
  } catch (error) {
    console.error("Error processing broken links:", error);
    throw new Error("Failed to analyze broken links");
  }
}

async function processRobotsTxt(url: string, config?: RobotsTxtConfig) {
  try {
    if (!config) {
      // If no config is provided, try to fetch existing robots.txt
      const robotsTxtUrl = new URL('/robots.txt', url).href;
      const response = await fetch(robotsTxtUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch robots.txt: ${response.status} ${response.statusText}`);
      }

      const content = await response.text();
      return { content };
    }

    // Generate robots.txt based on provided configuration
    let content = '';

    // Add User-agents and their rules
    config.userAgents.forEach((agent) => {
      if (agent) {
        content += `User-agent: ${agent}\n`;

        // Add crawl delay if specified
        if (config.crawlDelay > 0) {
          content += `Crawl-delay: ${config.crawlDelay}\n`;
        }

        // Add allow rules
        config.allowPaths.forEach((path) => {
          if (path) {
            content += `Allow: ${path}\n`;
          }
        });

        // Add disallow rules
        config.disallowPaths.forEach((path) => {
          if (path) {
            content += `Disallow: ${path}\n`;
          }
        });

        content += '\n';
      }
    });

    // Add sitemap if specified
    if (config.sitemapUrl) {
      content += `Sitemap: ${config.sitemapUrl}\n\n`;
    }

    // Add custom rules
    config.customRules.forEach((rule) => {
      if (rule) {
        content += `${rule}\n`;
      }
    });

    return { content: content.trim() };
  } catch (error) {
    console.error("Error processing robots.txt:", error);
    throw new Error("Failed to generate robots.txt");
  }
}

async function processSitemap(url: string) {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

  async function fetchWithBasicRetry(url: string): Promise<Response> {
    let lastError;
    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; SEOAuditBot/1.0; +http://localhost)'
          }
        });

        // If we get a success response or an error that's not rate limiting, return it
        if (response.ok || response.status !== 429) {
          return response;
        }

        // If we get rate limited, wait before retrying
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (i + 1)));
        continue;
      } catch (error) {
        lastError = error;
        // Only retry on network errors
        if (error instanceof TypeError) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (i + 1)));
          continue;
        }
        throw error;
      }
    }
    throw lastError || new Error('Failed to fetch after retries');
  }

  try {
    // First try to fetch sitemap.xml directly
    try {
      const sitemapUrl = new URL('/sitemap.xml', url).href;
      const response = await fetchWithBasicRetry(sitemapUrl);
      if (response.ok) {
        const sitemap = await response.text();
        return {
          content: sitemap,
          source: 'existing_sitemap'
        };
      }
    } catch (error) {
      console.log('No existing sitemap.xml found, generating basic one');
    }

    // If no sitemap.xml exists, generate a basic one from the current page
    const response = await fetchWithBasicRetry(url);
    if (!response.ok) {
      throw new Error(
        response.status === 429
          ? "Website is rate limiting requests. Please try again later."
          : `Failed to access website: ${response.status} ${response.statusText}`
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Get all unique internal links without verification
    const urls = new Set<string>();
    urls.add(url); // Add the main URL

    // Collect all links without verifying them
    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (!href) return;

      try {
        // Handle relative and absolute URLs
        const absoluteUrl = href.startsWith('http') ? href : new URL(href, url).href;
        const urlObj = new URL(absoluteUrl);

        // Only include URLs from the same domain
        if (urlObj.hostname === new URL(url).hostname) {
          urls.add(absoluteUrl);
        }
      } catch (error) {
        // Skip invalid URLs
        console.log(`Skipping invalid URL: ${href}`);
      }
    });

    // Generate XML sitemap
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    urls.forEach(pageUrl => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${pageUrl}</loc>\n`;
      sitemap += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      sitemap += '    <changefreq>weekly</changefreq>\n';
      sitemap += '    <priority>0.8</priority>\n';
      sitemap += '  </url>\n';
    });

    sitemap += '</urlset>';

    return {
      content: sitemap,
      source: 'generated',
      urlCount: urls.size
    };
  } catch (error) {
    console.error("Error processing sitemap:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to generate sitemap: ${errorMessage}`);
  }
}

async function processSEOScore(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();

    // Use cheerio instead of DOMParser
    const $ = cheerio.load(html);

    // Initialize scores and issues
    const score = {
      overall: 0,
      categories: {
        technical: 0,
        content: 0,
        performance: 0,
        accessibility: 0
      },
      issues: {
        critical: [] as string[],
        warning: [] as string[],
        info: [] as string[]
      }
    };

    // Technical SEO Checks
    let technicalScore = 100;
    const technicalIssues: string[] = [];

    // Check meta tags
    const title = $('title').text();
    if (!title) {
      technicalScore -= 20;
      technicalIssues.push("Missing title tag");
    } else if (title.length < 10 || title.length > 60) {
      technicalScore -= 10;
      technicalIssues.push("Title length is not optimal");
    }

    const metaDesc = $('meta[name="description"]').attr('content');
    if (!metaDesc) {
      technicalScore -= 20;
      technicalIssues.push("Missing meta description");
    } else if (metaDesc.length < 50 || metaDesc.length > 160) {
      technicalScore -= 10;
      technicalIssues.push("Meta description length is not optimal");
    }

    // Check canonical URL
    const canonical = $('link[rel="canonical"]').attr('href');
    if (!canonical) {
      technicalScore -= 15;
      technicalIssues.push("Missing canonical URL");
    }

    // Content Quality Checks
    let contentScore = 100;
    const contentIssues: string[] = [];

    // Check headings
    const h1s = $('h1');
    if (h1s.length === 0) {
      contentScore -= 20;
      contentIssues.push("Missing H1 tag");
    } else if (h1s.length > 1) {
      contentScore -= 10;
      contentIssues.push("Multiple H1 tags found");
    }

    // Check content length
    const bodyText = $('body').text();
    const wordCount = bodyText.trim().split(/\s+/).length;
    if (wordCount < 300) {
      contentScore -= 20;
      contentIssues.push("Content is too short");
    }

    // Performance Checks
    let performanceScore = 100;
    const performanceIssues: string[] = [];

    // Check images
    const images = $('img');
    images.each((_, img) => {
      if (!$(img).attr('width') || !$(img).attr('height')) {
        performanceScore -= 5;
        performanceIssues.push("Images missing dimensions");
        return false; // break the loop after first occurrence
      }
    });

    // Accessibility Checks
    let accessibilityScore = 100;
    const accessibilityIssues: string[] = [];

    // Check image alt texts
    images.each((_, img) => {
      if (!$(img).attr('alt')) {
        accessibilityScore -= 10;
        accessibilityIssues.push("Images missing alt text");
        return false; // break the loop after first occurrence
      }
    });

    // Check ARIA labels
    const elementsWithAria = $('[aria-label]');
    if (elementsWithAria.length === 0) {
      accessibilityScore -= 10;
      accessibilityIssues.push("No ARIA labels found");
    }

    // Update scores
    score.categories.technical = Math.max(0, technicalScore);
    score.categories.content = Math.max(0, contentScore);
    score.categories.performance = Math.max(0, performanceScore);
    score.categories.accessibility = Math.max(0, accessibilityScore);

    // Calculate overall score
    score.overall = Math.round(
      (score.categories.technical +
        score.categories.content +
        score.categories.performance +
        score.categories.accessibility) /
      4
    );

    // Categorize issues
    technicalIssues.forEach(issue => {
      if (issue.includes("Missing")) {
        score.issues.critical.push(issue);
      } else {
        score.issues.warning.push(issue);
      }
    });

    contentIssues.forEach(issue => {
      if (issue.includes("Missing")) {
        score.issues.critical.push(issue);
      } else {
        score.issues.warning.push(issue);
      }
    });

    performanceIssues.forEach(issue => {
      score.issues.warning.push(issue);
    });

    accessibilityIssues.forEach(issue => {
      if (issue.includes("Missing")) {
        score.issues.critical.push(issue);
      } else {
        score.issues.warning.push(issue);
      }
    });

    // Add general suggestions
    if (score.overall < 90) {
      score.issues.info.push("Consider implementing structured data");
      score.issues.info.push("Optimize page load speed");
      score.issues.info.push("Improve mobile responsiveness");
    }

    return { score };
  } catch (error) {
    console.error("Error processing SEO score:", error);
    throw new Error("Failed to calculate SEO score");
  }
}

async function processReadability(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();

    // Use cheerio instead of DOMParser
    const $ = cheerio.load(html);

    // Get main content
    const mainContent = $('main, article, .content, #content').first().length ?
      $('main, article, .content, #content').first() :
      $('body');
    const text = mainContent.text();

    // Basic text statistics
    const words = text.trim().split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    const wordCount = words.length;
    const sentenceCount = sentences.length;
    const paragraphCount = paragraphs.length;
    const averageWordsPerSentence = wordCount / sentenceCount;

    // Calculate readability metrics
    const syllables = words.reduce((count, word) => count + countSyllables(word), 0);

    // Flesch-Kincaid Grade Level
    const fleschKincaid = 0.39 * (wordCount / sentenceCount) + 11.8 * (syllables / wordCount) - 15.59;

    // Gunning Fog Index
    const complexWords = words.filter(word => countSyllables(word) > 2).length;
    const gunningFog = 0.4 * ((wordCount / sentenceCount) + 100 * (complexWords / wordCount));

    // Coleman-Liau Index
    const letters = words.join('').length;
    const colemanLiau = 0.0588 * (letters / wordCount * 100) - 0.296 * (sentenceCount / wordCount * 100) - 15.8;

    // SMOG Index
    const smog = 1.043 * Math.sqrt(complexWords * (30 / sentenceCount)) + 3.1291;

    // Automated Readability Index
    const automatedReadability = 4.71 * (letters / wordCount) + 0.5 * (wordCount / sentenceCount) - 21.43;

    // Calculate overall score (0-100)
    const overall = Math.min(100, Math.max(0, 100 - (
      Math.abs(fleschKincaid - 8) * 5 + // Target grade level 8
      Math.abs(gunningFog - 12) * 3 + // Target fog index 12
      Math.abs(colemanLiau - 10) * 4 + // Target grade level 10
      Math.abs(smog - 8) * 5 + // Target grade level 8
      Math.abs(automatedReadability - 8) * 4 // Target grade level 8
    )));

    // Generate suggestions
    const suggestions: string[] = [];

    if (averageWordsPerSentence > 20) {
      suggestions.push("Consider breaking down long sentences into shorter ones");
    }

    if (complexWords / wordCount > 0.2) {
      suggestions.push("Try to use simpler words where possible");
    }

    if (paragraphCount < 3) {
      suggestions.push("Consider breaking content into more paragraphs");
    }

    if (wordCount < 300) {
      suggestions.push("Content might be too short for comprehensive analysis");
    }

    return {
      score: {
        overall,
        metrics: {
          fleschKincaid,
          gunningFog,
          colemanLiau,
          smog,
          automatedReadability
        },
        suggestions,
        wordCount,
        sentenceCount,
        paragraphCount,
        averageWordsPerSentence
      }
    };
  } catch (error) {
    console.error("Error processing readability:", error);
    throw new Error("Failed to analyze readability");
  }
}

async function processTitlePreview(url: string, customTitle?: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Get title
    const title = customTitle || $('title').text() || '';
    const length = title.length;

    // Generate previews
    const desktopPreview = length > 60 ? title.substring(0, 60) + '...' : title;
    const mobilePreview = length > 40 ? title.substring(0, 40) + '...' : title;

    // Check for issues
    const issues: string[] = [];

    if (length === 0) {
      issues.push("Title tag is empty");
    } else if (length < 30) {
      issues.push("Title is too short (recommended: 30-60 characters)");
    } else if (length > 60) {
      issues.push("Title is too long (recommended: 30-60 characters)");
    }

    if (!title.includes(' ')) {
      issues.push("Title should contain multiple words");
    }

    if (title === title.toUpperCase()) {
      issues.push("Avoid using all caps in title");
    }

    if (title.includes('|') || title.includes('>>') || title.includes('<<')) {
      issues.push("Avoid using special characters as separators");
    }

    if (title.startsWith('Welcome to') || title.startsWith('Home')) {
      issues.push("Avoid generic title beginnings");
    }

    // Calculate sentiment
    const sentiment = analyzeSentiment(title);

    // Calculate readability
    const readability = calculateReadability(title);

    // Analyze keywords
    const words = title.toLowerCase().split(/\s+/);
    const wordFrequency: { [key: string]: number } = {};
    words.forEach(word => {
      if (word.length > 3) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });

    const keywords = Object.entries(wordFrequency)
      .map(([word, count]) => ({
        word,
        count,
        density: (count / words.length) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      preview: {
        title,
        length,
        issues,
        preview: {
          desktop: desktopPreview,
          mobile: mobilePreview
        },
        sentiment,
        keywords,
        readability
      }
    };
  } catch (error) {
    console.error("Error processing title preview:", error);
    throw new Error("Failed to analyze title tag");
  }
}

async function processDescriptionPreview(url: string, customDescription?: string, targetKeywords?: string, options?: { showEmojis: boolean; autoOptimize: boolean }) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Get description
    let description = customDescription || $('meta[name="description"]').attr('content') || '';
    const length = description.length;

    // Auto-optimize if enabled
    if (options?.autoOptimize) {
      description = autoOptimizeDescription(description);
    }

    // Add emojis if enabled
    if (options?.showEmojis) {
      description = addRelevantEmojis(description);
    }

    // Generate previews
    const desktopPreview = length > 160 ? description.substring(0, 160) + '...' : description;
    const mobilePreview = length > 120 ? description.substring(0, 120) + '...' : description;

    // Check for issues
    const issues: string[] = [];

    if (length === 0) {
      issues.push("Meta description is empty");
    } else if (length < 50) {
      issues.push("Description is too short (recommended: 50-160 characters)");
    } else if (length > 160) {
      issues.push("Description is too long (recommended: 50-160 characters)");
    }

    if (!description.includes(' ')) {
      issues.push("Description should contain multiple words");
    }

    if (description === description.toUpperCase()) {
      issues.push("Avoid using all caps in description");
    }

    if (description.includes('Click here') || description.includes('Read more')) {
      issues.push("Avoid using generic call-to-action phrases");
    }

    if (description.includes('...') || description.includes('>>')) {
      issues.push("Avoid using ellipsis or special characters");
    }

    // Analyze keywords
    const words = description.toLowerCase().split(/\s+/);
    const wordFrequency: { [key: string]: number } = {};
    words.forEach(word => {
      if (word.length > 3) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });

    // Calculate keyword density and check for stuffing
    const keywords = Object.entries(wordFrequency)
      .map(([word, count]) => ({
        word,
        count,
        density: (count / words.length) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Check target keywords presence
    if (targetKeywords) {
      const targetKeywordsList = targetKeywords.toLowerCase().split(',').map(k => k.trim());
      const missingKeywords = targetKeywordsList.filter(keyword =>
        !description.toLowerCase().includes(keyword)
      );

      if (missingKeywords.length > 0) {
        issues.push(`Missing target keywords: ${missingKeywords.join(', ')}`);
      }
    }

    // Calculate sentiment
    const sentiment = analyzeSentiment(description);

    // Calculate readability
    const readability = calculateReadability(description);

    return {
      preview: {
        description,
        length,
        issues,
        preview: {
          desktop: desktopPreview,
          mobile: mobilePreview
        },
        sentiment,
        keywords,
        readability
      }
    };
  } catch (error) {
    console.error("Error processing description preview:", error);
    throw new Error("Failed to analyze meta description");
  }
}

// Helper function to auto-optimize description
function autoOptimizeDescription(description: string): string {
  let optimized = description;

  // Remove multiple spaces
  optimized = optimized.replace(/\s+/g, ' ').trim();

  // Capitalize first letter of sentences
  optimized = optimized.replace(/(^\w|\.\s+\w)/g, letter => letter.toUpperCase());

  // Remove redundant punctuation
  optimized = optimized.replace(/[!?.,]+(?=[!?.,])/g, '');

  // Ensure it ends with proper punctuation
  if (!optimized.match(/[.!?]$/)) {
    optimized += '.';
  }

  return optimized;
}

// Helper function to add relevant emojis
function addRelevantEmojis(description: string): string {
  const emojiMap: { [key: string]: string } = {
    'best': '⭐',
    'new': '🆕',
    'save': '💰',
    'free': '🎁',
    'fast': '⚡',
    'secure': '🔒',
    'learn': '📚',
    'guide': '📖',
    'tips': '💡',
    'expert': '👨‍💼',
    'professional': '👨‍💼',
    'guarantee': '✅',
    'certified': '✔️',
    'award': '🏆',
    'winning': '🏆',
    'top': '🔝',
    'premium': '💎',
    'exclusive': '💫',
    'trending': '📈',
    'popular': '🔥'
  };

  let result = description;
  Object.entries(emojiMap).forEach(([keyword, emoji]) => {
    if (result.toLowerCase().includes(keyword)) {
      // Add emoji at the end to not disrupt the text
      result = result.trim() + ' ' + emoji;
    }
  });

  return result;
}

// Helper function to analyze sentiment
function analyzeSentiment(text: string): { score: number; label: string } {
  const positiveWords = new Set([
    'best', 'amazing', 'awesome', 'excellent', 'great', 'perfect',
    'innovative', 'leading', 'premium', 'professional', 'expert',
    'trusted', 'reliable', 'proven', 'guaranteed', 'exclusive'
  ]);

  const negativeWords = new Set([
    'bad', 'poor', 'worst', 'terrible', 'avoid', 'never',
    'problem', 'issue', 'difficult', 'hard', 'complicated',
    'expensive', 'costly', 'risky', 'dangerous', 'unreliable'
  ]);

  const words = text.toLowerCase().split(/\s+/);
  let score = 0;

  words.forEach(word => {
    if (positiveWords.has(word)) score += 1;
    if (negativeWords.has(word)) score -= 1;
  });

  let label;
  if (score > 2) label = 'Very Positive';
  else if (score > 0) label = 'Positive';
  else if (score === 0) label = 'Neutral';
  else if (score > -2) label = 'Negative';
  else label = 'Very Negative';

  return { score, label };
}

// Helper function to calculate readability
function calculateReadability(text: string): { score: number; level: string } {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.trim().length > 0);
  const syllables = words.reduce((count, word) => count + countSyllables(word), 0);

  // Flesch Reading Ease score
  const score = 206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (syllables / words.length);

  let level;
  if (score >= 90) level = 'Very Easy';
  else if (score >= 80) level = 'Easy';
  else if (score >= 70) level = 'Fairly Easy';
  else if (score >= 60) level = 'Standard';
  else if (score >= 50) level = 'Fairly Difficult';
  else if (score >= 30) level = 'Difficult';
  else level = 'Very Difficult';

  return { score, level };
}

async function processStructuredData(url: string, customJson?: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Get all script tags with type="application/ld+json"
    const jsonLdScripts = $('script[type="application/ld+json"]').toArray();

    let jsonData;
    if (customJson) {
      try {
        jsonData = JSON.parse(customJson);
      } catch (error) {
        throw new Error("Invalid JSON format in custom input");
      }
    } else if (jsonLdScripts.length > 0) {
      try {
        jsonData = JSON.parse($(jsonLdScripts[0]).text() || "{}");
      } catch (error) {
        throw new Error("Invalid JSON-LD format found on page");
      }
    } else {
      throw new Error("No structured data found on page");
    }

    // Basic validation
    const issues = [];
    let type = "";

    // Check for @type
    if (!jsonData["@type"]) {
      issues.push({
        severity: "error",
        message: "Missing @type property",
        path: "@type"
      });
    } else {
      type = jsonData["@type"];
    }

    // Check for @context
    if (!jsonData["@context"]) {
      issues.push({
        severity: "warning",
        message: "Missing @context property",
        path: "@context"
      });
    } else if (jsonData["@context"] !== "https://schema.org") {
      issues.push({
        severity: "warning",
        message: "Non-standard @context value",
        path: "@context"
      });
    }

    // Validate required properties based on type
    if (type === "Article") {
      if (!jsonData.headline) {
        issues.push({
          severity: "error",
          message: "Article must have a headline",
          path: "headline"
        });
      }
      if (!jsonData.datePublished) {
        issues.push({
          severity: "warning",
          message: "Article should have a publication date",
          path: "datePublished"
        });
      }
    } else if (type === "Product") {
      if (!jsonData.name) {
        issues.push({
          severity: "error",
          message: "Product must have a name",
          path: "name"
        });
      }
      if (!jsonData.description) {
        issues.push({
          severity: "warning",
          message: "Product should have a description",
          path: "description"
        });
      }
    }

    return {
      validation: {
        valid: issues.filter(i => i.severity === "error").length === 0,
        type,
        issues,
        preview: {
          json: jsonData,
          formatted: JSON.stringify(jsonData, null, 2)
        }
      }
    };
  } catch (error) {
    console.error("Error processing structured data:", error);
    throw error;
  }
}

async function processCanonicalURL(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Find canonical link
    const canonicalLink = $('link[rel="canonical"]');
    const canonicalUrl = canonicalLink.attr("href") || null;

    const issues = [];
    let isSelfReferencing = false;
    let isAbsolute = false;
    let matchesCurrentUrl = false;

    if (!canonicalUrl) {
      issues.push({
        severity: "error",
        message: "No canonical URL found"
      });
    } else {
      // Check if URL is absolute
      isAbsolute = canonicalUrl.startsWith("http://") || canonicalUrl.startsWith("https://");
      if (!isAbsolute) {
        issues.push({
          severity: "warning",
          message: "Canonical URL should be absolute"
        });
      }

      // Check if URL is self-referencing
      const currentUrl = new URL(url);
      const canonicalUrlObj = new URL(canonicalUrl, currentUrl.origin);
      isSelfReferencing = canonicalUrlObj.toString() === currentUrl.toString();
      if (!isSelfReferencing) {
        issues.push({
          severity: "warning",
          message: "Canonical URL points to a different URL"
        });
      }

      // Check if URL matches current URL
      matchesCurrentUrl = canonicalUrl === url;
      if (!matchesCurrentUrl) {
        issues.push({
          severity: "info",
          message: "Canonical URL differs from current URL"
        });
      }
    }

    return {
      check: {
        hasCanonical: !!canonicalUrl,
        canonicalUrl,
        isSelfReferencing,
        isAbsolute,
        matchesCurrentUrl,
        issues
      }
    };
  } catch (error) {
    console.error("Error processing canonical URL:", error);
    throw error;
  }
}

// Helper function to count syllables
function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;

  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace('^y', '');

  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
} 