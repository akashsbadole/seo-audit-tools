"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  MoreHorizontal,
  Calendar,
  Globe,
  TrendingUp
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { formatDistanceToNow } from "date-fns"

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

interface AuditsResponse {
  audits: Audit[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function AuditsPage() {
  const router = useRouter()
  const [audits, setAudits] = useState<Audit[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  })
  const [isNewAuditOpen, setIsNewAuditOpen] = useState(false)
  const [newAuditUrl, setNewAuditUrl] = useState("")

  useEffect(() => {
    fetchAudits()
  }, [pagination.page, filters])

  const fetchAudits = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search })
      })

      const response = await fetch(`/api/audits?${params}`)
      if (response.ok) {
        const data: AuditsResponse = await response.json()
        setAudits(data.audits)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch audits:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewAudit = async () => {
    if (!newAuditUrl.trim()) return

    try {
      const response = await fetch('/api/audits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: newAuditUrl,
          type: 'FULL_AUDIT'
        }),
      })

      if (response.ok) {
        const audit = await response.json()
        setIsNewAuditOpen(false)
        setNewAuditUrl("")
        fetchAudits() // Refresh the list
        router.push(`/audits/${audit.id}`)
      }
    } catch (error) {
      console.error('Failed to start audit:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'IN_PROGRESS':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
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

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Website Audits</h1>
          <p className="text-muted-foreground">
            Manage and monitor your website audits
          </p>
        </div>
        
        <Dialog open={isNewAuditOpen} onOpenChange={setIsNewAuditOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Audit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start New Website Audit</DialogTitle>
              <DialogDescription>
                Enter a website URL to begin a comprehensive audit
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  Website URL
                </Label>
                <Input
                  id="url"
                  placeholder="https://example.com"
                  value={newAuditUrl}
                  onChange={(e) => setNewAuditUrl(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsNewAuditOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleNewAudit} disabled={!newAuditUrl.trim()}>
                Start Audit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search audits..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="max-w-sm"
              />
            </div>
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audits List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : audits.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No audits found</h3>
              <p className="text-muted-foreground mb-4">
                Start your first website audit to see results here.
              </p>
              <Button onClick={() => setIsNewAuditOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Start New Audit
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {audits.map((audit) => (
            <Card key={audit.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-lg">{audit.url}</h3>
                      {getStatusBadge(audit.status)}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDistanceToNow(new Date(audit.createdAt), { addSuffix: true })}</span>
                      </div>
                      {audit.totalIssues !== undefined && (
                        <div className="flex items-center space-x-1">
                          <span>{audit.totalIssues} issues found</span>
                        </div>
                      )}
                    </div>

                    {audit.status === 'COMPLETED' && (
                      <div className="flex items-center space-x-6">
                        {audit.digitalCertaintyIndex !== undefined && (
                          <div className="text-center">
                            <div className={`text-xl font-bold ${getScoreColor(audit.digitalCertaintyIndex)}`}>
                              {audit.digitalCertaintyIndex}
                            </div>
                            <div className="text-xs text-muted-foreground">Overall</div>
                          </div>
                        )}
                        {audit.seoScore !== undefined && (
                          <div className="text-center">
                            <div className={`text-lg font-bold ${getScoreColor(audit.seoScore)}`}>
                              {audit.seoScore}
                            </div>
                            <div className="text-xs text-muted-foreground">SEO</div>
                          </div>
                        )}
                        {audit.accessibilityScore !== undefined && (
                          <div className="text-center">
                            <div className={`text-lg font-bold ${getScoreColor(audit.accessibilityScore)}`}>
                              {audit.accessibilityScore}
                            </div>
                            <div className="text-xs text-muted-foreground">Accessibility</div>
                          </div>
                        )}
                        {audit.performanceScore !== undefined && (
                          <div className="text-center">
                            <div className={`text-lg font-bold ${getScoreColor(audit.performanceScore)}`}>
                              {audit.performanceScore}
                            </div>
                            <div className="text-xs text-muted-foreground">Performance</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/audits/${audit.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/audits/${audit.id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download Report
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete Audit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page >= pagination.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
