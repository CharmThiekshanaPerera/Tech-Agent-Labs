import { Helmet } from "react-helmet-async";

const SITE_URL = "https://techagentlabs.com";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

type Props = {
  title?: string;
  description?: string;
  pathname?: string;
  image?: string;
  article?: boolean;
};

export default function Seo({
  title = "Tech Agent Labs",
  description = "Production-ready AI agents for sales, support, operations & analytics.",
  pathname = "/",
  image = DEFAULT_IMAGE,
  article = false,
}: Props) {
  const url = `${SITE_URL.replace(/\/$/, "")}${pathname}`;
  const fullTitle = title.includes("Tech Agent Labs")
    ? title
    : `${title} | Tech Agent Labs`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* OpenGraph */}
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content="Tech Agent Labs - AI Agents Marketplace"
      />
      <meta property="og:site_name" content="Tech Agent Labs" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@TechAgentLabs" />
      <meta name="twitter:creator" content="@TechAgentLabs" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* AEO / Speakable hook (content must exist on page) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          url,
          name: fullTitle,
          description,
          speakable: {
            "@type": "SpeakableSpecification",
            xpath: [
              "/html/head/title",
              "//h1",
              "//meta[@name='description']/@content",
            ],
          },
        })}
      </script>
    </Helmet>
  );
}
