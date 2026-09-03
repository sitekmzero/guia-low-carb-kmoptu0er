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

8. NOTA DE RODAPÉ OBRIGATÓRIA (ART. 55):
   - Todo artigo gerado ou concluído deve terminar com a seguinte nota padronizada:
   <div class="not-prose mt-12 p-6 rounded-2xl bg-muted/40 border border-primary/20 shadow-sm text-sm space-y-2 text-foreground/80">
     <p class="font-semibold text-primary">Nota de Esclarecimento e Responsabilidade Técnica</p>
     <p class="leading-relaxed">Este conteúdo tem caráter estritamente educativo e informativo, não configurando diagnóstico, prescrição dietética individualizada ou recomendação terapêutica específica. Para adequação de conduta, consulte sempre um nutricionista habilitado.</p>
     <p class="text-xs text-muted-foreground pt-1 border-t border-border/50">Responsável Técnica: <strong>Adriana Araújo</strong> • Nutricionista Clínica • <strong>CRN-9 28762</strong>.</p>
   </div>
`

interface GeminiRequestPayload {
  action: 'draft' | 'improve' | 'seo' | 'suggest_tags' | 'free_prompt'
  title?: string
  content?: string
  selectedText?: string
  briefing?: string
  driveContent?: string
  driveFileName?: string
  userInstruction?: string
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
    } = payload

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

    // Call Gemini 3.7 Flash API (or 2.5/flash fallback if 3.7 alias needs specific version)
    // The task specifically calls for: "gemini-3.7-flash"
    const model = 'gemini-2.5-flash' // Note: fallback or 3.7-flash
    const requestedModel = 'gemini-3.7-flash'

    let apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${requestedModel}:generateContent?key=${apiKey}`

    const requestBody: any = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT_COMPLIANCE }],
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

    let geminiRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    })

    // If gemini-3.7-flash is not available on this API key's tier, fallback to gemini-2.5-flash, gemini-2.0-flash, or gemini-1.5-flash
    let usedModelName = requestedModel
    let finalErrorDetails = ''

    if (!geminiRes.ok) {
      const errText = await geminiRes.text()
      console.warn(
        `Tentativa com ${requestedModel} falhou (${geminiRes.status}): ${errText}. Tentando fallback...`,
      )
      finalErrorDetails = errText

      const fallbacks = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']
      for (const fallbackModel of fallbacks) {
        const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/${fallbackModel}:generateContent?key=${apiKey}`
        const fbRes = await fetch(fallbackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        })
        if (fbRes.ok) {
          geminiRes = fbRes
          usedModelName = fallbackModel
          break
        } else {
          const fErr = await fbRes.text()
          console.warn(`Fallback ${fallbackModel} falhou (${fbRes.status}): ${fErr}`)
          finalErrorDetails = fErr
        }
      }
    }

    if (!geminiRes.ok) {
      return new Response(
        JSON.stringify({ error: `Erro na API do Gemini: ${geminiRes.status}`, details: finalErrorDetails }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const geminiData = await geminiRes.json()
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ''

    let cleanedText = rawText.trim()
    // Strip markdown code fences if wrapped
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
