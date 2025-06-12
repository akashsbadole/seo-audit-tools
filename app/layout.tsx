import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import Head from "next/head";
import Script from "next/script";
import { Providers } from "@/components/providers";
import { ClerkProvider } from "@clerk/nextjs";
// import { BuyMeCoffee } from "@/components/BuyMeCoffee";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const metadata: Metadata = {
  title:
    "SEO Audit Tool | keyword planner free | free seo audit report pdf | Meta Tags Generator | Open Graph Generator | Campaign URL Builder",
  description:
    "Analyze your website's SEO performance and get actionable recommendations, SEO Audit Tool | keyword planner free | free seo audit report pdf | Meta Tags Generator | Open Graph Generator | Campaign URL Builder",
  generator: "Akash Badole",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="google-site-verification"
          content="WLgTPSYRu1BMneRlMaLg9AwvMbP-Bpd9zlDxb64eDeM"
        />
      </Head>
      <body suppressHydrationWarning>
        <ClerkProvider>
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
        </ClerkProvider>
      </body>
    </html>
  );
}
