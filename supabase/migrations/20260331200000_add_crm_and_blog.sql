DO $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.leads_cursos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS public.leads_seguros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp TEXT,
    interest TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL
  );

  CREATE TABLE IF NOT EXISTS public.vendas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pago',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- Seed admin user
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'adriana.araujo@kmzero.com.br') THEN
    DECLARE
      new_user_id uuid := gen_random_uuid();
    BEGIN
      INSERT INTO auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
        is_super_admin, role, aud, confirmation_token, recovery_token, email_change_token_new, email_change, email_change_token_current, phone_change, phone_change_token, reauthentication_token
      ) VALUES (
        new_user_id, '00000000-0000-0000-0000-000000000000', 'adriana.araujo@kmzero.com.br', crypt('admin123456', gen_salt('bf')), NOW(),
        NOW(), NOW(), '{"provider": "email", "providers": ["email"]}', '{"name": "Adriana"}',
        false, 'authenticated', 'authenticated', '', '', '', '', '', NULL, '', '', ''
      );
      
      INSERT INTO public.user_profiles (id, full_name, is_admin)
      VALUES (new_user_id, 'Adriana Araújo', true)
      ON CONFLICT (id) DO UPDATE SET is_admin = true;
    END;
  ELSE
    UPDATE public.user_profiles 
    SET is_admin = true 
    WHERE id = (SELECT id FROM auth.users WHERE email = 'adriana.araujo@kmzero.com.br');
  END IF;

  -- Add bucket 'materiais'
  INSERT INTO storage.buckets (id, name, public) 
  VALUES ('materiais', 'materiais', false)
  ON CONFLICT (id) DO NOTHING;
END $$;

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads_cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads_seguros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_posts" ON public.posts;
CREATE POLICY "public_read_posts" ON public.posts FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_all_posts" ON public.posts;
CREATE POLICY "admin_all_posts" ON public.posts FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "public_insert_leads_cursos" ON public.leads_cursos;
CREATE POLICY "public_insert_leads_cursos" ON public.leads_cursos FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "admin_all_leads_cursos" ON public.leads_cursos;
CREATE POLICY "admin_all_leads_cursos" ON public.leads_cursos FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "public_insert_leads_seguros" ON public.leads_seguros;
CREATE POLICY "public_insert_leads_seguros" ON public.leads_seguros FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "admin_all_leads_seguros" ON public.leads_seguros;
CREATE POLICY "admin_all_leads_seguros" ON public.leads_seguros FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "admin_all_vendas" ON public.vendas;
CREATE POLICY "admin_all_vendas" ON public.vendas FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "public_read_settings" ON public.settings;
CREATE POLICY "public_read_settings" ON public.settings FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_all_settings" ON public.settings;
CREATE POLICY "admin_all_settings" ON public.settings FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true));
