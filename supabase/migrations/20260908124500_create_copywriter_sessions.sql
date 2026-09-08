-- Migration: Create copywriter_sessions and copywriter_messages tables for Copywriter Blog IA
-- Idempotent creation with RLS policies for admin and service_role

CREATE TABLE IF NOT EXISTS public.copywriter_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL DEFAULT 'Nova Conversa',
  publico TEXT CHECK (publico IN ('B2C', 'B2B', 'a_definir')),
  tema TEXT,
  objetivo TEXT,
  restricoes TEXT,
  referencias_arquivos JSONB DEFAULT '[]'::jsonb,
  pautas_propostas JSONB DEFAULT '[]'::jsonb,
  pauta_selecionada JSONB DEFAULT '{}'::jsonb,
  seo_config JSONB DEFAULT '{}'::jsonb,
  checklist JSONB DEFAULT '{}'::jsonb,
  artigo_gerado TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.copywriter_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.copywriter_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS copywriter_sessions_updated_at_idx ON public.copywriter_sessions (updated_at DESC);
CREATE INDEX IF NOT EXISTS copywriter_messages_session_id_idx ON public.copywriter_messages (session_id, created_at ASC);

-- Enable RLS
ALTER TABLE public.copywriter_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copywriter_messages ENABLE ROW LEVEL SECURITY;

-- Policies for copywriter_sessions
DROP POLICY IF EXISTS "copywriter_sessions_admin_all" ON public.copywriter_sessions;
CREATE POLICY "copywriter_sessions_admin_all" ON public.copywriter_sessions
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
        AND user_profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
        AND user_profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "copywriter_sessions_service_role" ON public.copywriter_sessions;
CREATE POLICY "copywriter_sessions_service_role" ON public.copywriter_sessions
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Policies for copywriter_messages
DROP POLICY IF EXISTS "copywriter_messages_admin_all" ON public.copywriter_messages;
CREATE POLICY "copywriter_messages_admin_all" ON public.copywriter_messages
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
        AND user_profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
        AND user_profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "copywriter_messages_service_role" ON public.copywriter_messages;
CREATE POLICY "copywriter_messages_service_role" ON public.copywriter_messages
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
