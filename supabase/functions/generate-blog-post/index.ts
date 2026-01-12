import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BLOG_TOPICS = [
  "AI Automation in Business",
  "Custom AI Agents for Customer Support",
  "Machine Learning Trends",
  "AI-Powered Marketing Strategies",
  "Intelligent Process Automation",
  "AI in Sales and Lead Generation",
  "Data Analytics with AI",
  "AI Security and Privacy",
  "Future of Work with AI",
  "AI Integration Best Practices",
  "Conversational AI and Chatbots",
  "AI for Small Business Growth",
  "Enterprise AI Solutions",
  "AI-Driven Decision Making",
  "Natural Language Processing Applications",
];

const CATEGORIES = [
  "AI Technology",
  "Business Automation",
  "Industry Insights",
  "Case Studies",
  "Tutorials",
  "News & Updates",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    // Parse request body for optional topic/category override
    let customTopic = null;
    let customCategory = null;
    let autoPublish = true;

    try {
      const body = await req.json();
      customTopic = body.topic || null;
      customCategory = body.category || null;
      autoPublish = body.autoPublish !== false;
    } catch {
      // No body provided, use defaults
    }

    // Get recent posts to avoid duplicate topics
    const { data: recentPosts } = await supabase
      .from("blog_posts")
      .select("title, category")
      .order("created_at", { ascending: false })
      .limit(10);

    const recentTitles = recentPosts?.map((p) => p.title).join(", ") || "";

    // Select random topic and category if not provided
    const topic = customTopic || BLOG_TOPICS[Math.floor(Math.random() * BLOG_TOPICS.length)];
    const category = customCategory || CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

    console.log(`Generating blog post about: ${topic} in category: ${category}`);

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
- Professional yet accessible
- Data-driven with practical insights
- Engaging and thought-provoking
- SEO-optimized with relevant keywords

Generate a complete blog post in JSON format with these exact fields:
- title: A compelling, SEO-friendly title (max 80 chars)
- excerpt: A hook summary (150-200 chars)
- content: Full article in HTML format with proper headings (h2, h3), paragraphs, bullet points, and emphasis. Include 800-1200 words.
- read_time: Estimated read time (e.g., "5 min read")

Important: Return ONLY valid JSON, no markdown code blocks or extra text.`,
          },
          {
            role: "user",
            content: `Write a unique blog post about "${topic}" for the "${category}" category.

Recent posts to avoid similarity: ${recentTitles}

Focus on providing actionable insights for businesses looking to implement AI solutions. Include real-world applications and benefits.`,
          },
        ],
        temperature: 0.8,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
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

    console.log("Raw AI response:", generatedContent.substring(0, 500));

    // Parse the JSON response
    let blogData;
    try {
      // Clean up potential markdown code blocks
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
      console.error("Failed to parse AI response:", parseError);
      throw new Error("Failed to parse generated content");
    }

    // Validate required fields
    if (!blogData.title || !blogData.excerpt || !blogData.content) {
      throw new Error("Missing required fields in generated content");
    }

    // Insert the blog post
    const { data: insertedPost, error: insertError } = await supabase
      .from("blog_posts")
      .insert({
        title: blogData.title,
        excerpt: blogData.excerpt,
        content: blogData.content,
        category: category,
        read_time: blogData.read_time || "5 min read",
        published: autoPublish,
        image_url: null, // Can be enhanced to generate images
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      throw new Error(`Failed to save blog post: ${insertError.message}`);
    }

    console.log("Blog post created successfully:", insertedPost.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Blog post generated and saved successfully",
        post: {
          id: insertedPost.id,
          title: insertedPost.title,
          category: insertedPost.category,
          published: insertedPost.published,
          created_at: insertedPost.created_at,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating blog post:", error);
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
