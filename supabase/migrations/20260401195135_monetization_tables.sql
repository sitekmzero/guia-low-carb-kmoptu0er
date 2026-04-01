DO $$ 
BEGIN
    -- Enhance existing products table
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price NUMERIC(12,2);
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS product_type TEXT;
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS file_url TEXT;
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS hotmart_id TEXT;
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stripe_product_id TEXT;
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

    -- Enhance existing leads table
    ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS lead_source TEXT;
    ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS lead_status TEXT DEFAULT 'new';
    ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS notes TEXT;
    ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

    -- Enhance existing posts table
    ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'Adriana';

    -- Enhance existing vendas table
    ALTER TABLE public.vendas ADD COLUMN IF NOT EXISTS buyer_email TEXT;
END $$;

-- TABLE 2: purchases
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    amount_paid NUMERIC(12,2),
    payment_method TEXT CHECK (payment_method IN ('stripe', 'mercado_pago', 'hotmart')),
    transaction_id TEXT,
    status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    purchased_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 4: consultations
CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    consultation_type TEXT CHECK (consultation_type IN ('nutrition', 'protection', 'bundle')),
    scheduled_date TIMESTAMPTZ,
    scheduled_time TEXT,
    duration_minutes INTEGER DEFAULT 60,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    zoom_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 5: email_subscriptions
CREATE TABLE IF NOT EXISTS public.email_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    subscription_status TEXT CHECK (subscription_status IN ('active', 'unsubscribed')),
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Storage Bucket setup
INSERT INTO storage.buckets (id, name, public) 
VALUES ('materiais', 'materiais', false) 
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for Storage Bucket "materiais"
DROP POLICY IF EXISTS "Public read access for ebooks-gratuitos" ON storage.objects;
CREATE POLICY "Public read access for ebooks-gratuitos" ON storage.objects 
FOR SELECT TO public USING (bucket_id = 'materiais' AND (storage.foldername(name))[1] IN ('ebooks-gratuitos', 'blog-imagens'));

DROP POLICY IF EXISTS "Auth read access for ebooks-pagos" ON storage.objects;
CREATE POLICY "Auth read access for ebooks-pagos" ON storage.objects 
FOR SELECT TO authenticated USING (bucket_id = 'materiais' AND (storage.foldername(name))[1] IN ('ebooks-pagos', 'materiais-consulta'));

DROP POLICY IF EXISTS "Admin all access materiais" ON storage.objects;
CREATE POLICY "Admin all access materiais" ON storage.objects 
FOR ALL TO authenticated USING (
    bucket_id = 'materiais' AND EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Table RLS Settings
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_subscriptions ENABLE ROW LEVEL SECURITY;

-- Product Policies updates
DROP POLICY IF EXISTS "products_public_select" ON public.products;
CREATE POLICY "products_public_select" ON public.products FOR SELECT TO public USING (true);

-- Purchases Policies
DROP POLICY IF EXISTS "purchases_user_select" ON public.purchases;
CREATE POLICY "purchases_user_select" ON public.purchases FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "purchases_admin_all" ON public.purchases;
CREATE POLICY "purchases_admin_all" ON public.purchases FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Consultations Policies
DROP POLICY IF EXISTS "consultations_user_all" ON public.consultations;
CREATE POLICY "consultations_user_all" ON public.consultations FOR ALL TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "consultations_admin_all" ON public.consultations;
CREATE POLICY "consultations_admin_all" ON public.consultations FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Email Subscriptions Policies
DROP POLICY IF EXISTS "email_subscriptions_user_all" ON public.email_subscriptions;
CREATE POLICY "email_subscriptions_user_all" ON public.email_subscriptions FOR ALL TO authenticated USING (user_id = auth.uid() OR email = auth.email());

DROP POLICY IF EXISTS "email_subscriptions_admin_all" ON public.email_subscriptions;
CREATE POLICY "email_subscriptions_admin_all" ON public.email_subscriptions FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND is_admin = true)
);
