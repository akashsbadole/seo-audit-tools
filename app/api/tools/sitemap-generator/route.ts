import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      url,
      depth = 3,
      maxPages = 500,
    } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const pages = await crawlSite(url, depth, maxPages);

    const sitemapXml = generateSitemapXml(pages, "weekly", "0.5");

    return NextResponse.json({
      success: true,
      totalPages: pages.length,
      sitemap: sitemapXml,
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate sitemap" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json([]);
}

async function crawlSite(baseUrl: string, maxDepth: number, maxPages: number) {
  const visited = new Set<string>();
  const queue: { url: string; depth: number }[] = [{ url: baseUrl, depth: 0 }];
  const pages: Array<{ url: string; title: string; lastModified: string }> = [];

  while (queue.length > 0 && pages.length < maxPages) {
    const { url, depth } = queue.shift()!;
    if (visited.has(url) || depth > maxDepth) continue;
    visited.add(url);

    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (response.ok && response.headers.get("content-type")?.includes("text/html")) {
        const html = await response.text();
        const title = extractTitle(html);
        const lastModified = response.headers.get("last-modified") || new Date().toISOString();
        
        pages.push({ url, title, lastModified });

        if (depth < maxDepth) {
          const links = extractLinks(html, new URL(url).origin);
          for (const link of links) {
            if (!visited.has(link) && pages.length < maxPages) {
              queue.push({ url: link, depth: depth + 1 });
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error crawling ${url}:`, error);
    }
  }

  return pages;
}

function extractTitle(html: string): string {
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : "";
}

function extractLinks(html: string, baseOrigin: string): string[] {
  const linkRegex = /<a\s+(?:[^>]*?)href\s*=\s*(['"])(.*?)\1/gi;
  const links: string[] = [];
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    let href = match[2];
    if (!href || href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("http")) continue;
    if (href.startsWith("/")) href = baseOrigin + href;
    else if (!href.startsWith("http")) href = baseOrigin + "/" + href;
    if (href.startsWith(baseOrigin)) links.push(href.split("#")[0]);
  }

  return [...new Set(links)];
}

function generateSitemapXml(pages: any[], changeFreq: string, priority: string): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const page of pages) {
    xml += "  <url>\n";
    xml += `    <loc>${escapeXml(page.url)}</loc>\n`;
    if (page.lastModified) xml += `    <lastmod>${escapeXml(page.lastModified)}</lastmod>\n`;
    xml += `    <changefreq>${changeFreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += "  </url>\n";
  }

  xml += "</urlset>";
  return xml;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
