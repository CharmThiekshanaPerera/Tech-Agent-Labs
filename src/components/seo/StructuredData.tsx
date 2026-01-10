import { useEffect } from "react";

type StructuredDataType = 
  | "Organization"
  | "WebSite"
  | "FAQPage"
  | "Article"
  | "BlogPosting"
  | "Service"
  | "Product"
  | "BreadcrumbList"
  | "LocalBusiness";

interface StructuredDataProps {
  type: StructuredDataType;
  data: Record<string, unknown>;
  id?: string;
}

/**
 * StructuredData Component
 * Injects JSON-LD structured data for SEO, AEO, and GEO
 */
const StructuredData = ({ type, data, id }: StructuredDataProps) => {
  const scriptId = id || `structured-data-${type.toLowerCase()}`;

  useEffect(() => {
    // Remove existing script with same ID
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    // Create new script element
    const script = document.createElement("script");
    script.id = scriptId;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": type,
      ...data,
    });

    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, data, scriptId]);

  return null;
};

export default StructuredData;

/**
 * Pre-built structured data generators
 */
export const generateArticleSchema = (article: {
  title: string;
  description: string;
  imageUrl: string;
  authorName: string;
  publishedDate: string;
  modifiedDate?: string;
  url: string;
}) => ({
  headline: article.title,
  description: article.description,
  image: article.imageUrl,
  author: {
    "@type": "Person",
    name: article.authorName,
  },
  publisher: {
    "@type": "Organization",
    name: "Tech Agent Labs",
    logo: {
      "@type": "ImageObject",
      url: "https://techagentlabs.com/logo.png",
    },
  },
  datePublished: article.publishedDate,
  dateModified: article.modifiedDate || article.publishedDate,
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": article.url,
  },
});

export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const generateServiceSchema = (service: {
  name: string;
  description: string;
  price?: string;
  url?: string;
}) => ({
  name: service.name,
  description: service.description,
  provider: {
    "@type": "Organization",
    name: "Tech Agent Labs",
  },
  areaServed: "Worldwide",
  ...(service.price && {
    offers: {
      "@type": "Offer",
      price: service.price.replace(/[^0-9.]/g, ""),
      priceCurrency: "USD",
    },
  }),
  ...(service.url && { url: service.url }),
});

export const generateFAQSchema = (faqs: { question: string; answer: string }[]) => ({
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});
