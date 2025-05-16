import { useEffect, useState } from "react";
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
import {
  Download,
  FileText,
  BarChart2,
  Eye,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface AuditData {
  id: string;
  url: string;
  type: string;
  score: number;
  status: string;
  createdAt: string;
  issues: {
    id: string;
    type: string;
    severity: string;
    description: string;
    status: string;
  }[];
  recommendations: {
    id: string;
    title: string;
    priority: string;
    status: string;
  }[];
}

interface AuditTrends {
  totalAudits: number;
  averageScore: number;
  criticalIssues: number;
  resolvedIssues: number;
}

interface RecentImprovement {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  audit: {
    url: string;
  };
}

export function AuditHistory() {
  const [audits, setAudits] = useState<AuditData[]>([]);
  const [trends, setTrends] = useState<AuditTrends | null>(null);
  const [recentImprovements, setRecentImprovements] = useState<
    RecentImprovement[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuditHistory = async () => {
      try {
        const response = await fetch("/api/audits/history");
        if (!response.ok) {
          throw new Error("Failed to fetch audit history");
        }
        const data = await response.json();
        setAudits(data.audits || []);
        setTrends(data.trends || null);
        setRecentImprovements(data.recentImprovements || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching audit history:", error);
        setError("Failed to load audit history");
        setAudits([]);
        setTrends(null);
        setRecentImprovements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditHistory();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { label: string; variant: "default" | "secondary" | "destructive" }
    > = {
      COMPLETED: { label: "Completed", variant: "default" },
      IN_PROGRESS: { label: "In Progress", variant: "secondary" },
      FAILED: { label: "Failed", variant: "destructive" },
    };
    const { label, variant } = statusMap[status] || {
      label: status,
      variant: "default",
    };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<
      string,
      { label: string; variant: "default" | "secondary" }
    > = {
      FULL: { label: "Full Audit", variant: "default" },
      TECHNICAL: { label: "Technical", variant: "secondary" },
      CONTENT: { label: "Content", variant: "secondary" },
    };
    const { label, variant } = typeMap[type] || {
      label: type,
      variant: "default",
    };
    return <Badge variant={variant}>{label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading audit history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Audit History</CardTitle>
              <CardDescription>
                View and compare your website's performance over time
              </CardDescription>
            </div>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              New Audit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground">Total Audits</div>
              <div className="text-2xl font-bold">
                {trends?.totalAudits || 0}
              </div>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground">Average Score</div>
              <div className="text-2xl font-bold">
                {trends?.averageScore.toFixed(1) || 0}
              </div>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground">
                Critical Issues
              </div>
              <div className="text-2xl font-bold">
                {trends?.criticalIssues || 0}
              </div>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground">
                Resolved Issues
              </div>
              <div className="text-2xl font-bold">
                {trends?.resolvedIssues || 0}
              </div>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Issues</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audits.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground"
                  >
                    No audits found
                  </TableCell>
                </TableRow>
              ) : (
                audits.map((audit) => (
                  <TableRow key={audit.id}>
                    <TableCell>
                      {new Date(audit.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">{audit.url}</TableCell>
                    <TableCell>{getTypeBadge(audit.type)}</TableCell>
                    <TableCell>{audit.score}</TableCell>
                    <TableCell>{audit.issues.length}</TableCell>
                    <TableCell>{getStatusBadge(audit.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Audit Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Trends</CardTitle>
          <CardDescription>
            Track improvements in your website's performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            Chart visualization will be added here
          </div>
        </CardContent>
      </Card>

      {/* Recent Improvements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Improvements</CardTitle>
          <CardDescription>
            Key improvements made based on audit recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentImprovements.length === 0 ? (
              <div className="text-center text-muted-foreground">
                No recent improvements found
              </div>
            ) : (
              recentImprovements.map((improvement) => (
                <div
                  key={improvement.id}
                  className="flex items-start space-x-4 p-4 bg-secondary rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{improvement.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {improvement.description}
                    </p>
                    <div className="mt-2 flex items-center space-x-2">
                      <Badge variant="secondary">{improvement.priority}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {improvement.audit.url}
                      </span>
                    </div>
                  </div>
                  <Badge variant="default">Completed</Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
