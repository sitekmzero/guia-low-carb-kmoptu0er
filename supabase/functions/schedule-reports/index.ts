import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

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

    if (error) throw error

    if (reports && reports.length > 0) {
      for (const report of reports) {
        console.log(`[CRON] Triggering generation for report ${report.report_name}`)
        // Invoke generate-report edge function
        await supabase.functions.invoke('generate-report', {
          body: { report_type: report.report_type },
        })

        // Update next_scheduled logic (mock updating to tomorrow)
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
      console.log('[CRON] No reports scheduled for now.')
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
