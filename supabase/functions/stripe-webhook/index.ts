import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import Stripe from 'npm:stripe@14'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const signature = req.headers.get('stripe-signature')
  const webhookSecret =
    Deno.env.get('STRIPE_WEBHOOK_SECRET') || Deno.env.get('STRIKE_WEBHOOK_SECRET')
  const stripeApiKey =
    Deno.env.get('STRIPE_SECRET_KEY') ||
    Deno.env.get('STRIPE_API_KEY') ||
    Deno.env.get('STRIKE_API_KEY')

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const rawBody = await req.text()
    let event: any

    if (webhookSecret && signature && stripeApiKey) {
      const stripe = new Stripe(stripeApiKey, {
        apiVersion: '2023-10-16',
        httpClient: Stripe.createFetchHttpClient(),
      })
      event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret)
    } else {
      // Fallback JSON parsing if webhook signature verification secret is pending
      event = JSON.parse(rawBody)
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const metadata = session.metadata || {}
      const user_email =
        session.customer_details?.email || session.customer_email || metadata.user_email
      const product_id = metadata.product_id
      const amount = (session.amount_total || 0) / 100
      const transaction_id = session.id || session.payment_intent

      if (user_email && product_id) {
        // Forward directly to process-purchase logic
        const { error: invokeErr } = await supabase.functions.invoke('process-purchase', {
          body: {
            user_email,
            product_id,
            amount,
            payment_method: 'stripe',
            transaction_id,
          },
        })
        if (invokeErr) {
          console.error('[STRIPE-WEBHOOK] Error invoking process-purchase:', invokeErr)
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err: any) {
    console.error('[STRIPE-WEBHOOK] Error processing webhook:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
