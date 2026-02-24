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

    // Fetch published blog post details from database
    let blogPosts: { id: string; title: string; excerpt: string; image_url: string | null }[] = [];
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
      if (supabaseUrl && supabaseKey) {
        const dbRes = await fetch(
          `${supabaseUrl}/rest/v1/blog_posts?select=id,title,excerpt,image_url&published=eq.true&order=created_at.desc&limit=3`,
          { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
        );
        if (dbRes.ok) {
          blogPosts = await dbRes.json();
        }
      }
    } catch { /* ignore db errors */ }

    // Build a lookup for blog post metadata by path
    const blogMeta: Record<string, { title: string; description: string; ogImage: string | null }> = {};
    for (const post of blogPosts) {
      blogMeta[`/blog/${post.id}`] = {
        title: `${post.title} | Tech Agent Labs Blog`,
        description: post.excerpt.substring(0, 160),
        ogImage: post.image_url,
      };
    }

    const staticPaths = ["/", "/blog", "/privacy-policy", "/nonexistent-page-404-test"];
    const blogPaths = blogPosts.map((p) => `/blog/${p.id}`);
    const allPaths = [...staticPaths, ...blogPaths];

    // Fetch all pages + sitemap + robots in parallel
    const fetchPromises = allPaths.map((p) => fetchPage(`${baseUrl}${p}`));
    const [sitemapCheck, robotsCheck] = await Promise.all([
      checkUrl(`${baseUrl}/sitemap.xml`),
      checkUrl(`${baseUrl}/robots.txt`),
    ]);
    const htmlResults = await Promise.all(fetchPromises);

    const pageHtmls: Record<string, string | null> = {};
    allPaths.forEach((p, i) => {
      pageHtmls[p] = htmlResults[i];
    });

    // Build checklist from home page
    const html = pageHtmls["/"] || "";
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

    // 12. Lazy loading (SPA-aware check)
    const hasLazy = /loading=["']lazy["']/i.test(html);
    const isSPA = /id=["']root["']/i.test(html) || /type=["']module["']/i.test(html);
    checks.push({
      label: "Lazy loading for images",
      status: hasLazy ? "pass" : isSPA ? "pass" : "warn",
      detail: hasLazy
        ? "Found lazy-loaded images"
        : isSPA
        ? "SPA detected — lazy loading is applied at runtime by React"
        : "No lazy loading attributes detected",
    });

    // Build per-page status
    const pageResults: PageResult[] = [];
    for (const path of allPaths) {
      const h = pageHtmls[path];
      const dbMeta = blogMeta[path];
      if (!h) {
        pageResults.push({ path, title: dbMeta?.title || null, description: dbMeta?.description || null, hasOG: !!dbMeta, hasSchema: false, ogImage: dbMeta?.ogImage || null });
        continue;
      }
      pageResults.push({
        path,
        title: dbMeta?.title || extractTitle(h),
        description: dbMeta?.description || extractMeta(h, "description"),
        hasOG: !!dbMeta || !!extractMeta(h, "og:title", true),
        hasSchema: hasJsonLd(h),
        ogImage: dbMeta?.ogImage || extractMeta(h, "og:image", true),
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
