"use client";

import Script from "next/script";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "job_posting";
  structuredData?: Record<string, unknown>;
  noindex?: boolean;
  canonical?: string;
}

export default function SEOHead({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website",
  structuredData,
  noindex = false,
  canonical,
}: SEOHeadProps) {
  const baseUrl = "https://job-board-nine-lyart.vercel.app";
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullImage = image ? `${baseUrl}${image}` : `${baseUrl}/og-image.jpg`;

  return (
    <>
      {/* Meta tags */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {fullImage && <meta property="og:image" content={fullImage} />}
      {fullUrl && <meta property="og:url" content={fullUrl} />}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="React Developer Jobs & Interview Prep" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {fullImage && <meta name="twitter:image" content={fullImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@reactdevjobs" />
      <meta name="twitter:creator" content="@reactdevjobs" />

      {/* Additional meta tags */}
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Structured Data */}
      {structuredData && (
        <Script
          id="page-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
    </>
  );
} 