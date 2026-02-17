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
} from "lucide-react";

const seoChecklist = [
  { label: "Meta title on all pages", status: "pass" },
  { label: "Meta descriptions set", status: "pass" },
  { label: "Open Graph images configured", status: "pass" },
  { label: "JSON-LD structured data", status: "pass" },
  { label: "XML Sitemap available", status: "pass" },
  { label: "Robots.txt configured", status: "pass" },
  { label: "Canonical URLs set", status: "pass" },
  { label: "Alt text on images", status: "warn" },
  { label: "Mobile responsive design", status: "pass" },
  { label: "HTTPS enabled", status: "pass" },
  { label: "Google Search Console verified", status: "pass" },
  { label: "Lazy loading for images", status: "pass" },
];

const pages = [
  { path: "/", title: "Home", hasTitle: true, hasDesc: true, hasOG: true, hasSchema: true },
  { path: "/blog", title: "Blog", hasTitle: true, hasDesc: true, hasOG: true, hasSchema: true },
  { path: "/blog/:slug", title: "Blog Post", hasTitle: true, hasDesc: true, hasOG: true, hasSchema: true },
  { path: "/privacy-policy", title: "Privacy Policy", hasTitle: true, hasDesc: true, hasOG: false, hasSchema: false },
];

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
  const passCount = seoChecklist.filter((i) => i.status === "pass").length;
  const score = Math.round((passCount / seoChecklist.length) * 100);

  return (
    <AdminLayout title="SEO & Performance" description="Monitor search optimization and site performance">
      {/* Score Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={`text-3xl font-bold ${score >= 90 ? "text-green-500" : score >= 70 ? "text-yellow-500" : "text-destructive"}`}>
                {score}%
              </div>
              <div>
                <p className="text-sm font-medium">SEO Score</p>
                <p className="text-xs text-muted-foreground">{passCount}/{seoChecklist.length} checks passed</p>
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
                <p className="text-sm text-muted-foreground">Indexed Pages</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">4</p>
                <p className="text-sm text-muted-foreground">Schema Types Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SEO Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">SEO Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {seoChecklist.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusIcon status={item.status} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <Badge variant={item.status === "pass" ? "default" : "secondary"} className="text-xs">
                    {item.status === "pass" ? "Pass" : "Review"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Page-Level SEO */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Page SEO Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pages.map((page) => (
                  <div key={page.path} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{page.title}</p>
                      <p className="text-xs text-muted-foreground">{page.path}</p>
                    </div>
                    <div className="flex gap-1">
                      <Badge variant={page.hasTitle ? "default" : "destructive"} className="text-[10px]">Title</Badge>
                      <Badge variant={page.hasDesc ? "default" : "destructive"} className="text-[10px]">Desc</Badge>
                      <Badge variant={page.hasOG ? "default" : "secondary"} className="text-[10px]">OG</Badge>
                      <Badge variant={page.hasSchema ? "default" : "secondary"} className="text-[10px]">Schema</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* External Tools */}
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
      </div>
    </AdminLayout>
  );
};

export default AdminSEO;
