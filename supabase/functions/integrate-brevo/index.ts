import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, nome, mensagem } = await req.json()
    const brevoApiKey = Deno.env.get('BREVO_API_KEY')

    if (!brevoApiKey) {
      throw new Error('BREVO_API_KEY is not configured')
    }

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Guia Low Carb', email: 'contato@guialowcarb.com.br' },
        to: [{ email: email, name: nome || 'Cliente' }],
        subject: 'Confirmação - Guia Low Carb',
        htmlContent: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; padding: 20px;">
            <h1 style="color: #1CA67D;">Olá, ${nome || ''}!</h1>
            <p style="font-size: 16px; line-height: 1.5;">${mensagem}</p>
            <br/>
            <p style="color: #777; font-size: 14px;">Abraços,<br/>Equipe Guia Low Carb</p>
          </div>
        `,
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error('Brevo API error:', errorText)
      throw new Error(`Failed to send email via Brevo`)
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
        status: 400,
      },
    )
  }
})
