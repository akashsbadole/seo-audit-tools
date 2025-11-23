import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateUser(request);

    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { user } = auth;

    const body = await request.json();
    const {
      url,
      depth = 3,
      maxPages = 500,
      includeImages = true,
      changeFreq = "weekly",
      priority = "0.5",
    } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Check user's usage limits
    const userDetails = await prisma.user.findUnique({
      where: { id: user.id },
      select: { isPremium: true, usageLimit: true },
    });

    if (!userDetails?.isPremium) {
      const today = new Date();
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

      const currentUsage = await prisma.usageTracking.count({
        where: {
          userId: user.id,
          feature: "sitemap-generator",
          createdAt: { gte: monthStart },
        },
      });

      if (currentUsage >= 5) {
        return NextResponse.json(
          {
            error:
              "Monthly limit reached. Upgrade to Premium for unlimited access.",
          },
          { status: 429 }
        );
      }
    }

    // Create sitemap generation job
    const job = await prisma.sitemapGeneration.create({
      data: {
        url,
        depth,
        maxPages,
        includeImages,
        changeFreq,
        priority,
        status: "pending",
        userId: user.id,
      },
    });

    // Track usage for free users
    if (!userDetails?.isPremium) {
      await prisma.usageTracking.create({
        data: {
          feature: "sitemap-generator",
          userId: user.id,
        },
      });
    }

    // Start sitemap generation process in background
    generateSitemap(
      job.id,
      url,
      depth,
      maxPages,
      includeImages,
      changeFreq,
      priority
    );

    return NextResponse.json({
      success: true,
      jobId: job.id,
      message: "Sitemap generation started. Results will be available shortly.",
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return NextResponse.json(
      { error: "Failed to start sitemap generation" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateUser(request);

    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { user } = auth;

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (jobId) {
      // Get specific job results
      const job = await prisma.sitemapGeneration.findFirst({
        where: {
          id: jobId,
          userId: user.id,
        },
        include: {
          sitemapPages: true,
        },
      });

      if (!job) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
      }

      return NextResponse.json(job);
    } else {
      // Get all jobs for user
      const jobs = await prisma.sitemapGeneration.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      });

      return NextResponse.json(jobs);
    }
  } catch (error) {
    console.error("Get sitemap generation error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sitemap generation results" },
      { status: 500 }
    );
  }
}

// Background function to generate sitemap
async function generateSitemap(
  jobId: string,
  baseUrl: string,
  maxDepth: number,
  maxPages: number,
  includeImages: boolean,
  changeFreq: string,
  priority: string
) {
  try {
    const visited = new Set<string>();
    const queue: { url: string; depth: number }[] = [
      { url: baseUrl, depth: 0 },
    ];
    const pages: Array<{
      url: string;
      title: string;
      description: string;
      lastModified: string;
      images?: Array<{ url: string; title: string; caption: string }>;
    }> = [];

    const updateJobStatus = async (status: string, progress?: number) => {
      await prisma.sitemapGeneration.update({
        where: { id: jobId },
        data: {
          status,
          progress,
          updatedAt: new Date(),
        },
      });
    };

    while (queue.length > 0 && pages.length < maxPages) {
      const { url, depth } = queue.shift()!;

      if (visited.has(url) || depth > maxDepth) continue;
      visited.add(url);

      try {
        const response = await fetch(url, {
          method: "GET",
          signal: AbortSignal.timeout(15000), // 15 second timeout
        });

        if (
          response.ok &&
          response.headers.get("content-type")?.includes("text/html")
        ) {
          const html = await response.text();

          // Extract page information
          const title = extractTitle(html);
          const description = extractDescription(html);
          const lastModified =
            response.headers.get("last-modified") || new Date().toISOString();
          const images = includeImages
            ? extractImages(html, new URL(url).origin)
            : undefined;

          pages.push({
            url,
            title,
            description,
            lastModified,
            images,
          });

          // Extract links for crawling
          if (depth < maxDepth) {
            const links = extractLinks(html, new URL(url).origin);

            for (const link of links) {
              if (!visited.has(link) && pages.length < maxPages) {
                queue.push({ url: link, depth: depth + 1 });
              }
            }
          }
        }

        // Update progress
        const progress = Math.round((pages.length / maxPages) * 100);
        await updateJobStatus("running", progress);
      } catch (error) {
        console.error(`Error crawling ${url}:`, error);
      }
    }

    // Generate XML sitemap
    const sitemapXml = generateSitemapXml(pages, changeFreq, priority);
    const sitemapIndexXml = generateSitemapIndexXml(baseUrl, pages.length);

    // Save results
    await prisma.sitemapGeneration.update({
      where: { id: jobId },
      data: {
        status: "completed",
        progress: 100,
        completedAt: new Date(),
        sitemapXml,
        sitemapIndexXml,
        totalPages: pages.length,
        sitemapPages: {
          create: pages.map((page) => ({
            url: page.url,
            title: page.title,
            description: page.description,
            lastModified: page.lastModified,
            images: page.images || [],
          })),
        },
      },
    });
  } catch (error) {
    console.error("Background sitemap generation error:", error);
    await prisma.sitemapGeneration.update({
      where: { id: jobId },
      data: {
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
        completedAt: new Date(),
      },
    });
  }
}

