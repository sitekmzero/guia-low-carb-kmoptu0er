import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { password } = await req.json()
    const passStr = typeof password === 'string' ? password : ''
    const errors: string[] = []

    // Length checks
    if (passStr.length < 8) {
      errors.push('Mínimo 8 caracteres')
    }
    if (passStr.length > 12) {
      errors.push('Máximo 12 caracteres')
    }

    // Complexity checks
    if (!/[A-Z]/.test(passStr)) {
      errors.push('Falta uma letra maiúscula')
    }
    if (!/[a-z]/.test(passStr)) {
      errors.push('Falta uma letra minúscula')
    }
    if (!/[0-9]/.test(passStr)) {
      errors.push('Falta um número')
    }
    if (!/[!@#$%^&*]/.test(passStr)) {
      errors.push('Falta um caractere especial (!@#$%^&*)')
    }

    // Restrictions
    if (/\s/.test(passStr)) {
      errors.push('Não pode conter espaços')
    }
    if (/[áàâãäéèêëíìîïóòôõöúùûüçÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇ]/i.test(passStr)) {
      errors.push('Não pode conter acentos')
    }

    const isValid = errors.length === 0

    return new Response(JSON.stringify({ isValid, errors }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
