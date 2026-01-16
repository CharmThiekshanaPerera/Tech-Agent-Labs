import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ShareRequest {
  postId: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl?: string;
  postUrl: string;
}

interface WebhookConfig {
  id: string;
  platform: string;
  webhook_url: string;
  enabled: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { postId, title, excerpt, category, imageUrl, postUrl }: ShareRequest = await req.json();

    console.log("[Social Share] Sharing blog post:", postId, title);

    // Fetch social media webhook configurations
    const { data: webhooks, error: webhookError } = await supabase
      .from("social_webhooks")
      .select("*")
      .eq("enabled", true);

    if (webhookError) {
      console.error("[Social Share] Error fetching webhooks:", webhookError);
      // Continue even if we can't fetch webhooks - we might not have any configured yet
    }

    const results: { platform: string; success: boolean; error?: string }[] = [];

    // If we have webhooks configured, trigger them
    if (webhooks && webhooks.length > 0) {
      for (const webhook of webhooks as WebhookConfig[]) {
        try {
          console.log(`[Social Share] Triggering ${webhook.platform} webhook`);
          
          // Prepare payload based on platform
          const payload = {
            // Common fields
            title,
            excerpt,
            category,
            postUrl,
            imageUrl,
            postId,
            timestamp: new Date().toISOString(),
            source: "Tech Agent Labs Blog",
            
            // Platform-specific formatting
            twitterText: `📢 New Blog Post: ${title}\n\n${excerpt.substring(0, 200)}...\n\n🔗 Read more: ${postUrl}\n\n#AI #Automation #TechAgentLabs`,
            linkedinText: `🚀 New Article Published!\n\n${title}\n\n${excerpt}\n\nRead the full article: ${postUrl}\n\n#AI #BusinessAutomation #ArtificialIntelligence #TechAgentLabs`,
            facebookText: `📖 New from our blog: ${title}\n\n${excerpt}\n\n👉 ${postUrl}`,
          };

          const response = await fetch(webhook.webhook_url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            console.log(`[Social Share] ${webhook.platform} webhook triggered successfully`);
            results.push({ platform: webhook.platform, success: true });
          } else {
            console.error(`[Social Share] ${webhook.platform} webhook failed:`, response.status);
            results.push({ platform: webhook.platform, success: false, error: `HTTP ${response.status}` });
          }
        } catch (error) {
          console.error(`[Social Share] Error triggering ${webhook.platform}:`, error);
          results.push({ 
            platform: webhook.platform, 
            success: false, 
            error: error instanceof Error ? error.message : "Unknown error" 
          });
        }
      }
    } else {
      console.log("[Social Share] No webhooks configured, skipping social sharing");
    }

    // Log the share attempt
    try {
      await supabase.from("social_share_logs").insert({
        post_id: postId,
        title,
        results: JSON.stringify(results),
        shared_at: new Date().toISOString(),
      });
    } catch (logError) {
      console.error("[Social Share] Failed to log share:", logError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Social sharing completed`,
        results,
        webhooksConfigured: webhooks?.length || 0,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("[Social Share] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
