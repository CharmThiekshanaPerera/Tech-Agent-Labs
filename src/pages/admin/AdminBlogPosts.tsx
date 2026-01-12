import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Search, Sparkles, Bot, Eye, ImageIcon } from "lucide-react";
import { format } from "date-fns";

const BLOG_TOPICS = [
  "AI Automation in Business",
  "Custom AI Agents for Customer Support",
  "Machine Learning Trends",
  "AI-Powered Marketing Strategies",
  "Intelligent Process Automation",
  "AI in Sales and Lead Generation",
  "Data Analytics with AI",
  "AI Security and Privacy",
  "Future of Work with AI",
  "AI Integration Best Practices",
];

const CATEGORIES = [
  "AI Technology",
  "Business Automation",
  "Industry Insights",
  "Case Studies",
  "Tutorials",
  "News & Updates",
];
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string | null;
  category: string;
  image_url: string | null;
  read_time: string | null;
  published: boolean;
  created_at: string;
}

const defaultPost = {
  title: "",
  excerpt: "",
  content: "",
  category: "",
  image_url: "",
  read_time: "5 min read",
  published: false,
};

const AdminBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState(defaultPost);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiCategory, setAiCategory] = useState("");
  const [aiAutoPublish, setAiAutoPublish] = useState(true);
  const [aiGenerateImage, setAiGenerateImage] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingPost, setViewingPost] = useState<BlogPost | null>(null);

  const openViewDialog = (post: BlogPost) => {
    setViewingPost(post);
    setViewDialogOpen(true);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAiGenerate = async () => {
    setAiGenerating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-blog-post`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            topic: aiTopic === "random" ? null : aiTopic || null,
            category: aiCategory === "random" ? null : aiCategory || null,
            autoPublish: aiAutoPublish,
            generateImage: aiGenerateImage,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate blog post");
      }

      toast.success(`Blog post "${result.post.title}" generated successfully!`);
      setAiDialogOpen(false);
      setAiTopic("");
      setAiCategory("");
      setAiGenerateImage(false);
      fetchPosts();
    } catch (error: any) {
      console.error("AI generation error:", error);
      toast.error(error.message || "Failed to generate blog post");
    } finally {
      setAiGenerating(false);
    }
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const openNewPostDialog = () => {
    setEditingPost(null);
    setFormData(defaultPost);
    setDialogOpen(true);
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content || "",
      category: post.category,
      image_url: post.image_url || "",
      read_time: post.read_time || "5 min read",
      published: post.published ?? false,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.excerpt || !formData.category) {
      toast.error("Please fill in required fields");
      return;
    }

    setSaving(true);

    try {
      if (editingPost) {
        const { error } = await supabase
          .from("blog_posts")
          .update(formData)
          .eq("id", editingPost.id);

        if (error) throw error;
        toast.success("Post updated successfully");
      } else {
        const { error } = await supabase.from("blog_posts").insert(formData);

        if (error) throw error;
        toast.success("Post created successfully");
      }

      setDialogOpen(false);
      fetchPosts();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Post deleted");
      fetchPosts();
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Blog Posts" description="Manage your blog content">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setAiDialogOpen(true)} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
          <Sparkles className="w-4 h-4" />
          AI Generate
        </Button>
        <Button onClick={openNewPostDialog} variant="glow">
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </div>

      {/* Posts Table */}
      <div className="bg-card border border-border/50 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No posts found
                </TableCell>
              </TableRow>
            ) : (
              filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {post.title}
                  </TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.published
                          ? "bg-green-500/20 text-green-500"
                          : "bg-yellow-500/20 text-yellow-500"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </TableCell>
                  <TableCell>{format(new Date(post.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openViewDialog(post)}
                      title="View post"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(post)}
                      title="Edit post"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(post.id)}
                      className="text-destructive hover:text-destructive"
                      title="Delete post"
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

      {/* Edit/Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Edit Post" : "Create New Post"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter post title"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., AI Trends"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="read_time">Read Time</Label>
                <Input
                  id="read_time"
                  value={formData.read_time}
                  onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                  placeholder="e.g., 5 min read"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief summary of the post"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown)</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your post content in markdown..."
                rows={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
              <Label htmlFor="published">Published</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} variant="glow">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingPost ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Generation Dialog */}
      <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              AI Blog Generator
            </DialogTitle>
            <DialogDescription>
              Let AI create a blog post for you. Leave fields empty for random selection.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ai-topic">Topic (optional)</Label>
              <Select value={aiTopic || "random"} onValueChange={(val) => setAiTopic(val === "random" ? "" : val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Random topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Random topic</SelectItem>
                  {BLOG_TOPICS.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ai-category">Category (optional)</Label>
              <Select value={aiCategory || "random"} onValueChange={(val) => setAiCategory(val === "random" ? "" : val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Random category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Random category</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="ai-auto-publish"
                checked={aiAutoPublish}
                onCheckedChange={setAiAutoPublish}
              />
              <Label htmlFor="ai-auto-publish">Auto-publish after generation</Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="ai-generate-image"
                checked={aiGenerateImage}
                onCheckedChange={setAiGenerateImage}
              />
              <Label htmlFor="ai-generate-image" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Auto-generate featured image
              </Label>
            </div>
            
            {aiGenerateImage && (
              <p className="text-xs text-muted-foreground">
                ⚡ AI will generate a professional header image for your blog post
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAiDialogOpen(false)} disabled={aiGenerating}>
              Cancel
            </Button>
            <Button onClick={handleAiGenerate} disabled={aiGenerating} variant="glow">
              {aiGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Post
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Post Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewingPost?.title}</DialogTitle>
            <DialogDescription className="flex items-center gap-3 pt-2">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                {viewingPost?.category}
              </span>
              <span className="text-muted-foreground">{viewingPost?.read_time}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                viewingPost?.published
                  ? "bg-green-500/20 text-green-500"
                  : "bg-yellow-500/20 text-yellow-500"
              }`}>
                {viewingPost?.published ? "Published" : "Draft"}
              </span>
            </DialogDescription>
          </DialogHeader>

          {viewingPost && (
            <div className="space-y-6 py-4">
              {viewingPost.image_url && (
                <div className="rounded-lg overflow-hidden border border-border/50">
                  <img
                    src={viewingPost.image_url}
                    alt={viewingPost.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Excerpt</h3>
                <p className="text-foreground/80 italic border-l-4 border-primary/50 pl-4">
                  {viewingPost.excerpt}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Content</h3>
                <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-ul:text-foreground/90 prose-ol:text-foreground/90 prose-li:marker:text-primary prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-blockquote:border-l-primary prose-blockquote:text-foreground/80">
                  {viewingPost.content ? (
                    <ReactMarkdown
                      components={{
                        code({ node, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          const isInline = !match && !className;
                          return !isInline && match ? (
                            <SyntaxHighlighter
                              style={oneDark}
                              language={match[1]}
                              PreTag="div"
                              className="rounded-lg !bg-muted"
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {viewingPost.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-muted-foreground italic">No content available</p>
                  )}
                </div>
              </div>

              <div className="text-xs text-muted-foreground border-t border-border/50 pt-4">
                Created: {format(new Date(viewingPost.created_at), "MMMM d, yyyy 'at' h:mm a")}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button
              variant="glow"
              onClick={() => {
                setViewDialogOpen(false);
                if (viewingPost) openEditDialog(viewingPost);
              }}
            >
              <Pencil className="w-4 h-4" />
              Edit Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminBlogPosts;
