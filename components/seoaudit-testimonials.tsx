"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  Quote,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function SeoauditTestimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechStart Inc.",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      content:
        "SEOaudit Pro has transformed how we approach SEO. The keyword research tools alone have helped us increase organic traffic by 150% in just 6 months. The competitor analysis features give us insights we never had before.",
      results: "150% increase in organic traffic",
    },
    {
      name: "Michael Chen",
      role: "SEO Specialist",
      company: "Digital Agency Pro",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      content:
        "As an agency managing multiple clients, SEOaudit Pro has been a game-changer. The project management features and comprehensive reporting make it easy to demonstrate ROI to our clients. Worth every penny!",
      results: "40+ clients managed successfully",
    },
    {
      name: "Emily Rodriguez",
      role: "Content Manager",
      company: "E-commerce Plus",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      content:
        "The content marketing tools in SEOaudit Pro are exceptional. We've been able to create content that ranks on the first page consistently. The SEO Content Template saves us hours of research time.",
      results: "300% increase in first-page rankings",
    },
    {
      name: "David Kim",
      role: "Business Owner",
      company: "Local Services Co.",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      content:
        "I was skeptical about investing in SEO tools, but SEOaudit Pro paid for itself within the first month. The site audit feature helped us fix critical issues that were holding back our rankings.",
      results: "ROI achieved in first month",
    },
    {
      name: "Jessica Taylor",
      role: "Digital Marketing Manager",
      company: "Global Retail Corp",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      content:
        "The scale and depth of data in SEOaudit Pro is unmatched. We use it for market research, competitor analysis, and tracking our global SEO performance across 20+ countries.",
      results: "20+ countries tracked globally",
    },
  ];

  const stats = [
    {
      value: "50,000+",
      label: "Happy Customers",
    },
    {
      value: "4.8/5",
      label: "Average Rating",
    },
    {
      value: "150+",
      label: "Countries Served",
    },
    {
      value: "99.9%",
      label: "Uptime",
    },
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="bg-gray-50 py-20">
      <div className="seoaudit-container">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-3 py-1 text-sm bg-[hsl(var(--seoaudit-orange))]/10 text-[hsl(var(--seoaudit-orange))] border-[hsl(var(--seoaudit-orange))]/20">
            <Star className="mr-2 h-4 w-4" />
            Customer Success Stories
          </Badge>

          <h2 className="seoaudit-heading mb-6">
            What Our{" "}
            <span className="seoaudit-gradient-text">Customers Say</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of marketers, agencies, and businesses who trust
            SEOaudit Pro to grow their online presence.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Testimonial */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12 mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start mb-8">
              <Quote className="h-12 w-12 text-[hsl(var(--seoaudit-orange))] mr-4 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-6">
                  {testimonials[activeTestimonial].content}
                </p>
                <div className="bg-[hsl(var(--seoaudit-orange))]/10 rounded-lg px-4 py-2 inline-block">
                  <span className="text-[hsl(var(--seoaudit-orange))] font-semibold">
                    {testimonials[activeTestimonial].results}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 overflow-hidden">
                  <img
                    src={testimonials[activeTestimonial].avatar}
                    alt={testimonials[activeTestimonial].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">
                    {testimonials[activeTestimonial].name}
                  </h4>
                  <p className="text-gray-600">
                    {testimonials[activeTestimonial].role} at{" "}
                    {testimonials[activeTestimonial].company}
                  </p>
                  <div className="flex items-center mt-1">
                    {[...Array(testimonials[activeTestimonial].rating)].map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-current"
                        />
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={prevTestimonial}
                  className="p-2 rounded-full border border-gray-300 hover:border-[hsl(var(--seoaudit-orange))] hover:text-[hsl(var(--seoaudit-orange))] transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-full border border-gray-300 hover:border-[hsl(var(--seoaudit-orange))] hover:text-[hsl(var(--seoaudit-orange))] transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 overflow-hidden">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex items-center mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-700 text-sm line-clamp-3">
                {testimonial.content}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to join our success stories?
            </h3>
            <p className="text-gray-600 mb-6">
              Start your free today and see why thousands of marketers choose
              SEOaudit Pro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="seoaudit-button">
                  Start Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/case-studies">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 text-gray-700 hover:border-[hsl(var(--seoaudit-orange))] hover:text-[hsl(var(--seoaudit-orange))]"
                >
                  View Case Studies
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
