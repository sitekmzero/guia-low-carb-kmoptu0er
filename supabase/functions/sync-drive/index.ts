import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Support GET for testing
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  const supabase = createClient(supabaseUrl, serviceKey)

  const urlObj = new URL(req.url)
  const part = urlObj.searchParams.get('part') || 'draft'

  try {
    if (part === 'draft') {
      const { data: driveDoc, error: driveErr } = await supabase
        .from('drive_arquivos')
        .select('id, nome, texto_extraido')
        .eq('id', 'd3153fa9-59c6-4968-a533-1256f24af70f')
        .single()

      if (driveErr || !driveDoc) {
        return new Response(
          JSON.stringify({ error: 'Erro ao carregar driveDoc', details: driveErr }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        )
      }

      const driveSnippet = driveDoc.texto_extraido || ''

      // 1a. Call gemini-assist for draft
      const geminiDraftStart = Date.now()
      const geminiDraftRes = await fetch(`${supabaseUrl}/functions/v1/gemini-assist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({
          action: 'draft',
          title: '[TESTE] Alimentação Intuitiva e Low Carb: Da Teoria à Prática Clínica',
          briefing:
            'Artigo educativo demonstrando a integração da escuta corporal (fome e saciedade) com a estratégia low carb sem imposição de restrições arbitrárias.',
          driveFileName: driveDoc.nome,
          driveContent: driveSnippet.slice(0, 8000),
          userInstruction:
            'Incluir advertência de segurança obrigatória para diabéticos e respeitar a titulação oficial de Adriana Araújo (CRN-9 28762).',
        }),
      })

      const draftStatus = geminiDraftRes.status
      const draftData = await geminiDraftRes
        .json()
        .catch(async () => ({ raw: await geminiDraftRes.text() }))
      const draftDurationMs = Date.now() - geminiDraftStart

      if (!draftData.text) {
        return new Response(
          JSON.stringify({
            error: 'Falha na geração do rascunho com Gemini',
            draftStatus,
            draftDurationMs,
            draftData,
          }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }

      // 1b. Call gemini-assist for SEO
      const geminiSeoStart = Date.now()
      const geminiSeoRes = await fetch(`${supabaseUrl}/functions/v1/gemini-assist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({
          action: 'seo',
          title: '[TESTE] Alimentação Intuitiva e Low Carb: Da Teoria à Prática Clínica',
          content: draftData.text.slice(0, 1500),
        }),
      })

      const seoStatus = geminiSeoRes.status
      const seoData = await geminiSeoRes
        .json()
        .catch(async () => ({ raw: await geminiSeoRes.text() }))
      const seoDurationMs = Date.now() - geminiSeoStart

      const seoJson = seoData.json || {}
      const metaTitle = seoJson.meta_title || 'Alimentação Intuitiva e Low Carb: Saúde Sem Culpa'
      const metaDesc =
        seoJson.meta_description ||
        'Descubra como conciliar alimentação intuitiva e low carb para maior saciedade e bem-estar metabólico.'
      const focusKeyword = seoJson.focus_keyword || 'alimentação intuitiva low carb'
      const generatedSlug =
        'teste-' +
        (seoJson.slug ? seoJson.slug.replace(/^teste-/, '') : 'alimentacao-intuitiva-low-carb')
      const tags =
        Array.isArray(seoJson.tags) && seoJson.tags.length > 0
          ? seoJson.tags
          : ['alimentação intuitiva', 'low carb', 'saciedade', 'metabolismo']

      // Calculate reading time: words / 200
      const plainText = draftData.text
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
      const wordCount = plainText ? plainText.split(/\s+/).length : 0
      const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))

      // Clean up previous test post with this slug if any
      await supabase.from('blog_posts').delete().eq('slug', generatedSlug)

      // Insert into public.blog_posts with EXACT schema column names
      const { data: savedPost, error: postErr } = await supabase
        .from('blog_posts')
        .insert({
          title: '[TESTE] Alimentação Intuitiva e Low Carb: Da Teoria à Prática Clínica',
          slug: generatedSlug,
          excerpt: metaDesc,
          content: draftData.text,
          category: 'Nutrição Clínica',
          tags,
          author: 'Adriana Araújo',
          published: true,
          published_date: new Date().toISOString(),
          reading_time_minutes: readingTimeMinutes,
          meta_title: metaTitle,
          meta_description: metaDesc,
          focus_keyword: focusKeyword,
          image_alt:
            seoJson.image_alt_suggestion || 'Prato saudável low carb com ingredientes frescos',
          image_is_ai: true,
          compliance_passed: true,
        })
        .select(
          'id, title, slug, published, reading_time_minutes, meta_title, meta_description, focus_keyword, tags',
        )
        .single()

      return new Response(
        JSON.stringify(
          {
            part: 'draft',
            geminiDraft: {
              status: draftStatus,
              durationMs: draftDurationMs,
              modelUsed: draftData.modelUsed,
            },
            geminiSeo: {
              status: seoStatus,
              durationMs: seoDurationMs,
              modelUsed: seoData.modelUsed,
              seoJson,
            },
            wordCount,
            readingTimeMinutes,
            savedPost,
            postErr,
          },
          null,
          2,
        ),
        {
          status: postErr ? 500 : 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    if (part === 'image') {
      const slugTarget = urlObj.searchParams.get('slug') || 'teste-alimentacao-intuitiva-low-carb'
      const imageStart = Date.now()
      const imageRes = await fetch(`${supabaseUrl}/functions/v1/openai-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({
          prompt:
            'Prato low carb com salmão grelhado, aspargos frescos salteados no azeite de oliva e fatias de abacate sobre mesa rústica de madeira em luz natural suave',
          userEmail: 'adriana.araujo@kmzero.com.br',
        }),
      })

      const status = imageRes.status
      const data = await imageRes.json().catch(async () => ({ raw: await imageRes.text() }))
      const durationMs = Date.now() - imageStart

      // If image succeeded, attach it to featured_image_url
      let updatedPost = null
      let updateErr = null
      if (data.imageUrl) {
        const updateResult = await supabase
          .from('blog_posts')
          .update({
            featured_image_url: data.imageUrl,
            image_alt: data.altText || 'Prato low carb com salmão, aspargos e abacate',
            image_is_ai: true,
          })
          .ilike('slug', 'teste-%')
          .select('id, title, slug, featured_image_url, image_alt, image_is_ai')

        updatedPost = updateResult.data
        updateErr = updateResult.error
      }

      return new Response(
        JSON.stringify(
          { part: 'image', status, durationMs, data, updatedPost, updateErr },
          null,
          2,
        ),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    return new Response(
      JSON.stringify({ error: 'Unknown part parameter. Use part=draft or part=image' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
