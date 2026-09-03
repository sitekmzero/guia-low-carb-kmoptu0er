-- Migration: Atualização de conteúdo clínico e reading time dos artigos do blog (Compliance CFN e LGPD)
-- Slugs atualizados: cardapio-low-carb-7-dias e low-carb-diabetes-tipo-2-2026

DO $$
BEGIN

  -- 1. Artigo: Cardápio Low Carb de 7 Dias: Estrutura Prática e Sem Complicações
  UPDATE public.blog_posts
  SET
    title = 'Cardápio Low Carb de 7 Dias: Estrutura Prática e Sem Complicações',
    excerpt = 'Entenda a estrutura de como montar um cardápio low carb de 7 dias com alimentos acessíveis, comida de verdade e fundamentação educativa.',
    reading_time_minutes = 6,
    content = $BODY$
<h2>Planejamento e Autonomia na Alimentação de Baixo Carboidrato</h2>
<p>Muitas pessoas acreditam erroneamente que adotar uma estratégia nutricional com menor teor de carboidratos exige ingredientes caros, farinhas especiais ou preparações complexas. Na prática clínica baseada em comida de verdade, os alimentos mais nutritivos e eficientes são exatamente aqueles presentes nas feiras livres e mercados locais: ovos, carnes, pescados, vegetais da estação e gorduras naturalmente presentes nos alimentos.</p>

<p>Este guia foi estruturado para apresentar a <strong>lógica de organização</strong> de uma semana típica, servindo como modelo didático para quem busca clareza sobre como compor suas refeições com equilíbrio, sem recorrer a ultraprocessados.</p>

<div style="background-color: #f8fafc; border-left: 4px solid #0F5132; padding: 16px; margin: 20px 0; border-radius: 8px;">
  <strong>Importante:</strong> Esta estrutura tem finalidade estritamente pedagógica e não substitui uma avaliação clínica individualizada. As quantidades ideais de calorias, proteínas, gorduras e fibras variam de acordo com composição corporal, nível de atividade física, rotina e histórico de saúde de cada indivíduo.
</div>

<h2>A Lógica dos Pratos: Como Montar Cada Refeição</h2>
<p>Em vez de focar em pesagens milimétricas nos primeiros passos, a abordagem didática preconiza a correta proporção dos grupos de alimentos:</p>
<ul>
  <li><strong>Base proteica de alto valor biológico:</strong> ovos, cortes de frango, carne bovina moída ou em tiras, lombo suíno, sardinha ou atum. A proteína promove saciedade prolongada e preservação de massa magra.</li>
  <li><strong>Vegetais de baixo amido:</strong> folhas verdes variadas (rúcula, alface, couve, espinafre), abobrinha, berinjela, chuchu, pepino, tomate, brócolis e couve-flor. São fontes essenciais de micronutrientes, água e fibras prebióticas.</li>
  <li><strong>Gorduras naturais para preparo:</strong> azeite de oliva extravirgem, manteiga e a gordura inerente das próprias proteínas e sementes. O objetivo não é hiperlipídico artificial, mas sim evitar o medo desnecessário das gorduras naturais que acompanham os alimentos integrais.</li>
</ul>

<h2>Estrutura Didática de 7 Dias</h2>

<h3>Dia 1: A Transição Simples</h3>
<ul>
  <li><strong>Café da manhã:</strong> Ovos mexidos preparados com azeite ou manteiga, acompanhados de café ou chá sem açúcar adicionado. Opcional: fatias de queijo curado.</li>
  <li><strong>Almoço:</strong> Coxa e sobrecoxa de frango assadas com ervas, acompanhadas de salada generosa de folhas verdes e abobrinha refogada com alho.</li>
  <li><strong>Lanche (se houver fome genuína):</strong> Um punhado pequeno de castanhas ou sementes de abóbora tostadas.</li>
  <li><strong>Jantar:</strong> Omelete recheada com espinafre e tomate picado, servida com salada de pepino e azeite.</li>
</ul>

<h3>Dia 2: Foco em Fibras e Vegetais da Estação</h3>
<ul>
  <li><strong>Café da manhã:</strong> Ovos cozidos com azeite e orégano, acompanhados de café preto ou chá verde.</li>
  <li><strong>Almoço:</strong> Carne moída refogada com cebola e pimentão, acompanhada de couve refogada e salada de tomate com manjericão.</li>
  <li><strong>Lanche:</strong> Porção pequena de morangos ou abacate com gotas de limão.</li>
  <li><strong>Jantar:</strong> Filé de peito de frango grelhado com brócolis no vapor regado com azeite extravirgem.</li>
</ul>

<h3>Dia 3: Praticidade no Dia a Dia</h3>
<ul>
  <li><strong>Café da manhã:</strong> Café com leite integral ou iogurte natural sem açúcar com sementes de chia e linhaça.</li>
  <li><strong>Almoço:</strong> Bisteca de porco ou lombo suíno grelhado com purê rústico de couve-flor e salada mista.</li>
  <li><strong>Lanche:</strong> Ovos de codorna cozidos com azeite e ervas frescas.</li>
  <li><strong>Jantar:</strong> Sopa reconfortante de legumes de baixo amido (abobrinha, chuchu e couve) enriquecida com frango desfiado.</li>
