import { Calendar, Clock, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string | null;
  category: string;
  image_url: string | null;
  read_time: string | null;
  created_at: string;
}

interface BlogPostModalProps {
  post: BlogPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BlogPostModal = ({ post, open, onOpenChange }: BlogPostModalProps) => {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden bg-background border-border">
        {/* Hero Image */}
        <div className="relative h-48 sm:h-64 overflow-hidden">
          <img
            src={post.image_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop"}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <span className="absolute top-4 left-4 px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full">
            {post.category}
          </span>
        </div>

        <ScrollArea className="max-h-[calc(90vh-16rem)]">
          <div className="p-6 sm:p-8">
            <DialogHeader className="text-left mb-4">
              <DialogTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                {post.title}
              </DialogTitle>
            </DialogHeader>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {format(new Date(post.created_at), "MMMM d, yyyy")}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.read_time || "5 min read"}
              </span>
            </div>

            {/* Content */}
            <div className="prose prose-invert prose-sm sm:prose-base max-w-none">
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-4">
                {post.excerpt}
              </p>
              {post.content ? (
                <div 
                  className="text-foreground/90 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <p className="text-muted-foreground italic">
                  Full content coming soon...
                </p>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostModal;
