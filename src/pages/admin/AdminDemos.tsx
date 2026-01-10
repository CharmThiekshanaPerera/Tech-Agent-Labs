import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Eye, Trash2, Mail, Phone, Building, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

interface DemoBooking {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-500",
  confirmed: "bg-green-500/20 text-green-500",
  completed: "bg-blue-500/20 text-blue-500",
  cancelled: "bg-red-500/20 text-red-500",
};

const AdminDemos = () => {
  const [demos, setDemos] = useState<DemoBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDemo, setSelectedDemo] = useState<DemoBooking | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchDemos();
  }, []);

  const fetchDemos = async () => {
    const { data, error } = await supabase
      .from("demo_bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setDemos(data);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("demo_bookings")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Status updated to ${status}`);
      fetchDemos();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this demo booking?")) return;

    const { error } = await supabase.from("demo_bookings").delete().eq("id", id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Demo booking deleted");
      fetchDemos();
    }
  };

  const viewDetails = (demo: DemoBooking) => {
    setSelectedDemo(demo);
    setDetailOpen(true);
  };

  const filteredDemos = statusFilter === "all" 
    ? demos 
    : demos.filter((d) => d.status === statusFilter);

  return (
    <AdminLayout title="Demo Bookings" description="Manage demo requests">
      <div className="flex justify-end mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border/50 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Preferred Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredDemos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No demo bookings found
                </TableCell>
              </TableRow>
            ) : (
              filteredDemos.map((demo) => (
                <TableRow key={demo.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{demo.name}</p>
                      <p className="text-sm text-muted-foreground">{demo.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{demo.company || "-"}</TableCell>
                  <TableCell>
                    {demo.preferred_date
                      ? format(new Date(demo.preferred_date), "MMM d, yyyy")
                      : "-"}
                    {demo.preferred_time && (
                      <span className="text-muted-foreground ml-1">
                        at {demo.preferred_time}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={demo.status}
                      onValueChange={(value) => updateStatus(demo.id, value)}
                    >
                      <SelectTrigger className={`w-28 h-8 text-xs ${statusColors[demo.status]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{format(new Date(demo.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => viewDetails(demo)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(demo.id)}
                      className="text-destructive hover:text-destructive"
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

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Demo Booking Details</DialogTitle>
          </DialogHeader>

          {selectedDemo && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedDemo.email}</p>
                </div>
              </div>

              {selectedDemo.phone && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedDemo.phone}</p>
                  </div>
                </div>
              )}

              {selectedDemo.company && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Building className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{selectedDemo.company}</p>
                  </div>
                </div>
              )}

              {selectedDemo.preferred_date && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Preferred Date & Time</p>
                    <p className="font-medium">
                      {format(new Date(selectedDemo.preferred_date), "MMMM d, yyyy")}
                      {selectedDemo.preferred_time && ` at ${selectedDemo.preferred_time}`}
                    </p>
                  </div>
                </div>
              )}

              {selectedDemo.message && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Message</p>
                  <p className="bg-secondary/50 p-3 rounded-lg text-sm">{selectedDemo.message}</p>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="font-medium">
                    {format(new Date(selectedDemo.created_at), "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminDemos;
