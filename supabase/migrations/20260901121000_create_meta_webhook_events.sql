-- Migration: Create meta_webhook_events table for Meta/Facebook App webhook events
CREATE TABLE IF NOT EXISTS public.meta_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.meta_webhook_events ENABLE ROW LEVEL SECURITY;

-- Allow admin full access
DROP POLICY IF EXISTS "admin_all_meta_webhook_events" ON public.meta_webhook_events;
CREATE POLICY "admin_all_meta_webhook_events" ON public.meta_webhook_events
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Allow service_role insert/select (used by edge functions with service role)
DROP POLICY IF EXISTS "service_role_meta_webhook_events" ON public.meta_webhook_events;
CREATE POLICY "service_role_meta_webhook_events" ON public.meta_webhook_events
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
