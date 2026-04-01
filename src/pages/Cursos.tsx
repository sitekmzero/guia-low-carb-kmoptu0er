import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { Loader2, MonitorPlay, CheckCircle } from 'lucide-react'

export default function Cursos() {
  const [cursos, setCursos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCurso, setSelectedCurso] = useState<any>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [processing, setProcessing] = useState(false)
  const { session } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCursos = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('product_type', 'course')
        .eq('is_active', true)
      if (data) setCursos(data)
      setLoading(false)
    }
    fetchCursos()
  }, [])

  const handleEnroll = (curso: any) => {
    setSelectedCurso(curso)
  }

  const proceedToPayment = () => {
    if (!session) {
      toast({
        title: 'Atenção',
        description: 'Faça login para se inscrever.',
        variant: 'destructive',
      })
      navigate('/admin/login')
      return
    }
    setShowPayment(true)
  }

  const processPayment = async (method: string) => {
    setProcessing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const { error: pError } = await supabase.from('purchases').insert({
        user_id: session?.user.id,
        product_id: selectedCurso.id,
        amount_paid: selectedCurso.price,
        payment_method: method,
        transaction_id: `txn_${Math.random().toString(36).substr(2, 9)}`,
        status: 'completed',
      })
      if (pError) throw pError

      const { error: cError } = await supabase.from('user_courses').insert({
        user_id: session?.user.id,
        course_id: selectedCurso.id,
        access_until: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      })
      if (cError) throw cError

      await supabase.functions.invoke('send-brevo-email', {
        body: {
          email: session?.user.email,
          list_name: 'Clientes Pagos',
          automation_name: 'Confirmação de Compra',
          user_data: { course: selectedCurso.name },
        },
      })

      toast({ title: 'Sucesso!', description: 'Inscrição realizada com sucesso!' })
      setShowPayment(false)
      setSelectedCurso(null)
    } catch (err) {
      toast({ title: 'Erro', description: 'Falha no pagamento.', variant: 'destructive' })
    } finally {
      setProcessing(false)
    }
  }

  const MOCK_MODULES = [
    'Fundamentos Low-Carb',
    'Macronutrientes',
    'Planejamento de Refeições',
    'Receitas Práticas',
    'Suplementação',
    'Acompanhamento',
  ]

  return (
    <div className="container mx-auto px-4 py-16 max-w-[1000px]">
      <div className="text-center mb-16 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-primary">
          Cursos Online
        </h1>
        <p className="text-xl text-muted-foreground font-subheading">
          Aprenda nutrição low-carb com especialista
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="animate-spin w-8 h-8 text-primary" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {cursos.map((curso) => (
            <Card
              key={curso.id}
              className="flex flex-col h-full shadow-lg border-primary/10 hover:shadow-xl transition-all"
            >
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <MonitorPlay className="w-8 h-8" />
                </div>
                <CardTitle className="font-heading text-2xl">{curso.name}</CardTitle>
                <CardDescription className="text-base mt-2">{curso.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground mb-4">Instrutora: Adriana Araújo</p>
                <p className="text-3xl font-bold text-foreground">
                  R$ {curso.price?.toFixed(2).replace('.', ',')}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleEnroll(curso)}
                  className="w-full h-12 text-base font-bold rounded-full"
                >
                  Ver Detalhes e Inscrever-se
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={!!selectedCurso && !showPayment}
        onOpenChange={(open) => !open && setSelectedCurso(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading">{selectedCurso?.name}</DialogTitle>
            <DialogDescription className="text-base">
              {selectedCurso?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div>
              <h4 className="font-bold text-lg mb-4">Módulos do Curso:</h4>
              <ul className="space-y-3">
                {MOCK_MODULES.map((mod, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>
                      Módulo {i + 1}: {mod}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-muted p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Investimento</p>
                <p className="text-2xl font-bold text-primary">
                  R$ {selectedCurso?.price?.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <Button
                onClick={proceedToPayment}
                className="w-full sm:w-auto h-12 px-8 text-base font-bold"
              >
                Inscrever-se Agora
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Forma de Pagamento</DialogTitle>
            <DialogDescription>Conclua sua inscrição no curso.</DialogDescription>
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
