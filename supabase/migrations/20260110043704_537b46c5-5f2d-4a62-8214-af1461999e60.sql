-- Allow first admin signup: Only permit insert if no admin exists yet
CREATE POLICY "Allow first admin signup"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  role = 'admin'::app_role
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'::app_role
  )
);