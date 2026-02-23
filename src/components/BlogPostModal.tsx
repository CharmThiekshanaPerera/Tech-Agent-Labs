import { Calendar, Clock, Share2, Copy, Check, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import SEOHead from "@/components/seo/SEOHead";
import StructuredData, { generateArticleSchema } from "@/components/seo/StructuredData";

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
  const [copied, setCopied] = useState(false);

  if (!post) return null;

  const articleUrl = `https://techagentlabs.com/blog#${post.id}`;
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: articleUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  // Generate article schema for GEO/AEO
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.excerpt,
    imageUrl: post.image_url || "https://techagentlabs.com/og-image.png",
    authorName: "Tech Agent Labs",
    publishedDate: post.created_at,
    url: articleUrl,
  });

  return (
    <>
      {open && (
        <>
          <SEOHead
            title={`${post.title} | Tech Agent Labs Blog`}
            description={post.excerpt}
            canonicalUrl={articleUrl}
            ogType="article"
            ogImage={post.image_url || "/og-image.png"}
            publishedTime={post.created_at}
            keywords={[post.category, "AI automation", "Tech Agent Labs", "business automation"]}
          />
          <StructuredData type="BlogPosting" data={articleSchema} id={`article-${post.id}`} />
        </>
      )}
      
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[95vh] sm:max-h-[90vh] p-0 overflow-hidden bg-background border-border gap-0">
          {/* Hero Image */}
          <figure className="relative h-40 xs:h-48 sm:h-56 lg:h-64 overflow-hidden flex-shrink-0">
            <img
              src={post.image_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop"}
              alt={`Featured image for blog post: ${post.title}`}
              className="w-full h-full object-cover"
              loading="lazy"
              width={800}
              height={400}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <span className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 sm:px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full">
              {post.category}
            </span>
          </figure>

          <ScrollArea className="flex-1 max-h-[calc(95vh-10rem)] sm:max-h-[calc(90vh-14rem)]">
            <article className="p-4 sm:p-6 lg:p-8" itemScope itemType="https://schema.org/BlogPosting">
              <DialogHeader className="text-left mb-4 sm:mb-6">
                <DialogTitle 
                  className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight"
                  itemProp="headline"
                >
                  {post.title}
                </DialogTitle>
              </DialogHeader>

              {/* Meta & Share */}
              <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-border/50">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span itemProp="author">Tech Agent Labs</span>
                  </div>
                  <time dateTime={post.created_at} className="flex items-center gap-1.5" itemProp="datePublished">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {format(new Date(post.created_at), "MMMM d, yyyy")}
                  </time>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {post.read_time || "5 min read"}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {typeof navigator !== "undefined" && navigator.share && (
                    <Button variant="ghost" size="sm" onClick={handleShare} className="h-8 px-2 sm:px-3">
                      <Share2 className="w-4 h-4" />
                      <span className="hidden sm:inline ml-1.5">Share</span>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleCopyLink} className="h-8 px-2 sm:px-3">
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    <span className="hidden sm:inline ml-1.5">{copied ? "Copied" : "Copy Link"}</span>
                  </Button>
                </div>
              </div>

              {/* Excerpt */}
              <p 
                className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 italic border-l-4 border-primary/50 pl-4"
                itemProp="description"
              >
                {post.excerpt}
              </p>

              {/* Content */}
              <div 
                className="prose prose-invert prose-sm sm:prose-base max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-ul:text-foreground/90 prose-ol:text-foreground/90 prose-li:marker:text-primary prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-blockquote:border-l-primary prose-blockquote:text-foreground/80"
                itemProp="articleBody"
              >
                {post.content ? (
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
                            className="rounded-lg !bg-muted text-sm"
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
                    {post.content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground italic">
                    Full content coming soon...
                  </p>
                )}
              </div>

              {/* Tags / Related Topics for GEO */}
              <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-border/50">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Related Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {[post.category, "AI Automation", "Business Growth", "Tech Insights"].map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2.5 py-1 bg-secondary/50 text-foreground/80 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlogPostModal;