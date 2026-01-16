-- Create table for social media webhook configurations
CREATE TABLE IF NOT EXISTS public.social_webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  webhook_url TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.social_webhooks ENABLE ROW LEVEL SECURITY;

-- Only admins can manage webhooks
CREATE POLICY "Admins can view social webhooks" 
ON public.social_webhooks 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert social webhooks" 
ON public.social_webhooks 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update social webhooks" 
ON public.social_webhooks 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete social webhooks" 
ON public.social_webhooks 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create table for social share logs
CREATE TABLE IF NOT EXISTS public.social_share_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  results JSONB,
  shared_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.social_share_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view share logs
CREATE POLICY "Admins can view social share logs" 
ON public.social_share_logs 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Service role can insert logs (from edge functions)
CREATE POLICY "Service role can insert share logs"
ON public.social_share_logs
FOR INSERT
WITH CHECK (true);

-- Add updated_at trigger
CREATE TRIGGER update_social_webhooks_updated_at
BEFORE UPDATE ON public.social_webhooks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();