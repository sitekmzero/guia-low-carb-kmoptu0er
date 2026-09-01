import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import { Loader2, CheckCircle, ShieldCheck } from 'lucide-react'
import { trackEvent } from '@/services/analytics'
import { trackingService } from '@/services/trackingService'
import { getUTMParams } from '@/services/utm'
import { useSEO } from '@/services/seo'
import { ABTestVariant } from '@/components/ABTestVariant'

const formSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
})

export default function EbookGratuito() {
  const [loading, setLoading] = useState(false)

  useSEO(
    'Guia Completo Low-Carb para Iniciantes - Grátis',
    'Baixe seu e-book gratuito sobre nutrição low-carb. Receitas, dicas e guia prático.',
  )
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', phone: '' },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    try {
      const { error: dbError } = await supabase.from('leads').insert({
        name: values.name,
        email: values.email,
        phone: values.phone || null,
        lead_source: 'ebook-free',
        lead_status: 'new',
        product_type: 'E-book Grátis',
        status: 'novo',
      })

      if (dbError) throw dbError

      await supabase.functions.invoke('send-brevo-email', {
        body: {
          email: values.email,
          list_name: 'Leads GuiaLowCarb',
          automation_name: 'Boas-vindas E-book Gratuito',
          user_data: { name: values.name },
        },
      })

      trackEvent('lead_capture', {
        email: values.email,
        name: values.name,
        lead_source: 'ebook-free',
        timestamp: Date.now(),
        ...getUTMParams(),
      })

      trackingService.trackLead('ebook-free', 'nutrition')

      toast({ title: 'Sucesso!', description: 'E-book enviado para seu e-mail!' })

      setTimeout(() => {
        navigate('/obrigado-ebook')
      }, 2000)
    } catch (err) {
      console.error(err)
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao processar seu cadastro.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center bg-muted/30">
      <div className="container mx-auto px-4 py-16 max-w-[1200px] flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary leading-tight">
            Guia didático sobre dieta low-carb: emagrecimento, diabetes tipo 2 e aplicação prática
          </h1>
          <p className="text-xl text-muted-foreground mb-8 font-subheading">
            Baixe seu e-book gratuito agora
          </p>

          <div className="bg-card p-8 rounded-2xl shadow-xl border border-primary/10 relative">
            <div className="absolute top-4 right-4 text-xs text-muted-foreground">Passo 1 de 1</div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <p className="text-sm text-muted-foreground text-right mb-2">
                  * campos obrigatórios
                </p>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome *</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" className="h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Seu melhor e-mail"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <ABTestVariant
                  testName="ebook-form-fields"
                  variants={{
                    A: (
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>WhatsApp (Opcional)</FormLabel>
                            <FormControl>
                              <Input placeholder="(00) 00000-0000" className="h-11" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ),
                    B: <div className="hidden" />,
                  }}
                />
                <Button
                  type="submit"
                  disabled={loading}
                  variant="cta"
                  className="w-full h-12 mt-4 font-bold text-lg shadow-md transition-transform hover:-translate-y-0.5"
                  onClick={() =>
                    trackEvent('cta_click', {
                      cta_text: 'Receber E-book Gratuito',
                      page_path: '/ebook-gratuito',
                    })
                  }
                >
                  {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  {!loading && <CheckCircle className="mr-2 h-5 w-5" />}
                  Receber E-book Gratuito
                </Button>
              </form>
            </Form>

            <div className="mt-6 pt-4 border-t flex flex-col items-center justify-center gap-2 text-muted-foreground text-sm">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span>Seus dados estão 100% seguros.</span>
              </div>
              <p className="font-medium text-foreground">
                Mais de 5.000 pessoas já baixaram este e-book
              </p>
            </div>
          </div>
        </div>

        <div className="hidden md:block w-full md:w-1/2 animate-fade-in-up animation-delay-200">
          <img
            src="https://wfuwhozrwyqkqdovzers.supabase.co/storage/v1/object/public/Imagens/Fotos/Adriana%20consultorio.png"
            alt="Preview do E-book"
            className="rounded-2xl shadow-2xl object-cover w-full max-h-[600px]"
            loading="lazy"
            width="800"
            height="600"
          />
        </div>
      </div>
    </div>
  )
}
