"use client"

import { Suspense } from "react"
import { AuditResults } from "@/components/audit-results"
import { AuditResultsSkeleton } from "@/components/audit-results-skeleton"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { notFound } from "next/navigation"

function AuditResultsContent() {
  const searchParams = useSearchParams()
  const urlParam = searchParams.get('url')
  
  if (!urlParam) {
    return (
      <main className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-1 px-1">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-8">No URL provided</h1>
          <p>Please provide a URL to analyze.</p>
        </div>
      </main>
    )
  }

  // Validate and normalize the URL
  let url: string
  try {
    // First decode the URL parameter
    const decodedUrl = decodeURIComponent(urlParam)
    // Then validate it by creating a URL object
    const urlObj = new URL(decodedUrl)
    url = urlObj.toString()
  } catch (error) {
    return (
      <main className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-1 px-1">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-8">Invalid URL</h1>
          <p>The provided URL is not valid. Please check the URL and try again.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-1 px-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-8">SEO Audit Results</h1>
        <Suspense fallback={<AuditResultsSkeleton />}>
          <AuditResults url={url} />
        </Suspense>
      </div>
    </main>
  )
}

export default function AuditResultsPage() {
  return (
    <Suspense fallback={<AuditResultsSkeleton />}>
      <AuditResultsContent />
    </Suspense>
  )
}
