import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Play,
  Loader2,
  Smartphone,
  Monitor,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Zap,
  Eye,
  Shield,
  Search,
  Gauge,
  Download,
  Layers,
} from "lucide-react";

interface AuditCategory {
  id: string;
  title: string;
  score: number | null;
}

interface AuditItem {
  id: string;
  title: string;
  description: string;
  score: number | null;
  displayValue?: string;
}

interface AuditResult {
  categories: AuditCategory[];
  audits: AuditItem[];
  strategy: "mobile" | "desktop";
  fetchTime: string;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  performance: Zap,
  accessibility: Eye,
  "best-practices": Shield,
  seo: Search,
};

const ScoreCircle = ({ score, size = "lg" }: { score: number | null; size?: "sm" | "lg" }) => {
  if (score === null) return null;
  const pct = Math.round(score * 100);
  const color = pct >= 90 ? "text-green-500" : pct >= 50 ? "text-yellow-500" : "text-destructive";
  const bgColor = pct >= 90 ? "bg-green-500/10" : pct >= 50 ? "bg-yellow-500/10" : "bg-destructive/10";
  const dims = size === "lg" ? "w-20 h-20 text-2xl" : "w-12 h-12 text-sm";

  return (
    <div className={`${dims} rounded-full ${bgColor} flex items-center justify-center font-bold ${color}`}>
      {pct}
    </div>
  );
};

const AuditItemRow = ({ audit }: { audit: AuditItem }) => {
  const pct = audit.score !== null ? Math.round(audit.score * 100) : null;
  const icon =
    pct === null ? null : pct >= 90 ? (
      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
    ) : pct >= 50 ? (
      <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
    ) : (
      <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
    );

  return (
    <div className="flex items-start gap-2 py-2 border-b border-border/30 last:border-0">
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{audit.title}</p>
        {audit.displayValue && (
          <p className="text-xs text-muted-foreground">{audit.displayValue}</p>
        )}
      </div>
      {pct !== null && (
        <Badge
          variant={pct >= 90 ? "default" : "secondary"}
          className="text-[10px] flex-shrink-0"
        >
          {pct}
        </Badge>
      )}
    </div>
  );
};

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

interface SEOAuditRunnerProps {
  checklistItems?: CheckItem[];
  pageItems?: PageItem[];
  checkedAt?: string;
}

const formatResultSection = (result: AuditResult, lines: string[]) => {
  const label = result.strategy === "mobile" ? "📱 Mobile" : "🖥️ Desktop";
  lines.push(`${label} Results (tested at ${result.fetchTime})`);
  lines.push("-".repeat(30));
  lines.push("Category Scores:");
  result.categories.forEach((cat) => {
    lines.push(`  ${cat.title}: ${cat.score !== null ? Math.round(cat.score * 100) : "N/A"}/100`);
  });
  if (result.audits.length > 0) {
    lines.push("");
    lines.push("Opportunities & Diagnostics:");
    result.audits.forEach((a) => {
      const pct = a.score !== null ? Math.round(a.score * 100) : "N/A";
      lines.push(`  [${pct}/100] ${a.title}${a.displayValue ? ` — ${a.displayValue}` : ""}`);
    });
  } else {
    lines.push("  All audits passed!");
  }
};

