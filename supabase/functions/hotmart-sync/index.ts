import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()

    // Simplification of Hotmart Webhook processing
    const { product, buyer_email, status, amount } = payload

    if (!product || !buyer_email) {
      return new Response(
        JSON.stringify({ message: 'Invalid payload, expecting product and buyer_email' }),
        { headers: corsHeaders, status: 400 },
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Insert into vendas table
    const { error: dbError } = await supabase.from('vendas').insert({
      product_name: product,
      buyer_email: buyer_email,
      status: status || 'pendente',
      amount: amount || 0,
    })

    if (dbError) {
      console.error('DB Insert Error', dbError)
      throw dbError
    }

    // If paid, trigger automated email via Brevo API
    if (status === 'pago') {
      const brevoApiKey = Deno.env.get('BREVO_API_KEY')
      if (brevoApiKey) {
        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'api-key': brevoApiKey,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            sender: { name: 'Guia Low Carb', email: 'contato@guialowcarb.com.br' },
            to: [{ email: buyer_email }],
            subject: 'Acesso Liberado: Seu E-book Low Carb Avançado',
            htmlContent: `
                <div style="font-family: sans-serif; padding: 20px;">
                  <h2 style="color: #1CA67D;">Seu pagamento foi confirmado!</h2>
                  <p>Acesse o Dashboard da plataforma para realizar o download do seu material premium.</p>
                </div>
              `,
          }),
        }).catch((e) => console.error('Brevo sending failed in Hotmart Sync:', e))
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Hotmart Sync Error', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
