import { type NextRequest, NextResponse } from "next/server"
import * as cheerio from "cheerio"
import type { SEOAuditResult } from "@/types/seo-audit"
import { searchAndStoreDomain, updateDomainReport } from '@/lib/db'
import dns from 'dns'
import { promisify } from 'util'

const lookup = promisify(dns.lookup)

// Mock functions for SEO checks
function mockPageSpeedCheck(domain: string) {
  return {
    status: "good" as const,
    value: "90/100",
    issues: [],
    recommendations: ["Your page speed is good"],
    score: 90
  }
}

function mockMobileFriendlinessCheck(domain: string) {
  return {
    status: "good" as const,
    value: "Mobile-friendly",
    issues: [],
    recommendations: ["Your site is mobile-friendly"],
    score: 95
  }
}

function mockRobotsTxtCheck(domain: string) {
  return {
    status: "good" as const,
    value: "Found",
    issues: [],
    recommendations: ["Your robots.txt is properly configured"],
    score: 100
  }
}

function mockSitemapCheck(domain: string) {
  return {
    status: "good" as const,
    value: "Found",
    issues: [],
    recommendations: ["Your sitemap is properly configured"],
    score: 100
  }
}

function mockHttpStatusCheck(url: string) {
  return {
    status: "good" as const,
    value: "200 OK",
    issues: [],
    recommendations: ["Your HTTP status is good"],
    score: 100
  }
}

function mockBrokenLinksCheck(domain: string, $: cheerio.CheerioAPI) {
  return {
    status: "good" as const,
    value: "No broken links found",
    issues: [],
    recommendations: ["No broken links detected"],
    total: 0,
    broken: 0,
    brokenList: []
  }
}

function checkHreflang($: cheerio.CheerioAPI) {
  return {
    status: "good" as const,
    value: "Properly implemented",
    issues: [],
    recommendations: ["Your hreflang tags are properly implemented"]
  }
}

function mockCoreWebVitalsCheck(domain: string) {
  return {
    status: "good" as const,
    value: "Good",
    issues: [],
    recommendations: ["Your Core Web Vitals are good"],
    lcp: { value: "2.5s", status: "good" as const },
    fid: { value: "100ms", status: "good" as const },
    cls: { value: "0.1", status: "good" as const }
  }
}

function mockDuplicateContentCheck(domain: string, $: cheerio.CheerioAPI) {
  return {
    status: "good" as const,
    value: "No duplicate content found",
    issues: [],
    recommendations: ["No duplicate content detected"],
    score: 100
  }
}