const SEOAuditRunner = ({ checklistItems, pageItems, checkedAt }: SEOAuditRunnerProps) => {
  const [url, setUrl] = useState("https://techagentlabs.com");
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
  const [loading, setLoading] = useState(false);
  const [mobileResult, setMobileResult] = useState<AuditResult | null>(null);
  const [desktopResult, setDesktopResult] = useState<AuditResult | null>(null);
  const [runningBoth, setRunningBoth] = useState(false);
  const [bothProgress, setBothProgress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const displayResult = strategy === "mobile" ? mobileResult : desktopResult;
  const hasBothResults = mobileResult !== null && desktopResult !== null;
  const hasAnyResult = mobileResult !== null || desktopResult !== null;

  const runSingleAudit = async (strat: "mobile" | "desktop"): Promise<AuditResult> => {
    const { data, error: fnError } = await supabase.functions.invoke("pagespeed-audit", {
      body: { url, strategy: strat },
    });

    if (fnError) throw new Error(fnError.message || "Edge function error");
    if (data?.error) throw new Error(data.error);

    const categories: AuditCategory[] = Object.values(
      data.lighthouseResult.categories as Record<string, any>
    ).map((cat: any) => ({ id: cat.id, title: cat.title, score: cat.score }));

    const allAudits = data.lighthouseResult.audits as Record<string, any>;
    const importantAudits: AuditItem[] = Object.values(allAudits)
      .filter(
        (a: any) =>
          a.score !== null && a.score < 1 && a.title &&
          !a.id.startsWith("diagnostic") &&
          a.scoreDisplayMode !== "informative" &&
          a.scoreDisplayMode !== "notApplicable" &&
          a.scoreDisplayMode !== "manual"
      )
      .sort((a: any, b: any) => (a.score ?? 1) - (b.score ?? 1))
      .slice(0, 15)
      .map((a: any) => ({
        id: a.id, title: a.title, description: a.description,
        score: a.score, displayValue: a.displayValue,
      }));

    return { categories, audits: importantAudits, strategy: strat, fetchTime: new Date().toLocaleTimeString() };
  };

  const runAudit = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await runSingleAudit(strategy);
      if (strategy === "mobile") setMobileResult(result);
      else setDesktopResult(result);
    } catch (err: any) {
      setError(err.message || "Failed to run audit.");
    } finally {
      setLoading(false);
    }
  };

  const runBothAudits = async () => {
    setLoading(true);
    setRunningBoth(true);
    setError(null);
    try {
      setBothProgress("Running mobile audit... (1/2)");
      const mobile = await runSingleAudit("mobile");
      setMobileResult(mobile);

      setBothProgress("Running desktop audit... (2/2)");
      const desktop = await runSingleAudit("desktop");
      setDesktopResult(desktop);
    } catch (err: any) {
      setError(err.message || "Failed to run audit.");
    } finally {
      setLoading(false);
      setRunningBoth(false);
      setBothProgress("");
    }
  };

  const downloadReport = () => {
    if (!hasAnyResult) return;
    const lines: string[] = [];
    lines.push("SEO & Performance Audit Report");
    lines.push("=".repeat(40));
    lines.push(`URL: ${url}`);
    lines.push(`Generated: ${new Date().toLocaleString()}`);
    lines.push("");

    if (mobileResult) {
      formatResultSection(mobileResult, lines);
      lines.push("");
    }
    if (desktopResult) {
      if (mobileResult) lines.push("");
      formatResultSection(desktopResult, lines);
      lines.push("");
    }

    if (checklistItems && checklistItems.length > 0) {
      lines.push("");
      lines.push("SEO Checklist Results");
      lines.push("=".repeat(40));
      if (checkedAt) lines.push(`Checked at: ${new Date(checkedAt).toLocaleString()}`);
      const passCount = checklistItems.filter((i) => i.status === "pass").length;
      lines.push(`Score: ${Math.round((passCount / checklistItems.length) * 100)}% (${passCount}/${checklistItems.length} passed)`);
      lines.push("-".repeat(30));
      checklistItems.forEach((item) => {
        const icon = item.status === "pass" ? "✓" : item.status === "warn" ? "⚠" : "✗";
        lines.push(`  ${icon} [${item.status.toUpperCase()}] ${item.label}`);
        if (item.detail) lines.push(`    → ${item.detail}`);
      });
    }

    if (pageItems && pageItems.length > 0) {
      lines.push("");
      lines.push("");
      lines.push("Page SEO Status");
      lines.push("=".repeat(40));
      pageItems.forEach((page) => {
        lines.push(`  ${page.path}`);
        lines.push(`    Title: ${page.title || "Missing"}`);
        lines.push(`    Description: ${page.description ? page.description.substring(0, 120) : "Missing"}`);
        lines.push(`    Open Graph: ${page.hasOG ? "Yes" : "No"} | Schema: ${page.hasSchema ? "Yes" : "No"}`);
        lines.push("");
      });
    }

    const label = hasBothResults ? "full" : mobileResult ? "mobile" : "desktop";
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `seo-audit-${label}-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const downloadLabel = hasBothResults
    ? "Download Full Report"
    : mobileResult
    ? "Download Report (Mobile)"
    : desktopResult
    ? "Download Report (Desktop)"
    : "Download Report";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Live SEO & Performance Audit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yoursite.com"
            className="flex-1"
            aria-label="URL to audit"
          />
          <div className="flex gap-2">
            <Button
              variant={strategy === "mobile" ? "default" : "outline"}
              size="sm"
              onClick={() => setStrategy("mobile")}
              aria-label="Test mobile version"
              className="relative"
            >
              <Smartphone className="w-4 h-4 mr-1" />
              Mobile
              {mobileResult && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background" />
              )}
            </Button>
            <Button
              variant={strategy === "desktop" ? "default" : "outline"}
              size="sm"
              onClick={() => setStrategy("desktop")}
              aria-label="Test desktop version"
              className="relative"
            >
              <Monitor className="w-4 h-4 mr-1" />
              Desktop
              {desktopResult && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background" />
              )}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={runAudit} disabled={loading || !url.trim()} className="gap-2">
              {loading && !runningBoth ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : displayResult ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  Re-run
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Audit
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={runBothAudits}
              disabled={loading || !url.trim()}
              className="gap-2"
            >
              {runningBoth ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Both...
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  Run Both
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-8 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">
              {runningBoth ? bothProgress : (
                <>Running Lighthouse audit on <span className="font-medium text-foreground">{strategy}</span>...</>
              )}
            </p>
            <p className="text-xs text-muted-foreground">This may take 15-30 seconds</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Results */}
        {displayResult && !loading && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {displayResult.strategy === "mobile" ? "📱 Mobile" : "🖥️ Desktop"} • Tested at {displayResult.fetchTime}
              </p>
              <Button variant="outline" size="sm" onClick={downloadReport} className="gap-1.5">
                <Download className="w-4 h-4" />
                {downloadLabel}
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {displayResult.categories.map((cat) => {
                const Icon = CATEGORY_ICONS[cat.id] || Zap;
                return (
                  <div key={cat.id} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted/30 border border-border/50">
                    <ScoreCircle score={cat.score} />
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs font-medium text-center">{cat.title}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {displayResult.audits.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Opportunities & Diagnostics ({displayResult.audits.length})
                </h4>
                <div className="max-h-[400px] overflow-y-auto pr-1">
                  {displayResult.audits.map((audit) => (
                    <AuditItemRow key={audit.id} audit={audit} />
                  ))}
                </div>
              </div>
            )}

            {displayResult.audits.length === 0 && (
              <div className="text-center py-6">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium">All audits passed!</p>
                <p className="text-xs text-muted-foreground">No issues found.</p>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!displayResult && !loading && !error && (
          <div className="text-center py-6 text-muted-foreground">
            <Gauge className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Click "Run Audit" to test your site's SEO & performance</p>
            <p className="text-xs mt-1">Powered by Google PageSpeed Insights (Lighthouse)</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SEOAuditRunner;
