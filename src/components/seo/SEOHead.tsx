import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
  noIndex?: boolean;
}

/**
 * SEOHead Component
 * Dynamically updates document head for SEO, AEO, and GEO optimization
 */
const SEOHead = ({
  title = "Tech Agent Labs | AI Agents Marketplace & Custom Development Studio",
  description = "Buy production-ready AI agents or get custom-built automation for your business. Plug-and-play workflow bots for sales, support, operations & more.",
  canonicalUrl = "https://techagentlabs.com",
  ogImage = "/og-image.png",
  ogType = "website",
  publishedTime,
  modifiedTime,
  author = "Tech Agent Labs",
  keywords = [],
  noIndex = false,
}: SEOHeadProps) => {
  useEffect(() => {
    // Update title
    document.title = title;

    // Helper to update or create meta tag
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Helper to update or create link tag
    const updateLink = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = href;
    };

    // Basic SEO meta tags
    updateMeta("description", description);
    updateMeta("author", author);
    if (keywords.length > 0) {
      updateMeta("keywords", keywords.join(", "));
    }

    // Robots meta
    updateMeta("robots", noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");

    // Canonical URL
    updateLink("canonical", canonicalUrl);

    // Open Graph tags
    updateMeta("og:title", title, true);
    updateMeta("og:description", description, true);
    updateMeta("og:url", canonicalUrl, true);
    updateMeta("og:image", ogImage.startsWith("http") ? ogImage : `https://techagentlabs.com${ogImage}`, true);
    updateMeta("og:type", ogType, true);
    updateMeta("og:site_name", "Tech Agent Labs", true);
    updateMeta("og:locale", "en_US", true);

    // Twitter Card tags
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", title);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", ogImage.startsWith("http") ? ogImage : `https://techagentlabs.com${ogImage}`);
    updateMeta("twitter:site", "@TechAgentLabs");

    // Article-specific meta (for blog posts)
    if (ogType === "article") {
      if (publishedTime) {
        updateMeta("article:published_time", publishedTime, true);
      }
      if (modifiedTime) {
        updateMeta("article:modified_time", modifiedTime, true);
      }
      updateMeta("article:author", author, true);
    }

    // Cleanup function (optional - restore original title)
    return () => {
      // We don't need to cleanup as we want the meta to persist
    };
  }, [title, description, canonicalUrl, ogImage, ogType, publishedTime, modifiedTime, author, keywords, noIndex]);

  return null; // This component only affects document.head
};

export default SEOHead;
