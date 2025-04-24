"use client";
import Link from "next/link";
import React, { useState } from "react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setIsOpen(false); // Close menu after clicking a link
    }
  };

  return (
    <header className="px-8 bg-indigo-900 py-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-white text-2xl font-bold hover:text-indigo-200 transition-colors"
        >
          <h1 className="text-center text-xl font-bold tracking-wider text-white ">
            <span
              className="inline-block px-1 font-extrabold text-xs md:text-base"
              style={{
                textShadow:
                  "-1px 0 #4338ca, 0 1px #4338ca, 1px 0 #4338ca, 0 -1px #4338ca",
              }}
            >
              FREE SEO AUDIT TOOL
            </span>
          </h1>
        </Link>
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
        <nav
          className={`fixed md:relative top-[50px] md:top-0 left-0 w-full md:w-auto bg-indigo-900 md:bg-transparent transition-all duration-300 ease-in-out ${
            isOpen
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 -translate-y-full invisible md:visible md:opacity-100 md:translate-y-0"
          } md:block`}
        >
          <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 p-4 md:p-0">
            <li>
              <Link
                href="/"
                className="block text-indigo-200 hover:text-white transition-colors"
                onClick={(e) => {
                  setIsOpen(false);
                }}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/keyword-research"
                className="block text-indigo-200 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Multi-Platform Research
              </Link>
            </li>
            <li>
              <Link
                href="/meta-tags-generator"
                className="block text-indigo-200 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Meta Tags Generator
              </Link>
            </li>
            <li>
              <Link
                href="/open-graph-generator"
                className="block text-indigo-200 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Open Graph Generator
              </Link>
            </li>
            <li>
              <Link
                href="/campaign-url-builder"
                className="block text-indigo-200 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Campaign URL Builder
              </Link>
            </li>
            <li>
              <a
                href="#about"
                className="block text-indigo-200 hover:text-white transition-colors"
                onClick={(e) => handleScroll(e, "about")}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="block text-indigo-200 hover:text-white transition-colors"
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
