"use client";

import React from "react";
import Link from "next/link";
import { BuyMeCoffee } from "./BuyMeCoffee";
import { SuggestionBox } from "./SuggestionBox";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: {
      title: "Product",
      links: [
        { href: "/features", label: "Features" },
        { href: "/pricing", label: "Pricing" },
        { href: "/api", label: "API" },
        { href: "/integrations", label: "Integrations" },
        { href: "/changelog", label: "What's New" },
        { href: "/roadmap", label: "Roadmap" },
      ],
    },
    tools: {
      title: "Tools",
      links: [
        { href: "/keyword-research", label: "Keyword Research" },
        { href: "/competitor-analysis", label: "Competitor Analysis" },
        { href: "/meta-tags-generator", label: "Meta Tags Generator" },
        { href: "/open-graph-generator", label: "Open Graph Generator" },
        { href: "/campaign-url-builder", label: "Campaign URL Builder" },
        { href: "/tools/seo-score", label: "SEO Score Calculator" },
      ],
    },
    resources: {
      title: "Resources",
      links: [
        { href: "/blog", label: "Blog" },
        { href: "/academy", label: "Academy" },
        { href: "/webinars", label: "Webinars" },
        { href: "/case-studies", label: "Case Studies" },
        { href: "/ebooks", label: "eBooks" },
        { href: "/glossary", label: "Glossary" },
      ],
    },
    company: {
      title: "Company",
      links: [
        { href: "/about", label: "About Us" },
        { href: "/careers", label: "Careers" },
        { href: "/press", label: "Press" },
        { href: "/contact", label: "Contact" },
        { href: "/partners", label: "Partners" },
        { href: "/affiliate", label: "Affiliate Program" },
      ],
    },
    support: {
      title: "Support",
      links: [
        { href: "/help", label: "Help Center" },
        { href: "/community", label: "Community" },
        { href: "/status", label: "System Status" },
        { href: "/feedback", label: "Feedback" },
      ],
    },
    legal: {
      title: "Legal",
      links: [
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms of Service" },
        { href: "/cookies", label: "Cookie Policy" },
        { href: "/gdpr", label: "GDPR" },
      ],
    },
  };

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: "#", label: "Facebook" },
    { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
    { icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" },
    { icon: <Instagram className="h-5 w-5" />, href: "#", label: "Instagram" },
    { icon: <Youtube className="h-5 w-5" />, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="seoaudit-container py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              Get the latest SEO tips and trends delivered to your inbox
            </h3>
            <p className="text-gray-400 mb-6">
              Join 50,000+ marketers getting our weekly newsletter
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[hsl(var(--seoaudit-orange))]"
              />
              <button className="px-6 py-3 bg-[hsl(var(--seoaudit-orange))] text-white font-semibold rounded-lg hover:bg-[hsl(var(--seoaudit-orange))] hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="seoaudit-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <span className="text-2xl font-bold text-white">SEOaudit</span>
              <span className="text-2xl font-bold text-[hsl(var(--seoaudit-orange))]">
                Pro
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              The all-in-one digital marketing platform that helps you grow your
              online presence, analyze competitors, and achieve better results.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-400">
                <Mail className="h-4 w-4 mr-3 text-[hsl(var(--seoaudit-orange))]" />
                <span>support@seoauditpro.com</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="h-4 w-4 mr-3 text-[hsl(var(--seoaudit-orange))]" />
                <span>1-800-SEO-PRO</span>
              </div>
              <div className="flex items-center text-gray-400">
                <MapPin className="h-4 w-4 mr-3 text-[hsl(var(--seoaudit-orange))]" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-[hsl(var(--seoaudit-orange))] transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-[hsl(var(--seoaudit-orange))] transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="seoaudit-container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {currentYear} SEOaudit Pro. All rights reserved.
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-gray-400 text-sm">
                <SuggestionBox />
              </div>
              {/* <div className="flex items-center space-x-4">
                <img src="/images/visa.webp" alt="Visa" className="h-6" />
                <img src="/images/mastercard.webp" alt="Mastercard" className="h-6" />
                <img src="/images/amex.webp" alt="American Express" className="h-6" />
                <img src="/images/paypal.webp" alt="PayPal" className="h-6" />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
