-- Migration: create drive_arquivos table and RLS policies
CREATE TABLE IF NOT EXISTS public.drive_arquivos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  texto_extraido TEXT,
  tamanho_bytes BIGINT DEFAULT 0,
  modified_time TIMESTAMPTZ,
  link_drive TEXT,
  status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo', 'em_producao', 'usado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS drive_arquivos_file_id_idx ON public.drive_arquivos (file_id);
CREATE INDEX IF NOT EXISTS drive_arquivos_status_idx ON public.drive_arquivos (status);
CREATE INDEX IF NOT EXISTS drive_arquivos_modified_time_idx ON public.drive_arquivos (modified_time DESC);

-- Enable RLS
ALTER TABLE public.drive_arquivos ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Admin full access
DROP POLICY IF EXISTS "drive_arquivos_admin_all" ON public.drive_arquivos;
CREATE POLICY "drive_arquivos_admin_all" ON public.drive_arquivos
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

-- Service role full access for edge functions
DROP POLICY IF EXISTS "drive_arquivos_service_role" ON public.drive_arquivos;
CREATE POLICY "drive_arquivos_service_role" ON public.drive_arquivos
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
