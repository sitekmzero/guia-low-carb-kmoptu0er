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
        .ilike('nome', '%alimentação intuitiva%')
        .single()

      if (driveErr || !driveDoc) {
        return new Response(JSON.stringify({ error: 'Erro ao carregar driveDoc', details: driveErr }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const driveSnippet = driveDoc.texto_extraido?.slice(0, 5000) || ''

      const geminiDraftStart = Date.now()
      const geminiDraftRes = await fetch(`${supabaseUrl}/functions/v1/gemini-assist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({
          action: 'draft',
          title: '[TESTE] Alimentação Intuitiva e Low Carb: Uma Abordagem Prática',
          briefing:
            'Artigo educativo explicando como aliar alimentação intuitiva (fome, saciedade) com estilo de vida low carb sem neuroses.',
          driveFileName: driveDoc.nome,
          driveContent: driveSnippet,
          userInstruction: 'Incluir advertência de segurança para quem toma medicação e respeitar a titulação oficial de Adriana Araújo (CRN-9 28762).',
        }),
      })

      const status = geminiDraftRes.status
      const data = await geminiDraftRes.json().catch(async () => ({ raw: await geminiDraftRes.text() }))
      const durationMs = Date.now() - geminiDraftStart

      // If draft was successful, save directly to blog_posts as a test post so we have the real record in DB!
      let savedPost = null
      let postErr = null
      if (data.text) {
        const postInsert = await supabase.from('blog_posts').insert({
          title: '[TESTE] Alimentação Intuitiva e Low Carb: Uma Abordagem Prática',
          slug: 'teste-alimentacao-intuitiva-e-low-carb',
          meta_title: 'Alimentação Intuitiva e Low Carb: Sintonia e Saúde',
          meta_description: 'Entenda como a alimentação intuitiva e a prática low carb podem caminhar juntas para favorecer a saciedade e a saúde metabólica com autonomia.',
          focus_keyword: 'alimentação intuitiva low carb',
          content: data.text,
          summary: 'Artigo educativo de teste demonstrando a integração harmoniosa entre a percepção intuitiva dos sinais de fome/saciedade e o estilo de vida nutricional low carb.',
          category: 'Low Carb',
          reading_time_minutes: Math.max(1, Math.ceil(data.text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/).length / 200)),
          is_published: true,
          published_at: new Date().toISOString(),
          tags: ['alimentação intuitiva', 'estratégia low carb', 'saciedade', 'saúde metabólica'],
        }).select().single()

        savedPost = postInsert.data
        postErr = postInsert.error
      }

      return new Response(JSON.stringify({ part: 'draft', status, durationMs, data, savedPost, postErr }, null, 2), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (part === 'image') {
      const imageStart = Date.now()
      const imageRes = await fetch(`${supabaseUrl}/functions/v1/openai-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({
          prompt:
            'Prato low carb com salmão grelhado, aspargos frescos, azeite de oliva e fatias de abacate sobre mesa de madeira rústica com luz natural suave',
          userEmail: 'adriana.araujo@kmzero.com.br',
        }),
      })

      const status = imageRes.status
      const data = await imageRes.json().catch(async () => ({ raw: await imageRes.text() }))
      const durationMs = Date.now() - imageStart

      // If image succeeded, attach it to our test blog post cover image!
      if (data.imageUrl) {
        await supabase
          .from('blog_posts')
          .update({ image_url: data.imageUrl })
          .eq('slug', 'teste-alimentacao-intuitiva-e-low-carb')
      }

      return new Response(JSON.stringify({ part: 'image', status, durationMs, data }, null, 2), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Unknown part parameter. Use part=draft or part=image' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
