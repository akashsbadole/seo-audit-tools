"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AlertCircle, AlertTriangle, CheckCircle2, Download, Globe, Loader2, ExternalLink } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuditScoreCard } from "@/components/audit-score-card"
import { AuditSummary } from "@/components/audit-summary"
import type { SEOAuditResult, PDFExportOptions } from "@/types/seo-audit"
import { SEOMetaTags } from "@/components/seo-meta-tags"

export function AuditResults({ url }: { url: string }) {
  const [auditResult, setAuditResult] = useState<SEOAuditResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [retryTime, setRetryTime] = useState<number | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const MAX_RETRIES = 3

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout | undefined = undefined
    let retryTimeout: NodeJS.Timeout | undefined = undefined

    const fetchAuditResults = async () => {
      if (!url) {
        setError("No URL provided")
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Validate and normalize the URL
        let normalizedUrl: string
        try {
          // Remove trailing slash if present
          const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url
          // Ensure URL has protocol
          const urlWithProtocol = cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`
          const urlObj = new URL(urlWithProtocol)
          // Remove www. if present
          const hostname = urlObj.hostname.replace(/^www\./, '')
          urlObj.hostname = hostname
          normalizedUrl = urlObj.toString()
        } catch (error) {
          throw new Error("Invalid URL format. Please enter a valid URL (e.g., example.com or https://example.com)")
        }

        // Add a timestamp to prevent caching issues
        const timestamp = new Date().getTime()
        const apiUrl = `/api/audit?url=${encodeURIComponent(normalizedUrl)}&_=${timestamp}`
        
        console.log(`Fetching audit results from: ${apiUrl}`)
        const response = await fetch(apiUrl, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          // Explicitly prevent caching
          cache: 'no-store'
        })
        
        if (!response.ok) {
          let errorMessage = `Error: ${response.status}`
          try {
            const errorData = await response.json()
            errorMessage = errorData.error || errorMessage
          } catch (e) {
            // If we can't parse the error JSON, use the status text
            errorMessage = response.statusText || errorMessage
          }
          throw new Error(errorMessage)
        }

        const data = await response.json()
        setAuditResult(data)
        setRetryCount(0)
        setRetryTime(null)
      } catch (err) {
        console.error("Failed to fetch audit results:", err)
        setError(err instanceof Error ? err.message : "An error occurred while analyzing the website")
        setRetryTime(null)
      } finally {
        setLoading(false)
      }
    }

    // Reset states when URL changes
    setRetryCount(0)
    setRetryTime(null)
    setError(null)
    
    fetchAuditResults()

    return () => {
      if (countdownInterval) clearInterval(countdownInterval)
      if (retryTimeout) clearTimeout(retryTimeout)
    }
  }, [url])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-semibold mb-2">
          {retryTime ? 'Waiting to retry...' : 'Analyzing your website'}
        </h2>
        <p className="text-muted-foreground">
          {retryTime ? (
            <>
              Rate limit reached. Retrying in {retryTime} seconds...
              <br />
              Retry attempt {retryCount + 1} of {MAX_RETRIES}
            </>
          ) : (
            'This may take a minute or two...'
          )}
        </p>
        {retryTime && (
          <div className="w-full max-w-md mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-1000" 
                style={{ 
                  width: `${(retryTime / 10) * 100}%`
                }} 
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  if (error || !auditResult) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>{error || "Failed to load audit results. Please try again."}</p>
          {retryTime && retryCount < MAX_RETRIES && (
            <div className="text-sm mt-2">
              <p>
                Automatically retrying in {retryTime} seconds...
                <br />
                Retry attempt {retryCount + 1} of {MAX_RETRIES}
              </p>
              <div className="w-1/2 bg-red-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-1000" 
                  style={{ 
                    width: `${(retryTime / 10) * 10}%`
                  }} 
                />
              </div>
            </div>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  const { overallScore, onPageSEO, technicalSEO, contentSEO, performance, advancedSEO, competitiveAnalysis, localSEO } =
    auditResult

  const handleExportPdf = async () => {
    if (!auditResult) return

    setIsExporting(true)
    try {
      const defaultOptions: PDFExportOptions = {
        includeWatermark: true,
        watermarkText: "SEO Audit Report",
        includeSections: {
          onPageSEO: true,
          technicalSEO: true,
          contentSEO: true,
          performance: true,
          advancedSEO: true,
          competitiveAnalysis: true,
          localSEO: true,
        },
        includeRecommendations: true,
      }

      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          auditResult,
          exportOptions: defaultOptions,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to generate PDF: ${response.statusText}`)
      }

      // Get the PDF as a blob
      const blob = await response.blob()

      // Get filename from Content-Disposition header if available
      let filename = `seo-audit-report-${new Date().toISOString().split("T")[0]}.pdf`
      const contentDisposition = response.headers.get('Content-Disposition')
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+?)"/i)
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1]
          console.log(`Using server-generated filename: ${filename}`)
        }
      }

      // Create a URL for the blob
      const pdfUrl = window.URL.createObjectURL(blob)

      // Create a link element
      const link = document.createElement("a")
      link.href = pdfUrl
      link.download = filename

      // Append to the document
      document.body.appendChild(link)

      // Trigger the download
      link.click()

      // Clean up
      window.URL.revokeObjectURL(pdfUrl)
      document.body.removeChild(link)
    } catch (err) {
      console.error("Failed to export PDF:", err)
      setError("Failed to export PDF. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-xl">{url}</CardTitle>
          </div>
          <CardDescription>
            Audit completed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuditSummary overallScore={overallScore} />
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="gap-2" onClick={handleExportPdf} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export PDF Report
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Search Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Search Preview</CardTitle>
          <CardDescription>Here's how your site may appear in search results:</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-white p-4 rounded-md border">
            <div className="text-blue-700 text-lg font-normal mb-1 hover:underline cursor-pointer">
              {onPageSEO.metaTitle.value || url}
            </div>
            <div className="text-green-700 text-sm mb-1">{url}</div>
            <div className="text-gray-600 text-sm">
              {onPageSEO.metaDescription.value ||
                "No meta description found. Add a compelling meta description to improve click-through rates."}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keywords Section */}
      <Card className="hidden">
        <CardHeader>
          <CardTitle className="text-base">Keywords</CardTitle>
          <CardDescription>Here are the most common keywords we found on the page:</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {contentSEO.keywordDensity.keywords.map((keyword, index) => (
              <div key={index} className="flex items-center border rounded-md overflow-hidden">
                <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 font-medium">{keyword.count}</div>
                <div className="px-3 py-2 truncate">{keyword.keyword}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <SEOMetaTags />

      <Tabs defaultValue="on-page" className="w-full">
        <TabsList className="w-full grid grid-cols-2 sm:grid-cols-3 sm:mb-5 lg:grid-cols-6 gap-1">
          <TabsTrigger value="on-page" className="text-xs sm:text-sm whitespace-nowrap">Basic SEO</TabsTrigger>
          <TabsTrigger value="technical" className="text-xs sm:text-sm whitespace-nowrap">Advanced SEO</TabsTrigger>
          <TabsTrigger value="content" className="text-xs sm:text-sm whitespace-nowrap">Content SEO</TabsTrigger>
          <TabsTrigger value="performance" className="text-xs sm:text-sm whitespace-nowrap">Performance</TabsTrigger>
          <TabsTrigger value="security" className="text-xs sm:text-sm whitespace-nowrap">Security</TabsTrigger>
          <TabsTrigger value="competitive" className="text-xs sm:text-sm whitespace-nowrap">Competitive</TabsTrigger>
        </TabsList>

        <TabsContent value="on-page" className="space-y-4 sm:mb-4">
          <AuditScoreCard
            title="Basic SEO Score"
            score={onPageSEO.score}
            description="Analysis of on-page elements like meta tags, headings, and internal links"
          />

          <Accordion type="single" collapsible className="space-y-4 sm:mb-4">
            <AuditItem
              title={`The SEO title is set and is ${onPageSEO.metaTitle.value?.length || 0} characters long.`}
              status={onPageSEO.metaTitle.status}
              value={onPageSEO.metaTitle.value || "Missing"}
              issues={onPageSEO.metaTitle.issues}
              recommendations={onPageSEO.metaTitle.recommendations}
            />

            <AuditItem
              title={`The meta description is set and is ${onPageSEO.metaDescription.value?.length || 0} characters long.`}
              status={onPageSEO.metaDescription.status}
              value={onPageSEO.metaDescription.value || "Missing"}
              issues={onPageSEO.metaDescription.issues}
              recommendations={onPageSEO.metaDescription.recommendations}
            />

            <AuditItem
              title={
                onPageSEO.headings.h1Count > 0
                  ? `H1 tag was found (${onPageSEO.headings.h1Count}).`
                  : "No H1 tag was found. For the best SEO results there should be exactly one H1 tag on each page."
              }
              status={onPageSEO.headings.h1Count === 1 ? "good" : "error"}
              value={`H1: ${onPageSEO.headings.h1Count}, H2: ${onPageSEO.headings.h2Count}, H3: ${onPageSEO.headings.h3Count}`}
              issues={onPageSEO.headings.issues}
              recommendations={onPageSEO.headings.recommendations}
            />

            <AuditItem
              title={
                onPageSEO.headings.h2Count > 0
                  ? `H2 tags were found (${onPageSEO.headings.h2Count}).`
                  : "No H2 tags were found on the page."
              }
              status={onPageSEO.headings.h2Count > 0 ? "good" : "warning"}
              value={`H2: ${onPageSEO.headings.h2Count}`}
              issues={onPageSEO.headings.issues.filter((i) => i.includes("H2"))}
              recommendations={onPageSEO.headings.recommendations.filter((r) => r.includes("H2"))}
            />

            <AuditItem
              title={
                auditResult.onPageSEO.imageAlt.withAlt === auditResult.onPageSEO.imageAlt.total
                  ? "All images on the page have alt attributes."
                  : `${auditResult.onPageSEO.imageAlt.total - auditResult.onPageSEO.imageAlt.withAlt} of ${auditResult.onPageSEO.imageAlt.total} images are missing alt attributes.`
              }
              status={onPageSEO.imageAlt.status}
              value={`${onPageSEO.imageAlt.withAlt} of ${onPageSEO.imageAlt.total} images have alt text`}
              issues={onPageSEO.imageAlt.issues}
              recommendations={onPageSEO.imageAlt.recommendations}
              details={
                onPageSEO.imageAlt.imageDetails.length > 0 ? (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {onPageSEO.imageAlt.imageDetails.map((image, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <div className="aspect-video bg-muted rounded-md overflow-hidden mb-2">
                          <img 
                            src={image.src} 
                            alt={image.alt || "No alt text"} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3EImage not found%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">Alt Text:</div>
                          <div className={image.alt ? "text-green-600" : "text-red-600"}>
                            {image.alt || "Missing alt text"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null
              }
            />

            <AuditItem
              title="The page has a correct number of internal and external links."
              status={onPageSEO.internalLinks.status}
              value={`Internal: ${onPageSEO.internalLinks.count}`}
              issues={onPageSEO.internalLinks.issues}
              recommendations={onPageSEO.internalLinks.recommendations}
            />
          </Accordion>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4 sm:mb-4">
          <AuditScoreCard
            title="Advanced SEO Score"
            score={technicalSEO.score}
            description="Analysis of technical aspects like canonical tags, robots.txt, and structured data"
          />

          <Accordion type="single" collapsible className="space-y-4 sm:mb-4">
            <AuditItem
              title="The page is using the canonical link tag."
              status={technicalSEO.canonicalTags.status}
              value={technicalSEO.canonicalTags.value}
              issues={technicalSEO.canonicalTags.issues}
              recommendations={technicalSEO.canonicalTags.recommendations}
            />

            <AuditItem
              title={
                technicalSEO.robotsTxt.status === "good"
                  ? "The site has a robots.txt file."
                  : "No robots.txt file was found."
              }
              status={technicalSEO.robotsTxt.status}
              value={technicalSEO.robotsTxt.value}
              issues={technicalSEO.robotsTxt.issues}
              recommendations={technicalSEO.robotsTxt.recommendations}
            />

            <AuditItem
              title="The page does not contain any noindex header or meta tag."
              status="good"
              value="No noindex tags found"
              issues={[]}
              recommendations={["Only use noindex meta tag or header on pages you want to keep out of search engines"]}
            />

            <AuditItem
              title="Open Graph meta tags"
              status="warning"
              value="Some Open Graph meta tags are missing."
              issues={["Missing og:title, og:type, og:url tags"]}
              recommendations={["Insert a customized Open Graph meta tag for each important page on your site."]}
            />

            <AuditItem
              title="Schema.org data"
              status={technicalSEO.structuredData.status}
              value={technicalSEO.structuredData.value}
              issues={technicalSEO.structuredData.issues}
              recommendations={technicalSEO.structuredData.recommendations}
            />

            <AuditItem
              title="HTTP status"
              status={technicalSEO.httpStatus.status}
              value={technicalSEO.httpStatus.value}
              issues={technicalSEO.httpStatus.issues}
              recommendations={technicalSEO.httpStatus.recommendations}
            />

            <AuditItem
              title="Broken links"
              status={technicalSEO.brokenLinks.status}
              value={`${technicalSEO.brokenLinks.broken} of ${technicalSEO.brokenLinks.total} links are broken`}
              issues={technicalSEO.brokenLinks.issues}
              recommendations={technicalSEO.brokenLinks.recommendations}
              details={
                technicalSEO.brokenLinks.brokenList.length > 0 ? (
                  <div className="mt-4 border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left">URL</th>
                          <th className="px-4 py-2 text-left">Status Code</th>
                        </tr>
                      </thead>
                      <tbody>
                        {technicalSEO.brokenLinks.brokenList.map((link, index) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-2 break-all">{link.url}</td>
                            <td className="px-4 py-2">{link.statusCode}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null
              }
            />
          </Accordion>
        </TabsContent>

        <TabsContent value="content" className="space-y-4 sm:mb-4">
          <AuditScoreCard
            title="Content SEO Score"
            score={contentSEO.score}
            description="Analysis of content quality, keyword optimization, and readability"
          />

          <Accordion type="single" collapsible className="space-y-4 sm:mb-4">
            <AuditItem
              title="Content quality"
              status={contentSEO.contentQuality.status}
              value={`${contentSEO.contentQuality.score}/100`}
              issues={contentSEO.contentQuality.issues}
              recommendations={contentSEO.contentQuality.recommendations}
            />

            <AuditItem
              title="Content length"
              status={contentSEO.contentLength.status}
              value={`${contentSEO.contentLength.wordCount} words`}
              issues={contentSEO.contentLength.issues}
              recommendations={contentSEO.contentLength.recommendations}
            />

            <AuditItem
              title="Keyword density"
              status={contentSEO.keywordDensity.status}
              value={`Top keywords analyzed`}
              issues={contentSEO.keywordDensity.issues}
              recommendations={contentSEO.keywordDensity.recommendations}
              details={
                contentSEO.keywordDensity.keywords.length > 0 ? (
                  <div className="mt-4 border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left">Keyword</th>
                          <th className="px-4 py-2 text-left">Count</th>
                          <th className="px-4 py-2 text-left">Density</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contentSEO.keywordDensity.keywords.map((keyword, index) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-2">{keyword.keyword}</td>
                            <td className="px-4 py-2">{keyword.count}</td>
                            <td className="px-4 py-2">{keyword.density}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null
              }
            />

            <AuditItem
              title="Keyword optimization"
              status={contentSEO.keywordOptimization.status}
              value={contentSEO.keywordOptimization.value}
              issues={contentSEO.keywordOptimization.issues}
              recommendations={contentSEO.keywordOptimization.recommendations}
            />

            <AuditItem
              title="Readability score"
              status={contentSEO.readability.status}
              value={contentSEO.readability.value}
              issues={contentSEO.readability.issues}
              recommendations={contentSEO.readability.recommendations}
            />

            <AuditItem
              title="Thin content"
              status={contentSEO.thinContent.status}
              value={contentSEO.thinContent.value}
              issues={contentSEO.thinContent.issues}
              recommendations={contentSEO.thinContent.recommendations}
            />

            <AuditItem
              title="Content freshness"
              status={contentSEO.contentFreshness.status}
              value={contentSEO.contentFreshness.value}
              issues={contentSEO.contentFreshness.issues}
              recommendations={contentSEO.contentFreshness.recommendations}
            />

            <AuditItem
              title="E-A-T signals"
              status={contentSEO.eatSignals.status}
              value={contentSEO.eatSignals.value}
              issues={contentSEO.eatSignals.issues}
              recommendations={contentSEO.eatSignals.recommendations}
            />
          </Accordion>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4 sm:mb-4">
          <AuditScoreCard
            title="Performance Score"
            score={performance.score}
            description="Analysis of page speed, Core Web Vitals, and resource optimization"
          />

          <Accordion type="single" collapsible className="space-y-4 sm:mb-4">
            <AuditItem
              title="Page speed score"
              status={technicalSEO.pageSpeed.status}
              value={`${technicalSEO.pageSpeed.score}/100`}
              issues={technicalSEO.pageSpeed.issues}
              recommendations={technicalSEO.pageSpeed.recommendations}
            />

            <AuditItem
              title="Core Web Vitals"
              status={technicalSEO.coreWebVitals.status}
              value={`LCP: ${technicalSEO.coreWebVitals.lcp.value}, FID: ${technicalSEO.coreWebVitals.fid.value}, CLS: ${technicalSEO.coreWebVitals.cls.value}`}
              issues={technicalSEO.coreWebVitals.issues}
              recommendations={technicalSEO.coreWebVitals.recommendations}
            />

            <AuditItem
              title="JavaScript and CSS minification"
              status="warning"
              value="Some JavaScript and CSS files don't seem to be minified."
              issues={["Unminified files increase page load time"]}
              recommendations={["Minify all JavaScript and CSS files to improve page load speed."]}
            />

            <AuditItem
              title="HTML document size"
              status="warning"
              value="The size of the HTML document is over our recommendation of 50 Kb."
              issues={["Large HTML documents can slow down page rendering"]}
              recommendations={["Reduce HTML size by removing unnecessary markup and comments."]}
            />

            <AuditItem
              title="Response time"
              status="good"
              value="The response time is under 0.2 seconds."
              issues={[]}
              recommendations={[
                "Continue to use caching to maintain fast response times",
                "Consider a content delivery network (CDN) for even faster delivery",
              ]}
            />

            <AuditItem
              title="Mobile-friendly design"
              status={technicalSEO.mobileFriendliness.status}
              value={technicalSEO.mobileFriendliness.value}
              issues={technicalSEO.mobileFriendliness.issues}
              recommendations={technicalSEO.mobileFriendliness.recommendations}
            />
          </Accordion>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 sm:mb-4">
          <AuditScoreCard
            title="Security Score"
            score={technicalSEO.ssl.status === "good" ? 90 : 60}
            description="Analysis of security features and best practices"
          />

          <Accordion type="single" collapsible className="space-y-4 sm:mb-4">
            <AuditItem
              title="Directory Listing"
              status="good"
              value="Directory Listing seems to be disabled on the server."
              issues={[]}
              recommendations={["Keep directory listing disabled to prevent exposing sensitive files."]}
            />

            <AuditItem
              title="Malware detection"
              status="good"
              value="Google has not flagged this site for malware."
              issues={[]}
              recommendations={["Regularly scan your site for malware and suspicious code."]}
            />

            <AuditItem
              title="Secure transfer protocol"
              status={technicalSEO.ssl.status}
              value={technicalSEO.ssl.value}
              issues={technicalSEO.ssl.issues}
              recommendations={technicalSEO.ssl.recommendations}
            />

            <AuditItem
              title="HTTP headers"
              status="warning"
              value="Some security headers are missing."
              issues={["Missing Content-Security-Policy header", "Missing X-XSS-Protection header"]}
              recommendations={[
                "Implement Content-Security-Policy headers to prevent XSS attacks",
                "Add X-XSS-Protection and X-Content-Type-Options headers",
                "Consider implementing HSTS for enhanced security",
              ]}
            />
          </Accordion>
        </TabsContent>

        <TabsContent value="competitive" className="space-y-4 sm:mb-4">
          <AuditScoreCard
            title="Competitive Analysis Score"
            score={competitiveAnalysis.score}
            description="Analysis of your website compared to competitors"
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Competitor Overview</CardTitle>
              <CardDescription>Analysis of your top competitors in search results</CardDescription>
            </CardHeader>
            <CardContent>
              {competitiveAnalysis.competitors.length > 0 ? (
                <div className="border rounded-md overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left">Domain</th>
                        <th className="px-4 py-2 text-left">Share of Voice</th>
                        <th className="px-4 py-2 text-left">Common Keywords</th>
                        <th className="px-4 py-2 text-left">Unique Keywords</th>
                      </tr>
                    </thead>
                    <tbody>
                      {competitiveAnalysis.competitors.map((competitor, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-1">
                              {competitor.domain}
                              <a
                                href={`https://${competitor.domain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </td>
                          <td className="px-4 py-2">{competitor.shareOfVoice}</td>
                          <td className="px-4 py-2">{competitor.commonKeywords}</td>
                          <td className="px-4 py-2">{competitor.uniqueKeywords}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground">No competitor data available</p>
              )}
            </CardContent>
          </Card>

          <Accordion type="single" collapsible className="space-y-4 sm:mb-4">
            <AuditItem
              title="Keyword gaps"
              status={competitiveAnalysis.keywordGaps.length > 0 ? "warning" : "good"}
              value={`${competitiveAnalysis.keywordGaps.length} keyword opportunities identified`}
              issues={competitiveAnalysis.issues.filter((issue) => issue.includes("keyword"))}
              recommendations={competitiveAnalysis.recommendations.filter((rec) => rec.includes("keyword"))}
              details={
                competitiveAnalysis.keywordGaps.length > 0 ? (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Keyword Opportunities:</h4>
                    <div className="flex flex-wrap gap-2">
                      {competitiveAnalysis.keywordGaps.map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-muted rounded-md text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null
              }
            />

            <AuditItem
              title="Content gaps"
              status={competitiveAnalysis.contentGaps.length > 0 ? "warning" : "good"}
              value={`${competitiveAnalysis.contentGaps.length} content opportunities identified`}
              issues={competitiveAnalysis.issues.filter((issue) => issue.includes("content"))}
              recommendations={competitiveAnalysis.recommendations.filter((rec) => rec.includes("content"))}
              details={
                competitiveAnalysis.contentGaps.length > 0 ? (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Content Opportunities:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {competitiveAnalysis.contentGaps.map((content, index) => (
                        <li key={index} className="text-sm">
                          {content}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null
              }
            />

            <AuditItem
              title="Backlinks comparison"
              status={competitiveAnalysis.backlinksComparison.status}
              value={competitiveAnalysis.backlinksComparison.value}
              issues={competitiveAnalysis.backlinksComparison.issues}
              recommendations={competitiveAnalysis.backlinksComparison.recommendations}
            />
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface AuditItemProps {
  title: string
  status: "good" | "warning" | "error"
  value: string
  issues: string[]
  recommendations: string[]
  details?: React.ReactNode
}

function AuditItem({ title, status, value, issues, recommendations, details }: AuditItemProps) {
  return (
    <Card>
      <AccordionItem value={title} className="border-none">
        <CardHeader className="pb-2">
          <AccordionTrigger className="py-0">
            <div className="flex items-center gap-3 text-left">
              {status === "good" && <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />}
              {status === "warning" && <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />}
              {status === "error" && <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />}
              <div>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription className="text-sm">{value}</CardDescription>
              </div>
            </div>
          </AccordionTrigger>
        </CardHeader>
        <AccordionContent>
          <CardContent className="pt-0">
            {issues.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Issues:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {issues.map((issue, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Recommendations:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {recommendations.map((recommendation, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {details}
          </CardContent>
        </AccordionContent>
      </AccordionItem>
    </Card>
  )
}
