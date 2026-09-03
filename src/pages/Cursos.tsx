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
import { trackEvent } from '@/services/analytics'
import { trackingService } from '@/services/trackingService'
import { getUTMParams } from '@/services/utm'
import { useSEO } from '@/services/seo'
import { SocialProof } from '@/components/SocialProof'

export default function Cursos() {
  const [cursos, setCursos] = useState<any[]>([])

  useSEO(
    'Cursos Online: Nutrição Low-Carb Completo',
    'Aprenda nutrição low-carb com embasamento científico. Cursos online com certificado.',
  )
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
      if (method === 'stripe') {
        const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
          body: {
            product_id: selectedCurso.id,
            product_name: selectedCurso.name,
            amount: selectedCurso.price,
            user_email: session?.user.email,
            user_id: session?.user.id,
            success_url: `${window.location.origin}/dashboard?payment=success&product=${encodeURIComponent(selectedCurso.name)}`,
            cancel_url: `${window.location.origin}/cursos?payment=cancelled`,
            metadata: {
              type: 'course',
              ...getUTMParams(),
            },
          },
        })

        if (error || !data?.url) {
          if (data?.requires_config || error?.message?.includes('STRIPE_SECRET_KEY')) {
            toast({
              title: 'Configuração do Stripe Pendente',
              description:
                'Aguardando configuração das chaves de API do Stripe (STRIPE_SECRET_KEY) no painel do Supabase.',
              variant: 'destructive',
            })
          } else {
            throw new Error(data?.error || error?.message || 'Falha ao iniciar checkout do Stripe')
          }
          return
        }

        trackEvent('course_enrolled', {
          course_name: selectedCurso.name,
          course_id: selectedCurso.id,
          price: selectedCurso.price,
          user_id: session?.user.id,
          timestamp: Date.now(),
          ...getUTMParams(),
        })

        trackingService.trackCourseEnrolled(selectedCurso.name, selectedCurso.price)

        window.location.href = data.url
        return
      }

      toast({
        title: 'Método não disponível',
        description: 'O método de pagamento padrão é Stripe. Conclua pelo Stripe.',
      })
    } catch (err: any) {
      toast({
        title: 'Erro no Pagamento',
        description: err?.message || 'Falha ao processar pagamento.',
        variant: 'destructive',
      })
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
          Aprenda nutrição low-carb com fundamentação científica
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
                  onClick={() => {
                    trackEvent('cta_click', {
                      cta_text: 'Ver Detalhes e Inscrever-se',
                      page_path: '/cursos',
                    })
                    handleEnroll(curso)
                  }}
                  variant="cta"
                  className="w-full h-12 text-base font-bold rounded-full min-h-[44px]"
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
                variant="cta"
                className="w-full sm:w-auto h-12 px-8 text-base font-bold"
              >
                Inscrever-se Agora
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-24 max-w-4xl mx-auto">
        <h2 className="text-3xl font-heading font-bold text-center mb-8 text-primary">
          O que nossos alunos dizem
        </h2>
        <SocialProof />
      </div>

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
              className="h-12 bg-[#635BFF] hover:bg-[#635BFF]/90 text-white font-semibold"
            >
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Ir para Checkout
              Stripe
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
