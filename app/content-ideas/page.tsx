"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Lightbulb,
  Loader2,
  AlertCircle,
  Brain,
  Copy,
  CheckCircle,
  TrendingUp,
  Hash,
} from "lucide-react";

interface ContentIdea {
  title: string;
  description: string;
  contentType: string;
  difficulty: string;
  searchVolume: number;
  targetKeywords: string[];
  potentialTraffic: number;
}

export default function ContentIdeasPage() {
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [ideas, setIdeas] = useState<ContentIdea[] | null>(null);
  const [error, setError] = useState("");

  const generateIdeas = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/content-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, contentType }),
      });

      const data = await response.json();

      if (response.ok) {
        setIdeas(data.ideas);
      } else {
        setError(data.error || "Failed to generate ideas");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      hard: "bg-red-100 text-red-800",
    };
    return colors[difficulty] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="seoaudit-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Ideas Generator</h1>
          <p className="text-gray-600">
            Generate data-driven content ideas that will attract traffic and engage your audience.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Generate Ideas
            </CardTitle>
            <CardDescription>Enter a topic to generate content ideas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter topic (e.g., SEO, digital marketing, cooking)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generateIdeas()}
                className="flex-1"
              />
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="blog">Blog Posts</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="guide">Guides</SelectItem>
                  <SelectItem value="listicle">Listicles</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={generateIdeas} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {ideas && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ideas.map((idea, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="capitalize">{idea.contentType}</Badge>
                    <Badge className={getDifficultyColor(idea.difficulty)}>{idea.difficulty}</Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">{idea.title}</CardTitle>
                  <CardDescription>{idea.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {idea.targetKeywords.map((kw, j) => (
                        <Badge key={j} variant="secondary" className="text-xs">
                          <Hash className="h-3 w-3 mr-1" />
                          {kw}
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Search Volume</span>
                        <div className="font-semibold">{idea.searchVolume.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Potential Traffic</span>
                        <div className="font-semibold text-green-600">{idea.potentialTraffic.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(idea.title)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Title
                      </Button>
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Use Idea
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
