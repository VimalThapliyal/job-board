import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

// Production URL - Update this to your actual domain
const PRODUCTION_URL = "https://job-board-nine-lyart.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "React Developer Jobs & Interview Prep - Find Your Dream React Job",
    template: "%s | React Developer Jobs & Interview Prep"
  },
  description:
    "Find the best React developer jobs from top companies worldwide. Practice with 100+ curated React interview questions. Updated every 6 hours with fresh opportunities. Apply to remote and onsite React developer positions.",
  keywords: [
    "react developer jobs",
    "react developer interview questions",
    "frontend developer jobs",
    "javascript developer jobs",
    "remote react jobs",
    "react hooks interview questions",
    "react performance interview questions",
    "react developer career",
    "react job board",
    "react developer hiring"
  ].join(", "),
  authors: [{ name: "React Developer Jobs" }],
  creator: "React Developer Jobs",
  publisher: "React Developer Jobs",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(PRODUCTION_URL),
  alternates: {
    canonical: PRODUCTION_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: PRODUCTION_URL,
    title: "React Developer Jobs & Interview Prep - Find Your Dream React Job",
    description: "Find the best React developer jobs from top companies worldwide. Practice with 100+ curated React interview questions. Updated every 6 hours with fresh opportunities.",
    siteName: "React Developer Jobs & Interview Prep",
    images: [
      {
        url: `${PRODUCTION_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "React Developer Jobs & Interview Prep",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "React Developer Jobs & Interview Prep - Find Your Dream React Job",
    description: "Find the best React developer jobs from top companies worldwide. Practice with 100+ curated React interview questions.",
    images: [`${PRODUCTION_URL}/og-image.jpg`],
    creator: "@reactdevjobs",
    site: "@reactdevjobs",
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
    google: "your-google-verification-code", // Add your Google Search Console verification code
    yandex: "your-yandex-verification-code", // Add if needed
    yahoo: "your-yahoo-verification-code", // Add if needed
  },
  category: "technology",
  classification: "Job Board",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enhanced structured data for the website
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "React Developer Jobs & Interview Prep",
    description: "Find the best React developer jobs from top companies worldwide. Practice with 100+ curated React interview questions.",
    url: PRODUCTION_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${PRODUCTION_URL}/interview-questions?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "React Developer Jobs & Interview Prep",
      url: PRODUCTION_URL,
    },
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };

  // Enhanced organization structured data
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "React Developer Jobs & Interview Prep",
    url: PRODUCTION_URL,
    description: "Your go-to platform for finding React developer jobs and mastering React development through comprehensive interview questions and answers",
    logo: {
      "@type": "ImageObject",
      url: `${PRODUCTION_URL}/logo.png`,
      width: 512,
      height: 512,
    },
    sameAs: [
      "https://twitter.com/reactdevjobs",
      "https://linkedin.com/company/reactdevjobs",
      "https://github.com/reactdevjobs",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "English",
      email: "contact@reactdevjobs.com",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
  };

  // JobPosting collection structured data
  const jobPostingCollectionStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "React Developer Jobs",
    description: "Latest React developer job opportunities from top companies",
    url: `${PRODUCTION_URL}/jobs`,
    numberOfItems: 50, // Update with actual count
    itemListElement: [
      // This will be dynamically populated
    ],
  };

  // FAQ structured data
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How often are React developer jobs updated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our job board is updated every 6 hours with fresh React developer opportunities from top companies worldwide.",
        },
      },
      {
        "@type": "Question",
        name: "Are the React interview questions free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, all our React interview questions are completely free to use. We have 100+ curated questions covering beginner to advanced topics.",
        },
      },
      {
        "@type": "Question",
        name: "Do you offer remote React developer jobs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we feature both remote and onsite React developer positions from companies worldwide.",
        },
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#2563eb" />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VKX0C6ZSXW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VKX0C6ZSXW', {
              page_title: 'React Developer Jobs & Interview Prep',
              page_location: window.location.href,
              custom_map: {
                'custom_parameter_1': 'job_category',
                'custom_parameter_2': 'job_location'
              }
            });
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
        <Script
          id="structured-data-job-collection"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jobPostingCollectionStructuredData),
          }}
        />
        <Script
          id="structured-data-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData),
          }}
        />

        {/* Performance Monitoring */}
        <Script id="performance-monitoring" strategy="afterInteractive">
          {`
            // Performance monitoring
            if (typeof window !== 'undefined') {
              window.addEventListener('load', function() {
                if ('performance' in window) {
                  const perfData = performance.getEntriesByType('navigation')[0];
                  if (perfData) {
                    // Send performance data to analytics
                    if (typeof gtag !== 'undefined') {
                      gtag('event', 'timing_complete', {
                        name: 'load',
                        value: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                      });
                    }
                  }
                }
              });
            }
          `}
        </Script>

        {/* Additional SEO meta tags */}
        <meta name="application-name" content="React Developer Jobs & Interview Prep" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="React Jobs" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
