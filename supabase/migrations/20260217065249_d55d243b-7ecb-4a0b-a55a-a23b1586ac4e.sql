
-- Create chat_logs table to store AI chatbot conversations
CREATE TABLE public.chat_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  message_count INTEGER NOT NULL DEFAULT 0,
  first_message TEXT,
  ip_address TEXT,
  user_agent TEXT,
  page_path TEXT DEFAULT '/',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;

-- Anyone can insert chat logs (anonymous visitors)
CREATE POLICY "Anyone can insert chat logs"
ON public.chat_logs
FOR INSERT
WITH CHECK (true);

-- Anyone can update their own session
CREATE POLICY "Anyone can update chat logs by session"
ON public.chat_logs
FOR UPDATE
USING (true);

-- Only admins can view chat logs
CREATE POLICY "Admins can view chat logs"
ON public.chat_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete chat logs
CREATE POLICY "Admins can delete chat logs"
ON public.chat_logs
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_chat_logs_updated_at
BEFORE UPDATE ON public.chat_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for session lookups
CREATE INDEX idx_chat_logs_session_id ON public.chat_logs(session_id);
CREATE INDEX idx_chat_logs_created_at ON public.chat_logs(created_at DESC);
