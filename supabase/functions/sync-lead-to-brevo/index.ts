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
    const { leadData } = await req.json()
    const brevoApiKey = Deno.env.get('BREVO_API_KEY')

    if (!brevoApiKey) {
      throw new Error('BREVO_API_KEY is not configured')
    }

    // Call Brevo API to create/update contact
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: leadData.email,
        attributes: {
          NOME: leadData.name,
          SCORE: leadData.lead_score,
          ORIGEM: leadData.lead_source,
        },
        updateEnabled: true,
      }),
    })

    if (!res.ok) {
      console.warn('Brevo API response:', await res.text())
    }

    return new Response(JSON.stringify({ success: true, message: 'Lead synced successfully' }), {
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