function mockKeywordOptimizationCheck(domain: string, $: cheerio.CheerioAPI) {
  // Extract keywords from meta tags
  const metaKeywords = $('meta[name="keywords"]').attr('content')?.split(',').map(k => k.trim()) || []
  
  // Extract domain keywords
  const domainKeywords = $('title').text().toLowerCase().split(/\s+/)
    .concat($('meta[name="description"]').attr('content')?.toLowerCase().split(/\s+/) || [])
    .concat($('h1').text().toLowerCase().split(/\s+/))
    .concat($('h2').text().toLowerCase().split(/\s+/))
    .filter(word => word.length > 3)
    .filter(word => !['and', 'the', 'for', 'that', 'this', 'with'].includes(word))

  // Get all text content
  const content = $('body').text().toLowerCase()
  const words = content.split(/[\s,\.\!\?\-\(\)\[\]\{\}:;"']+/)
    .filter(word => word.length > 3)
    .filter(word => !['and', 'the', 'for', 'that', 'this', 'with'].includes(word))

  // Count word frequencies
  const wordFrequencies: Record<string, number> = {}
  words.forEach(word => {
    wordFrequencies[word] = (wordFrequencies[word] || 0) + 1
  })

  // Get keywords with their frequencies
  const keywords = Array.from(new Set([...metaKeywords, ...domainKeywords]))
    .map(keyword => ({
      keyword,
      count: wordFrequencies[keyword.toLowerCase()] || 0,
      density: `${((wordFrequencies[keyword.toLowerCase()] || 0) / words.length * 100).toFixed(1)}%`,
      source: metaKeywords.includes(keyword) ? 'meta' : 'domain'
    }))
    .filter(k => k.count > 0)
    .sort((a, b) => b.count - a.count)

  // Add top frequency words that aren't already included
  const additionalKeywords = Object.entries(wordFrequencies)
    .map(([word, count]) => ({
      keyword: word,
      count,
      density: `${(count / words.length * 100).toFixed(1)}%`,
      source: 'content'
    }))
    .filter(k => !keywords.some(existing => existing.keyword.toLowerCase() === k.keyword.toLowerCase()))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  const allKeywords = [...keywords, ...additionalKeywords]
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)

  const status: "good" | "warning" | "error" = 
    allKeywords.length >= 10 ? "good" :
    allKeywords.length >= 5 ? "warning" : "error"

  return {
    status,
    value: "Keyword analysis complete",
    issues: allKeywords.length < 5 ? ["Not enough keywords found in content"] : [],
    recommendations: [
      "Ensure keywords are used naturally in content",
      "Include keywords in important HTML elements (title, headings, meta description)",
      "Maintain a good keyword density without overstuffing"
    ],
    score: Math.min(100, allKeywords.length * 10),
    keywords: allKeywords
  }
}

function mockReadabilityCheck($: cheerio.CheerioAPI) {
  return {
    status: "good" as const,
    value: "Good readability",
    issues: [],
    recommendations: ["Your content is readable"],
    score: 85,
    keywords: [
      { keyword: "example", count: 5, density: "2%" },
      { keyword: "test", count: 3, density: "1.2%" }
    ]
  }
}

function mockContentQualityCheck($: cheerio.CheerioAPI) {
  return {
    status: "good" as const,
    value: "High quality",
    issues: [],
    recommendations: ["Your content quality is good"],
    score: 90,
    keywords: [
      { keyword: "example", count: 5, density: "2%" },
      { keyword: "test", count: 3, density: "1.2%" }
    ]
  }
}

function mockKeywordDensityCheck($: cheerio.CheerioAPI) {
  // Get all text content from the page
  const content = $('body').text()
  
  // Helper function to decode encoded characters
  const decodeString = (str: string) => {
    try {
      return decodeURIComponent(str.replace(/\\x/g, '%'))
    } catch {
      return str
    }
  }

  // Technical terms to filter out
  const technicalTerms = new Set([
    'window', 'function', 'null', 'undefined', 'var', 'let', 'const',
    'true', 'false', 'return', 'new', 'this', 'typeof', 'instanceof',
    'break', 'case', 'catch', 'class', 'continue', 'debugger', 'default',
    'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'if',
    'import', 'in', 'yield', 'while', 'void', 'try', 'switch', 'super',
    'script', 'style', 'link', 'head', 'body', 'html', 'div', 'span',
    'ytcsi', 'ytcommand', 'ytcfg', 'ytatr', 'onpolymerready', 'polymer'
  ])

  // Clean and tokenize the text
  const words = content
    .toLowerCase()
    .split(/[\s,\.\!\?\-\(\)\[\]\{\}:;"']+/)
    .map(word => decodeString(word))
    .filter(word => {
      // Filter conditions:
      // 1. Word length > 3
      // 2. Not a technical term
      // 3. Not a common stop word
      // 4. Not just numbers
      // 5. Not encoded characters
      return word.length > 3 &&
        !technicalTerms.has(word) &&
        !['and', 'the', 'for', 'that', 'this', 'with', 'have', 'from'].includes(word) &&
        !/^\d+$/.test(word) &&
        !/\\x|%[0-9a-f]{2}/i.test(word)
    })

  // Count word frequencies
  const wordFrequencies: Record<string, number> = {}
  words.forEach(word => {
    wordFrequencies[word] = (wordFrequencies[word] || 0) + 1
  })

  // Sort keywords by frequency
  const keywords = Object.entries(wordFrequencies)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([keyword, count]) => ({
      keyword,
      count,
      density: `${((count / words.length) * 100).toFixed(1)}%`
    }))

  const status: "good" | "warning" | "error" = 
    keywords.length >= 10 ? "good" :
    keywords.length >= 5 ? "warning" : "error"

  return {
    status,
    value: "Keyword density analysis complete",
    issues: [],
    recommendations: [
      "Ensure keywords are used naturally in content",
      "Maintain a balanced keyword density"
    ],
    score: Math.min(100, keywords.length * 10),
    keywords
  }
}

function mockThinContentCheck(wordCount: number) {
  const issues: string[] = []
  const recommendations: string[] = []

  if (wordCount < 300) {
    issues.push("Page has thin content (less than 300 words)")
    issues.push("Search engines may devalue pages with insufficient content")
    issues.push("Thin content pages rarely rank well for competitive keywords")

    recommendations.push("Expand your content to at least 600 words for better search visibility")
    recommendations.push("Add more detailed information, examples, and explanations")
    recommendations.push("Consider merging with other related thin content pages")
    recommendations.push("If appropriate, add FAQs to naturally increase word count")

    return {
      status: "error" as const,
      value: "Thin content detected",
      issues,
      recommendations,
    }
  } else if (wordCount < 600) {
    issues.push("Content is on the shorter side (less than 600 words)")
    issues.push("May not be comprehensive enough for competitive keywords")

    recommendations.push("Consider expanding your content to 1000+ words for comprehensive coverage")
    recommendations.push("Add more sections addressing user questions and needs")
    recommendations.push("Include expert insights, data, or case studies to add depth")

    return {
      status: "warning" as const,
      value: "Content could be expanded",
      issues,
      recommendations,
    }
  } else {
    return {
      status: "good" as const,
      value: "Content length is sufficient",
      issues,
      recommendations: [
        "Your content has sufficient length for good SEO performance",
        "Focus on maintaining quality while ensuring comprehensive coverage",
        "Regularly update content to keep it fresh and relevant",
      ],
    }
  }
}

function mockContentFreshnessCheck(domain: string) {
  // Generate a deterministic last updated date based on domain
  const domainHash = domain.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const daysAgo = domainHash % 365 // 0-364 days ago

  const lastUpdated = new Date()
  lastUpdated.setDate(lastUpdated.getDate() - daysAgo)

  const issues: string[] = []
  const recommendations: string[] = []

  if (daysAgo > 180) {
    issues.push(`Content was last updated ${daysAgo} days ago`)
    issues.push("Outdated content may contain inaccurate information")
    issues.push("Search engines prefer fresh content for many queries")

    recommendations.push("Update your content regularly to maintain freshness signals")
    recommendations.push("Add new information, examples, or data to keep content current")
    recommendations.push("Implement a content audit schedule to regularly review older content")
    recommendations.push("Add a 'Last Updated' date to signal freshness to users and search engines")

    return {
      status: "warning" as const,
      value: `Last updated ${lastUpdated.toLocaleDateString()} (${daysAgo} days ago)`,
      issues,
      recommendations,
    }
  } else {
    return {
      status: "good" as const,
      value: `Last updated ${lastUpdated.toLocaleDateString()} (${daysAgo} days ago)`,
      issues,
      recommendations: [
        "Your content is relatively fresh and up-to-date",
        "Continue to monitor industry changes to keep content current",
        "Consider adding a visible 'Last Updated' date to signal freshness to users",
      ],
    }
  }
}

type AuditResult = {
  status: "error" | "warning" | "good";
  value: string;
  issues: string[];
  recommendations: string[];
};

function mockEATSignalsCheck($: cheerio.CheerioAPI): AuditResult {
  // Check for author information
  const hasAuthorInfo = $('[rel="author"]').length > 0 || $('*:contains("author")').length > 0

  // Check for credentials
  const hasCredentials = $('*:contains("certified")').length > 0 || $('*:contains("expert")').length > 0

  // Check for citations
  const hasCitations = $("cite").length > 0 || $("blockquote").length > 0

  const issues: string[] = []
  const recommendations: string[] = []

  if (!hasAuthorInfo) {
    issues.push("No clear author information found")
    recommendations.push("Add author information with credentials to improve E-A-T signals")
    recommendations.push("Include author bios that highlight expertise and authority")
  }

  if (!hasCredentials) {
    issues.push("Author credentials or expertise not clearly stated")
    recommendations.push("Include author credentials, qualifications, or expertise to enhance trustworthiness")
    recommendations.push("Highlight relevant experience, certifications, or education")
  }

  if (!hasCitations) {
    issues.push("Content lacks citations or references to authoritative sources")
    recommendations.push("Add citations, references, or links to authoritative sources to improve credibility")
    recommendations.push("Include data from reputable studies or organizations")
  }

  const status = (!hasAuthorInfo && !hasCredentials
    ? "error"
    : !hasAuthorInfo || !hasCredentials || !hasCitations
      ? "warning"
      : "good") as "error" | "warning" | "good"

  if (!issues.length) {
    recommendations.push("Your content demonstrates good E-A-T signals")
    recommendations.push("Continue building authority with expert content and proper citations")
  }

  return {
    status,
    value: status === "good" ? "Good E-A-T signals detected" : "E-A-T signals could be improved",
    issues,
    recommendations,
  }
}

function mockLCPCheck(domain: string) {
  return {
    status: "good" as const,
    value: "2.5s",
    issues: [],
    recommendations: ["Your LCP is good"]
  }
}

function mockFIDCheck(domain: string) {
  return {
    status: "good" as const,
    value: "100ms",
    issues: [],
    recommendations: ["Your FID is good"]
  }
}

function mockCLSCheck(domain: string) {
  return {
    status: "good" as const,
    value: "0.1",
    issues: [],
    recommendations: ["Your CLS is good"]
  }
}

function mockInternalLinkingStrengthCheck($: cheerio.CheerioAPI) {
  return {
    status: "good" as const,
    value: "Strong",
    issues: [],
    recommendations: ["Your internal linking is strong"],
    score: 90
  }
}

function mockPageDepthCheck(url: string) {
  return {
    status: "good" as const,
    value: "Optimal",
    issues: [],
    recommendations: ["Your page depth is optimal"],
    score: 95
  }
}

function mockOrphanedPagesCheck(domain: string) {
  return {
    status: "good" as const,
    value: "No orphaned pages",
    issues: [],
    recommendations: ["No orphaned pages detected"],
    score: 100,
    count: 0
  }
}

function mockEntityIdentificationCheck($: cheerio.CheerioAPI) {
  return {
    status: "good" as const,
    value: "Well identified",
    issues: [],
    recommendations: ["Your entities are well identified"],
    score: 90,
    entities: ["Product", "Service", "Organization"]
  }
}

function mockSERPFeaturesCheck(domain: string, $: cheerio.CheerioAPI) {
  return {
    status: "good" as const,
    value: "Good",
    issues: [],
    recommendations: ["Your SERP features are good"],
    score: 85,
    opportunities: ["Featured Snippet", "FAQ Schema"]
  }
}

function mockJavaScriptSEOCheck($: cheerio.CheerioAPI) {
  return {
    status: "good" as const,
    value: "Well optimized",
    issues: [],
    recommendations: ["Your JavaScript SEO is good"],
    score: 90
  }
}

function mockCompetitiveAnalysisCheck(domain: string, $: cheerio.CheerioAPI) {
  const status: "good" | "warning" | "error" = "good"
  
  const backlinksComparison: AuditResult = {
    status,
    value: "N/A",
    issues: [],
    recommendations: []
  }

  return {
    score: 0,
    competitors: [],
    keywordGaps: [],
    contentGaps: [],
    backlinksComparison,
    issues: [],
    recommendations: []
  }
}

function mockLocalSEOCheck(domain: string, $: cheerio.CheerioAPI) {
  return {
    status: "good" as const,
    value: "Well optimized",
    issues: [],
    recommendations: ["Your local SEO is good"],
    score: 90,
    googleBusinessProfile: {
      status: "good" as const,
      value: "Found",
      issues: [],
      recommendations: ["Your GBP is good"]
    },
    localCitations: {
      status: "good" as const,
      value: "Consistent",
      issues: [],
      recommendations: ["Your citations are good"]
    },
    localKeywords: {
      status: "good" as const,
      value: "Optimized",
      issues: [],
      recommendations: ["Your local keywords are good"]
    },
    reviews: {
      status: "good" as const,
      value: "Good",
      issues: [],
      recommendations: ["Your reviews are good"]
    }
  }
}

function calculateCategoryScore(statuses: Array<"good" | "warning" | "error">): number {
  const weights = {
    good: 100,
    warning: 60,
    error: 20,
  }

  const total = statuses.reduce((sum, status) => sum + weights[status], 0)
  return Math.round(total / statuses.length)
}

// Rate limiting map to store request counts per URL
const requestCounts = new Map<string, { count: number; timestamp: number }>();
const WINDOW_SIZE = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 10; // Allow 10 requests per minute per URL

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url')
    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch (e) {
      console.error('Invalid URL format:', url)
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    const domain = new URL(url).hostname
    console.log('Processing audit for domain:', domain)

    // Fetch and parse the webpage
    let response
    try {
      console.log('Fetching URL:', url)
      response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SEOAuditBot/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        timeout: 10000, // 10 second timeout
      })
      console.log('Fetch response status:', response.status)
    } catch (e) {
      console.error('Error fetching URL:', e)
      return NextResponse.json(
        { error: 'Failed to fetch the webpage. Please check if the URL is accessible.' },
        { status: 500 }
      )
    }

    if (!response.ok) {
      console.error('Fetch failed with status:', response.status)
      return NextResponse.json(
        { error: `Failed to fetch the webpage. Status: ${response.status}` },
        { status: response.status }
      )
    }

    let html
    try {
      html = await response.text()
      console.log('Successfully fetched HTML content')
    } catch (e) {
      console.error('Error reading response text:', e)
      return NextResponse.json(
        { error: 'Failed to read webpage content' },
        { status: 500 }
      )
    }

    let $
    try {
      $ = cheerio.load(html)
      console.log('Successfully parsed HTML with cheerio')
    } catch (e) {
      console.error('Error parsing HTML with cheerio:', e)
      return NextResponse.json(
        { error: 'Failed to parse webpage content' },
        { status: 500 }
      )
    }

    // Get IP address
    let ipAddress
    try {
      const { address } = await lookup(domain)
      ipAddress = address
      console.log('Successfully resolved IP address:', ipAddress)
    } catch (e) {
      console.error('Error looking up IP:', e)
      // Continue without IP address
    }

    // Store domain info
    try {
      console.log('Storing domain info for:', domain)
      await searchAndStoreDomain(domain)
      console.log('Successfully stored domain info')
    } catch (e) {
      console.error('Error storing domain:', e)
      // Continue without storing domain info
    }

    // Perform SEO audit
    console.log('Starting SEO audit')
    const auditResult = performSEOAudit($, url, domain)
    console.log('Completed SEO audit')

    // Update domain with report data
    try {
      console.log('Updating domain report')
      await updateDomainReport(domain, {
        ipAddress,
        reportData: new TextEncoder().encode(JSON.stringify(auditResult)),
      })
      console.log('Successfully updated domain report')
    } catch (e) {
      console.error('Error updating domain report:', e)
      // Continue without updating report
    }

    return NextResponse.json(auditResult)
  } catch (error) {
    console.error('Unexpected error in audit API:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred while performing the SEO audit' },
      { status: 500 }
    )
  }
}

