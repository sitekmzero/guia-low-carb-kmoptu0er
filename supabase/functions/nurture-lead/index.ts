import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const payload = await req.json()
    const { record } = payload // Webhook payload for insert/update on crm_leads

    if (!record) throw new Error('Missing record data')

    console.log(`[NURTURE] Processing lead: ${record.email} with score ${record.lead_score}`)

    // Example logic based on score
    if (record.lead_score >= 70) {
      console.log(`[NURTURE] Triggering HOT LEAD sequence for ${record.email}`)
      // Em uma aplicação real, faria a chamada para a Brevo para colocar na lista Hot
    } else if (record.lead_score >= 40) {
      console.log(`[NURTURE] Triggering WARM LEAD sequence for ${record.email}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
