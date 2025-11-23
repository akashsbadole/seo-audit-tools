"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star, Zap, Shield, Crown } from "lucide-react";
import { GradientButton } from "./ui/gradient-button";

const PricingComparison = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "free",
      name: "Starter",
      description: "Perfect for trying out our platform",
      price: billingCycle === "monthly" ? "$0" : "$0",
      yearlyPrice: "$0",
      monthlyPrice: "$0",
      icon: <Star className="h-6 w-6" />,
      color: "from-gray-500 to-gray-600",
      features: [
        { name: "Basic SEO Audit", included: true },
        { name: "10 Reports per month", included: true },
        { name: "Keyword Research", included: true },
        { name: "Meta Tag Generator", included: true },
        { name: "AI Content Analysis (5/month)", included: true },
        { name: "Website Monitoring (3 sites)", included: true },
        { name: "Competitor Analysis", included: false },
        { name: "Advanced Analytics", included: false },
        { name: "API Access", included: false },
        { name: "Priority Support", included: false },
        { name: "Custom Reports", included: false },
        { name: "White Label Reports", included: false },
      ],
      cta: "Get Started Free",
      popular: false,
    },
    {
      id: "premium",
      name: "Professional",
      description: "Best for growing businesses and agencies",
      price: billingCycle === "monthly" ? "$29" : "$290",
      yearlyPrice: "$290",
      monthlyPrice: "$29",
      icon: <Zap className="h-6 w-6" />,
      color: "from-blue-500 to-purple-600",
      features: [
        { name: "Advanced SEO Audit", included: true },
        { name: "Unlimited Reports", included: true },
        { name: "Advanced Keyword Research", included: true },
        { name: "All SEO Tools", included: true },
        { name: "Unlimited AI Analysis", included: true },
        { name: "Unlimited Website Monitoring", included: true },
        { name: "Competitor Analysis", included: true },
        { name: "Advanced Analytics", included: true },
        { name: "API Access", included: true },
        { name: "Priority Support", included: true },
        { name: "Custom Reports", included: true },
        { name: "White Label Reports", included: false },
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For large teams and agencies",
      price: billingCycle === "monthly" ? "$99" : "$990",
      yearlyPrice: "$990",
      monthlyPrice: "$99",
      icon: <Crown className="h-6 w-6" />,
      color: "from-purple-500 to-pink-600",
      features: [
        { name: "Enterprise SEO Audit", included: true },
        { name: "Unlimited Everything", included: true },
        { name: "Custom Keyword Research", included: true },
        { name: "All SEO Tools + Custom", included: true },
        { name: "Unlimited AI Analysis", included: true },
        { name: "Unlimited Monitoring", included: true },
        { name: "Advanced Competitor Analysis", included: true },
        { name: "Custom Analytics Dashboard", included: true },
        { name: "Advanced API Access", included: true },
        { name: "Dedicated Support", included: true },
        { name: "Custom Reports", included: true },
        { name: "White Label Reports", included: true },
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  const handlePlanSelect = (planId: string) => {
    if (planId === "enterprise") {
      // Open contact modal or redirect to contact page
      window.location.href = "/contact";
    } else {
      // Redirect to signup page with plan selection
      window.location.href = `/sign-up?plan=${planId}&billing=${billingCycle}`;
    }
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000" />
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2">
            Pricing Plans
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Choose Your Perfect Plan
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Start free and upgrade as you grow. All plans include our core SEO tools with varying levels of advanced features.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-lg font-medium ${billingCycle === "monthly" ? "text-gray-900" : "text-gray-500"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  billingCycle === "yearly" ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-lg font-medium ${billingCycle === "yearly" ? "text-gray-900" : "text-gray-500"}`}>
              Yearly
              <Badge className="ml-2 bg-green-100 text-green-800">Save 17%</Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                hoveredPlan === plan.id ? "ring-2 ring-blue-500" : ""
              } ${plan.popular ? "border-2 border-blue-500" : "border border-gray-200"}`}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-bl-lg text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} text-white mb-4`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600 ml-2">/{billingCycle === "monthly" ? "month" : "year"}</span>
                </div>
              </CardHeader>

              <CardContent className="pb-8">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? "text-gray-700" : "text-gray-400"}`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <GradientButton
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </GradientButton>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h3 className="text-2xl font-bold mb-8 text-center">Detailed Feature Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-6 font-semibold">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold">Starter</th>
                  <th className="text-center py-4 px-6 font-semibold">Professional</th>
                  <th className="text-center py-4 px-6 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "SEO Audit", starter: "Basic", professional: "Advanced", enterprise: "Enterprise" },
                  { feature: "Reports/Month", starter: "10", professional: "Unlimited", enterprise: "Unlimited" },
                  { feature: "AI Analysis", starter: "5/month", professional: "Unlimited", enterprise: "Unlimited" },
                  { feature: "Website Monitoring", starter: "3 sites", professional: "Unlimited", enterprise: "Unlimited" },
                  { feature: "Competitor Analysis", starter: "❌", professional: "✅", enterprise: "✅" },
                  { feature: "API Access", starter: "❌", professional: "✅", enterprise: "✅" },
                  { feature: "Support", starter: "Email", professional: "Priority", enterprise: "Dedicated" },
                  { feature: "Custom Reports", starter: "❌", professional: "✅", enterprise: "✅" },
                  { feature: "White Label", starter: "❌", professional: "❌", enterprise: "✅" },
                ].map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium">{row.feature}</td>
                    <td className="text-center py-4 px-6">{row.starter}</td>
                    <td className="text-center py-4 px-6">{row.professional}</td>
                    <td className="text-center py-4 px-6">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-8">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                q: "Can I change plans anytime?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                q: "Is there a free trial?",
                a: "Yes, we offer a 14-day free trial for our Professional plan. No credit card required.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and wire transfers for Enterprise plans.",
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 30-day money-back guarantee for all paid plans if you're not satisfied.",
              },
            ].map((faq, index) => (
              <div key={index} className="text-left bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold mb-2">{faq.q}</h4>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingComparison;