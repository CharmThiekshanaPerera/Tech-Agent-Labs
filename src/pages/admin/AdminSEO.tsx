import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Search,
  FileText,
  MapPin,
  Gauge,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ClipboardCheck,
  LayoutList,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
} from "lucide-react";
import SEOAuditRunner from "@/components/admin/SEOAuditRunner";

interface CheckItem {
  label: string;
  status: "pass" | "warn" | "fail";
  detail?: string;
}

interface PageItem {
  path: string;
  title: string | null;
  description: string | null;
  hasOG: boolean;
  hasSchema: boolean;
  ogImage: string | null;
}

interface SeoCheckResult {
  checks: CheckItem[];
  pages: PageItem[];
  checkedAt: string;
}

const externalTools = [
  {
    name: "Google PageSpeed Insights",
    url: "https://pagespeed.web.dev/analysis?url=https://techagentlabs.com",
    icon: Gauge,
    description: "Core Web Vitals & performance scores",
  },
  {
    name: "Google Search Console",
    url: "https://search.google.com/search-console",
    icon: Search,
    description: "Search performance & indexing",
  },
  {
    name: "Google Rich Results Test",
    url: "https://search.google.com/test/rich-results?url=https://techagentlabs.com",
    icon: FileText,
    description: "Validate structured data / JSON-LD",
  },
  {
    name: "XML Sitemap",
    url: "https://techagentlabs.com/sitemap.xml",
    icon: MapPin,
    description: "View generated sitemap",
  },
];

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "pass") return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  if (status === "warn") return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
  return <XCircle className="w-4 h-4 text-destructive" />;
};

const AdminSEO = () => {
  const [showChecklist, setShowChecklist] = useState(false);
  const [showPageStatus, setShowPageStatus] = useState(false);
  const [checkResult, setCheckResult] = useState<SeoCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("seo-checklist", {
        body: { baseUrl: "https://techagentlabs.com" },
      });
      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);
      setCheckResult(data as SeoCheckResult);
    } catch (e: any) {
      setError(e.message || "Failed to run SEO check");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChecklist = () => {
    const newState = !showChecklist;
    setShowChecklist(newState);
    if (newState && !checkResult && !loading) {
      runCheck();
    }
  };

  const handleTogglePageStatus = () => {
    const newState = !showPageStatus;
    setShowPageStatus(newState);
    if (newState && !checkResult && !loading) {
      runCheck();
    }
  };

  const checks = checkResult?.checks || [];
  const pages = checkResult?.pages || [];
  const passCount = checks.filter((i) => i.status === "pass").length;
  const score = checks.length > 0 ? Math.round((passCount / checks.length) * 100) : 0;

  return (
    <AdminLayout title="SEO & Performance" description="Monitor search optimization and site performance">
      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          variant={showChecklist ? "default" : "outline"}
          onClick={handleToggleChecklist}
          className="gap-2"
          disabled={loading}
        >
          {loading && showChecklist && !showPageStatus ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ClipboardCheck className="w-4 h-4" />
          )}
          SEO Checklist
          {showChecklist ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
        <Button
          variant={showPageStatus ? "default" : "outline"}
          onClick={handleTogglePageStatus}
          className="gap-2"
          disabled={loading}
        >
          {loading && showPageStatus && !showChecklist ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LayoutList className="w-4 h-4" />
          )}
          Page SEO Status
          {showPageStatus ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      {/* Live Audit Runner */}
      <div className="mb-6">
        <SEOAuditRunner />
      </div>

      {/* Score Overview - dynamic when data available */}
      {checkResult && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 animate-fade-in">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`text-3xl font-bold ${score >= 90 ? "text-green-500" : score >= 70 ? "text-yellow-500" : "text-destructive"}`}>
                  {score}%
                </div>
                <div>
                  <p className="text-sm font-medium">SEO Score</p>
                  <p className="text-xs text-muted-foreground">{passCount}/{checks.length} checks passed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Globe className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{pages.length}</p>
                  <p className="text-sm text-muted-foreground">Pages Checked</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{pages.filter((p) => p.hasSchema).length}</p>
                  <p className="text-sm text-muted-foreground">Pages with Schema</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center gap-3 p-4 mb-6 rounded-lg border border-border/50 bg-card/50">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Scanning techagentlabs.com for SEO elements…</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 p-4 mb-6 rounded-lg border border-destructive/50 bg-destructive/10">
          <XCircle className="w-5 h-5 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={runCheck} className="ml-auto gap-1">
            <RefreshCw className="w-3 h-3" /> Retry
          </Button>
        </div>
      )}

      {/* Collapsible Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SEO Checklist */}
        {showChecklist && checkResult && (
          <Card className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">SEO Checklist</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(checkResult.checkedAt).toLocaleTimeString()}
                </span>
                <Button variant="ghost" size="sm" onClick={runCheck} disabled={loading} className="h-7 w-7 p-0">
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {checks.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <StatusIcon status={item.status} />
                      <div className="min-w-0">
                        <span className="text-sm block">{item.label}</span>
                        {item.detail && (
                          <span className="text-xs text-muted-foreground block truncate">{item.detail}</span>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={item.status === "pass" ? "default" : item.status === "warn" ? "secondary" : "destructive"}
                      className="text-xs ml-2 shrink-0"
                    >
                      {item.status === "pass" ? "Pass" : item.status === "warn" ? "Review" : "Fail"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Page-Level SEO */}
        {showPageStatus && checkResult && (
          <Card className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Page SEO Status</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(checkResult.checkedAt).toLocaleTimeString()}
                </span>
                <Button variant="ghost" size="sm" onClick={runCheck} disabled={loading} className="h-7 w-7 p-0">
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pages.map((page) => (
                  <div key={page.path} className="py-2 border-b border-border/50 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{page.title || "No title"}</p>
                        <p className="text-xs text-muted-foreground">{page.path}</p>
                      </div>
                      <div className="flex gap-1 shrink-0 ml-2">
                        <Badge variant={page.title ? "default" : "destructive"} className="text-[10px]">Title</Badge>
                        <Badge variant={page.description ? "default" : "destructive"} className="text-[10px]">Desc</Badge>
                        <Badge variant={page.hasOG ? "default" : "secondary"} className="text-[10px]">OG</Badge>
                        <Badge variant={page.hasSchema ? "default" : "secondary"} className="text-[10px]">Schema</Badge>
                      </div>
                    </div>
                    {page.description && (
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {page.description.substring(0, 120)}…
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* External Tools - always visible */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {externalTools.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/50"
                >
                  <tool.icon className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{tool.name}</p>
                    <p className="text-xs text-muted-foreground">{tool.description}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSEO;
