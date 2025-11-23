"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  Star,
  Zap,
  Crown,
  Building,
  Users,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function SeoauditPricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Pro",
      description: "For freelancers and startups",
      icon: <Star className="h-6 w-6" />,
      monthlyPrice: 129.95,
      annualPrice: 108.33,
      badge: null,
      features: [
        "5 projects",
        "500 keywords to track",
        "10,000 results per report",
        "3,000 pages to crawl",
        "100 social profiles",
        "50 PDF reports per day",
        "Historical data (1 month)",
        "Competitor intelligence",
        "Content marketing tools",
        "Basic API access",
      ],
      notIncluded: [
        "Multi-user management",
        "White label reports",
        "Dedicated account manager",
        "Advanced API access",
      ],
    },
    {
      name: "Guru",
      description: "For marketing agencies and SMBs",
      icon: <Zap className="h-6 w-6" />,
      monthlyPrice: 249.95,
      annualPrice: 208.33,
      badge: "Most Popular",
      features: [
        "15 projects",
        "1,500 keywords to track",
        "30,000 results per report",
        "Unlimited pages to crawl",
        "300 social profiles",
        "300 PDF reports per day",
        "Historical data (6 months)",
        "Competitor intelligence",
        "Content marketing tools",
        "Advanced API access",
        "Multi-user management (3 users)",
        "Google Data Studio integration",
        "Looker Studio integration",
      ],
      notIncluded: ["White label reports", "Dedicated account manager"],
    },
    {
      name: "Business",
      description: "For large enterprises",
      icon: <Crown className="h-6 w-6" />,
      monthlyPrice: 499.95,
      annualPrice: 416.66,
      badge: null,
      features: [
        "40 projects",
        "5,000 keywords to track",
        "50,000 results per report",
        "Unlimited pages to crawl",
        "500 social profiles",
        "Unlimited PDF reports",
        "Historical data (2 years)",
        "Competitor intelligence",
        "Content marketing tools",
        "Advanced API access",
        "Multi-user management (unlimited users)",
        "Google Data Studio integration",
        "Looker Studio integration",
        "White label reports",
        "Dedicated account manager",
        "Custom limits",
        "Product training",
      ],
      notIncluded: [],
    },
  ];

  const faqs = [
    {
      question: "Can I change my plan later?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
    },
    {
      question: "Is there a free   available?",
      answer:
        "Yes, we offer a 7-day free   for all new users. No credit card required to start your  .",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.",
    },
  ];

  return (
    <section id="pricing" className="bg-white py-20">
      <div className="seoaudit-container">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-3 py-1 text-sm bg-[hsl(var(--seoaudit-orange))]/10 text-[hsl(var(--seoaudit-orange))] border-[hsl(var(--seoaudit-orange))]/20">
            <Building className="mr-2 h-4 w-4" />
            Pricing Plans
          </Badge>

          <h2 className="seoaudit-heading mb-6">
            Choose the Right Plan for Your{" "}
            <span className="seoaudit-gradient-text">Business</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Whether you're a freelancer, agency, or enterprise, we have a plan
            that fits your needs.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <span
              className={`mr-3 font-medium ${!isAnnual ? "text-gray-900" : "text-gray-500"}`}
            >
              Monthly billing
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? "bg-[hsl(var(--seoaudit-orange))]" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`ml-3 font-medium ${isAnnual ? "text-gray-900" : "text-gray-500"}`}
            >
              Annual billing
              <span className="ml-2 text-sm text-green-600 font-semibold">
                Save 17%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl border-2 ${
                plan.badge
                  ? "border-[hsl(var(--seoaudit-orange))] shadow-xl"
                  : "border-gray-200"
              } p-8 hover:shadow-lg transition-all duration-300`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="px-4 py-1 text-sm bg-[hsl(var(--seoaudit-orange))] text-white">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[hsl(var(--seoaudit-orange))]/10 rounded-full text-[hsl(var(--seoaudit-orange))] mb-4">
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    $
                    {isAnnual
                      ? plan.annualPrice.toFixed(2)
                      : plan.monthlyPrice.toFixed(2)}
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>
                {isAnnual && (
                  <p className="text-sm text-green-600 font-medium">
                    ${(plan.monthlyPrice * 12).toFixed(2)} billed annually
                  </p>
                )}
              </div>

              <Link href="/signup" className="block mb-8">
                <Button
                  size="lg"
                  className={`w-full ${
                    plan.badge
                      ? "seoaudit-button"
                      : "border-2 border-gray-300 text-gray-700 hover:border-[hsl(var(--seoaudit-orange))] hover:text-[hsl(var(--seoaudit-orange))]"
                  }`}
                  variant={plan.badge ? "default" : "outline"}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">
                  What's included:
                </h4>
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}

                {plan.notIncluded.length > 0 && (
                  <>
                    <h4 className="font-semibold text-gray-900 pt-4">
                      Not included:
                    </h4>
                    {plan.notIncluded.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <X className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-500">{feature}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="bg-gray-50 rounded-2xl p-8 text-center mb-16">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need a custom solution?
            </h3>
            <p className="text-gray-600 mb-6">
              We offer custom plans for large organizations with specific needs.
              Contact our sales team to discuss your requirements.
            </p>
            <Link href="/contact">
              <Button size="lg" className="seoaudit-button">
                Contact Sales
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <div className="flex items-start">
                  <HelpCircle className="h-5 w-5 text-[hsl(var(--seoaudit-orange))] mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