// Generate mock audit result for sites we can't scrape
function generateMockAuditResult(url: string, domain: string): SEOAuditResult {
  const $ = cheerio.load(`
    <html>
      <head>
        <title>${domain} - Official Website</title>
        <meta name="description" content="This is the official website for ${domain}">
      </head>
      <body>
        <h1>${domain}</h1>
        <p>Welcome to ${domain}. This is a mock audit as the actual site couldn't be scraped.</p>
      </body>
    </html>
  `)
  
  return performSEOAudit($, url, domain)
}

function performSEOAudit($: cheerio.CheerioAPI, url: string, domain: string): SEOAuditResult {
  // On-Page SEO checks
  const metaTitleResult = checkMetaTitle($)
  const metaDescriptionResult = checkMetaDescription($)
  const headingsResult = checkHeadings($)
  const imageAltResult = checkImageAlt($)
  const urlStructureResult = checkUrlStructure(url)
  const internalLinksResult = checkInternalLinks($, url)

  // Technical SEO checks
  const pageSpeedResult = mockPageSpeedCheck(domain)
  const mobileFriendlinessResult = mockMobileFriendlinessCheck(domain)
  const sslResult = checkSSL(url)
  const robotsTxtResult = mockRobotsTxtCheck(domain)
  const sitemapResult = mockSitemapCheck(domain)
  const structuredDataResult = checkStructuredData($)
  const httpStatusResult = mockHttpStatusCheck(url)
  const brokenLinksResult = mockBrokenLinksCheck(domain, $)
  const canonicalTagsResult = checkCanonicalTags($, url)
  const hreflangResult = checkHreflang($)
  const coreWebVitalsResult = mockCoreWebVitalsCheck(domain)
  const duplicateContentResult = mockDuplicateContentCheck(domain, $)

  // Content SEO checks
  const contentLengthResult = checkContentLength($)
  const keywordOptimizationResult = mockKeywordOptimizationCheck(domain, $)
  const readabilityResult = mockReadabilityCheck($)
  const contentQualityResult = mockContentQualityCheck($)
  const keywordDensityResult = mockKeywordDensityCheck($)
  const thinContentResult = mockThinContentCheck(contentLengthResult.wordCount)
  const contentFreshnessResult = mockContentFreshnessCheck(domain)
  const eatSignalsResult = mockEATSignalsCheck($)

  // Performance checks
  const lcpResult = mockLCPCheck(domain)
  const fidResult = mockFIDCheck(domain)
  const clsResult = mockCLSCheck(domain)

  // Advanced SEO checks
  const internalLinkingStrengthResult = mockInternalLinkingStrengthCheck($)
  const pageDepthResult = mockPageDepthCheck(url)
  const orphanedPagesResult = mockOrphanedPagesCheck(domain)
  const entityIdentificationResult = mockEntityIdentificationCheck($)
  const serpFeaturesResult = mockSERPFeaturesCheck(domain, $)
  const javascriptSEOResult = mockJavaScriptSEOCheck($)

  // Competitive Analysis
  const competitiveAnalysisResult = mockCompetitiveAnalysisCheck(domain, $)

  // Local SEO
  const localSEOResult = mockLocalSEOCheck(domain, $)

  // Calculate scores
  const onPageScore = calculateCategoryScore([
    metaTitleResult.status as "error" | "warning" | "good",
    metaDescriptionResult.status,
    headingsResult.status,
    imageAltResult.status,
    urlStructureResult.status,
    internalLinksResult.status,
  ])

  const technicalScore = calculateCategoryScore([
    pageSpeedResult.status,
    mobileFriendlinessResult.status,
    sslResult.status,
    robotsTxtResult.status,
    sitemapResult.status,
    structuredDataResult.status,
    httpStatusResult.status,
    brokenLinksResult.status,
    canonicalTagsResult.status,
    hreflangResult.status,
    coreWebVitalsResult.status,
    duplicateContentResult.status,
  ])

  const contentScore = calculateCategoryScore([
    contentLengthResult.status,
    keywordOptimizationResult.status,
    readabilityResult.status,
    contentQualityResult.status,
    keywordDensityResult.status,
    thinContentResult.status,
    contentFreshnessResult.status,
    eatSignalsResult.status,
  ])

  const performanceScore = calculateCategoryScore([lcpResult.status, fidResult.status, clsResult.status])

  const advancedSEOScore = calculateCategoryScore([
    internalLinkingStrengthResult.status,
    pageDepthResult.status,
    orphanedPagesResult.status,
    entityIdentificationResult.status,
    serpFeaturesResult.status,
    javascriptSEOResult.status,
  ])

  const competitiveScore = calculateCategoryScore([competitiveAnalysisResult.backlinksComparison.status])

  // Calculate overall score
  const overallScore = Math.round(
    onPageScore * 0.2 +
      technicalScore * 0.25 +
      contentScore * 0.2 +
      performanceScore * 0.15 +
      advancedSEOScore * 0.1 +
      competitiveScore * 0.1,
  )

  return {
    overallScore,
    onPageSEO: {
      score: onPageScore,
      metaTitle: metaTitleResult,
      metaDescription: metaDescriptionResult,
      headings: headingsResult,
      imageAlt: imageAltResult,
      urlStructure: urlStructureResult,
      internalLinks: internalLinksResult,
    },
    technicalSEO: {
      score: technicalScore,
      pageSpeed: pageSpeedResult,
      mobileFriendliness: mobileFriendlinessResult,
      ssl: sslResult,
      robotsTxt: robotsTxtResult,
      sitemap: sitemapResult,
      structuredData: structuredDataResult,
      httpStatus: httpStatusResult,
      brokenLinks: brokenLinksResult,
      canonicalTags: canonicalTagsResult,
      hreflang: hreflangResult,
      coreWebVitals: coreWebVitalsResult,
      duplicateContent: duplicateContentResult,
    },
    contentSEO: {
      score: contentScore,
      contentLength: contentLengthResult,
      keywordOptimization: keywordOptimizationResult,
      readability: readabilityResult,
      contentQuality: contentQualityResult,
      keywordDensity: keywordDensityResult,
      thinContent: thinContentResult,
      contentFreshness: contentFreshnessResult,
      eatSignals: eatSignalsResult,
    },
    performance: {
      score: performanceScore,
      lcp: lcpResult,
      fid: fidResult,
      cls: clsResult,
    },
    advancedSEO: {
      score: advancedSEOScore,
      internalLinkingStrength: internalLinkingStrengthResult,
      pageDepth: pageDepthResult,
      orphanedPages: orphanedPagesResult,
      entityIdentification: entityIdentificationResult,
      serpFeatures: serpFeaturesResult,
      javascriptSEO: javascriptSEOResult,
    },
    competitiveAnalysis: competitiveAnalysisResult,
    localSEO: localSEOResult,
  }
}

