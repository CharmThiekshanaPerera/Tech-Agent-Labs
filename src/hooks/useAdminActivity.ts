import { supabase } from "@/integrations/supabase/client";

export type AdminAction =
  | "login"
  | "logout"
  | "blog_generated"
  | "blog_created"
  | "blog_updated"
  | "blog_deleted"
  | "blog_published"
  | "blog_unpublished"
  | "message_read"
  | "message_replied"
  | "message_deleted"
  | "demo_updated"
  | "demo_deleted"
  | "newsletter_sent"
  | "subscriber_deleted"
  | "testimonial_created"
  | "testimonial_updated"
  | "testimonial_deleted"
  | "document_uploaded"
  | "document_deleted"
  | "webhook_created"
  | "webhook_updated"
  | "webhook_deleted"
  | "settings_updated"
  | "seo_audit_run"
  | "revenue_created"
  | "revenue_updated"
  | "revenue_deleted"
  | "password_reset";

const ACTION_LABELS: Record<AdminAction, string> = {
  login: "Logged in",
  logout: "Logged out",
  blog_generated: "AI generated blog post",
  blog_created: "Created blog post",
  blog_updated: "Updated blog post",
  blog_deleted: "Deleted blog post",
  blog_published: "Published blog post",
  blog_unpublished: "Unpublished blog post",
  message_read: "Read message",
  message_replied: "Replied to message",
  message_deleted: "Deleted message",
  demo_updated: "Updated demo booking",
  demo_deleted: "Deleted demo booking",
  newsletter_sent: "Sent newsletter",
  subscriber_deleted: "Deleted subscriber",
  testimonial_created: "Created testimonial",
  testimonial_updated: "Updated testimonial",
  testimonial_deleted: "Deleted testimonial",
  document_uploaded: "Uploaded document",
  document_deleted: "Deleted document",
  webhook_created: "Created webhook",
  webhook_updated: "Updated webhook",
  webhook_deleted: "Deleted webhook",
  settings_updated: "Updated settings",
  seo_audit_run: "Ran SEO audit",
  revenue_created: "Added revenue entry",
  revenue_updated: "Updated revenue entry",
  revenue_deleted: "Deleted revenue entry",
  password_reset: "Reset password",
};

export const getActionLabel = (action: string): string => {
  return ACTION_LABELS[action as AdminAction] || action;
};

export const logAdminActivity = async (
  action: AdminAction,
  details?: string,
  metadata?: Record<string, unknown>
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await (supabase.from("admin_activity_logs" as any) as any).insert({
      user_id: user.id,
      action,
      details: details || null,
      metadata: metadata || {},
    });
  } catch (error) {
    console.error("Failed to log admin activity:", error);
  }
};