// Extract title from HTML
function extractTitle(html: string): string {
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : "";
}

// Extract description from HTML
function extractDescription(html: string): string {
  const descMatch = html.match(
    /<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i
  );
  return descMatch ? descMatch[1].trim() : "";
}

// Extract images from HTML
function extractImages(
  html: string,
  baseUrl: string
): Array<{ url: string; title: string; caption: string }> {
  const imageRegex = /<img[^>]*src\s*=\s*(['"])(.*?)\1[^>]*>/gi;
  const images: Array<{ url: string; title: string; caption: string }> = [];
  let match;

  while ((match = imageRegex.exec(html)) !== null) {
    let src = match[2];

    if (src.startsWith("/")) {
      src = baseUrl + src;
    } else if (!src.startsWith("http")) {
      src = baseUrl + "/" + src;
    }

    // Only include same-origin images
    if (src.startsWith(baseUrl)) {
      images.push({
        url: src,
        title: "", // Could extract from alt attribute
        caption: "", // Could extract from title or caption
      });
    }
  }

  return images.slice(0, 10); // Limit to 10 images per page
}

// Extract links from HTML
function extractLinks(html: string, baseOrigin: string): string[] {
  const linkRegex = /<a\s+(?:[^>]*?)href\s*=\s*(['"])(.*?)\1/gi;
  const links: string[] = [];
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    let href = match[2];

    // Skip empty links, anchors, javascript, mailto, and external links
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("javascript:") ||
      href.startsWith("mailto:") ||
      href.startsWith("http")
    ) {
      continue;
    }

    // Convert relative URLs to absolute
    if (href.startsWith("/")) {
      href = baseOrigin + href;
    } else if (!href.startsWith("http")) {
      href = baseOrigin + "/" + href;
    }

    // Only include same-origin links
    if (href.startsWith(baseOrigin)) {
      links.push(href.split("#")[0]); // Remove anchor fragments
    }
  }

  return [...new Set(links)]; // Remove duplicates
}

// Generate sitemap XML
function generateSitemapXml(
  pages: any[],
  changeFreq: string,
  priority: string
): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml +=
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

  for (const page of pages) {
    xml += "  <url>\n";
    xml += `    <loc>${escapeXml(page.url)}</loc>\n`;

    if (page.lastModified) {
      xml += `    <lastmod>${escapeXml(page.lastModified)}</lastmod>\n`;
    }

    xml += `    <changefreq>${changeFreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;

    if (page.title) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${escapeXml(page.url)}</image:loc>\n`;
      xml += `      <image:title>${escapeXml(page.title)}</image:title>\n`;
      if (page.description) {
        xml += `      <image:caption>${escapeXml(page.description)}</image:caption>\n`;
      }
      xml += `    </image:image>\n`;
    }

    xml += "  </url>\n";
  }

  xml += "</urlset>";
  return xml;
}

// Generate sitemap index XML (for multiple sitemaps)
function generateSitemapIndexXml(baseUrl: string, totalPages: number): string {
  const sitemapsNeeded = Math.ceil(totalPages / 50000); // 50,000 URLs per sitemap limit
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (let i = 0; i < sitemapsNeeded; i++) {
    xml += "  <sitemap>\n";
    xml += `    <loc>${escapeXml(`${baseUrl}/sitemap-${i + 1}.xml`)}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    xml += "  </sitemap>\n";
  }

  xml += "</sitemapindex>";
  return xml;
}

// Escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
