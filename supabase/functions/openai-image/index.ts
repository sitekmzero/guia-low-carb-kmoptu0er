import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

/**
 * Edge function openai-image
 * Generates editorial food/culinary photography adhering to brand rules.
 * NO system prompt — brand identity is prefixed directly to user prompt.
 * Only food, ingredients, dishes, culinary scenes. Never human portraits, medical consultations, or before/after.
 * Direct upload to Supabase Storage (bucket 'Imagens/blog-ia/'), returns public URL.
 * Daily rate limiter checked via ai_image_generations.
 */

const STYLE_PREFIX = `High-end editorial food photography, warm natural sunlight, authentic culinary styling, organic ingredients, fresh whole foods, rustic kitchen setting. Color palette inspired by deep emerald (#0F5132), olive green (#3D6B4F), sage green (#A8C3A0), warm cream (#FAF6EF), terracotta (#C65D3B). Strictly culinary, dishes, produce or healthy cooking setting. No human faces, no medical equipment, no weight-loss before/after imagery, no synthetic glossy filters. Aspect ratio landscape 16:9 composition.`

const DAILY_LIMIT_DEFAULT = 20

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Secret OPENAI_API_KEY não configurado no backend.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const payload = await req.json().catch(() => ({}))
    const { prompt: userPrompt, userEmail, checkOnly } = payload

    // 1. Check daily generation count
    const todayStart = new Date()
    todayStart.setUTCHours(0, 0, 0, 0)

    const { count, error: countErr } = await supabase
      .from('ai_image_generations')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', todayStart.toISOString())

    const generationsToday = count || 0

    if (checkOnly) {
      return new Response(
        JSON.stringify({
          generationsToday,
          dailyLimit: DAILY_LIMIT_DEFAULT,
          remaining: Math.max(0, DAILY_LIMIT_DEFAULT - generationsToday),
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (generationsToday >= DAILY_LIMIT_DEFAULT) {
      return new Response(
        JSON.stringify({
          error: `Limite diário atingido (${DAILY_LIMIT_DEFAULT} imagens/dia). Aguarde amanhã ou contate o administrador.`,
          generationsToday,
          dailyLimit: DAILY_LIMIT_DEFAULT,
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (!userPrompt || typeof userPrompt !== 'string' || userPrompt.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Prompt de imagem é obrigatório.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Safety checks against prohibited content
    const lowerPrompt = userPrompt.toLowerCase()
    const prohibitedKeywords = [
      'rosto',
      'pessoa',
      'consulta',
      'paciente',
      'antes e depois',
      'emagrecimento milagroso',
      'before after',
      'doctor',
      'portrait',
      'face',
    ]
    const hasForbidden = prohibitedKeywords.some((kw) => lowerPrompt.includes(kw))
    if (hasForbidden) {
      return new Response(
        JSON.stringify({
          error:
            'Política de imagem: são permitidos apenas ingredientes, pratos e cenas culinárias (proibido retratos humanos, consultas médicas ou antes/depois).',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Construct final prompt with brand prefix
    const finalPrompt = `${STYLE_PREFIX} Subject: ${userPrompt.trim()}`

    // 2. Call OpenAI Images API
    // Attempt gpt-image-2 first (per task), with fallback to dall-e-3
    let imageModel = 'gpt-image-2'
    let imageRes = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: imageModel,
        prompt: finalPrompt,
        n: 1,
        size: '1792x1024', // 16:9 standard for landscape covers
        response_format: 'b64_json',
      }),
    })

    if (!imageRes.ok) {
      const errBody = await imageRes.text()
      console.warn(
        `Tentativa com ${imageModel} falhou (${imageRes.status}): ${errBody}. Tentando dall-e-3...`,
      )

      imageModel = 'dall-e-3'
      imageRes = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: imageModel,
          prompt: finalPrompt,
          n: 1,
          size: '1792x1024',
          response_format: 'b64_json',
        }),
      })
    }

    if (!imageRes.ok) {
      const errorText = await imageRes.text()
      return new Response(
        JSON.stringify({
          error: `Erro ao gerar imagem na OpenAI (${imageRes.status})`,
          details: errorText,
        }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const imageData = await imageRes.json()
    const b64Data = imageData.data?.[0]?.b64_json
    const revisedPrompt = imageData.data?.[0]?.revised_prompt || finalPrompt

    if (!b64Data) {
      return new Response(JSON.stringify({ error: 'Nenhuma imagem retornada pela OpenAI.' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 3. Decode base64 to binary buffer and upload directly to Supabase Storage
    const binaryStr = atob(b64Data)
    const bytes = new Uint8Array(binaryStr.length)
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i)
    }

    const fileName = `ia_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.webp`
    const filePath = `blog-ia/${fileName}`

    // Upload to 'Imagens' bucket
    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from('Imagens')
      .upload(filePath, bytes, {
        contentType: 'image/webp',
        upsert: true,
      })

    if (uploadErr) {
      console.error('Erro no upload para Supabase Storage:', uploadErr)
      return new Response(
        JSON.stringify({ error: `Erro ao salvar imagem no storage: ${uploadErr.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('Imagens').getPublicUrl(filePath)

    // Suggest ALT text (max 125 chars)
    let altText = `Fotografia culinária de ${userPrompt.trim().replace(/[".]/g, '')}`
    if (altText.length > 125) {
      altText = altText.slice(0, 122) + '...'
    }

    // 4. Record generation in database
    await supabase.from('ai_image_generations').insert({
      prompt: userPrompt,
      image_url: publicUrl,
      user_email: userEmail || 'adriana.araujo@kmzero.com.br',
      metadata: {
        model: imageModel,
        filePath,
        revisedPrompt,
        altText,
      },
    })

    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: publicUrl,
        altText,
        model: imageModel,
        generationsToday: generationsToday + 1,
        dailyLimit: DAILY_LIMIT_DEFAULT,
        remaining: Math.max(0, DAILY_LIMIT_DEFAULT - (generationsToday + 1)),
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err: any) {
    console.error('Erro geral no openai-image:', err)
    return new Response(JSON.stringify({ error: err.message || String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
