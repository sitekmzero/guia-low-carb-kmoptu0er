import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { event_type, payload } = await req.json()
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const adminEmail = Deno.env.get('ADMIN_EMAIL')

    if (!resendApiKey || !adminEmail) {
      console.warn('Missing RESEND_API_KEY or ADMIN_EMAIL')
      return new Response(JSON.stringify({ error: 'Configuration missing' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let subject = ''
    let htmlContent = ''

    const colorGold = '#C8A24A'
    const colorNavy = '#0B1F3B'

    const baseTemplate = (title: string, body: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: ${colorNavy}; padding: 20px; text-align: center;">
          <h1 style="color: ${colorGold}; margin: 0; font-size: 24px;">KM Zero Seguros</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff; color: #333333;">
          <h2 style="color: ${colorNavy}; margin-top: 0;">${title}</h2>
          ${body}
        </div>
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          <p style="margin: 0;">Este é um e-mail automático. Por favor, não responda.</p>
        </div>
      </div>
    `

    if (event_type === 'new_signup') {
      subject = 'Novo Cadastro de Cliente'
      htmlContent = baseTemplate(
        'Novo Cadastro Realizado',
        `<p>Um novo cliente se cadastrou na plataforma e aguarda aprovação.</p>
         <ul style="list-style-type: none; padding: 0;">
           <li style="margin-bottom: 10px;"><strong>Nome:</strong> ${payload.name}</li>
           <li style="margin-bottom: 10px;"><strong>E-mail:</strong> ${payload.email}</li>
         </ul>
         <p>Acesse o painel administrativo para revisar e aprovar o cadastro.</p>`,
      )
    } else if (event_type === 'reactivation_request') {
      subject = 'Nova Solicitação de Reativação'
      htmlContent = baseTemplate(
        'Solicitação de Reativação',
        `<p>Um usuário solicitou a reativação de sua conta.</p>
         <ul style="list-style-type: none; padding: 0;">
           <li style="margin-bottom: 10px;"><strong>E-mail:</strong> ${payload.email}</li>
         </ul>
         <p>Acesse o painel administrativo para revisar e aprovar a solicitação.</p>`,
      )
    } else if (event_type === 'login_attempt_failed') {
      subject = 'ALERTA DE SEGURANÇA: Múltiplas Falhas de Login'
      htmlContent = baseTemplate(
        'Alerta de Segurança',
        `<p style="color: #dc2626; font-weight: bold;">Foram detectadas múltiplas falhas de login recentes.</p>
         <ul style="list-style-type: none; padding: 0;">
           <li style="margin-bottom: 10px;"><strong>E-mail Alvo:</strong> ${payload.email}</li>
           <li style="margin-bottom: 10px;"><strong>Tentativas Falhas:</strong> ${payload.count} nos últimos 30 minutos</li>
         </ul>
         <p>Recomendamos verificar os logs de acesso no painel administrativo.</p>`,
      )
    } else {
      throw new Error(`Unknown event_type: ${event_type}`)
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'alerts@resend.dev',
        to: adminEmail,
        subject,
        html: htmlContent,
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error('Resend error:', errorText)
      throw new Error(`Failed to send email: ${errorText}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error sending admin notification:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
