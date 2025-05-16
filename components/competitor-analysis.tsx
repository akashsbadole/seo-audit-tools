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
import { Input } from "@/components/ui/input";
import { Search, Plus, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface CompetitorData {
  id: string;
  domain: string;
  domainAuthority: number;
  backlinks: number;
  organicKeywords: number;
  organicTraffic: number;
  lastUpdated: string;
}

interface CompetitorMetrics {
  totalCompetitors: number;
  averageDomainAuthority: number;
  totalBacklinks: number;
  totalOrganicKeywords: number;
  totalOrganicTraffic: number;
}

export function CompetitorAnalysis() {
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [metrics, setMetrics] = useState<CompetitorMetrics | null>(null);
  const [topCompetitors, setTopCompetitors] = useState<CompetitorData[]>([]);
  const [significantChanges, setSignificantChanges] = useState<
    CompetitorData[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitorData = async () => {
      try {
        const response = await fetch("/api/competitors/analysis");
        const data = await response.json();
        setCompetitors(data.competitors);
        setMetrics(data.metrics);
        setTopCompetitors(data.topCompetitors);
        setSignificantChanges(data.significantChanges);
      } catch (error) {
        console.error("Error fetching competitor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitorData();
  }, []);

  const getMetricChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    if (change > 0) {
      return (
        <div className="flex items-center text-green-500">
          <TrendingUp className="h-4 w-4 mr-1" />
          {change.toFixed(1)}%
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center text-red-500">
          <TrendingDown className="h-4 w-4 mr-1" />
          {Math.abs(change).toFixed(1)}%
        </div>
      );
    }
    return (
      <div className="flex items-center text-gray-500">
        <Minus className="h-4 w-4 mr-1" />
        0%
      </div>
    );
  };

  const filteredCompetitors = competitors.filter((competitor) =>
    competitor.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Loading competitor data...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Competitor Analysis</h2>
              <p className="text-muted-foreground">
                Track and analyze your competitors' performance
              </p>
            </div>
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search competitors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Competitor
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="p-4 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground">
                Total Competitors
              </div>
              <div className="text-2xl font-bold">
                {metrics?.totalCompetitors || 0}
              </div>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground">
                Avg. Domain Authority
              </div>
              <div className="text-2xl font-bold">
                {metrics?.averageDomainAuthority.toFixed(1) || 0}
              </div>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground">
                Total Backlinks
              </div>
              <div className="text-2xl font-bold">
                {metrics?.totalBacklinks.toLocaleString() || 0}
              </div>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground">
                Organic Keywords
              </div>
              <div className="text-2xl font-bold">
                {metrics?.totalOrganicKeywords.toLocaleString() || 0}
              </div>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground">
                Organic Traffic
              </div>
              <div className="text-2xl font-bold">
                {metrics?.totalOrganicTraffic.toLocaleString() || 0}
              </div>
            </div>
          </div>

          <Table>
            <thead>
              <tr>
                <th>Domain</th>
                <th>Domain Authority</th>
                <th>Backlinks</th>
                <th>Organic Keywords</th>
                <th>Organic Traffic</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompetitors.map((competitor) => (
                <tr key={competitor.id}>
                  <td className="font-medium">{competitor.domain}</td>
                  <td>{competitor.domainAuthority}/100</td>
                  <td>{competitor.backlinks.toLocaleString()}</td>
                  <td>{competitor.organicKeywords.toLocaleString()}</td>
                  <td>{competitor.organicTraffic.toLocaleString()}</td>
                  <td>
                    {new Date(competitor.lastUpdated).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                      <Button variant="ghost" size="sm">
                        Compare
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Top Competitors</h2>
            <div className="space-y-4">
              {topCompetitors.map((competitor) => (
                <div
                  key={competitor.id}
                  className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{competitor.domain}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-muted-foreground">
                        DA: {competitor.domainAuthority}/100
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Backlinks: {competitor.backlinks.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Compare
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Changes</h2>
            <div className="space-y-4">
              {significantChanges.map((competitor) => (
                <div
                  key={competitor.id}
                  className="p-4 bg-secondary rounded-lg"
                >
                  <h3 className="font-semibold">{competitor.domain}</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Domain Authority
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">
                          {competitor.domainAuthority}/100
                        </span>
                        {getMetricChange(
                          competitor.domainAuthority,
                          competitor.domainAuthority - 2
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Backlinks
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">
                          {competitor.backlinks.toLocaleString()}
                        </span>
                        {getMetricChange(
                          competitor.backlinks,
                          competitor.backlinks - 100
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
