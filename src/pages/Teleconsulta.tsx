import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format, isWeekend, isBefore, startOfToday } from 'date-fns'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  type: z.string().min(1, 'Selecione um tipo'),
  date: z.date({ required_error: 'Selecione uma data' }),
  time: z.string().min(1, 'Selecione um horário'),
  notes: z.string().optional(),
})

const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']

export default function Teleconsulta() {
  const [processing, setProcessing] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const { session } = useAuth()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { notes: '' },
  })

  const onSubmit = async () => {
    if (!session) {
      toast({ title: 'Atenção', description: 'Faça login para agendar.', variant: 'destructive' })
      navigate('/admin/login')
      return
    }
    setShowPayment(true)
  }

  const processPayment = async (method: string) => {
    setProcessing(true)
    try {
      const values = form.getValues()
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const { error: consError } = await supabase.from('consultations').insert({
        user_id: session?.user.id,
        consultation_type: values.type,
        scheduled_date: values.date.toISOString(),
        scheduled_time: values.time,
        status: 'confirmed',
        notes: values.notes,
        zoom_link: 'https://zoom.us/j/mock_link',
      })
      if (consError) throw consError

      await supabase.functions.invoke('send-brevo-email', {
        body: {
          email: session?.user.email,
          list_name: 'Clientes Pagos',
          automation_name: 'Confirmação de Consulta',
          user_data: { date: format(values.date, 'dd/MM/yyyy'), time: values.time },
        },
      })

      toast({ title: 'Sucesso!', description: 'Consulta agendada com sucesso!' })
      setShowPayment(false)
      form.reset()
    } catch (err) {
      toast({ title: 'Erro', description: 'Falha no agendamento.', variant: 'destructive' })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-[1200px]">
      <div className="text-center mb-16 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-primary">
          Teleconsulta com Adriana Araújo
        </h1>
        <p className="text-xl text-muted-foreground font-subheading">
          Consultoria nutricional personalizada
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-6 animate-fade-in-up flex flex-col h-full">
          <div className="bg-card p-6 rounded-2xl border shadow-soft flex-1">
            <h3 className="text-2xl font-bold text-primary mb-2">Nutrição</h3>
            <p className="text-muted-foreground mb-4">
              Plano alimentar completo focado em resultados reais e duradouros.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => form.setValue('type', 'nutrition')}
            >
              Selecionar (R$ 150)
            </Button>
          </div>
          <div className="bg-card p-6 rounded-2xl border shadow-soft flex-1">
            <h3 className="text-2xl font-bold text-primary mb-2">Proteção</h3>
            <p className="text-muted-foreground mb-4">
              Consultoria especializada para proteção familiar e seguros de vida.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => form.setValue('type', 'protection')}
            >
              Selecionar (R$ 150)
            </Button>
          </div>
          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 shadow-soft flex-1">
            <h3 className="text-2xl font-bold text-primary mb-2">Bundle Saúde+Proteção</h3>
            <p className="text-muted-foreground mb-4">
              Análise 360º da sua saúde física e proteção financeira. O melhor valor.
            </p>
            <Button className="w-full" onClick={() => form.setValue('type', 'bundle')}>
              Selecionar (R$ 250)
            </Button>
          </div>
        </div>

        <div className="bg-card p-8 rounded-2xl border shadow-xl animate-fade-in-up animation-delay-200">
          <h3 className="text-2xl font-heading font-bold mb-6">Agende seu horário</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Consulta</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="nutrition">Nutrição</SelectItem>
                        <SelectItem value="protection">Proteção</SelectItem>
                        <SelectItem value="bundle">Bundle Saúde+Proteção</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data</FormLabel>
                      <div className="border rounded-md p-2 bg-background flex justify-center">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => isBefore(date, startOfToday()) || isWeekend(date)}
                          className="rounded-md"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 mt-1">
                            <SelectValue placeholder="Selecione o horário" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TIME_SLOTS.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva brevemente o motivo da consulta..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-12 text-base font-bold">
                Agendar e Pagar
              </Button>
            </form>
          </Form>
        </div>
      </div>

      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pagamento da Consulta</DialogTitle>
            <DialogDescription>
              Selecione o método de pagamento para confirmar seu agendamento.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              disabled={processing}
              onClick={() => processPayment('stripe')}
              className="h-12 bg-[#635BFF] hover:bg-[#635BFF]/90"
            >
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Pagar com Stripe
            </Button>
            <Button
              disabled={processing}
              onClick={() => processPayment('mercado_pago')}
              className="h-12 bg-[#009EE3] hover:bg-[#009EE3]/90 text-white"
            >
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Pagar com Mercado
              Pago
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
