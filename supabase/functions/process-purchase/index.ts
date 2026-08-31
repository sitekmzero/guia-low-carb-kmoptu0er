import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { sendPurchaseErrorAlert, sendSlackNotification } from '../_shared/slack.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  let requestBody: any = {}
  try {
    requestBody = await req.json()
    const { product_id, user_email, amount, payment_method, transaction_id } = requestBody

    if (!user_email || !product_id) {
      throw new Error('user_email e product_id são campos obrigatórios para processar a compra.')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1. Check if user exists or create
    const { data: users, error: userLookupError } = await supabase.auth.admin.listUsers()
    if (userLookupError) {
      console.error('[PROCESS-PURCHASE] Error looking up users:', userLookupError)
      throw userLookupError
    }

    let user = users?.users.find((u) => u.email === user_email)

    if (!user) {
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: user_email,
        password: 'TempPassword123!',
        email_confirm: true,
      })
      if (createError) {
        console.error('[PROCESS-PURCHASE] Error creating user:', createError)
        throw createError
      }
      user = newUser.user

      console.log(
        `[PROCESS-PURCHASE] Novo usuário criado. Enviando e-mail de boas-vindas para ${user_email}`,
      )
    }

    if (user) {
      // 2. Insert Purchase
      const { error: purchaseError } = await supabase.from('purchases').insert({
        user_id: user.id,
        product_id,
        amount_paid: amount,
        payment_method,
        transaction_id,
        status: 'completed',
        purchased_at: new Date().toISOString(),
      })

      if (purchaseError) {
        console.error('[PROCESS-PURCHASE] Error saving purchase record:', purchaseError)
        throw purchaseError
      }

      // Se for um curso, conceder acesso de 1 ano
      const { data: product, error: prodError } = await supabase
        .from('products')
        .select('name, category, product_type')
        .eq('id', product_id)
        .single()

      if (
        !prodError &&
        product &&
        (product.product_type === 'course' || product.category === 'curso')
      ) {
        const nextYear = new Date()
        nextYear.setFullYear(nextYear.getFullYear() + 1)
        const { error: accessError } = await supabase.from('user_courses').insert({
          user_id: user.id,
          course_id: product_id,
          access_until: nextYear.toISOString(),
        })
        if (accessError) {
          console.error('[PROCESS-PURCHASE] Error giving course access:', accessError)
          throw accessError
        }
      }

      // Notificação opcional de sucesso da compra no Slack
      await sendSlackNotification({
        text: `💰 Nova compra aprovada no Guia Low Carb!\n• *Cliente:* ${user_email}\n• *Produto:* ${product?.name || product_id}\n• *Valor:* R$ ${amount || 0}`,
      }).catch(() => {})
    }

    return new Response(JSON.stringify({ success: true, message: 'Processado com sucesso' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[PROCESS-PURCHASE] Error during purchase processing:', errorMsg)

    // Envia alerta de erro de compra para o Slack
    await sendPurchaseErrorAlert({
      user_email: requestBody?.user_email,
      product_id: requestBody?.product_id,
      amount: requestBody?.amount,
      payment_method: requestBody?.payment_method,
      transaction_id: requestBody?.transaction_id,
      error_message: errorMsg,
    }).catch((err) => console.error('[PROCESS-PURCHASE] Slack error alert failed:', err))

    return new Response(JSON.stringify({ error: errorMsg }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
