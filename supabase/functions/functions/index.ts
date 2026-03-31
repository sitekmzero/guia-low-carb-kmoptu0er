import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

Deno.serve(async () => {
  return new Response(JSON.stringify({ message: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  })
})
