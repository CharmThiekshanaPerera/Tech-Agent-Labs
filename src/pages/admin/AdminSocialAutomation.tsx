import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Webhook, Plus, Trash2, ToggleLeft, ToggleRight, ExternalLink, Copy, Check, RefreshCw, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import AdminLayout from "@/components/admin/AdminLayout";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SocialWebhook {
  id: string;
  platform: string;
  webhook_url: string;
  enabled: boolean;
  description: string | null;
  created_at: string;
}

const PLATFORMS = [
  { value: "zapier", label: "Zapier", icon: "⚡" },
  { value: "make", label: "Make (Integromat)", icon: "🔧" },
  { value: "n8n", label: "n8n", icon: "🔄" },
  { value: "twitter", label: "Twitter/X", icon: "🐦" },
  { value: "linkedin", label: "LinkedIn", icon: "💼" },
  { value: "facebook", label: "Facebook", icon: "📘" },
  { value: "buffer", label: "Buffer", icon: "📅" },
  { value: "hootsuite", label: "Hootsuite", icon: "🦉" },
  { value: "slack", label: "Slack", icon: "💬" },
  { value: "discord", label: "Discord", icon: "🎮" },
  { value: "custom", label: "Custom Webhook", icon: "🔗" },
];

const AdminSocialAutomation = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [webhooks, setWebhooks] = useState<SocialWebhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    platform: "",
    webhook_url: "",
    description: "",
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("social_webhooks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load webhooks");
      console.error(error);
    } else {
      setWebhooks(data || []);
    }
    setLoading(false);
  };

  const handleAddWebhook = async () => {
    if (!newWebhook.platform || !newWebhook.webhook_url) {
      toast.error("Please fill in all required fields");
      return;
    }

    const { error } = await supabase.from("social_webhooks").insert({
      platform: newWebhook.platform,
      webhook_url: newWebhook.webhook_url,
      description: newWebhook.description || null,
      enabled: true,
    });

    if (error) {
      toast.error("Failed to add webhook");
      console.error(error);
    } else {
      toast.success("Webhook added successfully");
      setNewWebhook({ platform: "", webhook_url: "", description: "" });
      setDialogOpen(false);
      fetchWebhooks();
    }
  };

  const toggleWebhook = async (id: string, currentEnabled: boolean) => {
    const { error } = await supabase
      .from("social_webhooks")
      .update({ enabled: !currentEnabled })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update webhook");
    } else {
      toast.success(`Webhook ${!currentEnabled ? "enabled" : "disabled"}`);
      fetchWebhooks();
    }
  };

  const deleteWebhook = async (id: string) => {
    const { error } = await supabase.from("social_webhooks").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete webhook");
    } else {
      toast.success("Webhook deleted");
      fetchWebhooks();
    }
  };

  const copyWebhookUrl = async (url: string, id: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Webhook URL copied");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const testWebhook = async (webhook: SocialWebhook) => {
    setTestingId(webhook.id);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/share-blog-social`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          postId: "test-" + Date.now(),
          title: "Test Blog Post",
          excerpt: "This is a test notification from your social automation setup.",
          category: "Test",
          imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop",
          postUrl: "https://techagentlabs.lovable.app/blog",
        }),
      });
      if (response.ok) {
        toast.success("Test request sent! Check your webhook destination.");
      } else {
        toast.error("Test failed: " + response.statusText);
      }
    } catch (error) {
      toast.error("Failed to send test request");
    }
    setTestingId(null);
  };

  const handleGenerateBlogNow = async () => {
    setGenerating(true);
    const toastId = toast.loading("Generating blog post with AI... This may take up to 60 seconds.");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.dismiss(toastId);
        toast.error("You must be logged in as admin");
        setGenerating(false);
        return;
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/admin-generate-blog-now`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      });

      const result = await response.json();
      toast.dismiss(toastId);

      if (result.ok) {
        const failedMsg = result.failedTargets?.length
          ? ` (${result.failedTargets.join(", ")} failed)`
          : "";
        toast.success(
          `Blog post "${result.title}" published! Delivered to ${result.deliveredCount} webhook(s)${failedMsg}.`,
          { duration: 8000 }
        );
      } else {
        toast.error(`Generation failed: ${result.error}`);
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to generate blog post");
      console.error(error);
    }
    setGenerating(false);
  };

  const getPlatformInfo = (platform: string) => {
    return PLATFORMS.find((p) => p.value === platform) || { value: platform, label: platform, icon: "🔗" };
  };

  if (adminLoading || loading) {
    return (
      <AdminLayout title="Social Media Automation" description="Configure webhooks to automatically share blog posts">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Social Media Automation" description="Configure webhooks to automatically share blog posts to social media platforms">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Webhook className="w-6 h-6 text-primary" />
              Social Media Automation
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure webhooks to automatically share blog posts to social media platforms
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleGenerateBlogNow}
              disabled={generating}
            >
              {generating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {generating ? "Generating..." : "Generate Blog Now"}
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Webhook
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Social Media Webhook</DialogTitle>
                  <DialogDescription>
                    Configure a webhook to automatically share new blog posts
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Platform</Label>
                    <Select
                      value={newWebhook.platform}
                      onValueChange={(value) => setNewWebhook({ ...newWebhook, platform: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {PLATFORMS.map((platform) => (
                          <SelectItem key={platform.value} value={platform.value}>
                            <span className="flex items-center gap-2">
                              <span>{platform.icon}</span>
                              <span>{platform.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Webhook URL</Label>
                    <Input
                      placeholder="https://hooks.zapier.com/hooks/catch/..."
                      value={newWebhook.webhook_url}
                      onChange={(e) => setNewWebhook({ ...newWebhook, webhook_url: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Description (optional)</Label>
                    <Input
                      placeholder="e.g., Posts to Twitter and LinkedIn"
                      value={newWebhook.description}
                      onChange={(e) => setNewWebhook({ ...newWebhook, description: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddWebhook} className="w-full">
                    Add Webhook
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Generate Blog Info */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
          <h3 className="font-semibold text-foreground mb-2">📱 How it works</h3>
          <p className="text-sm text-muted-foreground">
            Blog posts are auto-generated daily at 9 AM UTC. Use <strong>"Generate Blog Now"</strong> to manually
            trigger a new AI-written post that gets published and shared to all enabled webhooks immediately.
            The webhook payload includes top-level fields: <code className="text-xs bg-muted px-1 py-0.5 rounded">postId</code>,{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">title</code>,{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">excerpt</code>,{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">postUrl</code>,{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">imageUrl</code>,{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">twitterText</code>,{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">linkedinText</code>.
          </p>
        </div>

        {/* Webhooks Table */}
        {webhooks.length > 0 ? (
          <div className="bg-secondary/30 border border-border/50 rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead>Webhook URL</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.map((webhook) => {
                  const platformInfo = getPlatformInfo(webhook.platform);
                  return (
                    <TableRow key={webhook.id}>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <span className="text-lg">{platformInfo.icon}</span>
                          <span className="font-medium">{platformInfo.label}</span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 max-w-[200px]">
                          <span className="truncate text-sm text-muted-foreground">
                            {webhook.webhook_url}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 flex-shrink-0"
                            onClick={() => copyWebhookUrl(webhook.webhook_url, webhook.id)}
                          >
                            {copiedId === webhook.id ? (
                              <Check className="w-3 h-3 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {webhook.description || "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => toggleWebhook(webhook.id, webhook.enabled)}
                          className="flex items-center gap-1"
                        >
                          {webhook.enabled ? (
                            <>
                              <ToggleRight className="w-5 h-5 text-green-500" />
                              <span className="text-xs text-green-500">Active</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Disabled</span>
                            </>
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => testWebhook(webhook)}
                            disabled={testingId === webhook.id}
                          >
                            <RefreshCw className={`w-4 h-4 ${testingId === webhook.id ? "animate-spin" : ""}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => window.open(webhook.webhook_url, "_blank")}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive/80"
                            onClick={() => deleteWebhook(webhook.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="bg-secondary/30 border border-border/50 rounded-xl p-12 text-center">
            <Webhook className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No webhooks configured</h3>
            <p className="text-muted-foreground mb-4">
              Add a webhook to start sharing blog posts automatically to social media
            </p>
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Webhook
            </Button>
          </div>
        )}

        {/* Troubleshooting */}
        <div className="bg-accent/30 border border-accent/50 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-1">Troubleshooting: Make.com only shows "value" field?</h4>
            <p className="text-sm text-muted-foreground">
              If Make.com shows your webhook data as a single <code className="text-xs bg-muted px-1 py-0.5 rounded">value</code> field instead of
              individual fields like <code className="text-xs bg-muted px-1 py-0.5 rounded">title</code>,{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">excerpt</code>, and{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">postUrl</code>, click{" "}
              <strong>"Re-determine data structure"</strong> on your Make.com webhook module, then click the 🔄 test button here to send a fresh payload.
              Make will re-parse the JSON and show each field separately.
            </p>
          </div>
        </div>

        {/* Setup Guide */}
        <div className="bg-secondary/30 border border-border/50 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-foreground">🚀 Quick Setup Guide</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="font-medium text-foreground">1. Zapier</div>
              <p className="text-sm text-muted-foreground">
                Create a Zap with "Webhooks by Zapier" trigger. Copy the webhook URL and add it here.
              </p>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-foreground">2. Make (Integromat)</div>
              <p className="text-sm text-muted-foreground">
                Create a scenario with "Webhooks" module. Use the custom webhook URL provided.
              </p>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-foreground">3. n8n</div>
              <p className="text-sm text-muted-foreground">
                Add a Webhook node as trigger. Connect to Twitter, LinkedIn, or other social nodes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSocialAutomation;
