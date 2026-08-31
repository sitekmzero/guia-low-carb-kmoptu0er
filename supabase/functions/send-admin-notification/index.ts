import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { sendSystemErrorAlert, sendSlackNotification } from '../_shared/slack.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { event_type, payload } = await req.json()
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const adminEmail = Deno.env.get('ADMIN_EMAIL')

    let subject = ''
    let htmlContent = ''

    const colorGreen = '#1CA67D'
    const colorDark = '#1F2937'

    const baseTemplate = (title: string, body: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: ${colorDark}; padding: 20px; text-align: center;">
          <h1 style="color: ${colorGreen}; margin: 0; font-size: 24px;">Guia Low Carb</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff; color: #333333;">
          <h2 style="color: ${colorDark}; margin-top: 0;">${title}</h2>
          ${body}
        </div>
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          <p style="margin: 0;">Este é um e-mail automático do Guia Low Carb. Por favor, não responda.</p>
        </div>
      </div>
    `

    if (event_type === 'new_signup') {
      subject = 'Novo Cadastro na Plataforma'
      htmlContent = baseTemplate(
        'Novo Cadastro Realizado',
        `<p>Um novo usuário se cadastrou na plataforma Guia Low Carb.</p>
         <ul style="list-style-type: none; padding: 0;">
           <li style="margin-bottom: 10px;"><strong>Nome:</strong> ${payload.name || 'N/A'}</li>
           <li style="margin-bottom: 10px;"><strong>E-mail:</strong> ${payload.email}</li>
         </ul>
         <p>Acesse o painel administrativo para acompanhar.</p>`,
      )

      await sendSlackNotification({
        text: `👤 Novo Cadastro no Guia Low Carb:\n• *Nome:* ${payload.name || 'Não informado'}\n• *Email:* ${payload.email}`,
      }).catch(() => {})
    } else if (event_type === 'reactivation_request') {
      subject = 'Nova Solicitação de Reativação'
      htmlContent = baseTemplate(
        'Solicitação de Reativação',
        `<p>Um usuário solicitou a reativação de sua conta.</p>
         <ul style="list-style-type: none; padding: 0;">
           <li style="margin-bottom: 10px;"><strong>E-mail:</strong> ${payload.email}</li>
         </ul>
         <p>Acesse o painel administrativo para revisar a solicitação.</p>`,
      )

      await sendSlackNotification({
        text: `🔄 Solicitação de Reativação de Conta:\n• *Email:* ${payload.email}`,
      }).catch(() => {})
    } else if (event_type === 'login_attempt_failed' || event_type === 'system_error') {
      subject = 'ALERTA DE SEGURANÇA: Múltiplas Falhas de Login / Erro do Sistema'
      htmlContent = baseTemplate(
        'Alerta de Segurança & Monitoramento',
        `<p style="color: #dc2626; font-weight: bold;">Foram detectadas múltiplas falhas de login ou alertas de monitoramento.</p>
         <ul style="list-style-type: none; padding: 0;">
           <li style="margin-bottom: 10px;"><strong>Alvo/Componente:</strong> ${payload.email || payload.component || 'Sistema'}</li>
           <li style="margin-bottom: 10px;"><strong>Detalhes:</strong> ${payload.count ? `${payload.count} tentativas recentes` : payload.details || 'Falha de login recorrente'}</li>
         </ul>
         <p>Recomendamos verificar os logs de acesso no painel administrativo.</p>`,
      )

      await sendSystemErrorAlert({
        system_component: 'Autenticação / Segurança',
        error_message: `Múltiplas tentativas falhas de login para o usuário: ${payload.email || 'Desconhecido'} (${payload.count || 'recorrente'} tentativas)`,
      }).catch(() => {})
    } else {
      // Evento genérico ou desconhecido
      console.log(`[SEND-ADMIN-NOTIFICATION] Generic event received: ${event_type}`)
    }

    // Se houver configuração de email Resend, envia email também
    if (resendApiKey && adminEmail && subject && htmlContent) {
      await fetch('https://api.resend.com/emails', {
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
      }).catch((err) => console.error('Resend error:', err))
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
