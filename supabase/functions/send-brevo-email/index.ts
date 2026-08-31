import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { email, list_name, automation_name, user_data } = await req.json()
    const brevoApiKey = Deno.env.get('BREVO_API_KEY')

    if (!brevoApiKey) {
      throw new Error('BREVO_API_KEY is not configured')
    }

    const userName = user_data?.name || user_data?.nome || 'Cliente'
    const subject = automation_name || 'Guia Low Carb - Mensagem'
    const content = user_data?.course
      ? `Parabéns pela sua inscrição no curso: <strong>${user_data.course}</strong>!`
      : user_data?.product
        ? `Seu pedido do material <strong>${user_data.product}</strong> foi confirmado!`
        : user_data?.date && user_data?.time
          ? `Sua teleconsulta foi agendada para <strong>${user_data.date}</strong> às <strong>${user_data.time}</strong>.`
          : `Obrigado pelo seu contato! O seu material já está disponível.`

    // Send via Brevo SMTP API
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Guia Low Carb', email: 'contato@guialowcarb.com.br' },
        to: [{ email, name: userName }],
        subject,
        htmlContent: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; padding: 20px;">
            <h1 style="color: #1CA67D;">Olá, ${userName}!</h1>
            <p style="font-size: 16px; line-height: 1.5;">${content}</p>
            <br/>
            <p style="color: #777; font-size: 14px;">Abraços,<br/>Equipe Guia Low Carb</p>
          </div>
        `,
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error('Brevo API error in send-brevo-email:', errorText)
      throw new Error(`Failed to send email via Brevo: ${errorText}`)
    }

    const resData = await res.json().catch(() => ({}))

    return new Response(
      JSON.stringify({
        success: true,
        message: 'E-mail enviado com sucesso via Brevo.',
        data: resData,
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
