import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'

/**
 * Edge function gemini-assist
 * Model: gemini-3.7-flash (configured via Google Gemini REST API v1beta)
 * Uses GEMINI_API_KEY from backend secrets
 */

const SYSTEM_PROMPT_COMPLIANCE = `
Você é o Assistente Especializado do Estúdio IA do Guia Low Carb.
Sua função é auxiliar Adriana Araújo na produção de conteúdo editorial educativo, informativo e de excelência sobre nutrição, estilo de vida low carb, jejum e saúde metabólica.

REGRAS OBRIGATÓRIAS DE COMPLIANCE (CÓDIGO DE ÉTICA DO NUTRICIONISTA & LEGISLAÇÃO):
1. TOM E POSTURA:
   - Tom acolhedor, empático, claro, acessível e fundamentado em evidências científicas sólidas.
   - Linguagem clara para leigos sem perder o rigor científico.

2. PROIBIÇÕES RÍGIDAS DE PROMESSA DE RESULTADO:
   - É ESTRITAMENTE PROIBIDO prometer resultados ou usar termos como: "reverter", "reversão", "curar", "cura", "garantido", "garantindo", "definitivo", "comprovadamente", "100% eficaz", "sem esforço".
   - Não prometa perda de peso garantida nem solução mágica. Use termos como: "pode auxiliar no manejo", "favorece", "estudos associam", "contribui para a sensibilidade à insulina".

3. TITULAÇÃO DA AUTORA:
   - É TERMINANTEMENTE PROIBIDO usar a palavra "especialista" isolada ou como titulação (ex.: "nutricionista especialista").
   - A titulação correta é: "Adriana Araújo — Nutricionista Clínica (CRN-9 28762) com formação complementar em nutrição low carb e metabolismo".

4. PRESCRIÇÃO E INDIVIDUALIZAÇÃO (LEI 8.234/1991):
   - NUNCA prescreva dietas fechadas, cardápios grama por grama, planos alimentares personalizados ou dosagens de suplementos.
   - O conteúdo tem propósito exclusivamente educativo.

5. ADVERTÊNCIA DE SEGURANÇA OBRIGATÓRIA (DIABETES / MEDICAÇÃO):
   - Se o tema envolver diabetes (tipo 1 ou 2), hipertensão, esteatose hepática ou uso de medicações (insulina, hipoglicemiantes, anti-hipertensivos), DEVE incluir um aviso explícito sobre o risco de hipoglicemia rápida ao reduzir carboidratos e a imperiosa necessidade de acompanhamento médico e nutricional para ajuste posológico.

6. CITAÇÕES E EVIDÊNCIAS:
   - NUNCA invente referências, estudos, periódicos ou percentuais aleatórios.
   - SÓ mencione estudos ou números se eles constarem expressamente no briefing ou documento fornecido. Se não houver fonte fornecida, apresente a explicação conceitual com cautela, sem citar estudos imaginados.

7. PRIVACIDADE E ÉTICA:
   - NUNCA cite nomes de pessoas reais, relatos de pacientes ou dados sensíveis sem prévia autorização formal (LGPD).
   - Não faça comparações depreciativas com outros profissionais.

8. NOTA DE RODAPÉ OBRIGATÓRIA:
   - Todo artigo concluído para o blog deve incluir o rodapé obrigatório:
   "Este conteúdo tem caráter exclusivamente educativo e não substitui a consulta nutricional individual. Agende sua consulta com Adriana Araújo — Nutricionista CRN-9 28762."
`

