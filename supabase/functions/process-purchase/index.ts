import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { product_id, user_email, amount, payment_method, transaction_id } = await req.json()

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1. Check if user exists or create
    let { data: users, error: userLookupError } = await supabase.auth.admin.listUsers()
    let user = users?.users.find((u) => u.email === user_email)

    if (!user) {
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: user_email,
        password: 'TempPassword123!',
        email_confirm: true,
      })
      if (createError) throw createError
      user = newUser.user

      // Enviar email via Brevo solicitando redefinição (mock log)
      console.log(
        `[PROCESS-PURCHASE] Novo usuário criado. Enviando e-mail de boas-vindas com link de redefinição de senha para ${user_email}`,
      )
    }

    if (user) {
      // 2. Insert Purchase
      await supabase.from('purchases').insert({
        user_id: user.id,
        product_id,
        amount_paid: amount,
        payment_method,
        transaction_id,
        status: 'completed',
        purchased_at: new Date().toISOString(),
      })

      // Se for um curso, conceder acesso de 1 ano
      // Mock logic: assuming we check product type first
      const { data: product } = await supabase
        .from('products')
        .select('category')
        .eq('id', product_id)
        .single()
      if (product && product.category === 'curso') {
        const nextYear = new Date()
        nextYear.setFullYear(nextYear.getFullYear() + 1)
        await supabase.from('user_courses').insert({
          user_id: user.id,
          course_id: product_id,
          access_until: nextYear.toISOString(),
        })
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'Processado com sucesso' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
