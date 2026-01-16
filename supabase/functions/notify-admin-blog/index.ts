import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AdminNotificationRequest {
  postId: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl?: string;
  socialResults?: any[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.log("[Admin Notify] RESEND_API_KEY not configured, skipping notification");
      return new Response(
        JSON.stringify({ success: true, message: "Skipped - no email API configured" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { postId, title, excerpt, category, imageUrl, socialResults }: AdminNotificationRequest = await req.json();

    console.log("[Admin Notify] Sending admin notification for:", postId);

    // Fetch admin emails from user_roles
    const { data: adminRoles, error: roleError } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    if (roleError || !adminRoles || adminRoles.length === 0) {
      console.log("[Admin Notify] No admin users found");
      return new Response(
        JSON.stringify({ success: true, message: "No admins to notify" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get admin emails from auth.users
    const adminEmails: string[] = [];
    for (const admin of adminRoles) {
      const { data: userData } = await supabase.auth.admin.getUserById(admin.user_id);
      if (userData?.user?.email) {
        adminEmails.push(userData.user.email);
      }
    }

    if (adminEmails.length === 0) {
      console.log("[Admin Notify] No admin emails found");
      return new Response(
        JSON.stringify({ success: true, message: "No admin emails found" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`[Admin Notify] Sending notification to ${adminEmails.length} admin(s)`);

    const postUrl = `https://techagentlabs.lovable.app/blog/${postId}`;
    const adminUrl = `https://techagentlabs.lovable.app/admin/blog`;
    
    // Format social sharing results
    let socialSummary = "";
    if (socialResults && socialResults.length > 0) {
      const successCount = socialResults.filter(r => r.success).length;
      socialSummary = `
        <div style="background-color: #1a1a1a; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <h3 style="color: #22ff66; font-size: 14px; margin: 0 0 12px 0;">📱 Social Media Sharing</h3>
          <p style="color: #aaaaaa; margin: 0;">
            ${successCount}/${socialResults.length} platforms shared successfully
          </p>
          <ul style="margin: 8px 0 0 0; padding-left: 20px;">
            ${socialResults.map(r => `
              <li style="color: ${r.success ? '#22ff66' : '#ff4444'}; margin: 4px 0;">
                ${r.platform}: ${r.success ? '✓ Shared' : `✗ Failed (${r.error || 'Unknown error'})`}
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    }

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
            <h1 style="color: #22ff66; font-size: 24px; margin: 0;">🤖 Automated Blog Post Published</h1>
            <p style="color: #888888; font-size: 14px; margin-top: 8px;">Tech Agent Labs Admin Notification</p>
          </div>
          
          <!-- Success Badge -->
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="background-color: #22ff66; color: #000000; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600;">
              ✓ Auto-Generated & Published
            </span>
          </div>
          
          ${imageUrl ? `
          <div style="margin-bottom: 24px; border-radius: 12px; overflow: hidden;">
            <img src="${imageUrl}" alt="${title}" style="width: 100%; height: auto; display: block;">
          </div>
          ` : ''}
          
          <!-- Post Details -->
          <div style="background-color: #111111; border: 1px solid #333333; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <p style="color: #22ff66; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">
              ${category}
            </p>
            <h2 style="color: #ffffff; font-size: 22px; line-height: 1.3; margin: 0 0 16px 0;">
              ${title}
            </h2>
            <p style="color: #aaaaaa; font-size: 14px; line-height: 1.6; margin: 0;">
              ${excerpt}
            </p>
          </div>
          
          ${socialSummary}
          
          <!-- Action Buttons -->
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${postUrl}" style="display: inline-block; background-color: #22ff66; color: #000000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-right: 12px;">
              View Post →
            </a>
            <a href="${adminUrl}" style="display: inline-block; background-color: #333333; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
              Admin Panel
            </a>
          </div>
          
          <!-- Stats -->
          <div style="background-color: #1a1a1a; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="color: #666666; font-size: 12px; margin: 0;">
              📅 Published: ${new Date().toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
              })}
            </p>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; color: #666666; font-size: 12px; border-top: 1px solid #333333; padding-top: 24px;">
            <p style="margin: 0;">
              This is an automated notification from your blog system.
            </p>
            <p style="color: #444444; margin-top: 16px;">
              © ${new Date().getFullYear()} Tech Agent Labs. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to all admins
    for (const adminEmail of adminEmails) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Tech Agent Labs <notifications@techagentlabs.com>",
            to: [adminEmail],
            subject: `🤖 New Auto-Generated Post: ${title}`,
            html: emailHtml,
          }),
        });

        if (res.ok) {
          console.log(`[Admin Notify] Email sent to ${adminEmail}`);
        } else {
          const errorText = await res.text();
          console.error(`[Admin Notify] Failed to send to ${adminEmail}:`, errorText);
        }
      } catch (error) {
        console.error(`[Admin Notify] Error sending to ${adminEmail}:`, error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Admin notification sent to ${adminEmails.length} admin(s)`,
        admins: adminEmails.length,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("[Admin Notify] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
