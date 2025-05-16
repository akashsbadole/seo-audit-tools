"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  FileSearch,
  Download,
  ExternalLink,
  BarChart2,
  Target,
  AlertCircle,
  Link2,
  FileText,
  Settings,
  Bell,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { KeywordTracking } from "@/components/keyword-tracking";
import { CompetitorAnalysis } from "@/components/competitor-analysis";
import { TechnicalSEO } from "@/components/technical-seo";
import { AuditHistory } from "@/components/audit-history";
import { SEOToolsDashboard } from "@/components/seo-tools-dashboard";
import { ContactForm } from "@/components/contact-form";

interface KeywordSearch {
  id: number;
  keyword: string;
  platform: string;
  searchType: string;
  country: string;
  language: string;
  createdAt: string;
}

interface DomainAudit {
  id: number;
  domainName: string;
  ipAddress?: string;
  pdfPath?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { userId } = useAuth();
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();

        if (!data) {
          // Create user if not exists
          const createResponse = await fetch("/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          });
          const newUser = await createResponse.json();
          setUser(newUser);
        } else {
          setUser(data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [userId, router]);

  if (!userId) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Tabs defaultValue="tools" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tools">SEO Tools</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
        </TabsList>

        <TabsContent value="tools" className="space-y-6">
          <SEOToolsDashboard />
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
              <CardDescription>
                Contact our experts for digital marketing, SEO, and web
                development services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
