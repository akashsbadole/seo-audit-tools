import { AuditForm } from "@/components/audit-form";
import { AboutSection } from "@/components/about-section";
import { ContactForm } from "@/components/contact-form";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SeoauditHeroSection } from "@/components/seoaudit-hero-section";
import { SeoauditFeatures } from "@/components/seoaudit-features";
import { SeoauditPricing } from "@/components/seoaudit-pricing";
import { SeoauditTestimonials } from "@/components/seoaudit-testimonials";
import { Button } from "@/components/ui/button";
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
    <main className="min-h-screen bg-white">
      <SeoauditHeroSection />
      <SeoauditFeatures />
      <SeoauditTestimonials />
      <SeoauditPricing />

      {/* Quick Audit Section */}
      <section id="seo-audit" className="bg-gray-50 py-16">
        <div className="seoaudit-container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="seoaudit-heading mb-4">
                Quick <span className="seoaudit-gradient-text">SEO Audit</span>
              </h2>
              <p className="text-xl text-gray-600">
                Get an instant snapshot of your website's SEO performance
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <AuditForm />
            </div>
          </div>
        </div>
      </section>

      <AboutSection />
      <ContactForm />
      <ScrollToTop />
    </main>
  );
}
