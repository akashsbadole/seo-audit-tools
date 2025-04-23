import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import Head from "next/head";

export const metadata: Metadata = {
  title: "SEO Audit Tool",
  description:
    "Analyze your website's SEO performance and get actionable recommendations",
  generator: "Akash Badole",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body suppressHydrationWarning>
        <Header />
        {children}
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
