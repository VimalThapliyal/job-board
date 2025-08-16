import { Job } from "@/types/job";
import { InterviewQuestion } from "@/types/interview-question";

const BASE_URL = "https://job-board-nine-lyart.vercel.app";

export function generateJobStructuredData(job: Job) {
  const isRemote = job.location.toLowerCase().includes("remote");
  const likelyIndia =
    /india|mumbai|delhi|bengaluru|bangalore|pune|hyderabad|chennai|kolkata|gurugram|noida|ahmedabad/i.test(
      job.location
    );
  const currency = job.salary?.includes("₹") ? "INR" : "USD";

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.postedDate,
    validThrough: new Date(
      new Date(job.postedDate).getTime() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(), // 30 days from posting
    employmentType: job.type,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      url: job.applyUrl ? new URL(job.applyUrl).origin : BASE_URL,
      logo: job.logo
        ? {
            "@type": "ImageObject",
            url: job.logo,
          }
        : undefined,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: isRemote
          ? likelyIndia
            ? "IN"
            : "Worldwide"
          : likelyIndia
          ? "IN"
          : "US",
      },
    },
    applicantLocationRequirements: {
      "@type": "Country",
      name: isRemote
        ? likelyIndia
          ? "India"
          : "Worldwide"
        : likelyIndia
        ? "India"
        : "United States",
    },
    baseSalary: job.salary
      ? {
          "@type": "MonetaryAmount",
          currency,
          value: job.salary.replace(/[^0-9]/g, "") || "0",
        }
      : undefined,
    qualifications: job.skills?.join(", "),
    experienceRequirements: job.experience,
    responsibilities: job.description,
    benefits: "Remote work, competitive salary, health benefits",
    applicationContact: {
      "@type": "ContactPoint",
      contactType: "application",
      url: `${BASE_URL}/jobs/${job.id}`,
    },
    url: `${BASE_URL}/jobs/${job.id}`,
    identifier: {
      "@type": "PropertyValue",
      name: job.company,
      value: job.id,
    },
  };
}

export function generateInterviewQuestionStructuredData(
  question: InterviewQuestion
) {
  return {
    "@context": "https://schema.org",
    "@type": "Question",
    name: question.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: question.answer,
    },
  };
}

export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFAQStructuredData(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateWebSiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "React Developer Jobs & Interview Prep",
    description:
      "Find the best React developer jobs from top companies worldwide. Practice with 100+ curated React interview questions.",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/interview-questions?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "React Developer Jobs & Interview Prep",
      url: BASE_URL,
    },
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };
}

export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "React Developer Jobs & Interview Prep",
    url: BASE_URL,
    description:
      "Your go-to platform for finding React developer jobs and mastering React development through comprehensive interview questions and answers",
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/logo.png`,
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
}
