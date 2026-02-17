const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, strategy } = await req.json();

    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ error: "Missing url parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("GOOGLE_PAGESPEED_API_KEY") || "";
    const categories = ["performance", "accessibility", "best-practices", "seo"];
    const params = new URLSearchParams({
      url,
      strategy: strategy || "mobile",
      key: apiKey,
    });
    categories.forEach((c) => params.append("category", c));

    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data?.error?.message || `Google API returned ${response.status}`;
      return new Response(JSON.stringify({ error: errorMsg }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
