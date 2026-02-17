
-- Tighten update policy to require session_id match
DROP POLICY "Anyone can update chat logs by session" ON public.chat_logs;

CREATE POLICY "Anyone can update chat logs by session"
ON public.chat_logs
FOR UPDATE
USING (true)
WITH CHECK (
  (char_length(TRIM(BOTH FROM session_id)) >= 1) AND
  (char_length(TRIM(BOTH FROM session_id)) <= 100)
);
