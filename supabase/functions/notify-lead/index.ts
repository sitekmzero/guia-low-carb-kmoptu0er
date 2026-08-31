import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { sendHotLeadAlert, sendSlackNotification } from '../_shared/slack.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    console.log('Notifying lead:', body)

    const score = Number(body.lead_score || body.score || 0)
    if (score >= 70) {
      await sendHotLeadAlert({
        email: body.email || 'lead@exemplo.com',
        name: body.name || body.nome,
        score: score,
        source: body.lead_source || body.origem,
        phone: body.phone || body.telefone,
      }).catch((err) => console.error('[NOTIFY-LEAD] Slack alert error:', err))
    } else {
      await sendSlackNotification({
        text: `📥 Novo lead capturado no Guia Low Carb:\n• *Nome:* ${body.name || body.nome || 'Não informado'}\n• *Email:* ${body.email || 'N/A'}\n• *Origem:* ${body.lead_source || body.origem || 'Formulário'}`,
      }).catch(() => {})
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err: any) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ success: false, error: errorMsg }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
