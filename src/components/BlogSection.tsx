import { useState, useEffect, useRef } from "react";
import { Calendar, Clock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import BlogPostModal from "./BlogPostModal";
import Autoplay from "embla-carousel-autoplay";

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

const BlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, excerpt, content, category, image_url, read_time, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const handleReadMore = (post: BlogPost) => {
    setSelectedPost(post);
    setModalOpen(true);
  };

  return (
    <section id="blog" className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs sm:text-sm font-medium mb-4">
            Latest Insights
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            From Our <span className="text-primary text-glow">Blog</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            Stay updated with the latest trends in AI automation, industry insights, and tips to grow your business.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Blog Carousel */}
        {!loading && posts.length > 0 && (
          <div className="relative px-12 lg:px-16">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[autoplayPlugin.current]}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {posts.map((post) => (
                  <CarouselItem key={post.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                    <article className="group bg-secondary/30 border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,255,102,0.1)] h-full">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.image_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop"}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        <span className="absolute top-4 left-4 px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full">
                          {post.category}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5 sm:p-6 flex flex-col h-[calc(100%-12rem)]">
                        {/* Meta */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {format(new Date(post.created_at), "MMM d, yyyy")}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {post.read_time || "5 min read"}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow">
                          {post.excerpt}
                        </p>

                        {/* Read More Link */}
                        <button
                          onClick={() => handleReadMore(post)}
                          className="inline-flex items-center gap-1.5 text-sm text-primary font-medium group-hover:gap-2.5 transition-all mt-auto"
                        >
                          Read More
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </article>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="flex -left-2 lg:-left-4 h-10 w-10 bg-secondary/80 border-border hover:bg-primary hover:text-primary-foreground" />
              <CarouselNext className="flex -right-2 lg:-right-4 h-10 w-10 bg-secondary/80 border-border hover:bg-primary hover:text-primary-foreground" />
            </Carousel>
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No blog posts available yet.</p>
          </div>
        )}

        {/* View All Button */}
        {posts.length > 0 && (
          <div className="text-center mt-10 sm:mt-12">
            <Button variant="outline" size="lg" className="group">
              View All Articles
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </div>

      {/* Blog Post Modal */}
      <BlogPostModal
        post={selectedPost}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </section>
  );
};

export default BlogSection;
