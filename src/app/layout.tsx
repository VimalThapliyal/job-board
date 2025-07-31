import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "React Developer Jobs - Remote & Local Opportunities",
  description:
    "Find the best React developer jobs from top companies. Browse remote and local opportunities with real-time job listings updated every 6 hours.",
  keywords:
    "react developer jobs, react jobs, frontend developer, javascript jobs, remote jobs, tech jobs",
  authors: [{ name: "Job Board Aggregator" }],
  openGraph: {
    title: "React Developer Jobs - Remote & Local Opportunities",
    description:
      "Find the best React developer jobs from top companies. Browse remote and local opportunities with real-time job listings.",
    type: "website",
    url: "https://job-board-nq9al8dq8-vimalthapliyals-projects.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "React Developer Jobs - Remote & Local Opportunities",
    description: "Find the best React developer jobs from top companies.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="canonical"
          href="https://job-board-nq9al8dq8-vimalthapliyals-projects.vercel.app"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "React Developer Jobs",
              description:
                "Find the best React developer jobs from top companies",
              url: "https://job-board-nq9al8dq8-vimalthapliyals-projects.vercel.app",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://job-board-nq9al8dq8-vimalthapliyals-projects.vercel.app?search={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
