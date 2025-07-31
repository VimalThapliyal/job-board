import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Remote React Developer Jobs - Find Your Next Opportunity",
  description:
    "Discover the latest remote React developer jobs from top companies. Search, filter, and apply to React developer positions worldwide.",
  keywords:
    "react developer jobs, remote jobs, frontend developer, javascript jobs, react native jobs",
  openGraph: {
    title: "Remote React Developer Jobs",
    description: "Find your next remote React developer opportunity",
    type: "website",
    url: "https://job-board-nyjoo8uew-vimalthapliyals-projects.vercel.app",
    siteName: "Remote React Jobs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remote React Developer Jobs",
    description: "Find your next remote React developer opportunity",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
