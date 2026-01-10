-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT,
  category TEXT NOT NULL,
  image_url TEXT,
  read_time TEXT DEFAULT '5 min read',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published posts
CREATE POLICY "Anyone can view published blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (published = true);

-- Create function to update timestamps if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample blog posts
INSERT INTO public.blog_posts (title, excerpt, category, image_url, read_time, published) VALUES
('How AI Agents Are Revolutionizing Customer Support in 2024', 'Discover how businesses are achieving 80% faster response times and higher customer satisfaction with AI-powered support agents.', 'AI Trends', 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&h=400&fit=crop', '5 min read', true),
('The Complete Guide to Automating Your Sales Pipeline', 'Learn the strategies top-performing teams use to automate lead qualification and close deals faster with AI sales agents.', 'Sales', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop', '8 min read', true),
('5 Ways AI Analytics Can Transform Your Business Decisions', 'From predictive insights to real-time reporting, explore how AI analytics agents help companies make smarter, data-driven choices.', 'Analytics', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop', '6 min read', true);