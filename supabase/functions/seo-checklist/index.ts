const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface CheckResult {
  label: string;
  status: "pass" | "warn" | "fail";
  detail?: string;
}

interface PageResult {
  path: string;
  title: string | null;
  description: string | null;
  hasOG: boolean;
  hasSchema: boolean;
  ogImage: string | null;
}

function extractMeta(html: string, nameOrProp: string, isProperty = false): string | null {
  const attr = isProperty ? "property" : "name";
  const regex = new RegExp(
    `<meta[^>]+${attr}=["']${nameOrProp}["'][^>]+content=["']([^"']*)["']|<meta[^>]+content=["']([^"']*)["'][^>]+${attr}=["']${nameOrProp}["']`,
    "i"
  );
  const match = html.match(regex);
  return match ? (match[1] || match[2] || null) : null;
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match ? match[1].trim() : null;
}

function hasJsonLd(html: string): boolean {
  return /type=["']application\/ld\+json["']/i.test(html);
}

function hasCanonical(html: string): boolean {
  return /<link[^>]+rel=["']canonical["']/i.test(html);
}

function hasViewportMeta(html: string): boolean {
  return /<meta[^>]+name=["']viewport["']/i.test(html);
}

function countImagesWithoutAlt(html: string): number {
  const imgs = html.match(/<img[^>]*>/gi) || [];
  let missingAlt = 0;
  for (const img of imgs) {
    if (!/alt=["'][^"']+["']/i.test(img)) {
      missingAlt++;
    }
  }
  return missingAlt;
}

function hasHreflang(html: string): boolean {
  return /<link[^>]+hreflang=/i.test(html);
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "TechAgentLabs-SEO-Checker/1.0" },
      redirect: "follow",
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function checkUrl(url: string): Promise<{ status: number | null; ok: boolean }> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": "TechAgentLabs-SEO-Checker/1.0" },
      redirect: "follow",
    });
    return { status: res.status, ok: res.ok };
  } catch {
    return { status: null, ok: false };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { baseUrl = "https://techagentlabs.com" } = await req.json().catch(() => ({}));

    const pagePaths = ["/", "/blog", "/privacy-policy"];

    // Fetch all pages + sitemap + robots in parallel
    const [homeHtml, blogHtml, privacyHtml, sitemapCheck, robotsCheck] = await Promise.all([
      fetchPage(`${baseUrl}/`),
      fetchPage(`${baseUrl}/blog`),
      fetchPage(`${baseUrl}/privacy-policy`),
      checkUrl(`${baseUrl}/sitemap.xml`),
      checkUrl(`${baseUrl}/robots.txt`),
    ]);

    const pageHtmls: Record<string, string | null> = {
      "/": homeHtml,
      "/blog": blogHtml,
      "/privacy-policy": privacyHtml,
    };

    // Build checklist from home page
    const html = homeHtml || "";
    const checks: CheckResult[] = [];

    // 1. Meta title
    const title = extractTitle(html);
    checks.push({
      label: "Meta title on all pages",
      status: title ? "pass" : "fail",
      detail: title ? `"${title.substring(0, 60)}"` : "No <title> found",
    });

    // 2. Meta description
    const desc = extractMeta(html, "description");
    checks.push({
      label: "Meta descriptions set",
      status: desc ? "pass" : "fail",
      detail: desc ? `${desc.length} chars` : "No meta description found",
    });

    // 3. Open Graph
    const ogTitle = extractMeta(html, "og:title", true);
    const ogImg = extractMeta(html, "og:image", true);
    checks.push({
      label: "Open Graph images configured",
      status: ogTitle && ogImg ? "pass" : ogTitle || ogImg ? "warn" : "fail",
      detail: ogImg ? "OG image set" : "Missing og:image",
    });

    // 4. JSON-LD
    checks.push({
      label: "JSON-LD structured data",
      status: hasJsonLd(html) ? "pass" : "fail",
      detail: hasJsonLd(html) ? "Found on page" : "No JSON-LD detected",
    });

    // 5. Sitemap
    checks.push({
      label: "XML Sitemap available",
      status: sitemapCheck.ok ? "pass" : "fail",
      detail: sitemapCheck.ok ? `HTTP ${sitemapCheck.status}` : "Sitemap not accessible",
    });

    // 6. Robots.txt
    checks.push({
      label: "Robots.txt configured",
      status: robotsCheck.ok ? "pass" : "fail",
      detail: robotsCheck.ok ? `HTTP ${robotsCheck.status}` : "robots.txt not found",
    });

    // 7. Canonical
    checks.push({
      label: "Canonical URLs set",
      status: hasCanonical(html) ? "pass" : "warn",
      detail: hasCanonical(html) ? "Found" : "No canonical link",
    });

    // 8. Image alt text
    const missingAlt = countImagesWithoutAlt(html);
    checks.push({
      label: "Alt text on images",
      status: missingAlt === 0 ? "pass" : "warn",
      detail: missingAlt === 0 ? "All images have alt text" : `${missingAlt} image(s) missing alt`,
    });

    // 9. Mobile viewport
    checks.push({
      label: "Mobile responsive design",
      status: hasViewportMeta(html) ? "pass" : "fail",
      detail: hasViewportMeta(html) ? "Viewport meta set" : "Missing viewport meta",
    });

    // 10. HTTPS
    checks.push({
      label: "HTTPS enabled",
      status: baseUrl.startsWith("https") ? "pass" : "fail",
      detail: baseUrl.startsWith("https") ? "Site uses HTTPS" : "Not using HTTPS",
    });

    // 11. Search Console verification
    const hasVerification =
      html.includes("google-site-verification") || html.includes("iALzS_9n5iQRT5aVFmplfl8hFeR3Bkd47ArfJY3gG0c");
    checks.push({
      label: "Google Search Console verified",
      status: hasVerification ? "pass" : "warn",
      detail: hasVerification ? "Verification tag found" : "No verification tag detected",
    });

    // 12. Lazy loading
    const hasLazy = /loading=["']lazy["']/i.test(html);
    checks.push({
      label: "Lazy loading for images",
      status: hasLazy ? "pass" : "warn",
      detail: hasLazy ? "Found lazy-loaded images" : "No lazy loading attributes detected",
    });

    // Build per-page status
    const pageResults: PageResult[] = [];
    for (const path of pagePaths) {
      const h = pageHtmls[path];
      if (!h) {
        pageResults.push({ path, title: null, description: null, hasOG: false, hasSchema: false, ogImage: null });
        continue;
      }
      pageResults.push({
        path,
        title: extractTitle(h),
        description: extractMeta(h, "description"),
        hasOG: !!extractMeta(h, "og:title", true),
        hasSchema: hasJsonLd(h),
        ogImage: extractMeta(h, "og:image", true),
      });
    }

    return new Response(
      JSON.stringify({ checks, pages: pageResults, checkedAt: new Date().toISOString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
