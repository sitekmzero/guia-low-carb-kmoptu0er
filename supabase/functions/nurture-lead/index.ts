import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { sendHotLeadAlert, sendSystemErrorAlert } from '../_shared/slack.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const payload = await req.json()
    const { record } = payload // Webhook payload for insert/update on crm_leads

    if (!record) throw new Error('Missing record data')

    const score = Number(record.lead_score || 0)
    console.log(`[NURTURE] Processing lead: ${record.email} with score ${score}`)

    // Example logic based on score
    if (score >= 70) {
      console.log(
        `[NURTURE] Triggering HOT LEAD sequence and Slack notification for ${record.email}`,
      )
      await sendHotLeadAlert({
        email: record.email,
        name: record.name,
        score: score,
        source: record.lead_source,
        phone: record.phone,
      }).catch((err) => console.error('[NURTURE-LEAD] Slack hot lead alert failed:', err))
    } else if (score >= 40) {
      console.log(`[NURTURE] Triggering WARM LEAD sequence for ${record.email}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[NURTURE-LEAD] Error:', errorMsg)

    await sendSystemErrorAlert({
      system_component: 'Lead Nurturing Workflow (nurture-lead)',
      error_message: errorMsg,
    }).catch(() => {})

    return new Response(JSON.stringify({ error: errorMsg }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
