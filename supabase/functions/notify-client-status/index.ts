import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, action } = await req.json()
    const resendApiKey = Deno.env.get('RESEND_API_KEY')

    if (!email || !action) {
      throw new Error('Email and action are required')
    }

    if (resendApiKey) {
      let subject = ''
      let html = ''

      switch (action) {
        case 'approve_new':
          subject = 'Sua conta KM Zero foi aprovada!'
          html = `<h2>Bem-vindo(a) à KM Zero Seguros</h2>
                  <p>Sua conta foi aprovada com sucesso. Você já pode acessar a Área do Cliente em nossa plataforma.</p>
                  <br>
                  <p>Atenciosamente,</p>
                  <p><strong>Equipe KM Zero Seguros</strong></p>`
          break
        case 'reject_new':
          subject = 'Atualização sobre seu cadastro na KM Zero'
          html = `<h2>Status do Cadastro</h2>
                  <p>Agradecemos seu interesse, mas infelizmente não pudemos aprovar seu cadastro no momento.</p>
                  <br>
                  <p>Atenciosamente,</p>
                  <p><strong>Equipe KM Zero Seguros</strong></p>`
          break
        case 'approve_reactivation':
          subject = 'Sua conta KM Zero foi reativada!'
          html = `<h2>Conta Reativada</h2>
                  <p>Sua solicitação foi aprovada e seu acesso à Área do Cliente foi restabelecido.</p>
                  <br>
                  <p>Atenciosamente,</p>
                  <p><strong>Equipe KM Zero Seguros</strong></p>`
          break
        case 'reject_reactivation':
          subject = 'Atualização sobre sua solicitação de reativação'
          html = `<h2>Status da Reativação</h2>
                  <p>Após análise, sua solicitação de reativação não pôde ser aprovada neste momento.</p>
                  <br>
                  <p>Atenciosamente,</p>
                  <p><strong>Equipe KM Zero Seguros</strong></p>`
          break
        default:
          throw new Error('Invalid action')
      }

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'contato@resend.dev',
          to: email,
          subject,
          html,
        }),
      })

      if (!res.ok) {
        console.error('Failed to send email via Resend:', await res.text())
      }
    } else {
      console.log('RESEND_API_KEY not set. Skipping email notification.')
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
