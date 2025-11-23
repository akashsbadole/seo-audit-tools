import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
import { Providers } from "@/components/providers";
// import { BuyMeCoffee } from "@/components/BuyMeCoffee";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const metadata: Metadata = {
  title: {
    default: "SEOaudit Pro - All-in-One Digital Marketing Platform",
    template: "%s | SEOaudit Pro"
  },
  description:
    "Get 55+ tools for SEO, content marketing, competitor research, PPC, and social media marketing. Join 50,000+ marketers growing their business with SEOaudit Pro.",
  keywords: [
    "SEO tools",
    "keyword research",
    "competitor analysis",
    "digital marketing",
    "content marketing",
    "SEO audit",
    "backlink analysis",
    "rank tracking"
  ],
  authors: [{ name: "SEOaudit Pro Team" }],
  creator: "SEOaudit Pro",
  publisher: "SEOaudit Pro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://seoauditpro.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://seoauditpro.com",
    title: "SEOaudit Pro - All-in-One Digital Marketing Platform",
    description: "Get 55+ tools for SEO, content marketing, competitor research, PPC, and social media marketing. Join 50,000+ marketers growing their business with SEOaudit Pro.",
    siteName: "SEOaudit Pro",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SEOaudit Pro - All-in-One Digital Marketing Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEOaudit Pro - All-in-One Digital Marketing Platform",
    description: "Get 55+ tools for SEO, content marketing, competitor research, PPC, and social media marketing. Join 50,000+ marketers growing their business with SEOaudit Pro.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "WLgTPSYRu1BMneRlMaLg9AwvMbP-Bpd9zlDxb64eDeM",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            {/* <BuyMeCoffee username="akashbadole" /> */}
          </div>
          <Toaster />
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-18C568MF1Q"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-18C568MF1Q');
            `}
          </Script>
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "rliwg786j6");
            `}
          </Script>
        </Providers>
      </body>
    </html>
  );
}
