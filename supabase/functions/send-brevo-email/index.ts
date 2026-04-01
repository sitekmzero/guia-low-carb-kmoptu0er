import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { email, list_name, automation_name, user_data } = await req.json()
    const brevoApiKey = Deno.env.get('BREVO_API_KEY') || 'mock-api-key'

    // Simulate logging the email automation
    console.log(`[BREVO API MOCK] Sending email to ${email}`)
    console.log(`[BREVO API MOCK] List: ${list_name}`)
    console.log(`[BREVO API MOCK] Automation: ${automation_name}`)
    console.log(`[BREVO API MOCK] Data:`, user_data)

    // Simulated successful response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'E-mail enviado e automação iniciada com sucesso via Brevo.',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
