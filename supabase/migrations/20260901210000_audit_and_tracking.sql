-- Migration: Create audit_logs and channel_tracking tables, plus audit triggers
-- Date: 2026-09-01

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  user_email TEXT,
  user_id UUID,
  ip_address TEXT,
  status TEXT NOT NULL DEFAULT 'Success',
  details JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON public.audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_entity_idx ON public.audit_logs (entity_type, entity_id);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_all_audit_logs" ON public.audit_logs;
CREATE POLICY "admin_all_audit_logs" ON public.audit_logs
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid() AND (user_profiles.is_admin = true OR user_profiles.role = 'admin')
    )
  );

DROP POLICY IF EXISTS "service_role_audit_logs" ON public.audit_logs;
CREATE POLICY "service_role_audit_logs" ON public.audit_logs
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Trigger function to log purchases automatically
CREATE OR REPLACE FUNCTION public.log_purchase_audit()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.audit_logs (
    action,
    entity_type,
    entity_id,
    user_id,
    user_email,
    status,
    details
  ) VALUES (
    'Compra Realizada',
    'purchases',
    NEW.id::text,
    NEW.user_id,
    (SELECT email FROM auth.users WHERE id = NEW.user_id),
    COALESCE(NEW.status, 'completed'),
    jsonb_build_object(
      'amount', NEW.amount_paid,
      'product_id', NEW.product_id,
      'payment_method', NEW.payment_method,
      'transaction_id', NEW.transaction_id
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_audit_purchases ON public.purchases;
CREATE TRIGGER trg_audit_purchases
  AFTER INSERT ON public.purchases
  FOR EACH ROW EXECUTE FUNCTION public.log_purchase_audit();

-- Table for UTM and Channel Tracking
CREATE TABLE IF NOT EXISTS public.channel_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  page_path TEXT,
  source TEXT,
  medium TEXT,
  campaign TEXT,
  term TEXT,
  content TEXT,
  event_name TEXT NOT NULL DEFAULT 'page_view',
  conversion_value NUMERIC DEFAULT 0,
  user_email TEXT,
  user_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS channel_tracking_created_at_idx ON public.channel_tracking (created_at DESC);
CREATE INDEX IF NOT EXISTS channel_tracking_source_idx ON public.channel_tracking (source, medium, campaign);

ALTER TABLE public.channel_tracking ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_all_channel_tracking" ON public.channel_tracking;
CREATE POLICY "admin_all_channel_tracking" ON public.channel_tracking
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid() AND (user_profiles.is_admin = true OR user_profiles.role = 'admin')
    )
  );

DROP POLICY IF EXISTS "public_insert_channel_tracking" ON public.channel_tracking;
CREATE POLICY "public_insert_channel_tracking" ON public.channel_tracking
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_channel_tracking" ON public.channel_tracking;
CREATE POLICY "service_role_channel_tracking" ON public.channel_tracking
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Table for user preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  newsletter BOOLEAN NOT NULL DEFAULT true,
  marketing BOOLEAN NOT NULL DEFAULT true,
  whatsapp BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_insert_update_preferences" ON public.user_preferences;
CREATE POLICY "public_select_insert_update_preferences" ON public.user_preferences
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);
