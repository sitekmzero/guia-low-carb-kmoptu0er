-- Migration: Compliance CRN and Admin standardization
-- 1. Unpublish / move to draft blog posts related to seguros / protecao patrimonial / consultoria financeira
UPDATE public.blog_posts
SET published = false,
    updated_at = NOW()
WHERE title IN (
  'O Maior Risco à Sua Saúde Não É O Que Você Come — É O Estresse Financeiro',
  'Nutricionistas Que Não Falam de Dinheiro Estão Falhando Com Seus Pacientes',
  'Por Que Profissionais de Saúde São Os Mais Vulneráveis Financeiramente do Brasil',
  'O Que A Medicina Do Estilo de Vida Ainda Não Entendeu Sobre Risco'
)
OR slug IN (
  'estresse-financeiro-saude',
  'nutricionista-dinheiro-pacientes',
  'profissionais-saude-vulnerabilidade-financeira',
  'medicina-estilo-vida-risco'
)
OR category = 'Proteção';

-- 2. Remove / deactivate the 'Proteção' category
DELETE FROM public.blog_categories
WHERE name = 'Proteção' OR slug = 'protecao';

-- 3. Standardize Admin: keep ONLY guialowcarb@gmail.com as admin (is_admin=true, role=admin)
-- Demote adriana.araujo@kmzero.com.br to regular user (is_admin=false, role=user)
UPDATE public.user_profiles
SET is_admin = false,
    role = 'user',
    updated_at = NOW()
WHERE email = 'adriana.araujo@kmzero.com.br';

-- Ensure guialowcarb@gmail.com is admin
UPDATE public.user_profiles
SET is_admin = true,
    role = 'admin',
    updated_at = NOW()
WHERE email = 'guialowcarb@gmail.com';
