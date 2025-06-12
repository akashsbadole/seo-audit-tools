"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Clock, 
  ExternalLink, 
  Eye, 
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"

interface Audit {
  id: string
  url: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  digitalCertaintyIndex?: number
  seoScore?: number
  accessibilityScore?: number
  performanceScore?: number
  totalIssues?: number
  criticalIssues?: number
  createdAt: string
  completedAt?: string
}

interface RecentAuditsProps {
  audits: Audit[]
}

export function RecentAudits({ audits = [] }: RecentAuditsProps) {
  const router = useRouter()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'IN_PROGRESS':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>
      case 'IN_PROGRESS':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">In Progress</Badge>
      case 'FAILED':
        return <Badge variant="destructive">Failed</Badge>
      case 'PENDING':
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const handleViewAudit = (auditId: string) => {
    router.push(`/audits/${auditId}`)
  }

  const handleDeleteAudit = async (auditId: string) => {
    try {
      await fetch(`/api/audits/${auditId}`, {
        method: 'DELETE',
      })
      // Refresh the page or update the state
      window.location.reload()
    } catch (error) {
      console.error('Failed to delete audit:', error)
    }
  }

  if (audits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Audits</CardTitle>
          <CardDescription>
            Your latest website audits and their results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-4">
              No audits found. Start your first audit to see results here.
            </div>
            <Button onClick={() => router.push('/audits/new')}>
              Start New Audit
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Audits</CardTitle>
        <CardDescription>
          Your latest website audits and their results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {audits.map((audit) => (
            <div 
              key={audit.id} 
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(audit.status)}
                  <div>
                    <div className="font-medium text-sm">{audit.url}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(audit.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusBadge(audit.status)}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewAudit(audit.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => window.open(audit.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Site
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteAudit(audit.id)}
                        className="text-red-600"
                      >
                        Delete Audit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {audit.status === 'COMPLETED' && (
                <div className="space-y-3">
                  {/* Overall Score */}
                  {audit.digitalCertaintyIndex !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Digital Certainty Index
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold ${getScoreColor(audit.digitalCertaintyIndex)}`}>
                          {audit.digitalCertaintyIndex}/100
                        </span>
                        <Progress 
                          value={audit.digitalCertaintyIndex} 
                          className="w-20 h-2" 
                        />
                      </div>
                    </div>
                  )}

                  {/* Individual Scores */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    {audit.seoScore !== undefined && (
                      <div className="text-center">
                        <div className={`font-bold ${getScoreColor(audit.seoScore)}`}>
                          {audit.seoScore}
                        </div>
                        <div className="text-xs text-muted-foreground">SEO</div>
                      </div>
                    )}
                    
                    {audit.accessibilityScore !== undefined && (
                      <div className="text-center">
                        <div className={`font-bold ${getScoreColor(audit.accessibilityScore)}`}>
                          {audit.accessibilityScore}
                        </div>
                        <div className="text-xs text-muted-foreground">Accessibility</div>
                      </div>
                    )}
                    
                    {audit.performanceScore !== undefined && (
                      <div className="text-center">
                        <div className={`font-bold ${getScoreColor(audit.performanceScore)}`}>
                          {audit.performanceScore}
                        </div>
                        <div className="text-xs text-muted-foreground">Performance</div>
                      </div>
                    )}
                  </div>

                  {/* Issues Summary */}
                  {(audit.totalIssues !== undefined || audit.criticalIssues !== undefined) && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Issues Found</span>
                      <div className="flex items-center space-x-2">
                        {audit.criticalIssues !== undefined && audit.criticalIssues > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {audit.criticalIssues} Critical
                          </Badge>
                        )}
                        {audit.totalIssues !== undefined && (
                          <span className="text-muted-foreground">
                            {audit.totalIssues} Total
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {audit.status === 'IN_PROGRESS' && (
                <div className="text-sm text-muted-foreground">
                  Audit in progress... This may take a few minutes.
                </div>
              )}

              {audit.status === 'FAILED' && (
                <div className="text-sm text-red-600">
                  Audit failed. Please try again or contact support.
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            onClick={() => router.push('/audits')}
          >
            View All Audits
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
