"use client";

import React from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: {
      title: "Product",
      links: [
        { href: "/features", label: "Features" },
        { href: "/pricing", label: "Pricing" },
        { href: "/tools", label: "Tools" },
        { href: "/integrations", label: "Integrations" },
        { href: "/changelog", label: "What's New" },
      ],
    },
    tools: {
      title: "SEO Tools",
      links: [
        { href: "/keyword-research", label: "Keyword Research" },
        { href: "/competitor-analysis", label: "Competitor Analysis" },
        { href: "/meta-tags-generator", label: "Meta Tags Generator" },
        { href: "/open-graph-generator", label: "Open Graph Generator" },
        { href: "/tools/seo-score", label: "SEO Score Calculator" },
        { href: "/enhanced-site-audit", label: "Site Audit" },
      ],
    },
    resources: {
      title: "Resources",
      links: [
        { href: "/blog", label: "Blog" },
        { href: "/academy", label: "Academy" },
        { href: "/webinars", label: "Webinars" },
        { href: "/case-studies", label: "Case Studies" },
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
        { href: "/affiliate", label: "Affiliate Program" },
      ],
    },
  };

  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
    { icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" },
    { icon: <Instagram className="h-5 w-5" />, href: "#", label: "Instagram" },
    { icon: <Youtube className="h-5 w-5" />, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-[#050508] border-t border-white/10">
      {/* <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to boost your SEO?
            </h3>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Start your free trial today and see why thousands of marketers trust SEOaudit Pro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity">
                Start Free Trial
                <ArrowRight className="inline ml-2 w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
                Book Demo
              </button>
            </div>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <span className="text-2xl font-bold text-white">SEOaudit</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Pro
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              All-in-one SEO platform with 50+ tools for keyword research, 
              competitor analysis, site audits, and more.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-400">
                <Mail className="h-4 w-4 mr-3 text-violet-400" />
                <span>support@seoauditcheck.com</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="h-4 w-4 mr-3 text-violet-400" />
                <span>Sharing Soon</span>
              </div>
            </div>

            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-violet-400 transition-colors text-sm"
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

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {currentYear} SEOaudit Pro. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-500 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
