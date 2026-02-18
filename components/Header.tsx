"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DropdownMenu = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">
                SEOaudit
              </span>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Pro
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/#features"
              className="text-gray-300 hover:text-white font-medium text-sm transition-colors"
            >
              Features
            </Link>

            <Link
              href="/tools"
              className="text-gray-300 hover:text-white font-medium text-sm transition-colors"
            >
              Tools
            </Link>

            <Link
              href="/pricing"
              className="text-gray-300 hover:text-white font-medium text-sm transition-colors"
            >
              Pricing
            </Link>

            <Link
              href="/about"
              className="text-gray-300 hover:text-white font-medium text-sm transition-colors"
            >
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/#features">
              <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity text-sm">
                Explore Tools
              </button>
            </Link>

            <button
              className="lg:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0a0a0f]">
          <div className="px-4 py-4 space-y-2">
            <Link
              href="/#features"
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md"
            >
              Features
            </Link>
            <Link
              href="/tools"
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md"
            >
              Tools
            </Link>
            <Link
              href="/pricing"
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md"
            >
              About
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default DropdownMenu;
