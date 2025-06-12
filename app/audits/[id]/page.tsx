"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Search,
  Shield,
  Zap,
  Globe
} from "lucide-react"
import { DigitalCertaintyIndex } from "@/components/dashboard/digital-certainty-index"

interface AuditDetails {
  id: string
  url: string
  status: string
  digitalCertaintyIndex: number
  seoScore: number
  accessibilityScore: number
  performanceScore: number
  qualityScore: number
  totalPages: number
  crawledPages: number
  totalIssues: number
  criticalIssues: number
  warningIssues: number
  infoIssues: number
  createdAt: string
  completedAt: string
  auditResults: Array<{
    category: string
    subcategory: string
    score: number
    data: any
  }>
  auditIssues: Array<{
    id: string
    severity: string
    category: string
    title: string
    description: string
    pageUrl: string
    suggestion: string
    isFixed: boolean
  }>
}

export default function AuditDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [audit, setAudit] = useState<AuditDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchAuditDetails(params.id as string)
    }
  }, [params.id])

  const fetchAuditDetails = async (auditId: string) => {
    try {
      const response = await fetch(`/api/audits/${auditId}`)
      if (response.ok) {
        const data = await response.json()
        setAudit(data)
      }
    } catch (error) {
      console.error('Failed to fetch audit details:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <Badge variant="destructive">Critical</Badge>
      case 'WARNING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>
      case 'INFO':
        return <Badge variant="outline">Info</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'INFO':
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!audit) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Audit Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The audit you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{audit.url}</h1>
            <p className="text-muted-foreground">
              Audit completed on {new Date(audit.completedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open(audit.url, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit Site
          </Button>
        </div>
      </div>

      {/* Digital Certainty Index */}
      <DigitalCertaintyIndex score={audit.digitalCertaintyIndex} />

      {/* Score Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Search className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className={`text-3xl font-bold ${getScoreColor(audit.seoScore)}`}>
              {audit.seoScore}
            </div>
            <div className="text-sm text-muted-foreground">SEO Score</div>
            <Progress value={audit.seoScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className={`text-3xl font-bold ${getScoreColor(audit.accessibilityScore)}`}>
              {audit.accessibilityScore}
            </div>
            <div className="text-sm text-muted-foreground">Accessibility</div>
            <Progress value={audit.accessibilityScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Zap className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <div className={`text-3xl font-bold ${getScoreColor(audit.performanceScore)}`}>
              {audit.performanceScore}
            </div>
            <div className="text-sm text-muted-foreground">Performance</div>
            <Progress value={audit.performanceScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className={`text-3xl font-bold ${getScoreColor(audit.qualityScore)}`}>
              {audit.qualityScore}
            </div>
            <div className="text-sm text-muted-foreground">Quality</div>
            <Progress value={audit.qualityScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Audit Details Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="issues">Issues ({audit.totalIssues})</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="technical">Technical Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Pages Analyzed</span>
                  <span className="font-medium">{audit.crawledPages}/{audit.totalPages}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Issues</span>
                  <span className="font-medium">{audit.totalIssues}</span>
                </div>
                <div className="flex justify-between">
                  <span>Critical Issues</span>
                  <Badge variant="destructive">{audit.criticalIssues}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Warning Issues</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {audit.warningIssues}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Info Issues</span>
                  <Badge variant="outline">{audit.infoIssues}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF Report
                </Button>
                <Button className="w-full" variant="outline">
                  Schedule Re-audit
                </Button>
                <Button className="w-full" variant="outline">
                  Share Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Issues Found</CardTitle>
              <CardDescription>
                Issues that need your attention, sorted by severity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {audit.auditIssues.map((issue) => (
                  <div key={issue.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getSeverityIcon(issue.severity)}
                        <h4 className="font-medium">{issue.title}</h4>
                      </div>
                      {getSeverityBadge(issue.severity)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {issue.description}
                    </p>
                    {issue.pageUrl && (
                      <p className="text-xs text-blue-600 mb-2">
                        Found on: {issue.pageUrl}
                      </p>
                    )}
                    {issue.suggestion && (
                      <div className="bg-blue-50 p-3 rounded text-sm">
                        <strong>Suggestion:</strong> {issue.suggestion}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>
                Prioritized recommendations to improve your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Recommendations will be generated based on the audit results.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technical Details</CardTitle>
              <CardDescription>
                Detailed technical information about the audit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {audit.auditResults.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{result.category} - {result.subcategory}</h4>
                      <div className={`font-bold ${getScoreColor(result.score)}`}>
                        {result.score}/100
                      </div>
                    </div>
                    <Progress value={result.score} className="mb-2" />
                    <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
