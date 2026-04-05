import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { lead_id, action, points } = await req.json()

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Incrementa score
    const { data: lead } = await supabase
      .from('crm_leads')
      .select('lead_score, email')
      .eq('id', lead_id)
      .single()
    if (lead) {
      const newScore = (lead.lead_score || 0) + points
      await supabase.from('crm_leads').update({ lead_score: newScore }).eq('id', lead_id)

      console.log(`[LEAD SCORE] Updated score for ${lead.email} to ${newScore}`)

      if (newScore >= 70) {
        console.log(`[ALERT] Hot lead detected! Notifying admin.`)
      }
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