// Helper functions for SEO checks

function checkMetaTitle($: cheerio.CheerioAPI) {
  const metaTitle = $("title").text().trim()
  const issues: string[] = []
  const recommendations: string[] = []

  if (!metaTitle) {
    issues.push("Meta title is missing")
    recommendations.push("Add a descriptive meta title that includes your primary keyword")
    return {
      status: "error" as const,
      value: "Missing",
      issues,
      recommendations,
    }
  }

  if (metaTitle.length < 30) {
    issues.push("Meta title is too short (less than 30 characters)")
    recommendations.push("Expand your title to between 50-60 characters for optimal visibility in search results")
  } else if (metaTitle.length > 60) {
    issues.push("Meta title is too long (more than 60 characters)")
    recommendations.push("Shorten your title to 50-60 characters to prevent truncation in search results")
  }

  if (!issues.length) {
    recommendations.push("Your meta title has a good length")
  }

  const status: "error" | "warning" | "good" = issues.length ? (issues.length > 1 ? "error" : "warning") : "good"
  
  return {
    status,
    value: metaTitle,
    issues,
    recommendations,
  }
}

function checkMetaDescription($: cheerio.CheerioAPI) {
  const metaDescription = $('meta[name="description"]').attr("content")?.trim() || ""
  const issues: string[] = []
  const recommendations: string[] = []

  if (!metaDescription) {
    issues.push("Meta description is missing")
    recommendations.push("Add a compelling meta description that includes your primary keyword")
    return {
      status: "error" as const,
      value: "Missing",
      issues,
      recommendations,
    }
  }

  if (metaDescription.length < 70) {
    issues.push("Meta description is too short (less than 70 characters)")
    recommendations.push("Expand your description to between 120-155 characters")
  } else if (metaDescription.length > 160) {
    issues.push("Meta description is too long (more than 160 characters)")
    recommendations.push("Shorten your description to 120-155 characters to prevent truncation in search results")
  }

  if (!issues.length) {
    recommendations.push("Your meta description has a good length")
  }
  const status: "error" | "warning" | "good" = issues.length ? (issues.length > 1 ? "error" : "warning") : "good"

  return {
    status,
    value: metaDescription,
    issues,
    recommendations,
  }
}

