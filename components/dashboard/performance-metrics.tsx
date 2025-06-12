"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Zap, 
  Eye,
  Users
} from "lucide-react"

interface PerformanceMetricsProps {
  data: {
    trafficData: any[]
    keywordRankings: any[]
  }
}

export function PerformanceMetrics({ data }: PerformanceMetricsProps) {
  // Sample data for demonstration
  const trafficData = data.trafficData.length > 0 ? data.trafficData : [
    { date: '2024-01-01', visitors: 1200, pageViews: 3400, bounceRate: 45 },
    { date: '2024-01-02', visitors: 1350, pageViews: 3800, bounceRate: 42 },
    { date: '2024-01-03', visitors: 1100, pageViews: 3100, bounceRate: 48 },
    { date: '2024-01-04', visitors: 1450, pageViews: 4200, bounceRate: 40 },
    { date: '2024-01-05', visitors: 1600, pageViews: 4600, bounceRate: 38 },
    { date: '2024-01-06', visitors: 1380, pageViews: 3900, bounceRate: 44 },
    { date: '2024-01-07', visitors: 1520, pageViews: 4300, bounceRate: 41 }
  ]

  const keywordData = data.keywordRankings.length > 0 ? data.keywordRankings : [
    { keyword: 'seo tools', position: 3, change: 2, volume: 8100 },
    { keyword: 'website audit', position: 7, change: -1, volume: 2900 },
    { keyword: 'accessibility checker', position: 12, change: 5, volume: 1200 },
    { keyword: 'performance test', position: 15, change: 0, volume: 890 },
    { keyword: 'meta tags generator', position: 4, change: 1, volume: 1500 }
  ]

  const coreWebVitals = [
    { 
      metric: 'Largest Contentful Paint', 
      value: '2.1s', 
      status: 'good',
      description: 'Time to render largest element'
    },
    { 
      metric: 'First Input Delay', 
      value: '45ms', 
      status: 'good',
      description: 'Time to first user interaction'
    },
    { 
      metric: 'Cumulative Layout Shift', 
      value: '0.08', 
      status: 'needs-improvement',
      description: 'Visual stability score'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600'
      case 'needs-improvement':
        return 'text-yellow-600'
      case 'poor':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good':
        return <Badge className="bg-green-100 text-green-800">Good</Badge>
      case 'needs-improvement':
        return <Badge className="bg-yellow-100 text-yellow-800">Needs Improvement</Badge>
      case 'poor':
        return <Badge variant="destructive">Poor</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <div className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Traffic Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Website Traffic</CardTitle>
            <CardDescription>
              Visitor trends over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis fontSize={12} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value, name) => [value, name === 'visitors' ? 'Visitors' : 'Page Views']}
                />
                <Area 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.1}
                />
                <Area 
                  type="monotone" 
                  dataKey="pageViews" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Core Web Vitals</CardTitle>
            <CardDescription>
              Essential performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {coreWebVitals.map((vital) => (
                <div key={vital.metric} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{vital.metric}</div>
                    <div className="text-xs text-muted-foreground">
                      {vital.description}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold ${getStatusColor(vital.status)}`}>
                      {vital.value}
                    </span>
                    {getStatusBadge(vital.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keyword Rankings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Keyword Rankings</CardTitle>
          <CardDescription>
            Current search engine positions for tracked keywords
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {keywordData.map((keyword, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-sm">{keyword.keyword}</div>
                  <div className="text-xs text-muted-foreground">
                    Search Volume: {keyword.volume.toLocaleString()}/month
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-lg font-bold">#{keyword.position}</div>
                    <div className="text-xs text-muted-foreground">Position</div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(keyword.change)}
                    <span className={`text-sm ${
                      keyword.change > 0 ? 'text-green-600' : 
                      keyword.change < 0 ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {keyword.change > 0 ? `+${keyword.change}` : keyword.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">1,420</div>
                <div className="text-sm text-muted-foreground">Avg. Daily Visitors</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">2.3s</div>
                <div className="text-sm text-muted-foreground">Avg. Load Time</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">42%</div>
                <div className="text-sm text-muted-foreground">Bounce Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
