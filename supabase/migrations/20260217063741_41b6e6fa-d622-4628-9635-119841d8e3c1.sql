
-- Create site_visits table to track page visits
CREATE TABLE public.site_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL DEFAULT '/',
  referrer text,
  user_agent text,
  country text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a visit (anonymous tracking)
CREATE POLICY "Anyone can record a visit"
ON public.site_visits
FOR INSERT
WITH CHECK (true);

-- Only admins can view visits
CREATE POLICY "Admins can view site visits"
ON public.site_visits
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete visits
CREATE POLICY "Admins can delete site visits"
ON public.site_visits
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Index for fast date-range queries
CREATE INDEX idx_site_visits_created_at ON public.site_visits (created_at DESC);
CREATE INDEX idx_site_visits_page_path ON public.site_visits (page_path);