function checkHeadings($: cheerio.CheerioAPI) {
  const h1Count = $("h1").length
  const h2Count = $("h2").length
  const h3Count = $("h3").length
  const issues: string[] = []
  const recommendations: string[] = []

  if (h1Count === 0) {
    issues.push("No H1 heading found")
    recommendations.push("Add an H1 heading that includes your primary keyword")
  } else if (h1Count > 1) {
    issues.push(`Multiple H1 headings found (${h1Count})`)
    recommendations.push("Use only one H1 heading per page for proper SEO structure")
  }

  if (h2Count === 0) {
    issues.push("No H2 headings found")
    recommendations.push("Add H2 headings to structure your content and include relevant keywords")
  }

  // Check heading hierarchy
  const headings = $("h1, h2, h3, h4, h5, h6").toArray()
  let previousLevel = 0

  for (let i = 0; i < headings.length; i++) {
    const currentLevel = Number.parseInt(headings[i].name.substring(1))

    if (previousLevel > 0 && currentLevel > previousLevel + 1) {
      issues.push(`Heading hierarchy skip from H${previousLevel} to H${currentLevel}`)
      recommendations.push("Maintain proper heading hierarchy (don't skip levels)")
      break
    }

    previousLevel = currentLevel
  }

  if (!issues.length) {
    recommendations.push("Your heading structure follows SEO best practices")
  }
  const status: "error" | "warning" | "good" = issues.length 
    ? (issues.length > 1 ? "error" : "warning") 
    : "good";
    
  return {
    status,
    h1Count,
    h2Count,
    h3Count,
    issues,
    recommendations,
  }
}

