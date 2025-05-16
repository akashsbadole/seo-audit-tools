"use client";

import { useState } from "react";
import { SEOToolBase } from "./seo-tool-base";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface MobileFriendlyCheck {
  score: number;
  viewport: {
    width: number;
    height: number;
    initialScale: number;
    userScalable: boolean;
  };
  issues: {
    severity: "error" | "warning" | "info";
    message: string;
    element?: string;
  }[];
  recommendations: string[];
}

export function MobileFriendlinessTester() {
  const [check, setCheck] = useState<MobileFriendlyCheck | null>(null);

  const checkMobileFriendly = async (url: string) => {
    try {
      const response = await fetch("/api/seo-tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolType: "MOBILE_FRIENDLY",
          url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to check mobile friendliness");
      }

      const data = await response.json();
      setCheck(data.check);
      toast.success("Mobile friendliness check completed!");
    } catch (error) {
      toast.error("Failed to check mobile friendliness");
      console.error(error);
    }
  };

  return (
    <SEOToolBase
      title="Mobile-Friendliness Tester"
      description="Test your website's mobile responsiveness and get recommendations for improvement"
      toolType="MOBILE_FRIENDLY"
      onSubmit={checkMobileFriendly}
    >
      {check && (
        <div className="mt-8 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Mobile Friendliness Score
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Score</span>
                  <span>{check.score}%</span>
                </div>
                <Progress value={check.score} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Viewport Width</p>
                  <p className="text-sm text-muted-foreground">
                    {check.viewport.width}px
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Viewport Height</p>
                  <p className="text-sm text-muted-foreground">
                    {check.viewport.height}px
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Initial Scale</p>
                  <p className="text-sm text-muted-foreground">
                    {check.viewport.initialScale}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">User Scalable</p>
                  <Badge
                    variant={
                      check.viewport.userScalable ? "default" : "secondary"
                    }
                  >
                    {check.viewport.userScalable ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>

              {check.issues.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Issues Found</h4>
                  {check.issues.map((issue, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        issue.severity === "error"
                          ? "bg-red-50 dark:bg-red-900/20"
                          : issue.severity === "warning"
                          ? "bg-yellow-50 dark:bg-yellow-900/20"
                          : "bg-blue-50 dark:bg-blue-900/20"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            issue.severity === "error"
                              ? "destructive"
                              : issue.severity === "warning"
                              ? "secondary"
                              : "secondary"
                          }
                        >
                          {issue.severity}
                        </Badge>
                        {issue.element && (
                          <span className="text-sm text-muted-foreground">
                            {issue.element}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm">{issue.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {check.recommendations.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Recommendations</h4>
                  <ul className="list-disc list-inside space-y-2">
                    {check.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </SEOToolBase>
  );
}
