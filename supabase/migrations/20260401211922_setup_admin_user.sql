-- Add new columns to user_profiles if they don't exist
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create a security definer function to check admin status without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT COALESCE((SELECT is_admin FROM public.user_profiles WHERE id = auth.uid() LIMIT 1), false);
$$ LANGUAGE sql SECURITY DEFINER;

-- Setup RLS policies for user_profiles (LGPD compliant: no public exposure of profiles)
DROP POLICY IF EXISTS "Allow admins to read all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow users to read own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "public_read_user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "auth_read_own_profile" ON public.user_profiles;
DROP POLICY IF EXISTS "admin_all_user_profiles" ON public.user_profiles;

CREATE POLICY "auth_read_own_profile" ON public.user_profiles
  FOR SELECT TO authenticated USING (id = auth.uid());

CREATE POLICY "admin_all_user_profiles" ON public.user_profiles
  FOR ALL TO authenticated USING ( public.is_admin() );

-- Ensure admin status for standardized admin adriana.araujo@kmzero.com.br
DO $$
BEGIN
  UPDATE public.user_profiles
  SET is_admin = true, role = 'admin'
  WHERE email = 'adriana.araujo@kmzero.com.br'
     OR id IN (SELECT id FROM auth.users WHERE email = 'adriana.araujo@kmzero.com.br');
END $$;
