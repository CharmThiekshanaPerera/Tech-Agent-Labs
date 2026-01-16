import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
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

async function generateImage(title: string, topic: string, LOVABLE_API_KEY: string): Promise<string | null> {
  try {
    console.log("[Scheduled] Generating image for:", title);
    
    const imagePrompt = `A professional, modern tech blog header image for an article about "${topic}". 
    Style: Clean, minimalist, corporate tech aesthetic with subtle AI/automation visual elements like neural networks, data flows, or abstract tech patterns.
    Colors: Deep blues, teals, emerald greens, and subtle gradients. Professional lighting with soft glows.
    Composition: Wide 16:9 format, suitable as a hero banner.
    No text, no words, no letters, no numbers in the image.
    High quality, ultra detailed, photorealistic or sleek 3D render style.`;

    const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: imagePrompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!imageResponse.ok) {
      console.error("[Scheduled] Image generation failed:", imageResponse.status);
      return null;
    }

    const imageData = await imageResponse.json();
    const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error("[Scheduled] No image URL in response");
      return null;
    }

    console.log("[Scheduled] Image generated successfully");
    return imageUrl;
  } catch (error) {
    console.error("[Scheduled] Error generating image:", error);
    return null;
  }
}

async function uploadImageToStorage(
  supabase: any,
  base64Data: string,
  filename: string
): Promise<string | null> {
  try {
    // Extract base64 content (remove data:image/png;base64, prefix)
    const base64Content = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const binaryData = Uint8Array.from(atob(base64Content), (c) => c.charCodeAt(0));

    // Upload to storage
    const { data, error } = await supabase.storage
      .from("documents")
      .upload(`blog-images/${filename}`, binaryData, {
        contentType: "image/png",
        upsert: true,
      });

    if (error) {
      console.error("[Scheduled] Storage upload error:", error);
      return null;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("documents")
      .getPublicUrl(`blog-images/${filename}`);

    console.log("[Scheduled] Image uploaded to storage:", publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("[Scheduled] Error uploading image:", error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify cron secret for security (optional - allows both authenticated and cron calls)
    const cronSecret = req.headers.get("x-cron-secret") || new URL(req.url).searchParams.get("secret");
    const expectedSecret = Deno.env.get("CRON_SECRET");

    // Only check secret if one is configured
    if (expectedSecret && cronSecret && cronSecret !== expectedSecret) {
      console.error("[Scheduled] Invalid cron secret provided");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase credentials not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check if a post was already created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data: todaysPosts } = await supabase
      .from("blog_posts")
      .select("id")
      .gte("created_at", today.toISOString())
      .limit(1);

    if (todaysPosts && todaysPosts.length > 0) {
      console.log("[Scheduled] A blog post was already created today, skipping...");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Skipped - a post was already created today",
          skipped: true 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get recent posts to avoid duplicate topics
    const { data: recentPosts } = await supabase
      .from("blog_posts")
      .select("title, category")
      .order("created_at", { ascending: false })
      .limit(15);

    const recentTitles = recentPosts?.map((p) => p.title).join(", ") || "";
    const recentCategories = recentPosts?.slice(0, 3).map((p) => p.category) || [];

    // Select random topic and category (avoiding recent categories)
    const topic = BLOG_TOPICS[Math.floor(Math.random() * BLOG_TOPICS.length)];
    let category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    
    // Try to avoid recent categories
    let attempts = 0;
    while (recentCategories.includes(category) && attempts < 5) {
      category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      attempts++;
    }

    console.log(`[Scheduled] Generating blog post about: ${topic} in category: ${category}`);

    // Generate blog post using Lovable AI
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
            
Your writing style is:
- Professional yet accessible and conversational
- Data-driven with practical, actionable insights
- Engaging and thought-provoking with real-world examples
- SEO-optimized with relevant keywords naturally integrated
- Uses storytelling and concrete examples

Structure your articles with:
- A compelling hook in the first paragraph
- Clear section headings (## for main sections, ### for subsections)
- Bullet points for lists and key takeaways
- A strong conclusion with call-to-action

Generate a complete blog post in JSON format with these exact fields:
- title: A compelling, SEO-friendly title (max 80 chars) - be creative and specific
- excerpt: A hook summary that makes readers want to read more (150-200 chars)
- content: Full article in Markdown format. Include 1000-1500 words with proper structure.
- read_time: Estimated read time based on word count (e.g., "8 min read")

Important: Return ONLY valid JSON, no markdown code blocks or extra text.`,
          },
          {
            role: "user",
            content: `Write a unique, comprehensive blog post about "${topic}" for the "${category}" category.

Recent posts to AVOID similarity with: ${recentTitles}

Requirements:
1. Provide actionable insights businesses can implement immediately
2. Include real-world applications, case studies, or examples
3. Address common challenges and solutions
4. End with clear next steps or call-to-action
5. Make it engaging and valuable for business leaders and tech decision-makers`,
          },
        ],
        temperature: 0.85,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("[Scheduled] AI gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Will retry on next schedule." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const generatedContent = aiData.choices?.[0]?.message?.content;

    if (!generatedContent) {
      throw new Error("No content generated from AI");
    }

    console.log("[Scheduled] AI content generated, parsing...");

    // Parse the JSON response
    let blogData;
    try {
      let cleanedContent = generatedContent.trim();
      if (cleanedContent.startsWith("```json")) {
        cleanedContent = cleanedContent.slice(7);
      } else if (cleanedContent.startsWith("```")) {
        cleanedContent = cleanedContent.slice(3);
      }
      if (cleanedContent.endsWith("```")) {
        cleanedContent = cleanedContent.slice(0, -3);
      }
      blogData = JSON.parse(cleanedContent.trim());
    } catch (parseError) {
      console.error("[Scheduled] Failed to parse AI response:", parseError);
      console.error("[Scheduled] Raw content:", generatedContent.substring(0, 500));
      throw new Error("Failed to parse generated content");
    }

    if (!blogData.title || !blogData.excerpt || !blogData.content) {
      throw new Error("Missing required fields in generated content");
    }

    console.log("[Scheduled] Blog content parsed successfully. Generating image...");

    // Generate image for the blog post
    let imageUrl: string | null = null;
    const base64Image = await generateImage(blogData.title, topic, LOVABLE_API_KEY);
    
    if (base64Image) {
      const filename = `blog-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
      imageUrl = await uploadImageToStorage(supabase, base64Image, filename);
    }

    if (!imageUrl) {
      console.log("[Scheduled] Image generation failed, using fallback placeholder");
      // Use a professional placeholder if image generation fails
      imageUrl = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop";
    }

    // Insert the blog post (auto-published for scheduled posts)
    const { data: insertedPost, error: insertError } = await supabase
      .from("blog_posts")
      .insert({
        title: blogData.title,
        excerpt: blogData.excerpt,
        content: blogData.content,
        category: category,
        read_time: blogData.read_time || "7 min read",
        published: true,
        image_url: imageUrl,
      })
      .select()
      .single();

    if (insertError) {
      console.error("[Scheduled] Database insert error:", insertError);
      throw new Error(`Failed to save blog post: ${insertError.message}`);
    }

    console.log("[Scheduled] Blog post created successfully:", insertedPost.id, insertedPost.title);

    const postUrl = `https://techagentlabs.lovable.app/blog/${insertedPost.id}`;

    // Trigger social media sharing
    let socialResults: any[] = [];
    try {
      console.log("[Scheduled] Triggering social media sharing...");
      const shareResponse = await fetch(`${SUPABASE_URL}/functions/v1/share-blog-social`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          postId: insertedPost.id,
          title: insertedPost.title,
          excerpt: blogData.excerpt,
          category: insertedPost.category,
          imageUrl: insertedPost.image_url,
          postUrl,
        }),
      });

      if (shareResponse.ok) {
        const shareData = await shareResponse.json();
        socialResults = shareData.results || [];
        console.log("[Scheduled] Social sharing completed:", shareData);
      } else {
        console.error("[Scheduled] Social sharing failed:", shareResponse.status);
      }
    } catch (shareError) {
      console.error("[Scheduled] Error triggering social share:", shareError);
    }

    // Send admin notification
    try {
      console.log("[Scheduled] Sending admin notification...");
      const notifyResponse = await fetch(`${SUPABASE_URL}/functions/v1/notify-admin-blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          postId: insertedPost.id,
          title: insertedPost.title,
          excerpt: blogData.excerpt,
          category: insertedPost.category,
          imageUrl: insertedPost.image_url,
          socialResults,
        }),
      });

      if (notifyResponse.ok) {
        console.log("[Scheduled] Admin notification sent successfully");
      } else {
        console.error("[Scheduled] Admin notification failed:", notifyResponse.status);
      }
    } catch (notifyError) {
      console.error("[Scheduled] Error sending admin notification:", notifyError);
    }

    // Send newsletter notification to subscribers
    try {
      console.log("[Scheduled] Sending newsletter notification...");
      const newsletterResponse = await fetch(`${SUPABASE_URL}/functions/v1/send-blog-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          postId: insertedPost.id,
          title: insertedPost.title,
          excerpt: blogData.excerpt,
          category: insertedPost.category,
          imageUrl: insertedPost.image_url,
        }),
      });

      if (newsletterResponse.ok) {
        const newsletterData = await newsletterResponse.json();
        console.log("[Scheduled] Newsletter notification sent:", newsletterData);
      } else {
        console.error("[Scheduled] Newsletter notification failed:", newsletterResponse.status);
      }
    } catch (newsletterError) {
      console.error("[Scheduled] Error sending newsletter notification:", newsletterError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Scheduled blog post generated, published, and shared successfully",
        post: {
          id: insertedPost.id,
          title: insertedPost.title,
          category: insertedPost.category,
          image_url: insertedPost.image_url,
          created_at: insertedPost.created_at,
        },
        automation: {
          socialSharing: socialResults.length > 0 ? "triggered" : "no webhooks configured",
          adminNotification: "sent",
          newsletterNotification: "sent",
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[Scheduled] Error generating blog post:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
