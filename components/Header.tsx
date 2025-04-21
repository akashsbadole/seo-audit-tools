"use client"
import Link from "next/link";
import React from "react";

const Header = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  return (
    <header className="px-8 bg-indigo-900 py-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1>
          <Link href="/" className="text-white text-2xl font-bold hover:text-indigo-200 transition-colors">
            SEOTool
          </Link>
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link 
                href="/" 
                className="text-indigo-200 hover:text-white transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Home
              </Link>
            </li>
            <li>
              <a 
                href="#seo-audit" 
                className="text-indigo-200 hover:text-white transition-colors"
                onClick={(e) => handleScroll(e, "seo-audit")}
              >
                SEO Audit Tool
              </a>
            </li>
            <li>
              <a 
                href="#meta-tags" 
                className="text-indigo-200 hover:text-white transition-colors"
                onClick={(e) => handleScroll(e, "meta-tags")}
              >
                Meta Tags Generator
              </a>
            </li>
            <li>
              <a 
                href="#open-graph" 
                className="text-indigo-200 hover:text-white transition-colors"
                onClick={(e) => handleScroll(e, "open-graph")}
              >
                Open Graph Generator
              </a>
            </li>
            <li>
              <a 
                href="#campaign-url-builder" 
                className="text-indigo-200 hover:text-white transition-colors"
                onClick={(e) => handleScroll(e, "campaign-url-builder")}
              >
                Campaign URL Builder
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className="text-indigo-200 hover:text-white transition-colors"
                onClick={(e) => handleScroll(e, "about")}
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className="text-indigo-200 hover:text-white transition-colors"
                onClick={(e) => handleScroll(e, "contact")}
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
