-- Migration: Add caminho_pasta column and index to drive_arquivos
ALTER TABLE public.drive_arquivos 
ADD COLUMN IF NOT EXISTS caminho_pasta TEXT DEFAULT '';

CREATE INDEX IF NOT EXISTS drive_arquivos_caminho_pasta_idx ON public.drive_arquivos (caminho_pasta);
