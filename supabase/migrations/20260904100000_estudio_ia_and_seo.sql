-- Migration: Add Estudio IA support, SEO fields and storage policies for Imagens bucket
-- Timestamp: 20260904100000

-- 1. Ensure blog_posts has SEO and image metadata columns
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS focus_keyword TEXT;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS image_alt TEXT;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS image_is_ai BOOLEAN DEFAULT false;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS compliance_passed BOOLEAN DEFAULT true;

-- 2. Ensure daily image generation tracking table
CREATE TABLE IF NOT EXISTS public.ai_image_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_email TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on ai_image_generations
ALTER TABLE public.ai_image_generations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_all_ai_image_generations" ON public.ai_image_generations;
CREATE POLICY "admin_all_ai_image_generations" ON public.ai_image_generations
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.is_admin = true));

DROP POLICY IF EXISTS "service_role_ai_image_generations" ON public.ai_image_generations;
CREATE POLICY "service_role_ai_image_generations" ON public.ai_image_generations
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- 3. Storage policies for bucket 'Imagens'
DROP POLICY IF EXISTS "Public read access for Imagens bucket" ON storage.objects;
CREATE POLICY "Public read access for Imagens bucket" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'Imagens');

DROP POLICY IF EXISTS "Authenticated upload access for Imagens bucket" ON storage.objects;
CREATE POLICY "Authenticated upload access for Imagens bucket" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'Imagens');

DROP POLICY IF EXISTS "Admin full access for Imagens bucket" ON storage.objects;
CREATE POLICY "Admin full access for Imagens bucket" ON storage.objects
  FOR ALL TO authenticated
  USING (
    bucket_id = 'Imagens' AND
    EXISTS (SELECT 1 FROM public.user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.is_admin = true)
  )
  WITH CHECK (
    bucket_id = 'Imagens' AND
    EXISTS (SELECT 1 FROM public.user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.is_admin = true)
  );

-- Service role bypasses RLS anyway, but good to have explicit policy if needed
DROP POLICY IF EXISTS "Service role full access for Imagens bucket" ON storage.objects;
CREATE POLICY "Service role full access for Imagens bucket" ON storage.objects
  FOR ALL TO service_role
  USING (bucket_id = 'Imagens')
  WITH CHECK (bucket_id = 'Imagens');