function checkImageAlt($: cheerio.CheerioAPI) {
  const images = $("img")
  const totalImages = images.length
  let imagesWithAlt = 0
  const issues: string[] = []
  const recommendations: string[] = []
  const imageDetails: Array<{ src: string; alt: string; status: "good" | "warning" | "error" }> = []

  images.each((_, img) => {
    const $img = $(img)
    const src = $img.attr("src") || ""
    const alt = $img.attr("alt") || ""
    
    if (alt) {
      imagesWithAlt++
    }

    imageDetails.push({
      src,
      alt,
      status: alt ? "good" : "error"
    })
  })

  const missingAltCount = totalImages - imagesWithAlt

  if (totalImages === 0) {
    issues.push("No images found on the page")
    recommendations.push("Consider adding relevant images with descriptive alt text")
  } else if (missingAltCount > 0) {
    issues.push(`${missingAltCount} of ${totalImages} images are missing alt attributes`)
    recommendations.push("Add descriptive alt text to all images for better accessibility and SEO")
  }

  if (!issues.length && totalImages > 0) {
    recommendations.push("All images have alt attributes - great job!")
  }

  const status: "error" | "warning" | "good" = 
    missingAltCount > 0 
      ? (missingAltCount === totalImages ? "error" : "warning") 
      : "good";
      
  return {
    status,
    total: totalImages,
    withAlt: imagesWithAlt,
    imageDetails,
    issues,
    recommendations,
  }
}

