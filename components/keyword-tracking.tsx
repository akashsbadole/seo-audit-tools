"use client";

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
import { Search, TrendingUp, TrendingDown, Minus, Plus } from "lucide-react";

interface KeywordData {
  id: string;
  keyword: string;
  position: number;
  previousPosition: number;
  searchVolume: number;
  difficulty: number;
  lastUpdated: string;
}

interface KeywordMetrics {
  totalKeywords: number;
  averagePosition: number;
  keywordsInTop10: number;
  keywordsImproved: number;
  keywordsDeclined: number;
}

interface TrendingKeyword extends KeywordData {
  change: number;
}

export function KeywordTracking() {
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [metrics, setMetrics] = useState<KeywordMetrics | null>(null);
  const [trendingKeywords, setTrendingKeywords] = useState<TrendingKeyword[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKeywordData = async () => {
      try {
        const response = await fetch("/api/keywords/tracking");
        if (!response.ok) {
          throw new Error("Failed to fetch keyword data");
        }
        const data = await response.json();
        setKeywords(data.keywords || []);
        setMetrics(data.metrics || null);
        setTrendingKeywords(data.trendingKeywords || []);
      } catch (error) {
        console.error("Error fetching keyword data:", error);
        // Initialize with empty data on error
        setKeywords([]);
        setMetrics(null);
        setTrendingKeywords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKeywordData();
  }, []);

  const getPositionChange = (position: number, previousPosition: number) => {
    const change = previousPosition - position;
    if (change > 0) {
      return (
        <div className="flex items-center text-green-500">
          <TrendingUp className="h-4 w-4 mr-1" />
          {change}
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center text-red-500">
          <TrendingDown className="h-4 w-4 mr-1" />
          {Math.abs(change)}
        </div>
      );
    }
    return (
      <div className="flex items-center text-gray-500">
        <Minus className="h-4 w-4 mr-1" />0
      </div>
    );
  };

  const filteredKeywords = keywords.filter((keyword) =>
    keyword.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Loading keyword data...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Keyword Tracking</h2>
              <p className="text-muted-foreground">
                Monitor your keyword rankings and performance
              </p>
            </div>
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Keyword
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="p-4 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground">
                Total Keywords
              </div>
              <div className="text-2xl font-bold">
                {metrics?.totalKeywords || 0}
              </div>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground">
                Average Position
              </div>
              <div className="text-2xl font-bold">
                {metrics?.averagePosition.toFixed(1) || 0}
              </div>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground">
                Keywords in Top 10
              </div>
              <div className="text-2xl font-bold">
                {metrics?.keywordsInTop10 || 0}
              </div>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground">
                Keywords Improved
              </div>
              <div className="text-2xl font-bold text-green-500">
                {metrics?.keywordsImproved || 0}
              </div>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground">
                Keywords Declined
              </div>
              <div className="text-2xl font-bold text-red-500">
                {metrics?.keywordsDeclined || 0}
              </div>
            </div>
          </div>

          <Table>
            <thead>
              <tr>
                <th>Keyword</th>
                <th>Position</th>
                <th>Change</th>
                <th>Search Volume</th>
                <th>Difficulty</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredKeywords.map((keyword) => (
                <tr key={keyword.id}>
                  <td className="font-medium">{keyword.keyword}</td>
                  <td>{keyword.position}</td>
                  <td>
                    {getPositionChange(
                      keyword.position,
                      keyword.previousPosition
                    )}
                  </td>
                  <td>{keyword.searchVolume.toLocaleString()}</td>
                  <td>{keyword.difficulty}/100</td>
                  <td>{new Date(keyword.lastUpdated).toLocaleDateString()}</td>
                  <td>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        History
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Trending Keywords</h2>
          <div className="space-y-4">
            {trendingKeywords.map((keyword) => (
              <div
                key={keyword.id}
                className="flex items-center justify-between p-4 bg-secondary rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{keyword.keyword}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-muted-foreground">
                      Position: {keyword.position}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Volume: {keyword.searchVolume.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Difficulty: {keyword.difficulty}/100
                    </span>
                  </div>
                </div>
                {getPositionChange(keyword.position, keyword.previousPosition)}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
