"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Plus, 
  Search, 
  FileText, 
  Download, 
  Settings,
  Globe,
  Zap,
  Shield
} from "lucide-react"
import { useRouter } from "next/navigation"

export function QuickActions() {
  const [isNewAuditOpen, setIsNewAuditOpen] = useState(false)
  const [auditUrl, setAuditUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleNewAudit = async () => {
    if (!auditUrl.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/audits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: auditUrl,
          type: 'FULL_AUDIT'
        }),
      })

      if (response.ok) {
        const audit = await response.json()
        setIsNewAuditOpen(false)
        setAuditUrl("")
        router.push(`/audits/${audit.id}`)
      }
    } catch (error) {
      console.error('Failed to start audit:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const quickAuditActions = [
    {
      label: "SEO Audit",
      icon: Search,
      action: () => router.push('/tools/seo-score'),
      description: "Comprehensive SEO analysis"
    },
    {
      label: "Accessibility Check",
      icon: Shield,
      action: () => router.push('/tools/accessibility'),
      description: "WCAG compliance check"
    },
    {
      label: "Performance Test",
      icon: Zap,
      action: () => router.push('/tools/performance'),
      description: "Core Web Vitals analysis"
    },
    {
      label: "Full Site Audit",
      icon: Globe,
      action: () => setIsNewAuditOpen(true),
      description: "Complete website analysis"
    }
  ]

  return (
    <div className="flex items-center space-x-2">
      {/* Quick Audit Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Quick Audit
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {quickAuditActions.map((action) => {
            const Icon = action.icon
            return (
              <DropdownMenuItem 
                key={action.label}
                onClick={action.action}
                className="cursor-pointer"
              >
                <Icon className="h-4 w-4 mr-2" />
                <div>
                  <div className="font-medium">{action.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* New Full Audit Button */}
      <Dialog open={isNewAuditOpen} onOpenChange={setIsNewAuditOpen}>
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Audit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Start New Site Audit</DialogTitle>
            <DialogDescription>
              Enter a website URL to begin a comprehensive audit including SEO, 
              accessibility, performance, and quality checks.
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
                value={auditUrl}
                onChange={(e) => setAuditUrl(e.target.value)}
                className="col-span-3"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleNewAudit()
                  }
                }}
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
            <Button 
              type="submit" 
              onClick={handleNewAudit}
              disabled={!auditUrl.trim() || isLoading}
            >
              {isLoading ? "Starting..." : "Start Audit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reports Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Reports
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Generate Reports</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/reports/seo')}>
            <Search className="h-4 w-4 mr-2" />
            SEO Report
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/reports/accessibility')}>
            <Shield className="h-4 w-4 mr-2" />
            Accessibility Report
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/reports/performance')}>
            <Zap className="h-4 w-4 mr-2" />
            Performance Report
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/reports/custom')}>
            <FileText className="h-4 w-4 mr-2" />
            Custom Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Settings Button */}
      <Button variant="ghost" size="sm" onClick={() => router.push('/settings')}>
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  )
}
