// scripts/generate-sitemap.js
const fs = require("fs");
const path = require("path");

const SITE_URL = (process.env.SITE_URL || "https://techagentlabs.com").replace(
  /\/$/,
  ""
);

// ---- Optional external routes loader (fallback to static list) ----
let routes = [
  { url: "/", changefreq: "weekly", priority: 1.0 },
  { url: "/about", changefreq: "monthly", priority: 0.7 },
  { url: "/services", changefreq: "monthly", priority: 0.8 },
  { url: "/products", changefreq: "monthly", priority: 0.8 },
  { url: "/contact", changefreq: "yearly", priority: 0.5 }
];

// If ./routes.json exists, merge/override route list
const routesJsonPath = path.join(__dirname, "routes.json");
if (fs.existsSync(routesJsonPath)) {
  try {
    const dynamicRoutes = JSON.parse(fs.readFileSync(routesJsonPath, "utf8"));
    if (Array.isArray(dynamicRoutes)) {
      routes = dynamicRoutes;
      console.log("✓ Loaded routes from scripts/routes.json");
    }
  } catch (err) {
    console.warn("⚠️ Could not parse routes.json — using static routes.");
  }
}

// ---- Helpers ----
const today = new Date().toISOString().split("T")[0];

function toXmlUrl({ url, changefreq, priority, alternates }) {
  const loc = `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;

  const altLinks = (alternates || [])
    .map(
      (alt) =>
        `\n    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${SITE_URL}${alt.url}" />`
    )
    .join("");

  return `  <url>
    <loc>${loc}</loc>${altLinks}
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// ---- XML Output ----
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="https://www.w3.org/1999/xhtml"
>
${routes.map(toXmlUrl).join("\n")}
</urlset>
`;

// ---- Write file ----
const outPath = path.join(__dirname, "../public/sitemap.xml");
fs.writeFileSync(outPath, xml.trim(), "utf8");

console.log(`✓ Sitemap generated: public/sitemap.xml`);
console.log(`  • Domain: ${SITE_URL}`);
console.log(`  • Routes: ${routes.length}`);
