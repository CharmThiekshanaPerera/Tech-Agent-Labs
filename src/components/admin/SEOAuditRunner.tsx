import { useState } from "react";
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

const SEOAuditRunner = () => {
  const [url, setUrl] = useState("https://techagentlabs.com");
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAudit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`;
      const res = await fetch(apiUrl);

      if (!res.ok) {
        throw new Error(`API returned ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      const categories: AuditCategory[] = Object.values(
        data.lighthouseResult.categories as Record<string, any>
      ).map((cat: any) => ({
        id: cat.id,
        title: cat.title,
        score: cat.score,
      }));

      // Pick the most impactful audits (failed/warning ones first)
      const allAudits = data.lighthouseResult.audits as Record<string, any>;
      const importantAudits: AuditItem[] = Object.values(allAudits)
        .filter(
          (a: any) =>
            a.score !== null &&
            a.score < 1 &&
            a.title &&
            !a.id.startsWith("diagnostic") &&
            a.scoreDisplayMode !== "informative" &&
            a.scoreDisplayMode !== "notApplicable" &&
            a.scoreDisplayMode !== "manual"
        )
        .sort((a: any, b: any) => (a.score ?? 1) - (b.score ?? 1))
        .slice(0, 15)
        .map((a: any) => ({
          id: a.id,
          title: a.title,
          description: a.description,
          score: a.score,
          displayValue: a.displayValue,
        }));

      setResult({
        categories,
        audits: importantAudits,
        strategy,
        fetchTime: new Date().toLocaleTimeString(),
      });
    } catch (err: any) {
      setError(err.message || "Failed to run audit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            >
              <Smartphone className="w-4 h-4 mr-1" />
              Mobile
            </Button>
            <Button
              variant={strategy === "desktop" ? "default" : "outline"}
              size="sm"
              onClick={() => setStrategy("desktop")}
              aria-label="Test desktop version"
            >
              <Monitor className="w-4 h-4 mr-1" />
              Desktop
            </Button>
          </div>
          <Button onClick={runAudit} disabled={loading || !url.trim()} className="gap-2">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : result ? (
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
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-8 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">
              Running Lighthouse audit on <span className="font-medium text-foreground">{strategy}</span>...
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
        {result && !loading && (
          <div className="space-y-6">
            {/* Scores */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {result.strategy === "mobile" ? "📱 Mobile" : "🖥️ Desktop"} • Tested at {result.fetchTime}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {result.categories.map((cat) => {
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

            {/* Recommendations */}
            {result.audits.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Opportunities & Diagnostics ({result.audits.length})
                </h4>
                <div className="max-h-[400px] overflow-y-auto pr-1">
                  {result.audits.map((audit) => (
                    <AuditItemRow key={audit.id} audit={audit} />
                  ))}
                </div>
              </div>
            )}

            {result.audits.length === 0 && (
              <div className="text-center py-6">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium">All audits passed!</p>
                <p className="text-xs text-muted-foreground">No issues found.</p>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!result && !loading && !error && (
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
