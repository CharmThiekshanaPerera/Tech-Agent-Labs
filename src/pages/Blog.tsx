import { useState, useEffect, useMemo } from "react";
import { Calendar, Clock, ArrowRight, Loader2, Filter, Home, Search, X, Tag, TrendingUp, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/seo/SEOHead";
import StructuredData, { generateBreadcrumbSchema } from "@/components/seo/StructuredData";
import NewsletterSubscription from "@/components/NewsletterSubscription";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

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

const POSTS_PER_PAGE = 9;

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, excerpt, content, category, image_url, read_time, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPosts(data);
        setFilteredPosts(data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(post => post.category))];
        setCategories(uniqueCategories);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  // Filter posts by category and search query
  useEffect(() => {
    let result = posts;

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter(post => post.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        (post.content && post.content.toLowerCase().includes(query))
      );
    }

    setFilteredPosts(result);
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, posts]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  // Featured post (first post)
  const featuredPost = useMemo(() => posts[0], [posts]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  // Generate pagination numbers with ellipsis
  const getPaginationItems = () => {
    const items: (number | "ellipsis")[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      items.push(1);
      if (currentPage > 3) items.push("ellipsis");
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) items.push(i);
      
      if (currentPage < totalPages - 2) items.push("ellipsis");
      items.push(totalPages);
    }
    return items;
  };

  // Breadcrumb schema for SEO
  const breadcrumbData = generateBreadcrumbSchema([
    { name: "Home", url: "https://techagentlabs.com/" },
    { name: "Blog", url: "https://techagentlabs.com/blog" },
  ]);

  // Blog listing structured data for GEO/AEO
  const blogListingSchema = {
    "@type": "CollectionPage",
    name: "Tech Agent Labs Blog",
    description: "Expert insights on AI automation, business intelligence, and digital transformation strategies.",
    url: "https://techagentlabs.com/blog",
    isPartOf: {
      "@type": "WebSite",
      name: "Tech Agent Labs",
      url: "https://techagentlabs.com"
    },
    about: {
      "@type": "Thing",
      name: "Artificial Intelligence and Business Automation"
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.slice(0, 10).map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://techagentlabs.com/blog#${post.id}`,
        name: post.title
      }))
    }
  };

  return (
    <>
      <SEOHead
        title="AI & Automation Blog | Expert Insights - Tech Agent Labs"
        description="Discover actionable AI automation strategies, industry insights, and expert tips to transform your business. Learn how AI agents can boost productivity and growth."
        canonicalUrl="https://techagentlabs.com/blog"
        ogType="website"
        keywords={[
          "AI automation blog",
          "business automation tips",
          "artificial intelligence insights",
          "AI agents tutorials",
          "workflow automation guides",
          "machine learning for business",
          "AI implementation strategies",
          "digital transformation blog",
          "enterprise AI solutions",
          "AI chatbot development"
        ]}
      />
      <StructuredData type="BreadcrumbList" data={breadcrumbData} />
      <StructuredData type="WebSite" data={blogListingSchema} id="blog-listing" />
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-20 sm:pt-24 pb-12 sm:pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
              <Breadcrumb>
                <BreadcrumbList className="text-xs sm:text-sm">
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/" className="flex items-center gap-1 sm:gap-1.5 hover:text-primary transition-colors">
                        <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">Home</span>
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-primary">Blog</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </nav>

            {/* Header Section - AEO Optimized */}
            <header className="text-center mb-8 sm:mb-12 lg:mb-16">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs sm:text-sm font-medium mb-4">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                Knowledge Hub
              </div>
              <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
                AI & Automation <span className="text-primary text-glow">Insights</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed px-2">
                Expert strategies, tutorials, and industry analysis to help you leverage AI automation 
                for business growth. Updated weekly with actionable insights.
              </p>
              
              {/* Quick Stats for AEO */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span><strong className="text-foreground">{posts.length}+</strong> Articles</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                  <Tag className="w-4 h-4 text-primary" />
                  <span><strong className="text-foreground">{categories.length}</strong> Categories</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Updated <strong className="text-foreground">Weekly</strong></span>
                </div>
              </div>
            </header>

            {/* Featured Post - Large Hero Card */}
            {!loading && featuredPost && selectedCategory === "All" && !searchQuery && (
              <section aria-label="Featured article" className="mb-10 sm:mb-12 lg:mb-16">
                <Link to={`/blog/${featuredPost.id}`}>
                  <article 
                    className="group relative bg-gradient-to-br from-secondary/50 to-secondary/20 border border-border/50 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-primary/30 transition-all duration-500"
                    itemScope
                    itemType="https://schema.org/BlogPosting"
                  >
                    <div className="grid lg:grid-cols-2 gap-0">
                      {/* Image */}
                      <figure className="relative h-48 xs:h-56 sm:h-64 lg:h-80 xl:h-96 overflow-hidden">
                        <img
                          src={featuredPost.image_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop"}
                          alt={`Featured image for blog post: ${featuredPost.title}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="eager"
                          itemProp="image"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-background" />
                        <span className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 sm:px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wide">
                          Featured
                        </span>
                      </figure>

                      {/* Content */}
                      <div className="relative p-5 sm:p-6 lg:p-8 xl:p-10 flex flex-col justify-center">
                        <span className="inline-block px-2.5 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full mb-3 sm:mb-4 w-fit">
                          {featuredPost.category}
                        </span>
                        
                        <h2 
                          className="text-lg xs:text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground mb-2 sm:mb-3 line-clamp-3 group-hover:text-primary transition-colors leading-tight"
                          itemProp="headline"
                        >
                          {featuredPost.title}
                        </h2>
                        
                        <p 
                          className="text-muted-foreground text-sm sm:text-base lg:text-lg line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-6"
                          itemProp="description"
                        >
                          {featuredPost.excerpt}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                          <time dateTime={featuredPost.created_at} className="flex items-center gap-1.5" itemProp="datePublished">
                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            {format(new Date(featuredPost.created_at), "MMMM d, yyyy")}
                          </time>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            {featuredPost.read_time || "5 min read"}
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-2 w-fit px-4 sm:px-5 py-2 sm:py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm sm:text-base group-hover:bg-primary/90 transition-colors">
                          Read Article
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              </section>
            )}

            {/* Search and Filter Section */}
            <div className="flex flex-col gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
              {/* Search Bar */}
              <div className="w-full max-w-xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search articles by title, topic, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 sm:pl-11 pr-9 sm:pr-11 py-2.5 sm:py-3 bg-secondary/50 border-border/50 focus:border-primary/50 text-sm sm:text-base rounded-xl"
                    aria-label="Search blog posts"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filters */}
              <nav className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2" aria-label="Blog categories">
                <div className="flex items-center gap-1.5 text-muted-foreground mr-1 sm:mr-2">
                  <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium hidden xs:inline">Filter:</span>
                </div>
                <Button
                  variant={selectedCategory === "All" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("All")}
                  className="rounded-full text-xs sm:text-sm h-7 sm:h-8 px-2.5 sm:px-3"
                  aria-pressed={selectedCategory === "All"}
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="rounded-full text-xs sm:text-sm h-7 sm:h-8 px-2.5 sm:px-3"
                    aria-pressed={selectedCategory === category}
                  >
                    {category}
                  </Button>
                ))}
              </nav>
            </div>

            {/* Search Results Count */}
            {searchQuery && (
              <div className="text-center mb-6 sm:mb-8" role="status" aria-live="polite">
                <p className="text-muted-foreground text-sm sm:text-base">
                  Found <span className="text-primary font-semibold">{filteredPosts.length}</span> {filteredPosts.length === 1 ? 'article' : 'articles'} matching "<span className="text-foreground">{searchQuery}</span>"
                </p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-16 sm:py-20" role="status" aria-label="Loading blog posts">
                <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground text-sm sm:text-base">Loading articles...</p>
              </div>
            )}

            {/* Blog Grid - Responsive */}
            {!loading && paginatedPosts.length > 0 && (
              <section 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-12" 
                aria-label="Blog posts"
              >
                {paginatedPosts.map((post, index) => (
                  <Link key={post.id} to={`/blog/${post.id}`}>
                    <article
                      className="group bg-secondary/30 border border-border/50 rounded-xl sm:rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,255,102,0.1)] flex flex-col h-full"
                      itemScope
                      itemType="https://schema.org/BlogPosting"
                    >
                      {/* Image */}
                      <figure className="relative h-40 xs:h-44 sm:h-48 overflow-hidden">
                        <img
                          src={post.image_url || `https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop&q=80`}
                          alt={`Featured image for blog post: ${post.title}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading={index < 3 ? "eager" : "lazy"}
                          itemProp="image"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        <span className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2 sm:px-3 py-0.5 sm:py-1 bg-primary/90 text-primary-foreground text-[10px] sm:text-xs font-medium rounded-full">
                          {post.category}
                        </span>
                      </figure>

                      {/* Content */}
                      <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-1">
                        {/* Meta */}
                        <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground mb-2 sm:mb-3">
                          <time 
                            dateTime={post.created_at} 
                            className="flex items-center gap-1 sm:gap-1.5"
                            itemProp="datePublished"
                          >
                            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            {format(new Date(post.created_at), "MMM d, yyyy")}
                          </time>
                          <span className="flex items-center gap-1 sm:gap-1.5">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            {post.read_time || "5 min"}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 
                          className="text-base sm:text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug"
                          itemProp="headline"
                        >
                          {post.title}
                        </h2>

                        {/* Excerpt */}
                        <p 
                          className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4 flex-1"
                          itemProp="description"
                        >
                          {post.excerpt}
                        </p>

                        {/* Read More Link */}
                        <span className="inline-flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-primary font-medium group-hover:gap-2 sm:group-hover:gap-2.5 transition-all mt-auto">
                          Read Article
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </span>

                        {/* Hidden structured data */}
                        <meta itemProp="author" content="Tech Agent Labs" />
                      </div>
                    </article>
                  </Link>
                ))}
              </section>
            )}

            {/* Empty State */}
            {!loading && filteredPosts.length === 0 && (
              <div className="text-center py-12 sm:py-16 lg:py-20">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-secondary/50 flex items-center justify-center">
                  <Search className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">No articles found</h3>
                <p className="text-muted-foreground mb-6 text-sm sm:text-base max-w-md mx-auto">
                  {searchQuery 
                    ? `We couldn't find any articles matching "${searchQuery}".`
                    : "No blog posts found for this category."
                  }
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {searchQuery && (
                    <Button variant="outline" onClick={clearSearch} size="sm" className="text-sm">
                      Clear Search
                    </Button>
                  )}
                  {selectedCategory !== "All" && (
                    <Button variant="outline" onClick={() => setSelectedCategory("All")} size="sm" className="text-sm">
                      View All Posts
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Pagination - Responsive */}
            {totalPages > 1 && (
              <nav aria-label="Blog pagination" className="mt-8 sm:mt-10">
                <Pagination>
                  <PaginationContent className="gap-1 sm:gap-2">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3`}
                        aria-disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    
                    {getPaginationItems().map((item, index) => (
                      <PaginationItem key={index}>
                        {item === "ellipsis" ? (
                          <PaginationEllipsis className="h-8 sm:h-9 w-8 sm:w-9" />
                        ) : (
                          <PaginationLink
                            onClick={() => setCurrentPage(item)}
                            isActive={currentPage === item}
                            className="cursor-pointer h-8 sm:h-9 w-8 sm:w-9 text-xs sm:text-sm"
                            aria-current={currentPage === item ? "page" : undefined}
                          >
                            {item}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3`}
                        aria-disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                
                {/* Page indicator for mobile */}
                <p className="text-center text-xs text-muted-foreground mt-3 sm:hidden">
                  Page {currentPage} of {totalPages}
                </p>
              </nav>
            )}

            {/* Newsletter Subscription */}
            <section className="mt-16 sm:mt-20 lg:mt-24">
              <NewsletterSubscription variant="blog" />
            </section>

            {/* AEO/GEO - FAQ Section for Answer Engines */}
            <section className="mt-16 sm:mt-20 lg:mt-24 border-t border-border/50 pt-12 sm:pt-16" aria-labelledby="blog-faq-heading">
              <h2 id="blog-faq-heading" className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-8 sm:mb-10">
                Frequently Asked <span className="text-primary">Questions</span>
              </h2>
              
              <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
                <details className="group bg-secondary/30 border border-border/50 rounded-xl p-4 sm:p-5">
                  <summary className="font-semibold cursor-pointer text-sm sm:text-base list-none flex items-center justify-between">
                    What topics does Tech Agent Labs blog cover?
                    <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-3 text-muted-foreground text-sm sm:text-base leading-relaxed">
                    Our blog covers AI automation, machine learning trends, business workflow optimization, 
                    custom AI agent development, customer support automation, sales AI tools, and enterprise 
                    AI integration strategies. We publish weekly articles with actionable insights for businesses.
                  </p>
                </details>
                
                <details className="group bg-secondary/30 border border-border/50 rounded-xl p-4 sm:p-5">
                  <summary className="font-semibold cursor-pointer text-sm sm:text-base list-none flex items-center justify-between">
                    How often is the blog updated?
                    <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-3 text-muted-foreground text-sm sm:text-base leading-relaxed">
                    We publish new AI and automation articles weekly. Our content team, powered by advanced 
                    AI tools, ensures fresh, relevant insights on the latest industry trends and practical 
                    implementation guides for businesses of all sizes.
                  </p>
                </details>
                
                <details className="group bg-secondary/30 border border-border/50 rounded-xl p-4 sm:p-5">
                  <summary className="font-semibold cursor-pointer text-sm sm:text-base list-none flex items-center justify-between">
                    Can I implement the strategies from your blog articles?
                    <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-3 text-muted-foreground text-sm sm:text-base leading-relaxed">
                    Absolutely! Our blog articles are designed to be actionable. Each post includes practical 
                    steps, code examples where relevant, and real-world case studies. For complex implementations, 
                    you can also contact our team for custom AI agent development services.
                  </p>
                </details>
              </div>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Blog;