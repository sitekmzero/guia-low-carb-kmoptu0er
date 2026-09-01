import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const url = new URL(req.url)

  // 1. GET: Inscrição / Validação do Webhook do Meta App
  if (req.method === 'GET') {
    const mode = url.searchParams.get('hub.mode')
    const challenge = url.searchParams.get('hub.challenge')
    const verifyToken = url.searchParams.get('hub.verify_token')

    console.log('[META WEBHOOK] GET verification request received:', {
      mode,
      challenge,
      verifyToken,
    })

    if (mode === 'subscribe') {
      return new Response(challenge || '', {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain',
        },
      })
    }

    return new Response('Invalid verification request', {
      status: 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain',
      },
    })
  }

  // 2. POST: Recebimento e persistência dos eventos do Meta App
  if (req.method === 'POST') {
    try {
      const payload = await req.json()
      console.log('[META WEBHOOK] POST event received:', JSON.stringify(payload))

      const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      const supabase = createClient(supabaseUrl, supabaseServiceKey)

      // Identifica o tipo do evento (ex: leadgen, messages, page, object)
      const eventType =
        payload?.entry?.[0]?.changes?.[0]?.field ||
        payload?.object ||
        payload?.entry?.[0]?.messaging?.[0]
          ? 'messaging'
          : 'meta_event'

      const { error: insertError } = await supabase.from('meta_webhook_events').insert({
        event_type: String(eventType),
        payload: payload,
        created_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error('[META WEBHOOK] Error storing event in database:', insertError)
        // Mesmo com erro de banco, retornar 200 para o Meta não desativar o webhook
        return new Response(
          JSON.stringify({ success: false, message: 'Database error', error: insertError.message }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        )
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Event received and persisted.' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    } catch (err: any) {
      console.error('[META WEBHOOK] Error processing webhook payload:', err)
      return new Response(
        JSON.stringify({
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }
  }

  return new Response('Method Not Allowed', {
    status: 405,
    headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
  })
})
