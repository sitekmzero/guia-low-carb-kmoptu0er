import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { phone_number, message, message_type } = await req.json()

    // Simulate logging the WhatsApp message
    console.log(`[WHATSAPP API MOCK] Sending message to ${phone_number}`)
    console.log(`[WHATSAPP API MOCK] Type: ${message_type}`)
    console.log(`[WHATSAPP API MOCK] Content: ${message}`)

    // Simulated successful response
    return new Response(
      JSON.stringify({ success: true, message: 'Mensagem WhatsApp enviada com sucesso.' }),
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
