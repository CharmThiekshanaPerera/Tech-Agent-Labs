import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { 
  Search, 
  Loader2, 
  Trash2, 
  Users, 
  UserCheck, 
  UserX, 
  TrendingUp,
  Mail,
  Download,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  confirmed: boolean;
  unsubscribed_at: string | null;
  created_at: string;
}

interface Stats {
  total: number;
  active: number;
  unsubscribed: number;
  thisMonth: number;
}

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, unsubscribed: 0, thisMonth: 0 });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<Subscriber | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false });

    if (!error && data) {
      setSubscribers(data);
      calculateStats(data);
    } else if (error) {
      console.error("Error fetching subscribers:", error);
      toast.error("Failed to load subscribers");
    }
    setLoading(false);
  };

  const calculateStats = (data: Subscriber[]) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const total = data.length;
    const active = data.filter(s => !s.unsubscribed_at && s.confirmed).length;
    const unsubscribed = data.filter(s => s.unsubscribed_at).length;
    const thisMonth = data.filter(s => new Date(s.subscribed_at) >= startOfMonth).length;

    setStats({ total, active, unsubscribed, thisMonth });
  };

  const handleDelete = (subscriber: Subscriber) => {
    setSubscriberToDelete(subscriber);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!subscriberToDelete) return;
    
    setDeleting(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .eq("id", subscriberToDelete.id);

    if (error) {
      toast.error("Failed to remove subscriber");
    } else {
      toast.success("Subscriber removed");
      fetchSubscribers();
    }
    setDeleting(false);
    setDeleteDialogOpen(false);
    setSubscriberToDelete(null);
  };

  const handleExport = () => {
    const activeSubscribers = subscribers.filter(s => !s.unsubscribed_at && s.confirmed);
    const csvContent = [
      "Email,Subscribed Date,Status",
      ...activeSubscribers.map(s => 
        `${s.email},${format(new Date(s.subscribed_at), "yyyy-MM-dd")},Active`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Subscribers exported");
  };

  const filteredSubscribers = subscribers.filter(s =>
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) => (
    <div className="bg-card border border-border/50 rounded-xl p-5">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout 
      title="Newsletter Subscribers" 
      description="Manage your newsletter subscriber list and view subscription analytics"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Total Subscribers" value={stats.total} color="bg-blue-500/20 text-blue-500" />
        <StatCard icon={UserCheck} label="Active" value={stats.active} color="bg-green-500/20 text-green-500" />
        <StatCard icon={UserX} label="Unsubscribed" value={stats.unsubscribed} color="bg-red-500/20 text-red-500" />
        <StatCard icon={TrendingUp} label="This Month" value={stats.thisMonth} color="bg-primary/20 text-primary" />
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchSubscribers} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={stats.active === 0}>
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-card border border-border/50 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Subscribed Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredSubscribers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Mail className="w-8 h-8 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {searchQuery ? "No subscribers found matching your search" : "No subscribers yet"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredSubscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      {subscriber.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(subscriber.subscribed_at), "MMM d, yyyy 'at' h:mm a")}
                  </TableCell>
                  <TableCell>
                    {subscriber.unsubscribed_at ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-500">
                        Unsubscribed
                      </span>
                    ) : subscriber.confirmed ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-500">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-500">
                        Pending
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(subscriber)}
                      className="text-destructive hover:text-destructive"
                      title="Remove subscriber"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results Count */}
      {!loading && filteredSubscribers.length > 0 && (
        <p className="text-sm text-muted-foreground mt-4">
          Showing {filteredSubscribers.length} of {subscribers.length} subscribers
        </p>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Subscriber</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{subscriberToDelete?.email}</strong> from the newsletter?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminNewsletter;
