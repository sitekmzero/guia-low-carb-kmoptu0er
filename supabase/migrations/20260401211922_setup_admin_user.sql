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

-- Setup RLS policies for user_profiles
DROP POLICY IF EXISTS "Allow admins to read all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow users to read own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "public_read_user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "auth_read_own_profile" ON public.user_profiles;
DROP POLICY IF EXISTS "admin_all_user_profiles" ON public.user_profiles;

CREATE POLICY "public_read_user_profiles" ON public.user_profiles
  FOR SELECT TO public USING (is_admin = false);

CREATE POLICY "auth_read_own_profile" ON public.user_profiles
  FOR SELECT TO authenticated USING (id = auth.uid());

CREATE POLICY "admin_all_user_profiles" ON public.user_profiles
  FOR ALL TO authenticated USING ( public.is_admin() );

-- Seed the admin user
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'guialowcarb@gmail.com.br') THEN
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'guialowcarb@gmail.com.br',
      crypt('Luga9400@@', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Adriana Araújo"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );

    -- Insert or update user_profiles (handle_new_user trigger might have created it)
    INSERT INTO public.user_profiles (id, full_name, email, is_admin, role)
    VALUES (new_user_id, 'Adriana Araújo', 'guialowcarb@gmail.com.br', true, 'admin')
    ON CONFLICT (id) DO UPDATE
    SET is_admin = true, role = 'admin', email = 'guialowcarb@gmail.com.br', full_name = 'Adriana Araújo';
  ELSE
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'guialowcarb@gmail.com.br';
    
    UPDATE auth.users
    SET encrypted_password = crypt('Luga9400@@', gen_salt('bf'))
    WHERE id = new_user_id;

    UPDATE public.user_profiles
    SET is_admin = true, role = 'admin', email = 'guialowcarb@gmail.com.br', full_name = 'Adriana Araújo'
    WHERE id = new_user_id;
  END IF;
END $$;
