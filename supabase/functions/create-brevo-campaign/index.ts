import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const brevoApiKey = Deno.env.get('BREVO_API_KEY')

    if (!brevoApiKey) {
      throw new Error('BREVO_API_KEY is not configured')
    }

    const payload = await req.json()

    const {
      name,
      subject,
      sender,
      type,
      htmlContent,
      recipients,
      scheduledAt,
    } = payload

    if (!name || !subject || !sender || !htmlContent || !recipients) {
      return new Response(
        JSON.stringify({
          error: 'Missing required campaign parameters: name, subject, sender, htmlContent, recipients are required.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    const res = await fetch('https://api.brevo.com/v3/emailCampaigns', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        name,
        subject,
        sender,
        type: type || 'classic',
        htmlContent,
        recipients,
        ...(scheduledAt ? { scheduledAt } : {}),
      }),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      console.error('Brevo create campaign error:', data)
      return new Response(
        JSON.stringify({
          error: data?.message || 'Failed to create campaign via Brevo',
          details: data,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: res.status,
        },
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        data,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      },
    )
  } catch (error) {
    console.error('Error in create-brevo-campaign:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
