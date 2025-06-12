"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { MainDashboard } from "@/components/dashboard/main-dashboard";
import { SEOToolsDashboard } from "@/components/seo-tools-dashboard";
import { ContactForm } from "@/components/contact-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

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
  const { user } = useUser();
  const [dbUser, setDbUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!userId || !user) {
      router.push("/sign-in");
      return;
    }

    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/users/${userId}`);

        if (!response.ok) {
          if (response.status === 404) {
            // Create user if not exists
            const createResponse = await fetch("/api/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId,
                email: user.emailAddresses[0]?.emailAddress,
              }),
            });

            if (!createResponse.ok) {
              throw new Error("Failed to create user");
            }

            const newUser = await createResponse.json();
            setDbUser(newUser);
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else {
          const data = await response.json();
          setDbUser(data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast({
          title: "Error",
          description:
            "There was a problem connecting to the database. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId, user, router]);

  if (!userId || !user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="tools">SEO Tools</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <MainDashboard />
        </TabsContent>

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
