import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Admin email to receive notifications
const ADMIN_EMAIL = "info@techagentlabs.com";

interface NotificationRequest {
  type: "contact" | "demo";
  data: {
    name: string;
    email: string;
    company?: string;
    message?: string;
    subject?: string;
    preferredDate?: string;
    preferredTime?: string;
    phone?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data }: NotificationRequest = await req.json();
    
    console.log(`Processing ${type} notification for:`, data.email);

    // Send notification to admin
    const adminEmailHtml = type === "demo" 
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #22ff66; margin: 0;">🎉 New Demo Booking!</h1>
          </div>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
            <h2 style="color: #333; margin-top: 0;">Details:</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;"><strong>Name:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;"><strong>Email:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td>
              </tr>
              ${data.company ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;"><strong>Company:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.company}</td>
              </tr>
              ` : ""}
              ${data.phone ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;"><strong>Phone:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.phone}</td>
              </tr>
              ` : ""}
              ${data.preferredDate ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;"><strong>Preferred Date:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.preferredDate}</td>
              </tr>
              ` : ""}
              ${data.preferredTime ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;"><strong>Preferred Time:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.preferredTime}</td>
              </tr>
              ` : ""}
              ${data.message ? `
              <tr>
                <td style="padding: 10px 0; color: #666;"><strong>Message:</strong></td>
                <td style="padding: 10px 0;">${data.message}</td>
              </tr>
              ` : ""}
            </table>
            <div style="margin-top: 20px; padding: 15px; background: #22ff6620; border-radius: 8px; border-left: 4px solid #22ff66;">
              <p style="margin: 0; color: #333;">📅 A new demo booking has been received. Please respond within 24 hours.</p>
            </div>
          </div>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #22ff66; margin: 0;">💬 New Contact Message!</h1>
          </div>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
            <h2 style="color: #333; margin-top: 0;">Details:</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;"><strong>Name:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;"><strong>Email:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td>
              </tr>
              ${data.subject ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;"><strong>Subject:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.subject}</td>
              </tr>
              ` : ""}
              ${data.company ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;"><strong>Company:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.company}</td>
              </tr>
              ` : ""}
            </table>
            <div style="margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 8px;">
              <p style="margin: 0 0 10px 0; color: #666; font-weight: bold;">Message:</p>
              <p style="margin: 0; color: #333; white-space: pre-wrap;">${data.message}</p>
            </div>
            <div style="margin-top: 20px; padding: 15px; background: #22ff6620; border-radius: 8px; border-left: 4px solid #22ff66;">
              <p style="margin: 0; color: #333;">⚡ Please respond to this inquiry promptly.</p>
            </div>
          </div>
        </div>
      `;

    // Send admin notification
    const adminEmailResponse = await resend.emails.send({
      from: "Tech Agent Labs <notifications@techagentlabs.com>",
      to: [ADMIN_EMAIL],
      subject: type === "demo" 
        ? `🎉 New Demo Booking: ${data.name}${data.company ? ` from ${data.company}` : ""}`
        : `💬 New Contact Message: ${data.subject || "General Inquiry"}`,
      html: adminEmailHtml,
    });

    console.log("Admin email sent:", adminEmailResponse);

    // Send confirmation to the user
    const userEmailHtml = type === "demo"
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #22ff66; margin: 0;">Demo Booking Confirmed! 🎉</h1>
          </div>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
            <p style="color: #333; font-size: 16px;">Hi ${data.name},</p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Thank you for booking a demo with Tech Agent Labs! We're excited to show you how our AI agents can transform your business operations.
            </p>
            ${data.preferredDate && data.preferredTime ? `
            <div style="margin: 20px 0; padding: 20px; background: #fff; border-radius: 8px; border: 1px solid #eee;">
              <p style="margin: 0 0 10px 0; color: #666;"><strong>📅 Requested Date:</strong> ${data.preferredDate}</p>
              <p style="margin: 0; color: #666;"><strong>⏰ Requested Time:</strong> ${data.preferredTime}</p>
            </div>
            ` : ""}
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Our team will reach out within the next 24 hours to confirm your demo slot and send you a calendar invite.
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              In the meantime, feel free to explore our <a href="https://techagentlabs.com/#services" style="color: #22ff66;">AI agents</a> to see what's possible.
            </p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                Best regards,<br>
                <strong style="color: #333;">The Tech Agent Labs Team</strong>
              </p>
            </div>
          </div>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #22ff66; margin: 0;">Message Received! ✉️</h1>
          </div>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
            <p style="color: #333; font-size: 16px;">Hi ${data.name},</p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Thank you for reaching out to Tech Agent Labs! We've received your message and our team is on it.
            </p>
            <div style="margin: 20px 0; padding: 15px; background: #22ff6620; border-radius: 8px; border-left: 4px solid #22ff66;">
              <p style="margin: 0; color: #333;">⚡ <strong>Average response time:</strong> 2 hours during business hours</p>
            </div>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              While you wait, check out our <a href="https://techagentlabs.com/blog" style="color: #22ff66;">blog</a> for the latest insights on AI automation.
            </p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                Best regards,<br>
                <strong style="color: #333;">The Tech Agent Labs Team</strong>
              </p>
            </div>
          </div>
        </div>
      `;

    const userEmailResponse = await resend.emails.send({
      from: "Tech Agent Labs <notifications@techagentlabs.com>",
      to: [data.email],
      subject: type === "demo"
        ? "Your Demo Booking is Confirmed! 🎉"
        : "We received your message! ✉️",
      html: userEmailHtml,
    });

    console.log("User confirmation email sent:", userEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        adminEmail: adminEmailResponse,
        userEmail: userEmailResponse 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
