import { AuditForm } from "@/components/audit-form";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ContactForm } from "@/components/contact-form";
import { ScrollToTop } from "@/components/scroll-to-top";
import { PremiumFeatures } from "@/components/premium-features";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  Shield,
  Zap,
  Search,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      <HeroSection />

      {/* Features Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-black">
            Complete Website Optimization Platform
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Monitor, analyze, and optimize your website's performance with our
            comprehensive suite of SEO, accessibility, and performance tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 hidden">
          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 mx-auto text-blue-500 mb-4" />
              <CardTitle>Digital Certainty Index</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Get an overall health score for your website across all
                optimization metrics.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Search className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <CardTitle>SEO Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Comprehensive SEO analysis with actionable recommendations for
                better rankings.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 mx-auto text-purple-500 mb-4" />
              <CardTitle>Accessibility Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ensure WCAG compliance and make your website accessible to
                everyone.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="h-12 w-12 mx-auto text-orange-500 mb-4" />
              <CardTitle>Performance Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Monitor Core Web Vitals and optimize your website's loading
                speed.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center hidden">
          <Link href="/dashboard">
            <Button size="lg" className="mr-4">
              View Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link href="/audits">
            <Button variant="outline" size="lg">
              Start Free Audit
            </Button>
          </Link>
        </div>
      </section>

      <div id="seo-audit" className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <AuditForm />
        </div>
      </div>
      <PremiumFeatures />
      <AboutSection />
      <ContactForm />
      <ScrollToTop />
    </main>
  );
}
