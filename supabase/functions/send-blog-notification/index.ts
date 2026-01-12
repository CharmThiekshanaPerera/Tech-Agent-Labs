import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BlogNotificationRequest {
  postId: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { postId, title, excerpt, category, imageUrl }: BlogNotificationRequest = await req.json();

    console.log("Sending blog notification for post:", postId);

    // Fetch all active subscribers
    const { data: subscribers, error: subError } = await supabase
      .from("newsletter_subscribers")
      .select("email")
      .is("unsubscribed_at", null)
      .eq("confirmed", true);

    if (subError) {
      console.error("Error fetching subscribers:", subError);
      throw subError;
    }

    if (!subscribers || subscribers.length === 0) {
      console.log("No active subscribers found");
      return new Response(
        JSON.stringify({ success: true, message: "No subscribers to notify" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending notification to ${subscribers.length} subscribers`);

    const postUrl = `https://techagentlabs.com/blog/${postId}`;
    const unsubscribeBaseUrl = "https://techagentlabs.com/unsubscribe";

    // Send emails in batches to avoid rate limits
    const batchSize = 50;
    const batches = [];
    
    for (let i = 0; i < subscribers.length; i += batchSize) {
      batches.push(subscribers.slice(i, i + batchSize));
    }

    let successCount = 0;
    let errorCount = 0;

    for (const batch of batches) {
      const emailPromises = batch.map(async (subscriber) => {
        try {
          const emailHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff;">
              <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <!-- Header -->
                <div style="text-align: center; margin-bottom: 32px;">
                  <h1 style="color: #22ff66; font-size: 24px; margin: 0;">Tech Agent Labs</h1>
                  <p style="color: #888888; font-size: 14px; margin-top: 8px;">AI Automation Insights</p>
                </div>
                
                <!-- New Post Badge -->
                <div style="text-align: center; margin-bottom: 24px;">
                  <span style="background-color: #22ff66; color: #000000; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">
                    New Article
                  </span>
                </div>
                
                ${imageUrl ? `
                <div style="margin-bottom: 24px; border-radius: 12px; overflow: hidden;">
                  <img src="${imageUrl}" alt="${title}" style="width: 100%; height: auto; display: block;">
                </div>
                ` : ''}
                
                <!-- Category -->
                <p style="color: #22ff66; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                  ${category}
                </p>
                
                <!-- Title -->
                <h2 style="color: #ffffff; font-size: 28px; line-height: 1.3; margin: 0 0 16px 0;">
                  ${title}
                </h2>
                
                <!-- Excerpt -->
                <p style="color: #aaaaaa; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
                  ${excerpt}
                </p>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin-bottom: 40px;">
                  <a href="${postUrl}" style="display: inline-block; background-color: #22ff66; color: #000000; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                    Read Full Article →
                  </a>
                </div>
                
                <!-- Divider -->
                <div style="border-top: 1px solid #333333; margin: 32px 0;"></div>
                
                <!-- Footer -->
                <div style="text-align: center; color: #666666; font-size: 12px;">
                  <p style="margin-bottom: 8px;">
                    You're receiving this because you subscribed to our newsletter.
                  </p>
                  <p style="margin-bottom: 16px;">
                    <a href="https://techagentlabs.com" style="color: #22ff66; text-decoration: none;">Visit our website</a>
                    &nbsp;|&nbsp;
                    <a href="${unsubscribeBaseUrl}?email=${encodeURIComponent(subscriber.email)}" style="color: #888888; text-decoration: none;">Unsubscribe</a>
                  </p>
                  <p style="color: #444444;">
                    © ${new Date().getFullYear()} Tech Agent Labs. All rights reserved.
                  </p>
                </div>
              </div>
            </body>
            </html>
          `;

          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: "Tech Agent Labs <blog@techagentlabs.com>",
              to: [subscriber.email],
              subject: `New Post: ${title}`,
              html: emailHtml,
            }),
          });

          if (!res.ok) {
            throw new Error(`Resend API error: ${res.status}`);
          }
          successCount++;
        } catch (error) {
          console.error(`Failed to send to ${subscriber.email}:`, error);
          errorCount++;
        }
      });

      await Promise.all(emailPromises);
      
      // Small delay between batches to respect rate limits
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`Notification complete: ${successCount} sent, ${errorCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sent to ${successCount} subscribers`,
        stats: { sent: successCount, failed: errorCount, total: subscribers.length }
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-blog-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
