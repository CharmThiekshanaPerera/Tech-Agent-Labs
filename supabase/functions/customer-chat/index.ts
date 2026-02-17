import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the AI customer support assistant for Tech Agent Labs — an AI agents marketplace and custom development studio.

Your primary role is to help customers with booking demos, purchasing AI agents, and answering questions about our services.

## Our AI Agents (8 specialized agents):
- **Support Agent** ($99/mo) — 24/7 automated customer service
- **Marketing Agent** ($149/mo) — Campaign automation & analytics
- **Analytics Agent** ($129/mo) — Data insights & reporting
- **Operations Agent** ($179/mo) — Workflow automation
- **Sales Agent** ($199/mo) — Lead qualification & CRM integration
- **Content Agent** ($119/mo) — Content creation & scheduling
- **Web Agent** ($159/mo) — Website management & optimization
- **Custom Agent** (from $499) — Tailored solutions for unique needs

## Booking & Getting Started:
- Customers can book a free demo through our website
- Deployment takes 24-48 hours after purchase
- All agents include onboarding support
- 14-day free trial on all standard plans
- Enterprise plans with custom pricing available

## Key Selling Points:
- 100+ integrations (Salesforce, HubSpot, Slack, Zendesk, etc.)
- Enterprise-grade security (SOC 2 Type II, GDPR compliant, AES-256 encryption)
- 99.9% uptime guarantee
- Dedicated support for Professional and Enterprise plans

## Guidelines:
- Be warm, friendly, and professional — like a smart teammate
- Keep responses concise (2-4 short paragraphs max)
- Use emoji sparingly for warmth
- When someone wants to book a demo or buy an agent, encourage them to use the forms on the website or email hello@techagentlabs.com
- If asked about something you don't know, suggest contacting the team directly
- Format responses with markdown (bold, lists, etc.) for clarity
- Always be helpful and guide customers toward the right solution`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("customer-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
