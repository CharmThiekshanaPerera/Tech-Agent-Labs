import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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
import { Loader2, Eye, Trash2, Mail, User, Clock, CheckCircle, Circle } from "lucide-react";
import { format } from "date-fns";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  replied: boolean;
  created_at: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setMessages(data);
    }
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ read: true })
      .eq("id", id);

    if (!error) {
      fetchMessages();
    }
  };

  const toggleReplied = async (id: string, currentValue: boolean) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ replied: !currentValue })
      .eq("id", id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Marked as ${!currentValue ? "replied" : "not replied"}`);
      fetchMessages();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    const { error } = await supabase.from("contact_messages").delete().eq("id", id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Message deleted");
      fetchMessages();
    }
  };

  const viewDetails = (message: ContactMessage) => {
    setSelectedMessage(message);
    setDetailOpen(true);
    if (!message.read) {
      markAsRead(message.id);
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <AdminLayout 
      title="Contact Messages" 
      description={`${unreadCount} unread message${unreadCount !== 1 ? "s" : ""}`}
    >
      <div className="bg-card border border-border/50 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>From</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Replied</TableHead>
              <TableHead>Date</TableHead>
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
            ) : messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No messages yet
                </TableCell>
              </TableRow>
            ) : (
              messages.map((msg) => (
                <TableRow key={msg.id} className={!msg.read ? "bg-primary/5" : ""}>
                  <TableCell>
                    {!msg.read && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className={`${!msg.read ? "font-semibold" : "font-medium"}`}>
                        {msg.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{msg.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {msg.subject || "(No subject)"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleReplied(msg.id, msg.replied)}
                      className={msg.replied ? "text-green-500" : "text-muted-foreground"}
                    >
                      {msg.replied ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>{format(new Date(msg.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => viewDetails(msg)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(msg.id)}
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
              </div>

              {selectedMessage.subject && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Subject</p>
                  <p className="font-medium">{selectedMessage.subject}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-2">Message</p>
                <p className="bg-secondary/50 p-4 rounded-lg text-sm whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Received</p>
                  <p className="font-medium">
                    {format(new Date(selectedMessage.created_at), "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant={selectedMessage.replied ? "default" : "outline"}
                  onClick={() => {
                    toggleReplied(selectedMessage.id, selectedMessage.replied);
                    setSelectedMessage({ ...selectedMessage, replied: !selectedMessage.replied });
                  }}
                >
                  {selectedMessage.replied ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Marked as Replied
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4" />
                      Mark as Replied
                    </>
                  )}
                </Button>
                <Button variant="glow" asChild>
                  <a href={`mailto:${selectedMessage.email}`}>
                    <Mail className="w-4 h-4" />
                    Reply via Email
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminMessages;
