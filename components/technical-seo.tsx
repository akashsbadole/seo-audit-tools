"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";

interface TechnicalIssue {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  description: string;
  affectedPages: number;
  status: "open" | "in-progress" | "resolved";
  lastChecked: string;
}

export function TechnicalSEO() {
  const [issues, setIssues] = useState<TechnicalIssue[]>([
    {
      id: "1",
      type: "Broken Links",
      severity: "critical",
      description: "15 broken internal links found",
      affectedPages: 8,
      status: "open",
      lastChecked: "2024-03-20",
    },
    {
      id: "2",
      type: "Missing Meta Descriptions",
      severity: "warning",
      description: "23 pages missing meta descriptions",
      affectedPages: 23,
      status: "in-progress",
      lastChecked: "2024-03-20",
    },
    {
      id: "3",
      type: "Slow Loading Pages",
      severity: "warning",
      description: "5 pages taking more than 3 seconds to load",
      affectedPages: 5,
      status: "open",
      lastChecked: "2024-03-20",
    },
    {
      id: "4",
      type: "Mobile Responsiveness",
      severity: "info",
      description: "3 pages need mobile optimization",
      affectedPages: 3,
      status: "resolved",
      lastChecked: "2024-03-20",
    },
  ]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "info":
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "warning":
        return <Badge variant="warning">Warning</Badge>;
      case "info":
        return <Badge variant="secondary">Info</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="outline">Open</Badge>;
      case "in-progress":
        return <Badge variant="secondary">In Progress</Badge>;
      case "resolved":
        return <Badge variant="success">Resolved</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Technical SEO Issues</CardTitle>
          <CardDescription>
            Monitor and fix technical SEO problems affecting your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issue</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Affected Pages</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Checked</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(issue.severity)}
                      {issue.type}
                    </div>
                  </TableCell>
                  <TableCell>{getSeverityBadge(issue.severity)}</TableCell>
                  <TableCell>{issue.description}</TableCell>
                  <TableCell>{issue.affectedPages}</TableCell>
                  <TableCell>{getStatusBadge(issue.status)}</TableCell>
                  <TableCell>{issue.lastChecked}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Fix
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Technical SEO Score */}
      <Card>
        <CardHeader>
          <CardTitle>Technical SEO Score</CardTitle>
          <CardDescription>
            Overall technical health of your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Critical Issues</h3>
              <p className="text-2xl font-bold text-red-500">1</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Warnings</h3>
              <p className="text-2xl font-bold text-amber-500">2</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Resolved</h3>
              <p className="text-2xl font-bold text-green-500">1</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>
            Suggested actions to improve technical SEO
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Priority Actions</h3>
              <ul className="space-y-2">
                <li className="text-sm text-muted-foreground">
                  • Fix broken internal links on 8 pages
                </li>
                <li className="text-sm text-muted-foreground">
                  • Add meta descriptions to 23 pages
                </li>
                <li className="text-sm text-muted-foreground">
                  • Optimize loading speed for 5 pages
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
