import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MessageSquare, Calendar, Star, TrendingUp, Users, Eye, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { format, subDays, startOfDay, eachDayOfInterval } from "date-fns";

interface Stats {
  totalPosts: number;
  totalMessages: number;
  totalDemos: number;
  totalTestimonials: number;
  unreadMessages: number;
  pendingDemos: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    totalMessages: 0,
    totalDemos: 0,
    totalTestimonials: 0,
    unreadMessages: 0,
    pendingDemos: 0,
  });
  const [messagesOverTime, setMessagesOverTime] = useState<any[]>([]);
  const [demosOverTime, setDemosOverTime] = useState<any[]>([]);
  const [demoStatusData, setDemoStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchChartData();
  }, []);

  const fetchStats = async () => {
    const [posts, messages, demos, testimonials] = await Promise.all([
      supabase.from("blog_posts").select("id", { count: "exact" }),
      supabase.from("contact_messages").select("id, read", { count: "exact" }),
      supabase.from("demo_bookings").select("id, status", { count: "exact" }),
      supabase.from("testimonials").select("id", { count: "exact" }),
    ]);

    const unreadMessages = messages.data?.filter((m) => !m.read).length || 0;
    const pendingDemos = demos.data?.filter((d) => d.status === "pending").length || 0;

    setStats({
      totalPosts: posts.count || 0,
      totalMessages: messages.count || 0,
      totalDemos: demos.count || 0,
      totalTestimonials: testimonials.count || 0,
      unreadMessages,
      pendingDemos,
    });
    setLoading(false);
  };

  const fetchChartData = async () => {
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date(),
    });

    // Fetch messages for chart
    const { data: messagesData } = await supabase
      .from("contact_messages")
      .select("created_at")
      .gte("created_at", subDays(new Date(), 30).toISOString());

    // Fetch demos for chart
    const { data: demosData } = await supabase
      .from("demo_bookings")
      .select("created_at, status")
      .gte("created_at", subDays(new Date(), 30).toISOString());

    // Process messages over time
    const messagesChart = last30Days.map((date) => {
      const dayStr = format(date, "yyyy-MM-dd");
      const count = messagesData?.filter(
        (m) => format(new Date(m.created_at), "yyyy-MM-dd") === dayStr
      ).length || 0;
      return { date: format(date, "MMM d"), messages: count };
    });
    setMessagesOverTime(messagesChart);

    // Process demos over time
    const demosChart = last30Days.map((date) => {
      const dayStr = format(date, "yyyy-MM-dd");
      const count = demosData?.filter(
        (d) => format(new Date(d.created_at), "yyyy-MM-dd") === dayStr
      ).length || 0;
      return { date: format(date, "MMM d"), demos: count };
    });
    setDemosOverTime(demosChart);

    // Process demo status distribution
    const statusCounts = {
      pending: demosData?.filter((d) => d.status === "pending").length || 0,
      confirmed: demosData?.filter((d) => d.status === "confirmed").length || 0,
      completed: demosData?.filter((d) => d.status === "completed").length || 0,
      cancelled: demosData?.filter((d) => d.status === "cancelled").length || 0,
    };
    setDemoStatusData([
      { name: "Pending", value: statusCounts.pending, color: "#f59e0b" },
      { name: "Confirmed", value: statusCounts.confirmed, color: "#22ff66" },
      { name: "Completed", value: statusCounts.completed, color: "#3b82f6" },
      { name: "Cancelled", value: statusCounts.cancelled, color: "#ef4444" },
    ]);
  };

  const statCards = [
    { title: "Total Blog Posts", value: stats.totalPosts, icon: FileText, color: "text-blue-500" },
    { title: "Total Messages", value: stats.totalMessages, icon: MessageSquare, color: "text-green-500", subtitle: `${stats.unreadMessages} unread` },
    { title: "Demo Bookings", value: stats.totalDemos, icon: Calendar, color: "text-purple-500", subtitle: `${stats.pendingDemos} pending` },
    { title: "Testimonials", value: stats.totalTestimonials, icon: Star, color: "text-yellow-500" },
  ];

  return (
    <AdminLayout title="Dashboard" description="Overview of your website analytics">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                  )}
                </div>
                <div className={`p-3 rounded-lg bg-secondary/50 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Messages Over Time */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Messages (Last 30 Days)
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

        {/* Demos Over Time */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Demo Bookings (Last 30 Days)
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
                  <Bar dataKey="demos" fill="#22ff66" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demo Status Distribution */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Demo Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="h-64 w-64">
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
            <div className="flex flex-wrap gap-4">
              {demoStatusData.map((status) => (
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
    </AdminLayout>
  );
};

export default AdminDashboard;