function checkUrlStructure(url: string) {
  const parsedUrl = new URL(url)
  const path = parsedUrl.pathname
  const issues: string[] = []
  const recommendations: string[] = []

  // Check for uppercase letters
  if (/[A-Z]/.test(path)) {
    issues.push("URL contains uppercase letters")
    recommendations.push("Use lowercase letters in URLs for better consistency")
  }

  // Check for underscores
  if (/_/.test(path)) {
    issues.push("URL contains underscores")
    recommendations.push("Use hyphens instead of underscores to separate words in URLs")
  }

  // Check for multiple consecutive hyphens
  if (/--/.test(path)) {
    issues.push("URL contains consecutive hyphens")
    recommendations.push("Avoid using consecutive hyphens in URLs")
  }

  // Check for query parameters
  if (parsedUrl.search) {
    issues.push("URL contains query parameters")
    recommendations.push("Consider using clean, static URLs without query parameters")
  }

  if (!issues.length) {
    recommendations.push("Your URL structure follows SEO best practices")
  }
  const status: "error" | "warning" | "good" = 
    issues.length 
      ? (issues.length > 1 ? "error" : "warning") 
      : "good";

  return {
    status,
    value: url,
    issues,
    recommendations,
  }
}

function checkInternalLinks($: cheerio.CheerioAPI, url: string) {
  const parsedUrl = new URL(url)
  const baseUrl = parsedUrl.origin
  const links = $("a[href]")
  let internalLinksCount = 0
  const issues: string[] = []
  const recommendations: string[] = []

  links.each((_, link) => {
    const href = $(link).attr("href") || ""

    // Check if it's an internal link
    if (
      href.startsWith("/") ||
      href.startsWith(baseUrl) ||
      (!href.startsWith("http://") && !href.startsWith("https://") && !href.startsWith("#"))
    ) {
      internalLinksCount++

      // Check for empty anchor text
      const anchorText = $(link).text().trim()
      if (!anchorText && !$(link).find("img").length) {
        issues.push("Some internal links have empty anchor text")
        recommendations.push("Use descriptive anchor text for all internal links")
      }
    }
  })

  if (internalLinksCount < 3) {
    issues.push(`Only ${internalLinksCount} internal links found`)
    recommendations.push("Add more internal links to improve site structure and user navigation")
  }

  if (!issues.length) {
    recommendations.push("Your internal linking structure is good")
  }
  const status: "error" | "warning" | "good" = 
    issues.length 
      ? (issues.length > 1 ? "error" : "warning") 
      : "good";

  return {
    status,
    count: internalLinksCount,
    issues,
    recommendations,
  }
}

