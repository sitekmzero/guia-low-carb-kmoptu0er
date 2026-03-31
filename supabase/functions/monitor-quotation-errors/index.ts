import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const adminEmail = Deno.env.get('ADMIN_EMAIL')
    const slackWebhookUrl = Deno.env.get('SLACK_WEBHOOK_URL')

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

      // Email Alert
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
            subject: 'URGENT: High Quotation Failure Rate',
            html: `<h2>Alert: Quotation Service Instability</h2>
                   <p>The quotation service is experiencing high failure rates.</p>
                   <p>There have been <strong>${errorCount}</strong> iframe load errors in the last hour.</p>
                   <p>Please check the admin dashboard for more details.</p>`,
          }),
        }).catch((err) => console.error('Email alert failed', err))
      }

      // Slack Alert
      if (slackWebhookUrl) {
        await fetch(slackWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 *URGENT: High Quotation Failure Rate* 🚨\n\nThe quotation service is experiencing high failure rates.\nThere have been *${errorCount}* iframe load errors in the last hour.\n\n<https://km-zero-homepage-c0c96.goskip.app/admin/dashboard|Check the Admin Dashboard>`,
          }),
        }).catch((err) => console.error('Slack alert failed', err))
      }
    }

    return new Response(JSON.stringify({ success: true, count: errorCount }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
