-- Harden first-admin creation so it cannot be bypassed by RLS-filtered reads

-- 1) Helper function that bypasses RLS (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.admin_exists()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE role = 'admin'::public.app_role
  )
$$;

-- Allow frontend to call the helper safely
GRANT EXECUTE ON FUNCTION public.admin_exists() TO anon, authenticated;

-- 2) Replace the existing first-admin policy with a non-bypassable version
DROP POLICY IF EXISTS "Allow first admin signup" ON public.user_roles;

CREATE POLICY "Allow first admin signup"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  role = 'admin'::public.app_role
  AND user_id = auth.uid()
  AND NOT public.admin_exists()
);
