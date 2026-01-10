-- Tighten public INSERT policies so they are not "WITH CHECK (true)" while still allowing public submissions

-- contact_messages: Anyone can submit contact message (with basic validation)
DROP POLICY IF EXISTS "Anyone can submit contact message" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact message"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(trim(name)) BETWEEN 1 AND 100
  AND char_length(trim(email)) BETWEEN 3 AND 255
  AND position('@' in email) > 1
  AND char_length(trim(message)) BETWEEN 1 AND 5000
  AND (subject IS NULL OR char_length(trim(subject)) <= 200)
);

-- demo_bookings: Anyone can submit demo booking (with basic validation)
DROP POLICY IF EXISTS "Anyone can submit demo booking" ON public.demo_bookings;
CREATE POLICY "Anyone can submit demo booking"
ON public.demo_bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(trim(name)) BETWEEN 1 AND 100
  AND char_length(trim(email)) BETWEEN 3 AND 255
  AND position('@' in email) > 1
  AND (company IS NULL OR char_length(trim(company)) <= 200)
  AND (phone IS NULL OR char_length(trim(phone)) <= 50)
  AND (message IS NULL OR char_length(trim(message)) <= 5000)
  AND (preferred_time IS NULL OR char_length(trim(preferred_time)) <= 50)
);
