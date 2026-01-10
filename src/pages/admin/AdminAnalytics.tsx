import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MousePointer, 
  Target,
  ArrowRight,
  Calendar,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
  LineChart,
  Line
} from "recharts";
import { format, subDays, eachDayOfInterval, eachWeekOfInterval, startOfWeek, endOfWeek, differenceInDays } from "date-fns";
import { Button } from "@/components/ui/button";

interface ConversionMetrics {
  totalVisitors: number;
  contactSubmissions: number;
  demoBookings: number;
  conversionRate: number;
  demoConversionRate: number;
}

interface TimeRangeData {
  messages: { date: string; count: number }[];
  demos: { date: string; count: number }[];
}

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [conversionMetrics, setConversionMetrics] = useState<ConversionMetrics>({
    totalVisitors: 0,
    contactSubmissions: 0,
    demoBookings: 0,
    conversionRate: 0,
    demoConversionRate: 0,
  });
  const [funnelData, setFunnelData] = useState<any[]>([]);
  const [messagesOverTime, setMessagesOverTime] = useState<any[]>([]);
  const [demosOverTime, setDemosOverTime] = useState<any[]>([]);
  const [demoStatusData, setDemoStatusData] = useState<any[]>([]);
  const [responseTimeData, setResponseTimeData] = useState<any[]>([]);
  const [topSources, setTopSources] = useState<any[]>([]);
  const [weeklyComparison, setWeeklyComparison] = useState<any>({ current: 0, previous: 0, change: 0 });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const getDaysFromRange = () => {
    switch (timeRange) {
      case "7d": return 7;
      case "30d": return 30;
      case "90d": return 90;
      default: return 30;
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    const days = getDaysFromRange();
    const startDate = subDays(new Date(), days);

    // Fetch all data in parallel
    const [messagesResult, demosResult, previousMessagesResult, previousDemosResult] = await Promise.all([
      supabase
        .from("contact_messages")
        .select("created_at, read, replied, subject")
        .gte("created_at", startDate.toISOString()),
      supabase
        .from("demo_bookings")
        .select("created_at, status, company")
        .gte("created_at", startDate.toISOString()),
      // Previous period for comparison
      supabase
        .from("contact_messages")
        .select("created_at")
        .gte("created_at", subDays(startDate, days).toISOString())
        .lt("created_at", startDate.toISOString()),
      supabase
        .from("demo_bookings")
        .select("created_at")
        .gte("created_at", subDays(startDate, days).toISOString())
        .lt("created_at", startDate.toISOString()),
    ]);

    const messages = messagesResult.data || [];
    const demos = demosResult.data || [];
    const previousMessages = previousMessagesResult.data || [];
    const previousDemos = previousDemosResult.data || [];

    // Calculate conversion metrics (estimated based on typical conversion rates)
    const estimatedVisitors = (messages.length + demos.length) * 50; // Rough estimate
    const contactSubmissions = messages.length;
    const demoBookings = demos.length;
    
    setConversionMetrics({
      totalVisitors: estimatedVisitors,
      contactSubmissions,
      demoBookings,
      conversionRate: estimatedVisitors > 0 ? (contactSubmissions / estimatedVisitors) * 100 : 0,
      demoConversionRate: contactSubmissions > 0 ? (demoBookings / contactSubmissions) * 100 : 0,
    });

    // Build funnel data
    const confirmedDemos = demos.filter(d => d.status === "confirmed" || d.status === "completed").length;
    const completedDemos = demos.filter(d => d.status === "completed").length;
    
    setFunnelData([
      { name: "Visitors", value: estimatedVisitors, fill: "#22ff66" },
      { name: "Contact Form", value: contactSubmissions, fill: "#3b82f6" },
      { name: "Demo Booked", value: demoBookings, fill: "#8b5cf6" },
      { name: "Demo Confirmed", value: confirmedDemos, fill: "#f59e0b" },
      { name: "Completed", value: completedDemos, fill: "#10b981" },
    ]);

    // Weekly comparison
    const currentTotal = messages.length + demos.length;
    const previousTotal = previousMessages.length + previousDemos.length;
    const percentChange = previousTotal > 0 
      ? ((currentTotal - previousTotal) / previousTotal) * 100 
      : 0;
    
    setWeeklyComparison({
      current: currentTotal,
      previous: previousTotal,
      change: percentChange,
    });

    // Messages over time
    const dateRange = eachDayOfInterval({ start: startDate, end: new Date() });
    const messagesChart = dateRange.map((date) => {
      const dayStr = format(date, "yyyy-MM-dd");
      const count = messages.filter(
        (m) => format(new Date(m.created_at), "yyyy-MM-dd") === dayStr
      ).length;
      return { date: format(date, "MMM d"), messages: count };
    });
    setMessagesOverTime(messagesChart);

    // Demos over time
    const demosChart = dateRange.map((date) => {
      const dayStr = format(date, "yyyy-MM-dd");
      const count = demos.filter(
        (d) => format(new Date(d.created_at), "yyyy-MM-dd") === dayStr
      ).length;
      return { date: format(date, "MMM d"), demos: count };
    });
    setDemosOverTime(demosChart);

    // Demo status distribution
    const statusCounts = {
      pending: demos.filter((d) => d.status === "pending").length,
      confirmed: demos.filter((d) => d.status === "confirmed").length,
      completed: demos.filter((d) => d.status === "completed").length,
      cancelled: demos.filter((d) => d.status === "cancelled").length,
    };
    setDemoStatusData([
      { name: "Pending", value: statusCounts.pending, color: "#f59e0b", icon: AlertCircle },
      { name: "Confirmed", value: statusCounts.confirmed, color: "#22ff66", icon: CheckCircle },
      { name: "Completed", value: statusCounts.completed, color: "#3b82f6", icon: CheckCircle },
      { name: "Cancelled", value: statusCounts.cancelled, color: "#ef4444", icon: XCircle },
    ]);

    // Response analysis (based on read/replied status)
    const repliedCount = messages.filter(m => m.replied).length;
    const readCount = messages.filter(m => m.read).length;
    const unreadCount = messages.filter(m => !m.read).length;
    
    setResponseTimeData([
      { name: "Replied", value: repliedCount, color: "#22ff66" },
      { name: "Read", value: readCount - repliedCount, color: "#3b82f6" },
      { name: "Unread", value: unreadCount, color: "#f59e0b" },
    ]);

    // Top inquiry sources (from subject field)
    const subjectCounts: Record<string, number> = {};
    messages.forEach(m => {
      const subject = m.subject || "General Inquiry";
      subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
    });
    
    const sortedSources = Object.entries(subjectCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    setTopSources(sortedSources);

    setLoading(false);
  };

  const kpiCards = [
    { 
      title: "Total Leads", 
      value: conversionMetrics.contactSubmissions + conversionMetrics.demoBookings,
      subtitle: "Messages + Demos",
      icon: Users,
      color: "text-primary"
    },
    { 
      title: "Demo Bookings", 
      value: conversionMetrics.demoBookings,
      subtitle: `${conversionMetrics.demoConversionRate.toFixed(1)}% of contacts`,
      icon: Calendar,
      color: "text-purple-500"
    },
    { 
      title: "Contact Messages", 
      value: conversionMetrics.contactSubmissions,
      subtitle: "Form submissions",
      icon: MessageSquare,
      color: "text-blue-500"
    },
    { 
      title: "Period Change", 
      value: `${weeklyComparison.change >= 0 ? "+" : ""}${weeklyComparison.change.toFixed(1)}%`,
      subtitle: `vs previous ${timeRange}`,
      icon: TrendingUp,
      color: weeklyComparison.change >= 0 ? "text-green-500" : "text-red-500"
    },
  ];

  return (
    <AdminLayout title="Analytics" description="Detailed metrics and conversion funnels">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {(["7d", "30d", "90d"] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a 
              href="https://analytics.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Google Analytics
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a 
              href="https://clarity.microsoft.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Microsoft Clarity
            </a>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiCards.map((card) => (
          <Card key={card.title} className="bg-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-3xl font-bold mt-1">{card.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
                </div>
                <div className={`p-3 rounded-lg bg-secondary/50 ${card.color}`}>
                  <card.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="funnel" className="space-y-6">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="status">Demo Status</TabsTrigger>
          <TabsTrigger value="sources">Lead Sources</TabsTrigger>
        </TabsList>

        {/* Conversion Funnel Tab */}
        <TabsContent value="funnel" className="space-y-6">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Conversion Funnel
              </CardTitle>
              <CardDescription>
                Track user journey from visitor to completed demo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funnelData.map((stage, index) => {
                  const prevValue = index > 0 ? funnelData[index - 1].value : stage.value;
                  const dropoff = prevValue > 0 ? ((prevValue - stage.value) / prevValue * 100).toFixed(1) : "0";
                  const percentage = funnelData[0].value > 0 
                    ? ((stage.value / funnelData[0].value) * 100).toFixed(1)
                    : "0";
                  
                  return (
                    <div key={stage.name} className="relative">
                      <div className="flex items-center gap-4">
                        <div className="w-32 text-sm font-medium text-right">
                          {stage.name}
                        </div>
                        <div className="flex-1 relative">
                          <div className="h-12 bg-secondary/30 rounded-lg overflow-hidden">
                            <div 
                              className="h-full rounded-lg transition-all duration-500 flex items-center justify-center"
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: stage.fill,
                                minWidth: stage.value > 0 ? "60px" : "0"
                              }}
                            >
                              <span className="text-sm font-bold text-background px-2">
                                {stage.value}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-24 text-sm text-muted-foreground">
                          {percentage}%
                        </div>
                      </div>
                      {index > 0 && index < funnelData.length && (
                        <div className="flex items-center gap-4 my-1">
                          <div className="w-32" />
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <ArrowRight className="w-3 h-3" />
                            <span>{dropoff}% drop-off</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Response Status */}
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Message Response Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="h-48 w-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={responseTimeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {responseTimeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-4">
                  {responseTimeData.map((status) => (
                    <div key={status.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {status.name}: {status.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Messages Trend */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Contact Messages Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={messagesOverTime}>
                      <defs>
                        <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22ff66" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#22ff66" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="messages"
                        stroke="#22ff66"
                        fillOpacity={1}
                        fill="url(#colorMessages)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Demos Trend */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Demo Bookings Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={demosOverTime}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Bar dataKey="demos" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Demo Status Tab */}
        <TabsContent value="status" className="space-y-6">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Demo Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {demoStatusData.map((status) => (
                  <div 
                    key={status.name} 
                    className="p-4 rounded-lg border border-border/50 bg-secondary/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <status.icon className="w-4 h-4" style={{ color: status.color }} />
                      <span className="text-sm font-medium">{status.name}</span>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: status.color }}>
                      {status.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={demoStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {demoStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lead Sources Tab */}
        <TabsContent value="sources" className="space-y-6">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointer className="w-5 h-5 text-primary" />
                Top Inquiry Types
              </CardTitle>
              <CardDescription>
                Most common inquiry subjects from contact form
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topSources.length > 0 ? (
                <div className="space-y-4">
                  {topSources.map((source, index) => {
                    const maxCount = topSources[0]?.count || 1;
                    const percentage = (source.count / maxCount) * 100;
                    
                    return (
                      <div key={source.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate max-w-[200px]">
                            {index + 1}. {source.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {source.count} inquiries
                          </span>
                        </div>
                        <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No inquiry data available for this period
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminAnalytics;
