"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Menu, X } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";

const ToolItem = ({
  href,
  label,
  icon: Icon,
  closeMenu,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
  closeMenu?: () => void;
}) => (
  <Link
    href={href}
    className="flex items-start gap-2 p-2 rounded hover:bg-indigo-100 transition-colors md:text-black xl:text-black"
    onClick={typeof closeMenu === "function" ? closeMenu : undefined}
  >
    {Icon && <span className="text-indigo-600">{Icon}</span>}
    <span className="text-sm text-white font-medium">{label}</span>
  </Link>
);

const ToolGroup = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <h4 className="text-xs font-bold text-indigo-700 uppercase mb-2">
      {title}
    </h4>
    <div className="flex flex-col gap-1">{children}</div>
  </div>
);

const DropdownMenu = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-indigo-900 text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            SEO Audit Tool
          </Link>
          <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm">
                    Tools
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-3 gap-6 p-4 bg-white text-black rounded shadow-lg min-w-[700px]">
                      <ToolGroup title="SEO Tools">
                        <ToolItem
                          href="/keyword-research"
                          label="Keyword Research Tool"
                        />
                        <ToolItem
                          href="/meta-tags-generator"
                          label="Meta Tags Generator"
                        />
                        <ToolItem
                          href="/open-graph-generator"
                          label="Open Graph Generator"
                        />
                        <ToolItem
                          href="/campaign-url-builder"
                          label="Campaign URL Builder"
                        />
                        <ToolItem
                          href="/tools/seo-score"
                          label="SEO Score Calculator"
                        />
                      </ToolGroup>
                      <ToolGroup title="Content Tools">
                        <ToolItem
                          href="/tools/readability"
                          label="Content Readability Score"
                        />
                        <ToolItem
                          href="/tools/title-preview"
                          label="Title Tag Preview"
                        />
                        <ToolItem
                          href="/tools/description-preview"
                          label="Description Tag Preview"
                        />
                        <ToolItem
                          href="/tools/structured-data"
                          label="Structured Data Validator"
                        />
                        <ToolItem
                          href="/tools/canonical-url"
                          label="Canonical URL Checker"
                        />
                      </ToolGroup>
                      <ToolGroup title="Technical Tools">
                        <ToolItem
                          href="/tools/meta-tags"
                          label="Meta Tags Generator"
                        />
                        <ToolItem
                          href="/tools/keyword-density"
                          label="Keyword Density Analyzer"
                        />
                        <ToolItem
                          href="/tools/header-tags"
                          label="Header Tag Checker"
                        />
                        <ToolItem
                          href="/tools/internal-links"
                          label="Internal Linking Analyzer"
                        />
                        <ToolItem
                          href="/tools/alt-text"
                          label="Image Alt Text Checker"
                        />
                        <ToolItem
                          href="/tools/broken-links"
                          label="Broken Link Finder"
                        />
                        <ToolItem
                          href="/tools/robots-txt"
                          label="Robots.txt Generator"
                        />

                        <ToolItem
                          href="/tools/sitemap"
                          label="Sitemap Generator"
                        />
                        <ToolItem
                          href="/tools/mobile-friendly"
                          label="Mobile-Friendliness Tester"
                        />
                      </ToolGroup>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/about" className="block py-2 text-sm text-indigo-200">
            About
          </Link>
          <Link
            href="/keyword-research"
            className="block py-2 text-sm text-indigo-200"
          >
            Keyword Research Tool
          </Link>
          <Link
            href="/meta-tags-generator"
            className="block py-2 text-sm text-indigo-200"
          >
            Meta Tags Generator
          </Link>
          <Link
            href="/open-graph-generator"
            className="block py-2 text-sm text-indigo-200"
          >
            Open Graph Generator
          </Link>
          <Link
            href="/campaign-url-builder"
            className="block py-2 text-sm text-indigo-200"
          >
            Campaign URL Builder
          </Link>
          <SignedOut>
            <SignInButton>
              <button className="text-sm bg-white text-indigo-900 px-3 py-1 rounded hover:bg-indigo-200">
                Login
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <SignOutButton>
              <button className="text-sm bg-white text-indigo-900 px-3 py-1 rounded hover:bg-indigo-200">
                Logout
              </button>
            </SignOutButton>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-indigo-800 text-white px-4 pb-4">
          <div className="py-2">
            <p className="font-bold text-sm text-indigo-200 mb-2">SEO Tools</p>
            <ToolItem
              href="/keyword-research"
              label="Keyword Research Tool"
              closeMenu={() => setIsMobileMenuOpen(false)}
            />
            <ToolItem
              href="/meta-tags-generator"
              label="Meta Tags Generator"
              closeMenu={() => setIsMobileMenuOpen(false)}
            />
            <ToolItem
              href="/open-graph-generator"
              label="Open Graph Generator"
              closeMenu={() => setIsMobileMenuOpen(false)}
            />
            <ToolItem
              href="/campaign-url-builder"
              label="Campaign URL Builder"
              closeMenu={() => setIsMobileMenuOpen(false)}
            />
            <ToolItem
              href="/tools/seo-score"
              label="SEO Score Calculator"
              closeMenu={() => setIsMobileMenuOpen(false)}
            />

            <p className="font-bold text-sm text-indigo-200 mt-4 mb-2">
              Content Tools
            </p>
            <ToolItem
              href="/tools/readability"
              label="Content Readability Score"
              closeMenu={() => setIsMobileMenuOpen(false)}
            />
            <ToolItem
              href="/tools/title-preview"
              label="Title Tag Preview"
              closeMenu={() => setIsMobileMenuOpen(false)}
            />
            <ToolItem
              href="/tools/description-preview"
              label="Description Tag Preview"
              closeMenu={() => setIsMobileMenuOpen(false)}
            />
            <ToolItem
              href="/tools/structured-data"
              label="Structured Data Validator"
              closeMenu={() => setIsMobileMenuOpen(false)}
            />
            <ToolItem
              href="/tools/canonical-url"
              label="Canonical URL Checker"
              closeMenu={() => setIsMobileMenuOpen(false)}
            />

            <p className="font-bold text-sm text-indigo-200 mt-4 mb-2">
              Technical Tools
            </p>
            <ToolItem
              href="/tools/meta-tags"
              label="Meta Tags Generator"
              closeMenu={() => setIsMobileMenuOpen(false)}
            />
            <ToolItem
              href="/tools/keyword-density"
              label="Keyword Density Analyzer"
              closeMenu={() => setIsMobileMenuOpen(false)}
            />
            <ToolItem
              href="/tools/header-tags"
              label="Header Tag Checker"
              closeMenu={() => setIsMobileMenuOpen(false)}
            />
            <ToolItem
              href="/tools/internal-links"
              label="Internal Linking Analyzer"
              closeMenu={() => setIsMobileMenuOpen(false)}
            />
            <ToolItem
              href="/tools/alt-text"
              label="Image Alt Text Checker"
              closeMenu={() => setIsMobileMenuOpen(false)}
            />
            <ToolItem
              href="/tools/broken-links"
              label="Broken Link Finder"
              closeMenu={() => setIsMobileMenuOpen(false)}
            />
            <ToolItem
              href="/tools/robots-txt"
              label="Robots.txt Generator"
              closeMenu={() => setIsMobileMenuOpen(false)}
            />

            <ToolItem
              href="/tools/sitemap"
              label="Sitemap Generator"
              closeMenu={() => setIsMobileMenuOpen(false)}
            />
            <ToolItem
              href="/tools/mobile-friendly"
              label="Mobile-Friendliness Tester"
              closeMenu={() => setIsMobileMenuOpen(false)}
            />
          </div>
          <Link href="#about" className="block py-2 text-sm text-indigo-200">
            About
          </Link>
          <SignedOut>
            <SignInButton>
              <button className="block py-2 text-sm bg-white text-indigo-900 mt-2 rounded text-center">
                Login
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <SignOutButton>
              <button className="block py-2 text-sm bg-white text-indigo-900 mt-2 rounded text-center">
                Logout
              </button>
            </SignOutButton>
            <div className="flex justify-center mt-2">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      )}
    </header>
  );
};

export default DropdownMenu;
