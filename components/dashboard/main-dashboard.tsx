"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Globe, 
  Search, 
  Shield, 
  TrendingUp,
  Eye,
  Users,
  Clock,
  BarChart3
} from "lucide-react"
import { DigitalCertaintyIndex } from "./digital-certainty-index"
import { AuditOverview } from "./audit-overview"
import { RecentAudits } from "./recent-audits"
import { QuickActions } from "./quick-actions"
import { PerformanceMetrics } from "./performance-metrics"

interface DashboardData {
  digitalCertaintyIndex: number
  seoScore: number
  accessibilityScore: number
  performanceScore: number
  qualityScore: number
  totalAudits: number
  activeIssues: number
  resolvedIssues: number
  recentAudits: any[]
  keywordRankings: any[]
  trafficData: any[]
}

export function MainDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard')
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mt-2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const data = dashboardData || {
    digitalCertaintyIndex: 0,
    seoScore: 0,
    accessibilityScore: 0,
    performanceScore: 0,
    qualityScore: 0,
    totalAudits: 0,
    activeIssues: 0,
    resolvedIssues: 0,
    recentAudits: [],
    keywordRankings: [],
    trafficData: []
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your website's performance and optimization
          </p>
        </div>
        <QuickActions />
      </div>

      {/* Digital Certainty Index */}
      <DigitalCertaintyIndex score={data.digitalCertaintyIndex} />

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SEO Score</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.seoScore}/100</div>
            <Progress value={data.seoScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {data.seoScore >= 80 ? 'Excellent' : data.seoScore >= 60 ? 'Good' : 'Needs improvement'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accessibility</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.accessibilityScore}/100</div>
            <Progress value={data.accessibilityScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              WCAG 2.1 AA Compliance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.performanceScore}/100</div>
            <Progress value={data.performanceScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Core Web Vitals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Assurance</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.qualityScore}/100</div>
            <Progress value={data.qualityScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Content & Technical Quality
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audits">Recent Audits</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Audit Overview</CardTitle>
                <CardDescription>
                  Your website's health at a glance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AuditOverview data={data} />
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Issue Summary</CardTitle>
                <CardDescription>
                  Current issues requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Critical Issues</span>
                    </div>
                    <Badge variant="destructive">{data.activeIssues}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Resolved Issues</span>
                    </div>
                    <Badge variant="secondary">{data.resolvedIssues}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audits" className="space-y-4">
          <RecentAudits audits={data.recentAudits} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceMetrics data={data} />
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Issues</CardTitle>
              <CardDescription>
                Issues that need your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No active issues found. Great job!
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
