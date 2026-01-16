import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, User, Home, ArrowLeft, Share2, Twitter, Linkedin, Facebook, Link2, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/seo/SEOHead";
import StructuredData, { generateArticleSchema, generateBreadcrumbSchema } from "@/components/seo/StructuredData";
import NewsletterSubscription from "@/components/NewsletterSubscription";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import ReadingProgress from "@/components/blog/ReadingProgress";
import TableOfContents from "@/components/blog/TableOfContents";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      setLoading(true);
      
      // Fetch post by ID (slug is the post ID)
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", slug)
        .eq("published", true)
        .single();

      if (error || !data) {
        navigate("/blog", { replace: true });
        return;
      }

      setPost(data);

      // Fetch related posts from same category
      const { data: related } = await supabase
        .from("blog_posts")
        .select("id, title, excerpt, content, category, image_url, read_time, created_at")
        .eq("published", true)
        .eq("category", data.category)
        .neq("id", data.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (related) {
        setRelatedPosts(related);
      }

      setLoading(false);
    };

    fetchPost();
  }, [slug, navigate]);

  const articleUrl = `https://techagentlabs.com/blog/${post?.id}`;

  const handleShare = async (platform: string) => {
    if (!post) return;

    const shareText = `${post.title} - ${post.excerpt}`;
    const shareUrl = articleUrl;

    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    };

    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Failed to copy link");
      }
      return;
    }

    if (platform === "native" && navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
      return;
    }

    window.open(urls[platform], "_blank", "noopener,noreferrer,width=600,height=400");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  // Structured data
  const breadcrumbData = generateBreadcrumbSchema([
    { name: "Home", url: "https://techagentlabs.com/" },
    { name: "Blog", url: "https://techagentlabs.com/blog" },
    { name: post.title, url: articleUrl },
  ]);

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
      <SEOHead
        title={`${post.title} | Tech Agent Labs Blog`}
        description={post.excerpt}
        canonicalUrl={articleUrl}
        ogType="article"
        ogImage={post.image_url || "/og-image.png"}
        publishedTime={post.created_at}
        keywords={[post.category, "AI automation", "business automation", "Tech Agent Labs", "AI agents"]}
      />
      <StructuredData type="BreadcrumbList" data={breadcrumbData} />
      <StructuredData type="BlogPosting" data={articleSchema} id={`article-${post.id}`} />

      <div className="min-h-screen bg-background">
        <ReadingProgress targetRef={articleRef} />
        <Navbar />

        <main className="pt-20 sm:pt-24">
          {/* Hero Image */}
          <div className="relative h-48 xs:h-56 sm:h-72 md:h-80 lg:h-96 overflow-hidden">
            <img
              src={post.image_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200&h=600&fit=crop"}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 relative z-10">
            <div className="flex gap-8">
              {/* Main Content */}
              <article ref={articleRef} className="flex-1 max-w-4xl">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
                <Breadcrumb>
                  <BreadcrumbList className="text-xs sm:text-sm">
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to="/" className="flex items-center gap-1 hover:text-primary transition-colors">
                          <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden xs:inline">Home</span>
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-primary truncate max-w-[150px] sm:max-w-[250px]">
                        {post.title}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </nav>

              {/* Back Link */}
              <Link 
                to="/blog" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4 sm:mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to all articles
              </Link>

              {/* Article Header Card */}
              <header className="bg-secondary/50 backdrop-blur-sm border border-border/50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 mb-8 sm:mb-10">
                {/* Category */}
                <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs sm:text-sm font-medium rounded-full mb-4">
                  {post.category}
                </span>

                {/* Title */}
                <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground leading-tight mb-4 sm:mb-6">
                  {post.title}
                </h1>

                {/* Excerpt */}
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8">
                  {post.excerpt}
                </p>

                {/* Meta & Share */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-border/50">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Tech Agent Labs</span>
                    </div>
                    <time dateTime={post.created_at} className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {format(new Date(post.created_at), "MMMM d, yyyy")}
                    </time>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {post.read_time || "5 min read"}
                    </span>
                  </div>

                  {/* Share Buttons */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-xs text-muted-foreground mr-1 sm:mr-2 hidden sm:inline">Share:</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-9 sm:w-9"
                      onClick={() => handleShare("twitter")}
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-9 sm:w-9"
                      onClick={() => handleShare("linkedin")}
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-9 sm:w-9"
                      onClick={() => handleShare("facebook")}
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-9 sm:w-9"
                      onClick={() => handleShare("copy")}
                      aria-label="Copy link"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
                    </Button>
                    {typeof navigator !== "undefined" && navigator.share && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 sm:h-9 sm:w-9 sm:hidden"
                        onClick={() => handleShare("native")}
                        aria-label="Share"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </header>

              {/* Article Content */}
              <div className="prose prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none mb-12 sm:mb-16 prose-headings:text-foreground prose-headings:font-bold prose-p:text-foreground/90 prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-ul:text-foreground/90 prose-ol:text-foreground/90 prose-li:marker:text-primary prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-muted prose-blockquote:border-l-primary prose-blockquote:text-foreground/80 prose-blockquote:italic prose-img:rounded-xl">
                {post.content ? (
                  <ReactMarkdown
                    components={{
                      h2({ node, children, ...props }) {
                        const text = String(children);
                        const id = text
                          .toLowerCase()
                          .replace(/[^a-z0-9\s-]/g, "")
                          .replace(/\s+/g, "-")
                          .replace(/-+/g, "-");
                        return <h2 id={id} {...props}>{children}</h2>;
                      },
                      h3({ node, children, ...props }) {
                        const text = String(children);
                        const id = text
                          .toLowerCase()
                          .replace(/[^a-z0-9\s-]/g, "")
                          .replace(/\s+/g, "-")
                          .replace(/-+/g, "-");
                        return <h3 id={id} {...props}>{children}</h3>;
                      },
                      code({ node, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const isInline = !match && !className;
                        return !isInline && match ? (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-xl !bg-muted text-sm"
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
                  <p className="text-muted-foreground italic">Full content coming soon...</p>
                )}
              </div>

              {/* CTA Section with Backlinks */}
              <section className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 mb-12 sm:mb-16 text-center">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3 sm:mb-4">
                  Ready to Transform Your Business with AI?
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto mb-6">
                  <Link to="/" className="text-primary hover:underline">Tech Agent Labs</Link> offers production-ready AI agents and custom automation solutions. 
                  Explore our <Link to="/#services" className="text-primary hover:underline">AI services</Link>, 
                  view <Link to="/#pricing" className="text-primary hover:underline">pricing plans</Link>, 
                  or <Link to="/#contact" className="text-primary hover:underline">contact us</Link> for a personalized demo.
                </p>
                <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                  <Button asChild variant="glow" className="text-sm sm:text-base">
                    <Link to="/#contact">Book a Demo</Link>
                  </Button>
                  <Button asChild variant="outline" className="text-sm sm:text-base">
                    <Link to="/#services">Explore Services</Link>
                  </Button>
                </div>
              </section>

              {/* Author / About Section with Backlink */}
              <section className="bg-secondary/30 border border-border/50 rounded-2xl p-5 sm:p-6 lg:p-8 mb-12 sm:mb-16">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-base sm:text-lg mb-1">Tech Agent Labs</h3>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      We're a team of AI specialists building production-ready automation solutions for businesses worldwide. 
                      Visit <Link to="/" className="text-primary hover:underline">techagentlabs.com</Link> to learn more about 
                      our <Link to="/#features" className="text-primary hover:underline">AI capabilities</Link> and 
                      <Link to="/#testimonials" className="text-primary hover:underline"> client success stories</Link>.
                    </p>
                  </div>
                </div>
              </section>

              {/* Newsletter Subscription */}
              <section className="mb-12 sm:mb-16">
                <NewsletterSubscription variant="blog" />
              </section>

              {/* Share Section */}
              <section className="text-center py-6 sm:py-8 border-t border-b border-border/50 mb-12 sm:mb-16">
                <p className="text-muted-foreground text-sm sm:text-base mb-4">
                  Found this article helpful? Share it with your network!
                </p>
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleShare("twitter")}
                  >
                    <Twitter className="w-4 h-4" />
                    <span className="hidden xs:inline">Twitter</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleShare("linkedin")}
                  >
                    <Linkedin className="w-4 h-4" />
                    <span className="hidden xs:inline">LinkedIn</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleShare("facebook")}
                  >
                    <Facebook className="w-4 h-4" />
                    <span className="hidden xs:inline">Facebook</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleShare("copy")}
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
                    <span className="hidden xs:inline">{copied ? "Copied!" : "Copy Link"}</span>
                  </Button>
                </div>
              </section>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <section className="mb-12 sm:mb-16" aria-labelledby="related-posts-heading">
                  <h2 id="related-posts-heading" className="text-xl sm:text-2xl font-bold text-foreground mb-6 sm:mb-8">
                    Related Articles
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        to={`/blog/${relatedPost.id}`}
                        className="group bg-secondary/30 border border-border/50 rounded-xl overflow-hidden hover:border-primary/30 transition-all"
                      >
                        <div className="h-32 sm:h-36 overflow-hidden">
                          <img
                            src={relatedPost.image_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=200&fit=crop"}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-4">
                          <span className="text-xs text-primary font-medium">{relatedPost.category}</span>
                          <h3 className="text-sm sm:text-base font-semibold text-foreground mt-1 line-clamp-2 group-hover:text-primary transition-colors">
                            {relatedPost.title}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Back to Blog Link */}
              {/* Back to Blog Link */}
              <div className="text-center pb-12 sm:pb-16">
                <Link 
                  to="/blog"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  View all articles
                </Link>
              </div>
              </article>

              {/* Table of Contents - Desktop Sidebar */}
              <div className="hidden lg:block">
                <TableOfContents content={post.content} />
              </div>
            </div>
          </div>

          {/* Mobile Table of Contents */}
          <div className="lg:hidden">
            <TableOfContents content={post.content} />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BlogPostPage;