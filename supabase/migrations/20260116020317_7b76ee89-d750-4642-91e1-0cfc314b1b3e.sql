-- Enable pg_cron extension for scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant usage to postgres user
GRANT USAGE ON SCHEMA cron TO postgres;

-- Create a table to track scheduled blog post runs
CREATE TABLE IF NOT EXISTS public.scheduled_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_name TEXT NOT NULL UNIQUE,
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scheduled_tasks ENABLE ROW LEVEL SECURITY;

-- Only admins can view scheduled tasks
CREATE POLICY "Admins can view scheduled tasks" 
ON public.scheduled_tasks 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can manage scheduled tasks
CREATE POLICY "Admins can manage scheduled tasks" 
ON public.scheduled_tasks 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert the blog post scheduler task
INSERT INTO public.scheduled_tasks (task_name, status, next_run_at)
VALUES ('daily-blog-post', 'active', now() + interval '1 day')
ON CONFLICT (task_name) DO NOTHING;

-- Schedule the daily blog post job to run at 9 AM UTC every day
SELECT cron.schedule(
  'daily-blog-post-generator',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/scheduled-blog-post',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.supabase_anon_key')
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);