import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import Stripe from 'npm:stripe@14'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripeApiKey =
      Deno.env.get('STRIPE_SECRET_KEY') ||
      Deno.env.get('STRIPE_API_KEY') ||
      Deno.env.get('STRIKE_API_KEY')

    const {
      product_id,
      product_name,
      amount,
      user_email,
      user_id,
      metadata = {},
      success_url,
      cancel_url,
    } = await req.json()

    if (!user_email) {
      return new Response(
        JSON.stringify({
          error: 'E-mail do usuário é obrigatório para iniciar o checkout.',
          requires_config: false,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    // Se o segredo de chave secreta não existir no backend
    if (!stripeApiKey || stripeApiKey.startsWith('pk_')) {
      console.warn(
        '[CREATE-STRIPE-CHECKOUT] Chave secreta do Stripe (STRIPE_SECRET_KEY / STRIPE_API_KEY / STRIKE_API_KEY) não configurada nos secrets do Supabase.',
      )
      return new Response(
        JSON.stringify({
          error:
            'A integração com Stripe está pendente de configuração da chave secreta (STRIPE_SECRET_KEY / STRIPE_API_KEY) no Supabase.',
          requires_config: true,
          configured: false,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 412, // Precondition Failed
        },
      )
    }

    const stripe = new Stripe(stripeApiKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    const unitAmountCents = Math.round((Number(amount) || 10) * 100)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user_email,
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: product_name || 'Produto Guia Low Carb',
              metadata: { product_id: product_id || '' },
            },
            unit_amount: unitAmountCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url:
        success_url ||
        `${req.headers.get('origin') || 'https://www.guialowcarb.com.br'}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:
        cancel_url ||
        `${req.headers.get('origin') || 'https://www.guialowcarb.com.br'}/cursos?payment=cancelled`,
      metadata: {
        product_id: product_id || '',
        product_name: product_name || '',
        user_id: user_id || '',
        user_email: user_email || '',
        ...metadata,
      },
    })

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (err: any) {
    console.error('[CREATE-STRIPE-CHECKOUT] Error creating checkout session:', err)
    return new Response(
      JSON.stringify({
        error: err.message || 'Erro ao comunicar com Stripe.',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
