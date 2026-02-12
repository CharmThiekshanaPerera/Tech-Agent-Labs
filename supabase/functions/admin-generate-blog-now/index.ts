import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BLOG_TOPICS = [
  "How AI Agents Are Revolutionizing Customer Service",
  "Building Custom AI Solutions for Enterprise Businesses",
  "Machine Learning Trends Every Business Should Know",
  "AI-Powered Marketing: Strategies That Actually Work",
  "Automating Business Processes with Intelligent AI",
  "How AI is Transforming Sales and Lead Generation",
  "Data Analytics: Making Smarter Decisions with AI",
  "AI Security Best Practices for Modern Businesses",
  "The Future of Work: Human-AI Collaboration",
  "Step-by-Step Guide to AI Integration",
  "Conversational AI: Beyond Basic Chatbots",
  "How Small Businesses Can Leverage AI for Growth",
  "Enterprise AI Solutions: What You Need to Know",
  "AI-Driven Decision Making for Business Leaders",
  "Natural Language Processing: Practical Applications",
  "Reducing Costs with AI Automation",
  "AI in E-commerce: Personalization at Scale",
  "Building AI-Ready Teams: Training and Culture",
  "Measuring ROI on AI Investments",
  "AI Ethics and Responsible Implementation",
  "Real-Time AI Analytics for Business Intelligence",
  "Voice AI and Its Business Applications",
  "AI for Document Processing and Management",
  "Predictive AI: Forecasting Business Outcomes",
  "AI-Powered Content Creation Strategies",
];

const CATEGORIES = [
  "AI Technology",
  "Business Automation",
  "Industry Insights",
  "Case Studies",
  "Tutorials",
  "News & Updates",
  "Best Practices",
  "Workplace",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Verify admin authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAuth = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub as string;

    // Check admin role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ ok: false, error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("[AdminGenerate] Admin verified, generating blog post...");

    // Get recent posts to avoid duplicates
    const { data: recentPosts } = await supabase
      .from("blog_posts")
      .select("title, category")
      .order("created_at", { ascending: false })
      .limit(15);

    const recentTitles = recentPosts?.map((p) => p.title).join(", ") || "";
    const recentCategories = recentPosts?.slice(0, 3).map((p) => p.category) || [];

    const topic = BLOG_TOPICS[Math.floor(Math.random() * BLOG_TOPICS.length)];
    let category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    let attempts = 0;
    while (recentCategories.includes(category) && attempts < 5) {
      category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      attempts++;
    }

    console.log(`[AdminGenerate] Topic: ${topic}, Category: ${category}`);

    // Generate blog post via AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert AI content writer for Tech Agent Labs, a company specializing in AI automation solutions and custom AI agents for businesses. 
Your writing style is professional yet accessible, data-driven with practical insights, engaging with real-world examples, and SEO-optimized.

Structure your articles with:
- A compelling hook in the first paragraph
- Clear section headings (## for main sections, ### for subsections)
- Bullet points for lists and key takeaways
- A strong conclusion with call-to-action

Generate a complete blog post in JSON format with these exact fields:
- title: A compelling, SEO-friendly title (max 80 chars)
- excerpt: A hook summary (150-200 chars)
- content: Full article in Markdown format (1000-1500 words)
- read_time: Estimated read time (e.g., "8 min read")

Important: Return ONLY valid JSON, no markdown code blocks or extra text.`,
          },
          {
            role: "user",
            content: `Write a unique blog post about "${topic}" for the "${category}" category.\n\nRecent posts to AVOID similarity with: ${recentTitles}\n\nRequirements:\n1. Actionable insights\n2. Real-world examples\n3. Address common challenges\n4. End with clear next steps\n5. Engaging for business leaders`,
          },
        ],
        temperature: 0.85,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("[AdminGenerate] AI error:", aiResponse.status, errorText);
      throw new Error(`AI generation failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const generatedContent = aiData.choices?.[0]?.message?.content;
    if (!generatedContent) throw new Error("No content generated");

    let blogData;
    try {
      let cleaned = generatedContent.trim();
      if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
      else if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
      if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
      blogData = JSON.parse(cleaned.trim());
    } catch {
      throw new Error("Failed to parse AI response");
    }

    if (!blogData.title || !blogData.excerpt || !blogData.content) {
      throw new Error("Missing required fields in generated content");
    }

    // Generate image
    let imageUrl: string | null = null;
    try {
      const imagePrompt = `A professional, modern tech blog header image for an article about "${topic}". Style: Clean, minimalist, corporate tech aesthetic with AI/automation visual elements. Colors: Deep blues, teals, emerald greens. No text, no words. High quality, 16:9 format.`;

      const imgRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [{ role: "user", content: imagePrompt }],
          modalities: ["image", "text"],
        }),
      });

      if (imgRes.ok) {
        const imgData = await imgRes.json();
        const base64Image = imgData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        if (base64Image) {
          const base64Content = base64Image.replace(/^data:image\/\w+;base64,/, "");
          const binaryData = Uint8Array.from(atob(base64Content), (c) => c.charCodeAt(0));
          const filename = `blog-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

          const { error: uploadErr } = await supabase.storage
            .from("documents")
            .upload(`blog-images/${filename}`, binaryData, { contentType: "image/png", upsert: true });

          if (!uploadErr) {
            const { data: urlData } = supabase.storage
              .from("documents")
              .getPublicUrl(`blog-images/${filename}`);
            imageUrl = urlData.publicUrl;
          }
        }
      }
    } catch (e) {
      console.error("[AdminGenerate] Image generation error:", e);
    }

    if (!imageUrl) {
      imageUrl = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop";
    }

    // Insert blog post
    const { data: post, error: insertErr } = await supabase
      .from("blog_posts")
      .insert({
        title: blogData.title,
        excerpt: blogData.excerpt,
        content: blogData.content,
        category,
        read_time: blogData.read_time || "7 min read",
        published: true,
        image_url: imageUrl,
      })
      .select()
      .single();

    if (insertErr) throw new Error(`DB insert failed: ${insertErr.message}`);

    console.log("[AdminGenerate] Post created:", post.id);

    const postUrl = `https://techagentlabs.com/blog/${post.id}`;

    // Trigger social sharing
    let deliveredCount = 0;
    const failedTargets: string[] = [];

    try {
      const shareRes = await fetch(`${SUPABASE_URL}/functions/v1/share-blog-social`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          postId: post.id,
          title: post.title,
          excerpt: blogData.excerpt,
          category: post.category,
          imageUrl: post.image_url,
          postUrl,
        }),
      });

      if (shareRes.ok) {
        const shareData = await shareRes.json();
        const results = shareData.results || [];
        for (const r of results) {
          if (r.success) deliveredCount++;
          else failedTargets.push(r.platform);
        }
      }
    } catch (e) {
      console.error("[AdminGenerate] Social share error:", e);
    }

    // Notify admin
    try {
      await fetch(`${SUPABASE_URL}/functions/v1/notify-admin-blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          postId: post.id,
          title: post.title,
          excerpt: blogData.excerpt,
          category: post.category,
          imageUrl: post.image_url,
        }),
      });
    } catch (e) {
      console.error("[AdminGenerate] Notify error:", e);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        postId: post.id,
        title: post.title,
        category: post.category,
        deliveredCount,
        failedTargets,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[AdminGenerate] Error:", error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
