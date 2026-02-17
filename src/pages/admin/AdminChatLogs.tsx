import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Trash2, Search, Bot, User, Clock, Globe } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatLog {
  id: string;
  session_id: string;
  messages: ChatMessage[];
  message_count: number;
  first_message: string | null;
  page_path: string | null;
  created_at: string;
  updated_at: string;
}

const AdminChatLogs = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<ChatLog | null>(null);

  const { data: chatLogs, isLoading } = useQuery({
    queryKey: ["admin-chat-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data || []) as unknown as ChatLog[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("chat_logs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-chat-logs"] });
      setSelectedLog(null);
      toast.success("Chat log deleted");
    },
  });

  const filtered = chatLogs?.filter(
    (log) =>
      !search ||
      log.first_message?.toLowerCase().includes(search.toLowerCase()) ||
      log.session_id.toLowerCase().includes(search.toLowerCase())
  );

  const totalConversations = chatLogs?.length || 0;
  const totalMessages = chatLogs?.reduce((sum, l) => sum + l.message_count, 0) || 0;
  const todayCount = chatLogs?.filter(
    (l) => new Date(l.created_at).toDateString() === new Date().toDateString()
  ).length || 0;

  return (
    <AdminLayout title="AI Chat Logs" description="View customer chatbot conversations">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{totalConversations}</p>
                <p className="text-sm text-muted-foreground">Total Conversations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Bot className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{totalMessages}</p>
                <p className="text-sm text-muted-foreground">Total Messages</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{todayCount}</p>
                <p className="text-sm text-muted-foreground">Today's Chats</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversation List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Conversations</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {isLoading ? (
                <p className="p-4 text-muted-foreground text-sm">Loading...</p>
              ) : filtered?.length === 0 ? (
                <p className="p-4 text-muted-foreground text-sm">No conversations found</p>
              ) : (
                <div className="divide-y divide-border">
                  {filtered?.map((log) => (
                    <button
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${
                        selectedLog?.id === log.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
                      }`}
                    >
                      <p className="text-sm font-medium truncate">
                        {log.first_message || "New conversation"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {log.message_count} msgs
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(log.created_at), "MMM d, h:mm a")}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Conversation Detail */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              {selectedLog ? "Conversation Detail" : "Select a conversation"}
            </CardTitle>
            {selectedLog && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteMutation.mutate(selectedLog.id)}
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {selectedLog ? (
              <>
                <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3" /> {selectedLog.page_path || "/"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {format(new Date(selectedLog.created_at), "PPpp")}
                  </span>
                </div>
                <ScrollArea className="h-[420px]">
                  <div className="space-y-3">
                    {(selectedLog.messages as ChatMessage[]).map((msg, i) => (
                      <div
                        key={i}
                        className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted border border-border"
                          }`}
                        >
                          {msg.role === "user" ? (
                            <User className="w-3.5 h-3.5" />
                          ) : (
                            <Bot className="w-3.5 h-3.5 text-primary" />
                          )}
                        </div>
                        <div
                          className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-20">
                Click on a conversation to view the full chat history
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminChatLogs;
