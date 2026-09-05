-- Migration: Populate caminho_pasta in drive_arquivos based on folder hierarchy
-- Preserves existing 626 rows and their extracted texts, assigning clean folder paths

UPDATE public.drive_arquivos
SET caminho_pasta = 'Blog LowCArb/Receitas/'
WHERE (mime_type ILIKE '%document%' OR mime_type ILIKE '%text%' OR mime_type ILIKE '%pdf%')
  AND (nome ~* '(receita|cardapio|pao|bolo|sobremesa|torta|salgado|farinha|mousse|panqueca|waffle|shake|caldo|sopa|cookie|biscoito|lanche|refeicao|doce|prato|culinar)'
       OR nome ~* '50Receitas|Receitas-Guia');

UPDATE public.drive_arquivos
SET caminho_pasta = 'Blog LowCArb/Planilhas e Tabelas/'
WHERE (mime_type ILIKE '%sheet%' OR mime_type ILIKE '%excel%' OR mime_type ILIKE '%csv%' OR nome ~* '\.(xlsx|xls|csv)$')
  AND (caminho_pasta IS NULL OR caminho_pasta = '');

UPDATE public.drive_arquivos
SET caminho_pasta = 'Blog LowCArb/Imagens/'
WHERE (mime_type ILIKE 'image/%' OR nome ~* '\.(jpg|jpeg|png|gif|bmp|webp)$')
  AND (caminho_pasta IS NULL OR caminho_pasta = '');

UPDATE public.drive_arquivos
SET caminho_pasta = 'Blog LowCArb/Textos/'
WHERE (caminho_pasta IS NULL OR caminho_pasta = '')
  AND (mime_type ILIKE '%document%' OR mime_type ILIKE '%text%' OR mime_type ILIKE '%pdf%' OR nome ~* '\.(txt|docx|doc|pdf|rtf)$');

UPDATE public.drive_arquivos
SET caminho_pasta = 'Blog LowCArb/Outros/'
WHERE caminho_pasta IS NULL OR caminho_pasta = '';
