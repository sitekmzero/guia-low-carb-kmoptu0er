import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { sendSystemErrorAlert, sendSlackNotification } from '../_shared/slack.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const adminEmail = Deno.env.get('ADMIN_EMAIL')

    const supabase = createClient(supabaseUrl, supabaseKey)

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    const { count, error } = await supabase
      .from('conversion_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'iframe_error')
      .gte('timestamp', oneHourAgo)

    if (error) {
      console.error('Supabase query error:', error)
      throw error
    }

    const errorCount = count || 0
    console.log(`Found ${errorCount} iframe errors in the last hour`)

    if (errorCount > 5) {
      console.log('High error rate detected. Sending alerts...')

      // Email Alert via Resend
      if (resendApiKey && adminEmail) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'alerts@resend.dev',
            to: adminEmail,
            subject: 'ALERTA URGENTE: Alta Taxa de Falhas no Sistema',
            html: `<h2>Alerta: Instabilidade Detectada</h2>
                   <p>O sistema registrou um pico anormal de erros nas últimas horas.</p>
                   <p>Foram detectados <strong>${errorCount}</strong> erros recentes.</p>
                   <p>Por favor, verifique o painel administrativo para mais detalhes.</p>`,
          }),
        }).catch((err) => console.error('Email alert failed', err))
      }

      // Slack Alert via helper
      await sendSystemErrorAlert({
        system_component: 'Monitoramento de Erros / Iframe / Cotações',
        error_message: `Alta taxa de erros detectada: ${errorCount} falhas registradas na última hora.`,
        count: errorCount,
      }).catch((err) => console.error('Slack alert failed:', err))
    }

    return new Response(JSON.stringify({ success: true, count: errorCount }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('Edge function error in monitor-quotation-errors:', errorMsg)

    await sendSystemErrorAlert({
      system_component: 'monitor-quotation-errors',
      error_message: errorMsg,
    }).catch(() => {})

    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
