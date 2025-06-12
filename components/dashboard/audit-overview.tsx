"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Search, 
  Shield, 
  Zap,
  Globe
} from "lucide-react"

interface AuditOverviewProps {
  data: {
    seoScore: number
    accessibilityScore: number
    performanceScore: number
    qualityScore: number
    totalAudits: number
    activeIssues: number
    resolvedIssues: number
  }
}

export function AuditOverview({ data }: AuditOverviewProps) {
  const chartData = [
    {
      name: 'SEO',
      score: data.seoScore,
      icon: Search,
      color: '#3b82f6'
    },
    {
      name: 'Accessibility',
      score: data.accessibilityScore,
      icon: Shield,
      color: '#10b981'
    },
    {
      name: 'Performance',
      score: data.performanceScore,
      icon: Zap,
      color: '#f59e0b'
    },
    {
      name: 'Quality',
      score: data.qualityScore,
      icon: CheckCircle,
      color: '#8b5cf6'
    }
  ]

  const issueData = [
    { name: 'Critical', value: 5, color: '#ef4444' },
    { name: 'Warning', value: 12, color: '#f59e0b' },
    { name: 'Info', value: 8, color: '#3b82f6' },
    { name: 'Resolved', value: data.resolvedIssues, color: '#10b981' }
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  return (
    <div className="space-y-6">
      {/* Score Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {chartData.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.name} className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-2">
                  <Icon className="h-6 w-6" style={{ color: item.color }} />
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                  {item.score}
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {item.name}
                </div>
                <Progress value={item.score} className="h-2" />
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Metrics</CardTitle>
            <CardDescription>
              Scores across different audit categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  domain={[0, 100]}
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [`${value}/100`, 'Score']}
                  labelStyle={{ color: '#000' }}
                />
                <Bar 
                  dataKey="score" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Issues Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Issues Distribution</CardTitle>
            <CardDescription>
              Breakdown of current and resolved issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={issueData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {issueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                {issueData.map((item) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{data.totalAudits}</div>
                <div className="text-sm text-muted-foreground">Total Audits</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-2xl font-bold">{data.activeIssues}</div>
                <div className="text-sm text-muted-foreground">Active Issues</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{data.resolvedIssues}</div>
                <div className="text-sm text-muted-foreground">Resolved Issues</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <CardDescription>
            Latest audit activities and improvements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Fixed 3 accessibility issues on homepage</span>
              <Badge variant="secondary" className="ml-auto">2h ago</Badge>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Info className="h-4 w-4 text-blue-500" />
              <span>SEO audit completed for 15 pages</span>
              <Badge variant="secondary" className="ml-auto">4h ago</Badge>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span>New performance issues detected</span>
              <Badge variant="secondary" className="ml-auto">6h ago</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
