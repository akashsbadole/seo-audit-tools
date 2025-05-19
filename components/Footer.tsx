import React from "react";
import Link from "next/link";
import { BuyMeCoffee } from "./BuyMeCoffee";
import { SuggestionBox } from "./SuggestionBox";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              SEO Tools
            </h3>
            <p className="text-muted-foreground text-sm">
              Professional SEO tools to help you optimize your website and
              improve your search engine rankings.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 flex flex-col items-center gap-4">
          <SuggestionBox />
          <BuyMeCoffee username="akashbadole" />
          <p className="text-center text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} SEO Audit Tool. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
