import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  RefreshCw,
  Plus,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { toast } from "sonner";

const AGENT_OPTIONS = [
  "Support Agent",
  "Marketing Agent",
  "Analytics Agent",
  "Operations Agent",
  "Sales Agent",
  "Content Agent",
  "Web Agent",
  "Custom Agent",
];

const AdminRevenue = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    type: "sale" as string,
    agent_name: "",
    customer_name: "",
    customer_email: "",
    amount: "",
    is_recurring: false,
    recurring_interval: "" as string,
    status: "completed",
    notes: "",
    sale_date: format(new Date(), "yyyy-MM-dd"),
  });

  const { data: entries, isLoading } = useQuery({
    queryKey: ["admin-revenue"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("revenue_entries")
        .select("*")
        .order("sale_date", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("revenue_entries").insert({
        type: form.type,
        agent_name: form.agent_name,
        customer_name: form.customer_name || null,
        customer_email: form.customer_email || null,
        amount: parseFloat(form.amount),
        is_recurring: form.is_recurring,
        recurring_interval: form.is_recurring ? form.recurring_interval : null,
        status: form.status,
        notes: form.notes || null,
        sale_date: form.sale_date,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-revenue"] });
      setDialogOpen(false);
      setForm({
        type: "sale", agent_name: "", customer_name: "", customer_email: "",
        amount: "", is_recurring: false, recurring_interval: "", status: "completed",
        notes: "", sale_date: format(new Date(), "yyyy-MM-dd"),
      });
      toast.success("Revenue entry added");
    },
    onError: () => toast.error("Failed to add entry"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("revenue_entries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-revenue"] });
      toast.success("Entry deleted");
    },
  });

  const stats = useMemo(() => {
    if (!entries) return { totalRevenue: 0, mrr: 0, totalSales: 0, avgDeal: 0, growth: 0 };

    const completed = entries.filter((e) => e.status === "completed");
    const totalRevenue = completed.reduce((s, e) => s + Number(e.amount), 0);
    const mrr = completed
      .filter((e) => e.is_recurring && e.recurring_interval === "monthly")
      .reduce((s, e) => s + Number(e.amount), 0);
    const totalSales = completed.length;
    const avgDeal = totalSales > 0 ? totalRevenue / totalSales : 0;

    const now = new Date();
    const thisMonth = completed.filter((e) =>
      isWithinInterval(new Date(e.sale_date), { start: startOfMonth(now), end: endOfMonth(now) })
    );
    const lastMonth = completed.filter((e) =>
      isWithinInterval(new Date(e.sale_date), { start: startOfMonth(subMonths(now, 1)), end: endOfMonth(subMonths(now, 1)) })
    );
    const thisTotal = thisMonth.reduce((s, e) => s + Number(e.amount), 0);
    const lastTotal = lastMonth.reduce((s, e) => s + Number(e.amount), 0);
    const growth = lastTotal > 0 ? ((thisTotal - lastTotal) / lastTotal) * 100 : 0;

    return { totalRevenue, mrr, totalSales, avgDeal, growth };
  }, [entries]);

  const chartData = useMemo(() => {
    if (!entries) return [];
    const months: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(new Date(), i);
      months[format(d, "MMM yyyy")] = 0;
    }
    entries
      .filter((e) => e.status === "completed")
      .forEach((e) => {
        const key = format(new Date(e.sale_date), "MMM yyyy");
        if (key in months) months[key] += Number(e.amount);
      });
    return Object.entries(months).map(([name, revenue]) => ({ name, revenue }));
  }, [entries]);

  const agentData = useMemo(() => {
    if (!entries) return [];
    const agents: Record<string, number> = {};
    entries
      .filter((e) => e.status === "completed")
      .forEach((e) => {
        agents[e.agent_name] = (agents[e.agent_name] || 0) + Number(e.amount);
      });
    return Object.entries(agents)
      .map(([name, revenue]) => ({ name: name.replace(" Agent", ""), revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [entries]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  return (
    <AdminLayout title="Revenue Dashboard" description="Track agent sales, subscriptions, and MRR">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Recurring</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.mrr)}</p>
              </div>
              <RefreshCw className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">{stats.totalSales}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">MoM Growth</p>
                <p className="text-2xl font-bold flex items-center gap-1">
                  {stats.growth >= 0 ? (
                    <ArrowUpRight className="w-5 h-5 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5 text-destructive" />
                  )}
                  {Math.abs(stats.growth).toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                  formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.2)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue by Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={agentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                  formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Entries Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Entries</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Entry</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Revenue Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Type</Label>
                    <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">Sale</SelectItem>
                        <SelectItem value="subscription">Subscription</SelectItem>
                        <SelectItem value="custom_build">Custom Build</SelectItem>
                        <SelectItem value="refund">Refund</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Agent</Label>
                    <Select value={form.agent_name} onValueChange={(v) => setForm({ ...form, agent_name: v })}>
                      <SelectTrigger><SelectValue placeholder="Select agent" /></SelectTrigger>
                      <SelectContent>
                        {AGENT_OPTIONS.map((a) => (
                          <SelectItem key={a} value={a}>{a}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Amount ($)</Label>
                    <Input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input type="date" value={form.sale_date} onChange={(e) => setForm({ ...form, sale_date: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Customer Name</Label>
                    <Input value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Customer Email</Label>
                    <Input type="email" value={form.customer_email} onChange={(e) => setForm({ ...form, customer_email: e.target.value })} />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.is_recurring} onChange={(e) => setForm({ ...form, is_recurring: e.target.checked })} className="rounded" />
                    Recurring
                  </label>
                  {form.is_recurring && (
                    <Select value={form.recurring_interval} onValueChange={(v) => setForm({ ...form, recurring_interval: v })}>
                      <SelectTrigger className="w-32"><SelectValue placeholder="Interval" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
                </div>
                <Button
                  className="w-full"
                  onClick={() => addMutation.mutate()}
                  disabled={!form.agent_name || !form.amount || addMutation.isPending}
                >
                  {addMutation.isPending ? "Adding..." : "Add Entry"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : !entries?.length ? (
            <p className="text-muted-foreground text-sm text-center py-8">No revenue entries yet. Click "Add Entry" to start tracking.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Agent</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Customer</th>
                    <th className="text-right py-2 px-2 font-medium text-muted-foreground">Amount</th>
                    <th className="text-center py-2 px-2 font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-2 px-2 font-medium text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {entries.slice(0, 20).map((entry) => (
                    <tr key={entry.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-2 px-2">{format(new Date(entry.sale_date), "MMM d, yyyy")}</td>
                      <td className="py-2 px-2">
                        <Badge variant="secondary" className="text-xs capitalize">
                          {entry.type.replace("_", " ")}
                        </Badge>
                        {entry.is_recurring && (
                          <Badge variant="outline" className="text-xs ml-1">
                            <RefreshCw className="w-3 h-3 mr-0.5" />
                            {entry.recurring_interval}
                          </Badge>
                        )}
                      </td>
                      <td className="py-2 px-2">{entry.agent_name}</td>
                      <td className="py-2 px-2 text-muted-foreground">{entry.customer_name || "—"}</td>
                      <td className="py-2 px-2 text-right font-medium">
                        {entry.type === "refund" ? "-" : ""}
                        {formatCurrency(Number(entry.amount))}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <Badge
                          variant={entry.status === "completed" ? "default" : entry.status === "pending" ? "secondary" : "destructive"}
                          className="text-xs"
                        >
                          {entry.status}
                        </Badge>
                      </td>
                      <td className="py-2 px-2 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => deleteMutation.mutate(entry.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminRevenue;
