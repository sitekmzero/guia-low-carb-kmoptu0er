import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { sendHotLeadAlert, sendSystemErrorAlert } from '../_shared/slack.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { lead_id, action, points } = await req.json()

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Incrementa score
    const { data: lead, error: fetchError } = await supabase
      .from('crm_leads')
      .select('id, name, lead_score, email, phone, lead_source')
      .eq('id', lead_id)
      .single()

    if (fetchError) {
      console.error('[UPDATE-LEAD-SCORE] Error fetching lead:', fetchError)
      throw fetchError
    }

    if (lead) {
      const currentScore = lead.lead_score || 0
      const newScore = currentScore + (points || 0)
      await supabase.from('crm_leads').update({ lead_score: newScore }).eq('id', lead_id)

      console.log(
        `[LEAD SCORE] Updated score for ${lead.email} from ${currentScore} to ${newScore} (action: ${action})`,
      )

      // Se atingiu o patamar de lead quente (>= 70)
      if (newScore >= 70) {
        console.log(`[ALERT] Hot lead detected! Notifying admin and Slack for ${lead.email}`)
        await sendHotLeadAlert({
          email: lead.email,
          name: lead.name,
          score: newScore,
          source: lead.lead_source,
          phone: lead.phone,
        }).catch((err) => console.error('[UPDATE-LEAD-SCORE] Slack hot lead alert failed:', err))
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[UPDATE-LEAD-SCORE] Exception:', errorMsg)

    // Alerta de erro de monitoramento para o Slack caso a atualização falhe criticamente
    await sendSystemErrorAlert({
      system_component: 'Lead Scoring Engine (update-lead-score)',
      error_message: errorMsg,
    }).catch(() => {})

    return new Response(JSON.stringify({ error: errorMsg }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