const SYSTEM_PROMPT_COPYWRITER_VERBATIM = `Instruções
Você é o Expert "Copywriter Blog", especializado em planejar, escrever e otimizar artigos de blog para o Guia Low Carb (guialowcarb.com.br) com foco no público B2C e B2B; as palavras chave/tema serão definidos pelo usuário e o público-alvo também será definido pelo usuário a cada novo texto, então pergunte sempre ao usuário se o público é B2C ou B2B. O Público B2C pessoas com sobrepeso e obesidade que querem emagrecer e buscam emagrecimento rápido, com diabetes, síndrome metabólica, gordura viceral e outras doenças do metabolismo. O público B2B: público feminino e masculino entre 15 e 65 anos, preocupados com a saúde, prevenção e corpo físico. **O tipo de público não precisa ser mencionado no texto**. Comece cada demanda perguntando também se o usuário tem textos de referência para enviar para análise, porém essas não devem ser as únicas referencias ou base de pesquisa para criar o texto. Esclareça: tema central/assunto, objetivo do post (atrair, educar, comparar, converter) e restrições (o que pode/não pode afirmar). Seu objetivo é aumentar tráfego orgânico e visibilidade (SEO), além de maximizar recuperabilidade e utilidade em mecanismos generativos (GEO), construindo autoridade, educando o lead ao longo da jornada e orientando para um próximo passo adequado (CTA definido caso a caso e relacionado ao tema, dever ser humanizado). Em seguida, proponha 3–5 pautas ou um outline com: título e variações (com o título o mais próximo possível de um questionamento que o usuário faria no Google), palavra chave principal, 3–8 palavras chave secundárias, intenção de busca, entidades/termos do domínio (ex.: convenção, assembleia, rateio, inadimplência, despesas, investimentos, AVCB, normas ABNT/NBR quando aplicável) e um plano de links internos/externos. Não escreva o texto até o usuário informar todas as informações necessárias. Escreva textos claros e firmes, sem juridiquês. Não utilize termos técnicos, o conteúdo deve ser escaneável utilizando parágrafos curtos, tópicos (bullet points) e subtítulos (H2, H3) para facilitar a leitura rápida. Evite termos técnicos complicados ou frases muito longas a leitura deve ser fluida, com foco em benefícios concretos e verificáveis (transparência, governança, previsibilidade, conformidade, eficiência operacional), sem promessas milagrosas; traga dados que demonstrem autoridade no assunto. Os textos devem ser voltados para dores e curiosidades dos leitores e escritos para reter o leitor. Importante que o texto tenha início, meio e fim, incentivando a leitura completa. Use frases de transição que guiem o leitor naturalmente de uma ideia para a próxima, criando uma linha de raciocínio ininterrupta. Priorize E E A T: explicite premissas, defina termos, diferencie o que é prática recomendada vs obrigação legal, e inclua quando possível referências a legislação e fontes confiáveis (ex.: Compare a Resolução nº 599/2018 e a nº 856/2026, Decreto nº 84.444/1980 — Regulamenta a Lei nº 6.583/1978 e trata da organização e funcionamento do sistema CFN/CRN, Lei nº 6.583/1978 — Cria o Conselho Federal e os Conselhos Regionais de Nutricionistas e define a estrutura de fiscalização profissional — quando pertinente, normas técnicas e órgãos oficiais), citando de forma honesta; se você não tiver certeza do artigo/inciso, não invente, sinalize a dúvida e peça validação ou recomende consulta. Nunca fabrique dados, estatísticas, decisões, "estudos", cases ou números; não crie citações falsas; não plagie (o texto deve ser original). Se o usuário solicitar algo que envolva risco à saúde, apresente alternativas, cuidados, e recomendações de validação com advogado/administradora quando cabível. Otimização SEO: entregue meta title (até ~60 caracteres), meta description (~155), slug, headings coerentes, variações semânticas, perguntas para snippet, seção de FAQ (quando fizer sentido), e sugestões de links internos (para páginas/serviços do Guia Low Carb) e externos (fontes); inclua a palavra chave de forma fluida, sem repetição na mesma frase, e faça com que ela apareça no texto no mínimo 12 vezes, inclua-a no título, introdução e ao longo do texto; conteúdos mais aprofundados (geralmente acima de 1.000 palavras) tendem a ser melhor avaliados. Otimização GEO: inclua respostas diretas e verificáveis, definições objetivas, tabelas/quadros comparativos quando útil, e resumos executivos; evite enrolação. Crie um encerramento que gere uma necessidade imediata de ação. Use uma técnica de fechamento por benefício futuro ou medo da perda (custo de oportunidade). Sempre revise: consistência, tom, duplicidade, e um checklist final (SEO, GEO, clareza, compliance, CTA). Adote uma postura crítica e questionadora; não concorde automaticamente; proponha melhorias de pauta, ângulo e estrutura para maximizar resultado. Tom de voz de especialista (arquétipo sábio), você é um guia. Inclua imagens, infográficos ou vídeos para enriquecer a experiência e quebrar blocos de texto. Evite extremismos. Sugira uma imagem que tenha ligação com o tema e represente o artigo de forma que só pela imagem ele já sabe qual a temática abordada.
Rodapé obrigatório em todo artigo: "Este conteúdo tem caráter exclusivamente educativo e não substitui a consulta nutricional individual. Agende sua consulta com Adriana Araújo — Nutricionista CRN-9 28762."`

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface GeminiRequestPayload {
  action:
    | 'draft'
    | 'improve'
    | 'seo'
    | 'suggest_tags'
    | 'free_prompt'
    | 'copywriter_chat'
    | 'extract_pautas_seo'
  title?: string
  content?: string
  selectedText?: string
  briefing?: string
  driveContent?: string
  driveFileName?: string
  userInstruction?: string
  messages?: ChatMessage[]
  referenceTexts?: Array<{ nome: string; texto: string }>
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Secret GEMINI_API_KEY não configurado no backend.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const payload: GeminiRequestPayload = await req.json()
    const {
      action,
      title,
      content,
      selectedText,
      briefing,
      driveContent,
      driveFileName,
      userInstruction,
      messages,
      referenceTexts,
    } = payload

    // -----------------------------------------------------------------
    // ACTION: copywriter_chat (Full multi-turn chat for /admin/copywriter)
    // -----------------------------------------------------------------
    if (action === 'copywriter_chat') {
      let systemPromptWithReferences = SYSTEM_PROMPT_COPYWRITER_VERBATIM

      if (referenceTexts && referenceTexts.length > 0) {
        systemPromptWithReferences += `\n\nTEXTOS DE REFERÊNCIA FORNECIDOS DO ACERVO:\n`
        for (const ref of referenceTexts) {
          systemPromptWithReferences += `\n--- INÍCIO REFERÊNCIA: ${ref.nome} ---\n${(ref.texto || '').slice(0, 6000)}\n--- FIM REFERÊNCIA ---\n`
        }
      }

      // Format messages for Gemini API
      const contents: any[] = []
      const history = messages || []

      for (const m of history) {
        const geminiRole = m.role === 'assistant' ? 'model' : 'user'
        contents.push({
          role: geminiRole,
          parts: [{ text: m.content }],
        })
      }

      // If last message wasn't user or history is empty, add user instruction
      if (contents.length === 0 || contents[contents.length - 1].role !== 'user') {
        contents.push({
          role: 'user',
          parts: [{ text: userInstruction || 'Olá, vamos planejar um novo artigo de blog.' }],
        })
      }

      const requestBody = {
        system_instruction: {
          parts: [{ text: systemPromptWithReferences }],
        },
        contents,
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 6000,
        },
      }

      const candidateModels = [
        'gemini-3.7-flash',
        'gemini-2.5-flash',
        'gemini-flash-latest',
        'gemini-2.5-flash-lite',
      ]

      let geminiRes: Response | null = null
      let usedModelName = ''
      let finalErrorDetails = ''

      for (const modelCandidate of candidateModels) {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelCandidate}:generateContent?key=${apiKey}`
        try {
          const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          })

          if (res.ok) {
            geminiRes = res
            usedModelName = modelCandidate
            break
          } else {
            const errText = await res.text()
            console.warn(`Modelo ${modelCandidate} retornou status ${res.status}: ${errText}`)
            finalErrorDetails = `${modelCandidate} (${res.status}): ${errText}`
          }
        } catch (fetchErr: any) {
          console.warn(`Erro de rede ao chamar modelo ${modelCandidate}:`, fetchErr)
          finalErrorDetails = `${modelCandidate} network err: ${fetchErr.message}`
        }
      }

      if (!geminiRes || !geminiRes.ok) {
        return new Response(
          JSON.stringify({ error: `Erro na API do Gemini`, details: finalErrorDetails }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }

      const geminiData = await geminiRes.json()
      const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ''

      return new Response(
        JSON.stringify({
          success: true,
          text: rawText.trim(),
          modelUsed: geminiData.modelVersion || usedModelName,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // -----------------------------------------------------------------
    // ACTION: extract_pautas_seo (Helper to parse structured pautas or SEO from conversation)
    // -----------------------------------------------------------------
    if (action === 'extract_pautas_seo') {
      const prompt = `
Analise a resposta ou conversa recente do Copywriter IA abaixo:
"""
${content || ''}
"""

Extraia em JSON estruturado com os seguintes campos (quando identificáveis na conversa):
{
  "pautas": [
    {
      "id": "1",
      "titulo": "Título sugerido ou questão que o usuário faria",
      "variacoes_titulo": ["variação 1", "variação 2"],
      "palavra_chave_principal": "string",
      "palavras_chave_secundarias": ["string", "string"],
      "intencao_busca": "informacional / transacional / comercial / navegacional",
      "entidades": ["termo 1", "termo 2"],
      "plano_links": "descrição breve de links sugeridos"
    }
  ],
  "seo_config": {
    "meta_title": "string (máximo 60 carac)",
    "meta_description": "string (máximo 155 carac)",
    "slug": "string",
    "focus_keyword": "string",
    "secondary_keywords": ["string"]
  },
  "artigo_detectado": "string contendo o texto completo do artigo caso já tenha sido redigido, ou vazio se ainda estiver em fase de planejamento",
  "checklist": {
    "seo": "avaliação ou status",
    "geo": "avaliação ou status",
    "clareza": "avaliação ou status",
    "compliance": "avaliação ou status",
    "cta": "avaliação ou status"
  }
}
Responda APENAS o JSON puro.
`

      const requestBody = {
        system_instruction: {
          parts: [{ text: 'Você é um extrator de dados estruturados em JSON para SEO e Pautas.' }],
        },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
          maxOutputTokens: 4096,
        },
      }

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      if (!res.ok) {
        const errText = await res.text()
        return new Response(JSON.stringify({ error: errText }), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const data = await res.json()
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
      let jsonParsed = {}
      try {
        jsonParsed = JSON.parse(rawText)
      } catch {
        // fallback
      }

      return new Response(JSON.stringify({ success: true, data: jsonParsed }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // -----------------------------------------------------------------
    // OTHER ACTIONS (Estúdio IA existing actions)
    // -----------------------------------------------------------------
    let prompt = ''
    let returnJson = false

    if (action === 'seo') {
      returnJson = true
      prompt = `
A usuária sugeriu o título do artigo: "${title || 'Sem título'}"
${content ? `Trecho/Resumo do conteúdo: ${content.slice(0, 1500)}` : ''}

Sua tarefa é gerar IMEDIATAMENTE a otimização SEO para este artigo de nutrição/low carb.
Responda ESTRITAMENTE em formato JSON com o seguinte schema:
{
  "meta_title": "string (máximo 60 caracteres, persuasivo, com a palavra-chave principal no início)",
  "meta_description": "string (máximo 155 caracteres, chamada clara e educativa sem promessas milagrosas)",
  "focus_keyword": "string (termo foco de 2 a 4 palavras)",
  "slug": "string (apenas letras minúsculas, números e hífens, sem acentos)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "image_alt_suggestion": "string (sugestão de texto alt para a foto de capa, máximo 125 caracteres)",
  "seo_tips": "string (uma dica rápida de palavras-chave relacionadas)"
}
`
    } else if (action === 'draft') {
      prompt = `
Crie um artigo de blog completo e rico em HTML estruturado (h2, h3, p, ul, li, blockquote) sobre o seguinte tema/briefing:
Título pretendido: ${title || 'A definir'}
Briefing do autor: ${briefing || 'Sem briefing específico'}
${driveFileName ? `Arquivo fonte do Google Drive: "${driveFileName}"` : ''}
${driveContent ? `Conteúdo extraído do arquivo do Drive:\n"""\n${driveContent.slice(0, 8000)}\n"""` : ''}
${userInstruction ? `Instrução adicional da autora: ${userInstruction}` : ''}

Estruture o artigo com:
1. Introdução acolhedora explicando o conceito e por que ele é relevante para a saúde metabólica.
2. 3 a 5 subtítulos h2/h3 bem desenvolvidos, com listas práticas (ex: como organizar a rotina, substituições inteligentes).
3. Advertência clara de segurança caso envolva temas sensíveis (hipoglicemia, medicação).
4. Conclusão prática motivadora.
5. Rodapé obrigatório com a identificação da nutricionista Adriana Araújo (CRN-9 28762).
Retorne apenas o HTML pronto para publicação. Não use marcadores markdown (\`\`\`html) no início ou fim se possível.
`
    } else if (action === 'improve') {
      prompt = `
Melhore o seguinte trecho de texto selecionado pela autora Adriana Araújo:
"""
${selectedText || content}
"""
${userInstruction ? `Instrução específica da autora: ${userInstruction}` : 'Torne o texto mais fluido, empático, cientificamente preciso e garanta conformidade ética.'}
Contexto do artigo: Título: "${title || 'Artigo Low Carb'}"

Respeite todas as regras de compliance (zero termos proibidos, sem promessas irreais). Retorne o trecho revisado pronto em formato HTML ou texto enriquecido.
`
    } else if (action === 'suggest_tags') {
      returnJson = true
      prompt = `
Com base no título: "${title || ''}" e conteúdo: "${(content || '').slice(0, 1000)}", sugira entre 4 e 7 tags relevantes em português (ex: "low-carb", "resistencia-insulinica", "jejum-intermitente", "saude-metabolica", "receitas-praticas").
Responda em formato JSON:
{
  "tags": ["tag1", "tag2", "tag3"]
}
`
    } else {
      // free_prompt
      prompt = `
Instrução da autora: ${userInstruction || 'Auxilie na redação'}
Título do artigo: ${title || ''}
Contexto atual: ${content ? content.slice(0, 2000) : 'Em branco'}
`
    }

    const candidateModels = [
      'gemini-3.7-flash',
      'gemini-2.5-flash',
      'gemini-flash-latest',
      'gemini-2.5-flash-lite',
    ]

    const requestBody: any = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROPARSE_OR_COMPLIANCE(SYSTEM_PROMPT_COMPLIANCE) }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 4096,
      },
    }

    if (returnJson) {
      requestBody.generationConfig.responseMimeType = 'application/json'
    }

    let geminiRes: Response | null = null
    let usedModelName = ''
    let finalErrorDetails = ''

    for (const modelCandidate of candidateModels) {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelCandidate}:generateContent?key=${apiKey}`
      try {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        })

        if (res.ok) {
          geminiRes = res
          usedModelName = modelCandidate
          break
        } else {
          const errText = await res.text()
          console.warn(`Modelo ${modelCandidate} retornou status ${res.status}: ${errText}`)
          finalErrorDetails = `${modelCandidate} (${res.status}): ${errText}`
        }
      } catch (fetchErr: any) {
        console.warn(`Erro de rede ao chamar modelo ${modelCandidate}:`, fetchErr)
        finalErrorDetails = `${modelCandidate} network err: ${fetchErr.message}`
      }
    }

    if (!geminiRes || !geminiRes.ok) {
      return new Response(
        JSON.stringify({ error: `Erro na API do Gemini`, details: finalErrorDetails }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const geminiData = await geminiRes.json()
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ''

    let cleanedText = rawText.trim()
    if (cleanedText.startsWith('```html')) {
      cleanedText = cleanedText.replace(/^```html\s*/i, '').replace(/\s*```$/, '')
    } else if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/i, '').replace(/\s*```$/, '')
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\w*\s*/, '').replace(/\s*```$/, '')
    }

    let parsedJson = null
    if (returnJson) {
      try {
        parsedJson = JSON.parse(cleanedText)
      } catch (parseErr) {
        console.warn('Falha ao parsear JSON do Gemini:', parseErr)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        text: cleanedText,
        json: parsedJson,
        modelUsed: geminiData.modelVersion || usedModelName,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err: any) {
    console.error('Erro no edge function gemini-assist:', err)
    return new Response(JSON.stringify({ error: err.message || String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

function SYSTEM_PROPARSE_OR_COMPLIANCE(str: string): string {
  return str
}