</ul>

<h3>Dia 4: Peixes Acessíveis e Ricos em Ômega-3</h3>
<ul>
  <li><strong>Café da manhã:</strong> Ovos mexidos com tomate e cheiro-verde.</li>
  <li><strong>Almoço:</strong> Sardinha assada na frigideira com azeite, cebola e pimentão, servida com salada de folhas escuras e berinjela grelhada.</li>
  <li><strong>Lanche:</strong> Chá de camomila ou hortelã acompanhado de nozes ou castanha-do-pará.</li>
  <li><strong>Jantar:</strong> Carne moída refogada com abobrinha em cubos e salada de agrião.</li>
</ul>

<h3>Dia 5: Consolidação de Hábitos</h3>
<ul>
  <li><strong>Café da manhã:</strong> Panqueca simples feita apenas com ovo batido e sementes de linhaça moída, recheada com queijo.</li>
  <li><strong>Almoço:</strong> Iscas de bife bovino acebolado, chuchu refogado e salada crocante de repolho roxo com azeite.</li>
  <li><strong>Lanche:</strong> Iogurte natural integral simples.</li>
  <li><strong>Jantar:</strong> Sobrecoxa de frango desossada grelhada com salada de folhas e tomate.</li>
</ul>

<h3>Dia 6: Sabor e Sustentabilidade de Rotina</h3>
<ul>
  <li><strong>Café da manhã:</strong> Ovos fritos na manteiga com fatias de queijo minas curado e café sem açúcar.</li>
  <li><strong>Almoço:</strong> Carne de panela cozida com cenoura em moderação e chuchu, servida com salada de rúcula.</li>
  <li><strong>Lanche:</strong> Fatias finas de abacate com canela.</li>
  <li><strong>Jantar:</strong> Torta rápida de frigideira com base de ovos batidos e recheio de atum e vegetais.</li>
</ul>

<h3>Dia 7: Confraternização Familiar Sem Excesso de Açúcar</h3>
<ul>
  <li><strong>Café da manhã:</strong> Ovos mexidos cremosos com café coado e água saborizada com limão.</li>
  <li><strong>Almoço:</strong> Churrasco caseiro ou carne assada no forno, acompanhada de legumes grelhados (cebola, abobrinha, pimentão) e salada de folhas verdes com azeite.</li>
  <li><strong>Lanche:</strong> Chá gelado natural sem adoçantes industriais.</li>
  <li><strong>Jantar:</strong> Omelete leve de queijo e ervas ou prato de salada completa com frango desfiado.</li>
</ul>

<h2>Adaptação Inicial: O Que Esperar nos Primeiros Dias</h2>
<p>Durante os primeiros 3 a 5 dias de redução no consumo de carboidratos refinados, é comum que o organismo passe por um processo de transição metabólica enquanto adapta sua flexibilidade para oxidação lipídica. A redução de glicogênio hepático e muscular vem acompanhada de excreção natural de água e eletrólitos.</p>
<p>Por esse motivo, é fundamental:</p>
<ol>
  <li><strong>Manter ótima hidratação:</strong> beba água regularmente ao longo de todo o dia.</li>
  <li><strong>Não restringir sódio excessivamente:</strong> a ingestão adequada de sal de cozinha e caldos caseiros ajuda a evitar sintomas transitórios como fadiga e dor de cabeça leve.</li>
  <li><strong>Respeitar a saciedade:</strong> coma até sentir-se satisfeito, sem forçar refeições por relógio nem impor restrições extremas de calorias no início.</li>
</ol>
$BODY$
  WHERE slug = 'cardapio-low-carb-7-dias';


  -- 2. Artigo: Low Carb para Diabéticos Tipo 2: O que a Ciência Diz em 2026
  UPDATE public.blog_posts
  SET
    title = 'Low Carb para Diabéticos Tipo 2: O que a Ciência Diz em 2026',
    excerpt = 'Revisão atualizada sobre evidências científicas, estudos clínicos (DiRECT, metanálise BMJ, ADA 2026) e remissão de diabetes tipo 2 com nutrição.',
    reading_time_minutes = 7,
    content = $BODY$
<h2>Uma Mudança de Paradigma na Medicina e Nutrição Clínica</h2>
<p>Historicamente, o diabetes mellitus tipo 2 (DM2) foi descrito nos manuais médicos como uma condição crônica, degenerativa e invariavelmente progressiva. O modelo convencional de conduta focava quase exclusivamente no controle paliativo da glicemia por meio de escalonamento progressivo de medicamentos orais e, com frequência, introdução tardia de insulina exógena.</p>

<p>No entanto, a literatura científica das últimas duas décadas transformou radicalmente esse entendimento. Grandes ensaios clínicos randomizados e revisões sistemáticas evidenciam que a restrição orientada de carboidratos aliada à melhora da composição corporal pode induzir <strong>remissão clínica do diabetes tipo 2</strong>, permitindo descontinuação segura de medicações e restauração marcante da sensibilidade à insulina.</p>

