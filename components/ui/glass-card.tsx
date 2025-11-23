import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        "bg-white/10 backdrop-blur-sm border border-white/20",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5 opacity-20" />
      <CardContent className="relative">{children}</CardContent>
    </Card>
  );
}