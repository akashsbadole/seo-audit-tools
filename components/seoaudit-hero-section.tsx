"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Search,
  Star,
  Zap,
  TrendingUp,
  Play,
  Sparkles,
  CheckCircle,
  Globe,
  BarChart3,
  Users,
  ArrowDown,
  Loader2,
} from "lucide-react";
import Link from "next/link";

// Form validation schema
const formSchema = z.object({
  url: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .refine((url) => url.startsWith("http://") || url.startsWith("https://"), {
      message: "URL must start with http:// or https://",
    }),
});

export function SeoauditHeroSection() {
  const [email, setEmail] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function onAnalyze(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Encode the URL to handle special characters
      const encodedUrl = encodeURIComponent(values.url);
      router.push(`/audit-results?url=${encodedUrl}`);
    } catch (error) {
      console.error("Error analyzing URL:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const features = [
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Advanced Analytics",
      description: "Deep insights into your website performance",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Competitor Intelligence",
      description: "Analyze and outperform your competitors",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global SEO",
      description: "Optimize for search engines worldwide",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Collaboration",
      description: "Work together with your entire team",
    },
  ];

  const stats = [
    { value: "10M+", label: "Keywords analyzed" },
    { value: "500K+", label: "Websites audited" },
    { value: "99.9%", label: "Uptime guarantee" },
    { value: "24/7", label: "Support available" },
  ];

  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[hsl(var(--seoaudit-orange))]/10 to-[hsl(var(--seoaudit-light-blue))]/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[hsl(var(--seoaudit-light-blue))]/10 to-transparent rounded-full filter blur-3xl"></div>
      </div>

      <div className="seoaudit-container seoaudit-section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="px-3 py-1 text-sm bg-[hsl(var(--seoaudit-orange))]/10 text-[hsl(var(--seoaudit-orange))] border-[hsl(var(--seoaudit-orange))]/20">
                <Sparkles className="mr-2 h-4 w-4" />
                Trusted by 50,000+ Marketing Professionals
              </Badge>

              <h1 className="seoaudit-heading">
                <span className="seoaudit-gradient-text">
                  Online Visibility
                </span>
                <br />
                Made Simple
              </h1>

              <p className="seoaudit-subheading">
                Get 55+ tools for SEO, content marketing, competitor research,
                PPC, and social media marketing in one platform.
              </p>
            </div>

            {/* URL Input Form */}
            <form
              onSubmit={form.handleSubmit(onAnalyze)}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="url-input"
                    className="text-sm font-medium text-gray-700"
                  >
                    Enter your website URL to get started
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="url-input"
                      type="url"
                      placeholder="https://example.com"
                      {...form.register("url")}
                      className="flex-1 border-gray-300 focus:border-[hsl(var(--seoaudit-orange))] focus:ring-[hsl(var(--seoaudit-orange))]"
                    />
                    <Button
                      type="submit"
                      className="seoaudit-button whitespace-nowrap"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          Analyze
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                  {form.formState.errors.url && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.url.message}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  No credit card required • Free 7-day trial
                </p>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="seoaudit-button">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link href="#demo">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 text-gray-700 hover:border-[hsl(var(--seoaudit-orange))] hover:text-[hsl(var(--seoaudit-orange))]"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                No setup fee
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Cancel anytime
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                24/7 support
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="seoaudit-card">
                  <div className="flex items-start space-x-3">
                    <div className="seoaudit-feature-icon flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-[hsl(var(--seoaudit-orange))]/10 rounded-full mb-4">
            <ArrowDown className="h-6 w-6 text-[hsl(var(--seoaudit-orange))]" />
          </div>
          <p className="text-lg text-gray-600 mb-4">
            Join thousands of businesses growing with SEOaudit Pro
          </p>
          <Link href="#features">
            <Button
              variant="ghost"
              className="text-[hsl(var(--seoaudit-orange))] hover:text-[hsl(var(--seoaudit-orange))] hover:bg-[hsl(var(--seoaudit-orange))]/10 font-medium"
            >
              Explore all features
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
