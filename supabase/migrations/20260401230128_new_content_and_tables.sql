DO $$
BEGIN
  -- Create tables for new functionalities
  CREATE TABLE IF NOT EXISTS public.user_courses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      course_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
      enrolled_at TIMESTAMPTZ DEFAULT NOW(),
      access_until TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS public.blog_posts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT,
      content TEXT,
      category TEXT,
      tags TEXT[],
      author TEXT,
      featured_image_url TEXT,
      published BOOLEAN DEFAULT false,
      views INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS public.ebooks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT,
      file_url TEXT,
      category TEXT,
      is_free BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Insert mock data for E-books Pagos
  INSERT INTO public.products (id, name, description, price, estimated_price, category, product_type, status, is_active)
  VALUES 
    (gen_random_uuid(), 'Nutrição Clínica para Diabetes', 'Guia completo sobre nutrição para controle de diabetes tipo 2', 67.00, 67.00, 'nutrition', 'ebook-paid', 'ativo', true),
    (gen_random_uuid(), 'Nutrição Esportiva Low-Carb', 'Otimize seu desempenho atlético com nutrição low-carb', 57.00, 57.00, 'nutrition', 'ebook-paid', 'ativo', true),
    (gen_random_uuid(), 'Plano Nutricional Personalizado', 'Planilha interativa para criar seu plano nutricional', 47.00, 47.00, 'nutrition', 'ebook-paid', 'ativo', true)
  ON CONFLICT DO NOTHING;

  -- Insert mock data for Cursos
  INSERT INTO public.products (id, name, description, price, estimated_price, category, product_type, status, is_active)
  VALUES 
    (gen_random_uuid(), 'Nutrição Low-Carb Completo', 'Curso completo com 6 módulos sobre nutrição low-carb, incluindo vídeos, materiais e suporte', 297.00, 297.00, 'nutrition', 'course', 'ativo', true),
    (gen_random_uuid(), 'Emagrecimento Sustentável', 'Programa de 4 módulos focado em emagrecimento saudável e sustentável com nutrição', 247.00, 247.00, 'nutrition', 'course', 'ativo', true)
  ON CONFLICT DO NOTHING;

  -- Enable RLS and setup policies
  ALTER TABLE public.user_courses ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;

  DROP POLICY IF EXISTS "user_courses_select" ON public.user_courses;
  CREATE POLICY "user_courses_select" ON public.user_courses 
    FOR SELECT TO authenticated USING (user_id = auth.uid());
  
  DROP POLICY IF EXISTS "user_courses_admin" ON public.user_courses;
  CREATE POLICY "user_courses_admin" ON public.user_courses 
    FOR ALL TO authenticated USING (
      EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND is_admin = true)
    );

  DROP POLICY IF EXISTS "blog_posts_public" ON public.blog_posts;
  CREATE POLICY "blog_posts_public" ON public.blog_posts 
    FOR SELECT TO public USING (published = true);

  DROP POLICY IF EXISTS "blog_posts_admin" ON public.blog_posts;
  CREATE POLICY "blog_posts_admin" ON public.blog_posts 
    FOR ALL TO authenticated USING (
      EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND is_admin = true)
    );

  DROP POLICY IF EXISTS "ebooks_public" ON public.ebooks;
  CREATE POLICY "ebooks_public" ON public.ebooks 
    FOR SELECT TO public USING (true);

  DROP POLICY IF EXISTS "ebooks_admin" ON public.ebooks;
  CREATE POLICY "ebooks_admin" ON public.ebooks 
    FOR ALL TO authenticated USING (
      EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND is_admin = true)
    );
END $$;
