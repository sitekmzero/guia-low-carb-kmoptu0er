import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { sendReportGeneratedAlert, sendSystemErrorAlert } from '../_shared/slack.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const payload = await req.json().catch(() => ({}))
    const { report_type, report_name } = payload

    const reportIdentifier = report_type || 'geral'
    console.log(`[REPORT GENERATION] Generating ${reportIdentifier} report...`)

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Coleta métricas reais do banco para enriquecer o relatório
    let totalLeads = 0
    let totalSales = 0
    let revenue = 0

    try {
      const { count: leadsCount } = await supabase
        .from('crm_leads')
        .select('*', { count: 'exact', head: true })
      totalLeads = leadsCount || 0

      const { data: purchases } = await supabase
        .from('purchases')
        .select('amount_paid')
        .eq('status', 'completed')

      if (purchases) {
        totalSales = purchases.length
        revenue = purchases.reduce((acc, p) => acc + (Number(p.amount_paid) || 0), 0)
      }
    } catch (err) {
      console.warn('[REPORT GENERATION] Could not fetch extra metrics from DB:', err)
    }

    // Enviar alerta para o canal do Slack informando que o relatório foi gerado
    await sendReportGeneratedAlert({
      report_type: reportIdentifier,
      report_name: report_name,
      total_leads: totalLeads,
      total_sales: totalSales,
      revenue: revenue,
    }).catch((err) => console.error('[REPORT GENERATION] Slack report alert failed:', err))

    return new Response(
      JSON.stringify({
        success: true,
        message: `Report ${reportIdentifier} generated successfully.`,
        metrics: { totalLeads, totalSales, revenue },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[REPORT GENERATION] Error generating report:', errorMsg)

    await sendSystemErrorAlert({
      system_component: 'Gerador de Relatórios (generate-report)',
      error_message: errorMsg,
    }).catch(() => {})

    return new Response(JSON.stringify({ error: errorMsg }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
