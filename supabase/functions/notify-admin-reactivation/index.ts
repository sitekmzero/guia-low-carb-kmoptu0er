import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const email = body?.email
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const adminEmail = Deno.env.get('ADMIN_EMAIL')

    if (!email) {
      throw new Error('Email is required')
    }

    if (resendApiKey && adminEmail) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'alerts@resend.dev',
          to: adminEmail,
          subject: 'Nova Solicitação de Reativação de Conta',
          html: `<h2>Solicitação de Reativação</h2>
                 <p>O usuário com e-mail <strong>${email}</strong> solicitou a reativação da conta na plataforma KM Zero Seguros.</p>
                 <p>Por favor, verifique o painel administrativo para mais detalhes.</p>`,
        }),
      })

      if (!res.ok) {
        console.error('Failed to send email via Resend:', await res.text())
      }
    } else {
      console.log('RESEND_API_KEY or ADMIN_EMAIL not set. Skipping email notification.')
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