<div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0; border-radius: 8px;">
  <strong style="color: #991b1b;">ALERTA CLÍNICO OBRIGATÓRIO — RISCO DE HIPOGLICEMIA:</strong><br />
  A redução significativa de carboidratos dietéticos em pessoas com diabetes em uso de hipoglicemiantes orais (especialmente sulfonilureias) ou insulina <strong>reduz rapidamente os níveis de glicose no sangue</strong>. Iniciar essa abordagem sem o acompanhamento conjunto do médico assistente e da nutricionista clínica pode acarretar quadros graves de hipoglicemia. O desmame ou ajuste de doses medicamentosas deve ser supervisionado profissionalmente desde o primeiro dia.
</div>

<h2>As Evidências Científicas Contemporâneas</h2>

<h3>1. Estudo DiRECT (Diabetes Remission Clinical Trial)</h3>
<p>Conduzido no Reino Unido por Lean, Taylor e colaboradores, o marco do estudo DiRECT demonstrou que a perda ponderal substancial e a reversão do acúmulo de gordura ectópica no fígado e no pâncreas restaura a capacidade secretória das células beta pancreáticas:</p>
<ul>
  <li>Aos 2 anos de acompanhamento, aproximadamente <strong>36% dos pacientes mantinham remissão completa do diabetes tipo 2</strong> sem uso de medicações antidiabéticas.</li>
  <li>No seguimento estendido de 5 anos (publicado em 2024, PMID 38423026), demonstrou-se que cerca de <strong>26% dos participantes que haviam alcançado remissão em 2 anos permaneceram em remissão sustentada após 5 anos</strong>, com marcadores cardiometabólicos significativamente melhores e redução expressiva de complicações vasculares.</li>
</ul>

<h3>2. Metanálise Goldenberg et al. (BMJ 2021)</h3>
<p>Em rigorosa revisão sistemática e metanálise publicada no renomado <em>British Medical Journal</em> (BMJ 2021;372:m4743), Goldenberg e pesquisadores avaliaram intervenções de dietas de baixo carboidrato em pacientes com DM2. Os autores concluíram que dietas low carb alcançaram taxas superiores de remissão do diabetes aos 6 meses em comparação com dietas convencionais de controle, com atenuação dos índices observada aos 12 meses — destacando a necessidade primordial de sustentabilidade alimentar a longo prazo e acompanhamento comportamental contínuo.</p>

<h3>3. Coortes Virta Health (Athinarayanan 2019 e McKenzie 2024)</h3>
<p>Os estudos longitudinais de Athinarayanan et al. (2019) e o seguimento de longo prazo publicado por McKenzie et al. (2024) demonstraram que a restrição de carboidratos em um modelo de cuidado contínuo supervisionado resulta em reduções duradouras da hemoglobina glicada (HbA1c), queda nos triglicerídeos, aumento do HDL e expressiva redução ou eliminação completa do uso de insulina em até metade dos participantes acompanhados.</p>

<h3>4. Diretrizes da ADA (American Diabetes Association) Standards of Care 2026</h3>
<p>As Diretrizes Oficiais da Associação Americana de Diabetes — <em>Standards of Care in Diabetes 2026</em> (capítulo 5, "Facilitating Positive Health Behaviors and Well-being to Improve Health Outcomes", Diabetes Care 49(Suppl 1):S89-S131, PMID 41358898) — consolidam que estratégias de baixo carboidrato estão entre as intervenções nutricionais mais eficientes para redução rápida de HbA1c e redução da carga medicamentosa em adultos diagnosticados com diabetes tipo 2.</p>

<h2>Mecanismo Biológico: Por Que a Redução de Carboidratos Funciona?</h2>
<p>Ao ingerirmos carboidratos, eles são convertidos em glicose na corrente sanguínea, estimulando a liberação de insulina pelas células beta do pâncreas. Em indivíduos com resistência à insulina, os tecidos periféricos (músculo, fígado e tecido adiposo) respondem deficientemente a esse sinal, exigindo concentrações cronicamente elevadas de insulina para manter a glicemia sob controle.</p>
<p>Ao modular estrategicamente o aporte de carboidratos da dieta:</p>
<ul>
  <li>Reduz-se a demanda direta por insulina pancreática;</li>
  <li>Facilita-se a mobilização e queima da gordura hepática (esteatose);</li>
  <li>Restaura-se a sensibilidade celular aos hormônios reguladores;</li>
  <li>Estabilizam-se as flutuações glicêmicas, prevenindo a variabilidade que causa lesão endotelial.</li>
</ul>

<h2>O Papel do Acompanhamento Clínico Individualizado</h2>
<p>Não existe uma fórmula única: a quantidade exata de carboidratos, a escolha das fontes alimentares e a velocidade de progressão devem respeitar exames laboratoriais prévios, função renal, estilo de vida e preferências pessoais. A conduta nutricional baseada em ciência alia conhecimento técnico rigoroso com a escuta empática que viabiliza a aderência para a vida inteira.</p>
$BODY$
  WHERE slug = 'low-carb-diabetes-tipo-2-2026';

END $$;