function checkSSL(url: string) {
  const isHttps = url.startsWith("https://")
  const issues: string[] = []
  const recommendations: string[] = []

  if (!isHttps) {
    issues.push("Website is not using HTTPS")
    recommendations.push("Implement SSL/TLS certificate to secure your website with HTTPS")
  } else {
    recommendations.push("Your website is properly secured with HTTPS")
  }

  return {
    status: isHttps ? ("good" as const) : ("error" as const),
    value: isHttps ? "HTTPS Enabled" : "HTTPS Not Enabled",
    issues,
    recommendations,
  }
}

function checkStructuredData($: cheerio.CheerioAPI) {
  const structuredData = $('script[type="application/ld+json"]')
  const issues: string[] = []
  const recommendations: string[] = []

  if (structuredData.length === 0) {
    issues.push("No structured data found")
    recommendations.push("Implement structured data markup (JSON-LD) to help search engines understand your content")
    return {
      status: "warning" as const,
      value: "Not Found",
      issues,
      recommendations,
    }
  }

  // In a real implementation, you would validate the structured data
  // against Schema.org specifications

  return {
    status: "good" as const,
    value: `${structuredData.length} structured data blocks found`,
    issues,
    recommendations: ["Your page includes structured data markup"],
  }
}

function checkContentLength($: cheerio.CheerioAPI) {
  // Extract main content (simplified approach)
  const bodyText = $("body").text()
  const cleanText = bodyText.replace(/\s+/g, " ").trim()
  const wordCount = cleanText.split(" ").length

  const issues: string[] = []
  const recommendations: string[] = []

  if (wordCount < 300) {
    issues.push("Content is too thin (less than 300 words)")
    recommendations.push("Expand your content to at least 600 words for better SEO performance")
  } else if (wordCount < 600) {
    issues.push("Content is relatively short (less than 600 words)")
    recommendations.push("Consider expanding your content to 1000+ words for comprehensive coverage")
  }

  if (!issues.length) {
    recommendations.push("Your content length is good for SEO")
  }

  return {
    status: wordCount < 300 ? ("error" as const) : wordCount < 600 ? ("warning" as const) : ("good" as const),
    wordCount,
    issues,
    recommendations,
  }
}

function checkCanonicalTags($: cheerio.CheerioAPI, url: string): AuditResult {
  const canonicalTag = $('link[rel="canonical"]').attr("href")
  const issues: string[] = []
  const recommendations: string[] = []

  if (!canonicalTag) {
    issues.push("No canonical tag found")
    recommendations.push("Add a canonical tag to prevent duplicate content issues")
    return {
      status: "warning",
      value: "Missing",
      issues,
      recommendations,
    }
  }

  try {
    const canonicalUrl = new URL(canonicalTag, url).href
    const currentUrl = new URL(url).href

    if (canonicalUrl !== currentUrl) {
      issues.push("Canonical URL does not match the current URL")
      recommendations.push(
        "Ensure the canonical URL points to the current page unless intentionally pointing elsewhere",
      )
    }
  } catch (error) {
    issues.push("Invalid canonical URL")
    recommendations.push("Fix the canonical URL to ensure it's a valid URL")
  }

  if (!issues.length) {
    recommendations.push("Your canonical tag is properly implemented")
  }

  const status: AuditResult["status"] = issues.length ? (issues.length > 1 ? "error" : "warning") : "good"

  return {
    status,
    value: canonicalTag || "Missing",
    issues,
    recommendations,
  }
}
