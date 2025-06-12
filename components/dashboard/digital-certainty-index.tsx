"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface DigitalCertaintyIndexProps {
  score: number
  previousScore?: number
  trend?: 'up' | 'down' | 'stable'
}

export function DigitalCertaintyIndex({ 
  score, 
  previousScore = 0, 
  trend = 'stable' 
}: DigitalCertaintyIndexProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent"
    if (score >= 80) return "Very Good"
    if (score >= 70) return "Good"
    if (score >= 60) return "Fair"
    if (score >= 40) return "Poor"
    return "Critical"
  }

  const getScoreDescription = (score: number) => {
    if (score >= 90) return "Your website is performing exceptionally well across all metrics."
    if (score >= 80) return "Your website is performing very well with minor areas for improvement."
    if (score >= 70) return "Your website is performing well but has some optimization opportunities."
    if (score >= 60) return "Your website has moderate performance with several areas needing attention."
    if (score >= 40) return "Your website has significant issues that should be addressed promptly."
    return "Your website has critical issues requiring immediate attention."
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const scoreDifference = score - previousScore

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Digital Certainty Index</CardTitle>
        <CardDescription className="text-base">
          Overall website health and optimization score
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Score Display */}
        <div className="text-center space-y-4">
          <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
            {score}
            <span className="text-2xl text-muted-foreground">/100</span>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <Badge 
              variant={score >= 80 ? "default" : score >= 60 ? "secondary" : "destructive"}
              className="text-sm px-3 py-1"
            >
              {getScoreLabel(score)}
            </Badge>
            
            {previousScore > 0 && (
              <div className="flex items-center space-x-1 text-sm">
                {getTrendIcon()}
                <span className={
                  trend === 'up' ? 'text-green-600' : 
                  trend === 'down' ? 'text-red-600' : 
                  'text-gray-600'
                }>
                  {scoreDifference > 0 ? '+' : ''}{scoreDifference}
                </span>
              </div>
            )}
          </div>

          <Progress 
            value={score} 
            className="w-full h-3"
          />
          
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            {getScoreDescription(score)}
          </p>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-blue-600">85</div>
            <div className="text-xs text-muted-foreground">SEO</div>
            <Progress value={85} className="h-2" />
          </div>
          
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-green-600">92</div>
            <div className="text-xs text-muted-foreground">Accessibility</div>
            <Progress value={92} className="h-2" />
          </div>
          
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-orange-600">78</div>
            <div className="text-xs text-muted-foreground">Performance</div>
            <Progress value={78} className="h-2" />
          </div>
          
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-purple-600">88</div>
            <div className="text-xs text-muted-foreground">Quality</div>
            <Progress value={88} className="h-2" />
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-white/50 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-sm">Key Insights</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Pages Analyzed</span>
              <span className="font-medium">247</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Issues Found</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last Updated</span>
              <span className="font-medium">2 hours ago</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
