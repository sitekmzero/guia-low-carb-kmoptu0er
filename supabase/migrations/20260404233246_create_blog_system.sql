DO $$
BEGIN
    -- Create blog_categories table
    CREATE TABLE IF NOT EXISTS public.blog_categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT UNIQUE NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        color TEXT,
        icon TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Add new columns to blog_posts
    ALTER TABLE public.blog_posts
    ADD COLUMN IF NOT EXISTS published_date TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS reading_time_minutes INTEGER DEFAULT 0;

    -- Insert Categories
    INSERT INTO public.blog_categories (name, slug, description, color, icon) VALUES
    ('Nutrição', 'nutricao', 'Artigos sobre nutrição clínica e saúde', '#2D6A4F', 'apple'),
    ('Proteção', 'protecao', 'Artigos sobre proteção patrimonial', '#F7941D', 'shield'),
    ('Disruptivo', 'disruptivo', 'Perspectivas inovadoras', '#7BC142', 'zap')
    ON CONFLICT (slug) DO NOTHING;

    -- Insert Posts
    INSERT INTO public.blog_posts (
        title, slug, excerpt, content, category, author, published, published_date, reading_time_minutes, featured_image_url
    ) VALUES
    (
        'Cardápio Low Carb de 7 Dias: Simples, Barato e Sem Passar Fome',
        'cardapio-low-carb-7-dias',
        'Descubra um cardápio prático e acessível para começar sua jornada low carb sem complicações.',
        '<h2>O Início de uma Jornada Sustentável</h2><p>Muitas pessoas acreditam que uma alimentação low carb precisa ser cara e cheia de ingredientes complexos. A verdade é que os alimentos mais nutritivos muitas vezes são os mais acessíveis: ovos, carnes, vegetais da estação e gorduras naturais.</p><h2>O Cardápio Prático</h2><p>Este planejamento de 7 dias foi desenhado para maximizar a nutrição e minimizar o custo. Focamos em ingredientes que você encontra em qualquer feira ou mercado local.</p><h2>Dicas para as Primeiras 72 Horas</h2><p>Nos primeiros dias, seu corpo estará se adaptando a usar gordura como combustível. Mantenha-se hidratado e não limite as porções das proteínas. A fome diminuirá naturalmente.</p>',
        'Nutrição',
        'Adriana Araújo',
        true,
        NOW(),
        8,
        'https://img.usecurling.com/p/800/600?q=healthy%20food&color=green'
    ),
    (
        'Low Carb para Diabéticos Tipo 2: O que a Ciência Diz em 2026',
        'low-carb-diabetes-tipo-2-2026',
        'Evidências científicas sobre como nutrição low carb pode reverter diabetes tipo 2.',
        '<h2>A Ciência da Reversão</h2><p>O diabetes tipo 2 tem sido historicamente tratado como uma condição progressiva e incurável. No entanto, as pesquisas mais recentes reforçam que a intervenção nutricional estratégica pode mudar esse cenário.</p><h2>A Transformação de Gabriel</h2><p>Em 2015, meu filho Gabriel foi diagnosticado com síndrome metabólica. Em apenas seis meses com uma abordagem low carb, ele eliminou quase 30 quilos e reverteu completamente o quadro. A ciência encontra seu poder máximo quando aplicada com amor.</p>',
        'Nutrição',
        'Adriana Araújo',
        true,
        NOW(),
        10,
        'https://img.usecurling.com/p/800/600?q=science%20medical'
    ),
    (
        'Resistência à Insulina: Como Identificar e Reverter com Alimentação',
        'resistencia-insulina-alimentacao',
        'Entenda os sinais de resistência à insulina e como a nutrição pode reverter esse quadro.',
        '<h2>Sinais Silenciosos</h2><p>O cansaço constante após as refeições, a dificuldade de perder peso abdominal e a vontade incontrolável por doces são os primeiros sinais de alerta de que suas células não estão respondendo bem à insulina.</p><h2>O Mecanismo Low Carb</h2><p>Reduzir a ingestão de carboidratos refinados e açúcares é a estratégia mais direta e biologicamente fundamentada para reduzir os níveis de insulina circulante e restaurar a sensibilidade celular.</p>',
        'Nutrição',
        'Adriana Araújo',
        true,
        NOW(),
        9,
        'https://img.usecurling.com/p/800/600?q=sugar%20blood&color=red'
    ),
    (
        'Inflamação Crônica Silenciosa: Os Alimentos Que Estão te Destruindo por Dentro',
        'inflamacao-cronica-alimentos',
        'Descubra como alimentos aparentemente saudáveis podem estar causando inflamação crônica.',
        '<h2>O Inimigo Invisível</h2><p>Você pode não sentir dor imediata, mas o consumo diário de ultraprocessados coloca seu sistema imunológico em estado de alerta constante, promovendo uma inflamação que desgasta seu corpo.</p><h2>Alimentos Gatilho</h2><p>Óleos vegetais refinados (como soja e canola), açúcares ocultos e grãos altamente processados são frequentemente rotulados como opções "saudáveis para o coração", mas a ciência moderna mostra o exato oposto.</p>',
        'Disruptivo',
        'Adriana Araújo',
        true,
        NOW(),
        11,
        'https://img.usecurling.com/p/800/600?q=processed%20food'
    ),
    (
        'Teleconsulta Nutricional: Como Funciona, Quando Indicar e O Que Esperar',
        'teleconsulta-nutricional-guia',
        'Guia completo sobre teleconsultoria nutricional: processo, benefícios e como agendar.',
        '<h2>O Novo Consultório</h2><p>A tecnologia eliminou as barreiras geográficas da saúde clínica. Hoje, você pode receber um acompanhamento de alto nível, fundamentado na ciência, diretamente do conforto da sua casa.</p><h2>O Processo de Atendimento</h2><p>Antes mesmo do nosso encontro em vídeo, realizamos uma profunda anamnese online. O plano alimentar que você recebe não é uma folha padronizada, mas um mapa estratégico desenhado exclusivamente para o seu metabolismo e rotina.</p>',
        'Nutrição',
        'Adriana Araújo',
        true,
        NOW(),
        7,
        'https://img.usecurling.com/p/800/600?q=telemedicine&color=blue'
    ),
    (
        'Low Carb Não É Dieta — É Um Problema de Relação de Poder',
        'low-carb-relacao-poder',
        'Uma perspectiva disruptiva sobre por que a indústria do emagrecimento falha com você.',
        '<h2>O Paradoxo do Fracasso</h2><p>A indústria do emagrecimento convencional não lucra com o seu sucesso permanente. Ela lucra com a sua próxima tentativa frustrada. É um modelo desenhado para a dependência contínua de produtos "light", chás milagrosos e restrições insustentáveis.</p><h2>Libertação Metabólica</h2><p>Quando descobri o estilo de vida low carb, entendi que o verdadeiro conhecimento nutricional devolve a você o poder sobre a própria saúde, sem precisar estar amarrado a promessas vazias.</p>',
        'Disruptivo',
        'Adriana Araújo',
        true,
        NOW(),
        9,
        'https://img.usecurling.com/p/800/600?q=empowerment'
    ),
    (
        'O Maior Risco à Sua Saúde Não É O Que Você Come — É O Estresse Financeiro',
        'estresse-financeiro-saude',
        'Como o estresse financeiro sabota sua saúde metabólica e o que fazer sobre isso.',
        '<h2>Cortisol e o Bolso</h2><p>A preocupação com o dia de amanhã inunda o seu sistema nervoso de cortisol. Esse hormônio do estresse crônico desregula sua glicemia, promove acúmulo de gordura visceral e anula até mesmo as melhores escolhas alimentares.</p><h2>Proteção Holística</h2><p>Com mais de 20 anos como corretora de seguros, percebi que a verdadeira estabilidade envolve cuidar do corpo e do patrimônio simultaneamente. Um sem o outro é vulnerabilidade.</p>',
        'Disruptivo',
        'Adriana Araújo',
        true,
        NOW(),
        10,
        'https://img.usecurling.com/p/800/600?q=finance%20stress&color=orange'
    ),
    (
        'Nutricionistas Que Não Falam de Dinheiro Estão Falhando Com Seus Pacientes',
        'nutricionista-dinheiro-pacientes',
        'Por que nutrição clínica deve incluir educação financeira e proteção patrimonial.',
        '<h2>A Fome e o Medo</h2><p>Prescrever alimentos inacessíveis para um paciente financeiramente estrangulado não é conduta clínica, é falta de empatia e desconexão com a realidade.</p><h2>Abordagem Integrada</h2><p>Profissionais de saúde precisam entender que o orçamento familiar dita o padrão alimentar. Tratar a obesidade sem discutir planejamento financeiro básico é tratar o sintoma, ignorando a raiz de muitos comportamentos compulsivos.</p>',
        'Disruptivo',
        'Adriana Araújo',
        true,
        NOW(),
        8,
        'https://img.usecurling.com/p/800/600?q=business%20woman'
    ),
    (
        'Por Que Profissionais de Saúde São Os Mais Vulneráveis Financeiramente do Brasil',
        'profissionais-saude-vulnerabilidade-financeira',
        'Análise sobre vulnerabilidade financeira de profissionais de saúde e soluções de proteção.',
        '<h2>O Paradoxo do Cuidado</h2><p>Médicos, nutricionistas e dentistas passam a vida inteira cuidando da longevidade dos seus pacientes, mas muitas vezes não possuem um seguro de vida, uma proteção para perda de renda (DIT) ou planejamento estruturado para o próprio futuro.</p><h2>As Soluções Práticas</h2><p>É vital estabelecer blindagens: desde seguros de responsabilidade civil profissional até consórcios estratégicos que funcionam como poupança forçada para construção de patrimônio em clínicas e equipamentos.</p>',
        'Proteção',
        'Adriana Araújo',
        true,
        NOW(),
        9,
        'https://img.usecurling.com/p/800/600?q=doctor%20protection&color=cyan'
    ),
    (
        'O Que A Medicina Do Estilo de Vida Ainda Não Entendeu Sobre Risco',
        'medicina-estilo-vida-risco',
        'Uma perspectiva integradora entre medicina do estilo de vida e gestão de risco.',
        '<h2>Além do Consultório</h2><p>Focar apenas em alimentação, exercícios e sono é crucial, mas é uma visão incompleta da palavra prevenção. Como você se protege se um acidente imprevisto interromper sua capacidade de gerar renda?</p><h2>Gestão de Risco Completa</h2><p>O verdadeiro tripé da proteção duradoura une saúde metabólica inabalável, uma mente tranquila e a segurança patrimonial que garante o bem-estar dos que você mais ama.</p>',
        'Disruptivo',
        'Adriana Araújo',
        true,
        NOW(),
        10,
        'https://img.usecurling.com/p/800/600?q=risk%20management'
    )
    ON CONFLICT (slug) DO NOTHING;

    -- RLS Policies for blog_categories
    ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "blog_categories_public" ON public.blog_categories;
    CREATE POLICY "blog_categories_public" ON public.blog_categories FOR SELECT TO public USING (true);

    DROP POLICY IF EXISTS "blog_categories_admin" ON public.blog_categories;
    CREATE POLICY "blog_categories_admin" ON public.blog_categories FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND is_admin = true)
    );

    -- Ensure RLS for blog_posts
    ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "blog_posts_public" ON public.blog_posts;
    CREATE POLICY "blog_posts_public" ON public.blog_posts FOR SELECT TO public USING (published = true);

    DROP POLICY IF EXISTS "blog_posts_admin" ON public.blog_posts;
    CREATE POLICY "blog_posts_admin" ON public.blog_posts FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND is_admin = true)
    );

END $$;

-- Create RPC for incrementing views safely
CREATE OR REPLACE FUNCTION public.increment_blog_view(post_slug TEXT)
RETURNS void AS $function$
BEGIN
  UPDATE public.blog_posts
  SET views = views + 1
  WHERE slug = post_slug;
END;
$function$ LANGUAGE plpgsql SECURITY DEFINER;
