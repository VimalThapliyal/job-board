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
    url: "https://job-board-ieb1mlfcs-vimalthapliyals-projects.vercel.app",
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
  // Structured data for the website
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Remote React Jobs",
    description:
      "Find the best remote React developer jobs from top companies worldwide",
    url: "https://job-board-ieb1mlfcs-vimalthapliyals-projects.vercel.app",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://job-board-ieb1mlfcs-vimalthapliyals-projects.vercel.app/?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Remote React Jobs",
      url: "https://job-board-ieb1mlfcs-vimalthapliyals-projects.vercel.app",
    },
  };

  // Organization structured data
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Remote React Jobs",
    url: "https://job-board-ieb1mlfcs-vimalthapliyals-projects.vercel.app",
    description:
      "Your go-to platform for finding the best remote React developer opportunities",
    logo: "https://job-board-ieb1mlfcs-vimalthapliyals-projects.vercel.app/logo.png",
    sameAs: [
      "https://twitter.com/remotereactjobs",
      "https://linkedin.com/company/remotereactjobs",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "English",
    },
  };

  return (
    <html lang="en">
      <head>
        {/* Google Analytics - Replace G-XXXXXXXXXX with your actual GA4 ID */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VKX0C6ZSXW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
                   window.dataLayer = window.dataLayer || [];
                   function gtag(){dataLayer.push(arguments);}
                   gtag('js', new Date());
                   gtag('config', 'G-VKX0C6ZSXW');
                 `}
        </Script>

        {/* Structured Data */}
        <Script
          id="structured-data-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        <Script
          id="structured-data-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
