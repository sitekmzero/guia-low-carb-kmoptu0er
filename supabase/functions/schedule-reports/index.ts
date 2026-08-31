import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { sendReportGeneratedAlert, sendSystemErrorAlert } from '../_shared/slack.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('[CRON] Checking scheduled reports...')

    // Fetch reports scheduled for today
    const { data: reports, error } = await supabase
      .from('reports')
      .select('*')
      .eq('status', 'active')
      .lte('next_scheduled', new Date().toISOString())

    if (error) {
      console.warn('[CRON] Error querying reports table:', error)
    }

    if (reports && reports.length > 0) {
      for (const report of reports) {
        console.log(`[CRON] Triggering generation for report ${report.report_name}`)
        // Invoke generate-report edge function
        await supabase.functions.invoke('generate-report', {
          body: { report_type: report.report_type, report_name: report.report_name },
        })

        // Update next_scheduled logic
        const nextDate = new Date()
        nextDate.setDate(nextDate.getDate() + 1)

        await supabase
          .from('reports')
          .update({
            last_generated: new Date().toISOString(),
            next_scheduled: nextDate.toISOString(),
          })
          .eq('id', report.id)
      }
    } else {
      console.log('[CRON] No scheduled reports due at this moment.')
    }

    return new Response(JSON.stringify({ success: true, count: reports?.length || 0 }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[CRON-REPORTS] Error in schedule-reports:', errorMsg)

    await sendSystemErrorAlert({
      system_component: 'Agendador de Relatórios (schedule-reports)',
      error_message: errorMsg,
    }).catch(() => {})

    return new Response(JSON.stringify({ error: errorMsg }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
