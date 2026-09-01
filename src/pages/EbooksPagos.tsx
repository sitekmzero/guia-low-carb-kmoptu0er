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
import { Loader2, BookOpen } from 'lucide-react'
import { trackEvent } from '@/services/analytics'
import { trackingService } from '@/services/trackingService'
import { getUTMParams } from '@/services/utm'
import { useSEO } from '@/services/seo'
import { ExitIntentPopup } from '@/components/ExitIntentPopup'

export default function EbooksPagos() {
  const [ebooks, setEbooks] = useState<any[]>([])

  useSEO(
    'E-books Premium: Nutrição Clínica e Esportiva',
    'Adquira e-books especializados sobre nutrição clínica para diabetes e nutrição esportiva.',
  )
  const [loading, setLoading] = useState(true)
  const [selectedEbook, setSelectedEbook] = useState<any>(null)
  const [processing, setProcessing] = useState(false)
  const { session } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEbooks = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('product_type', 'ebook-paid')
        .eq('is_active', true)
      if (data) setEbooks(data)
      setLoading(false)
    }
    fetchEbooks()
  }, [])

  const handleBuy = (ebook: any) => {
    if (!session) {
      toast({ title: 'Atenção', description: 'Faça login para continuar.', variant: 'destructive' })
      navigate('/admin/login')
      return
    }
    setSelectedEbook(ebook)
  }

  const processPayment = async (method: string) => {
    setProcessing(true)
    try {
      if (method === 'stripe') {
        const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
          body: {
            product_id: selectedEbook.id,
            product_name: selectedEbook.name,
            amount: selectedEbook.price,
            user_email: session?.user.email,
            user_id: session?.user.id,
            success_url: `${window.location.origin}/dashboard?payment=success&product=${encodeURIComponent(selectedEbook.name)}`,
            cancel_url: `${window.location.origin}/ebooks-pagos?payment=cancelled`,
            metadata: {
              type: 'ebook',
              ...getUTMParams(),
            },
          },
        })

        if (error || !data?.url) {
          if (data?.requires_config || error?.message?.includes('STRIPE_SECRET_KEY')) {
            toast({
              title: 'Configuração do Stripe Pendente',
              description:
                'Aguardando configuração das chaves de API do Stripe (STRIPE_SECRET_KEY) no Supabase.',
              variant: 'destructive',
            })
          } else {
            throw new Error(data?.error || error?.message || 'Falha ao iniciar checkout do Stripe')
          }
          return
        }

        trackEvent('purchase', {
          product_name: selectedEbook.name,
          product_id: selectedEbook.id,
          price: selectedEbook.price,
          currency: 'BRL',
          payment_method: 'stripe',
          user_id: session?.user.id,
          timestamp: Date.now(),
          product_type: 'ebook-paid',
          ...getUTMParams(),
        })

        trackingService.trackPurchase(selectedEbook.price, 'BRL', selectedEbook.id)

        window.location.href = data.url
        return
      }
    } catch (err: any) {
      toast({
        title: 'Erro',
        description: err?.message || 'Falha no pagamento.',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-[1200px]">
      <ExitIntentPopup />
      <div className="text-center mb-16 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-primary">
          E-books Premium
        </h1>
        <p className="text-xl text-muted-foreground font-subheading">
          Aprofunde seus conhecimentos em nutrição
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="animate-spin w-8 h-8 text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ebooks.map((ebook) => (
            <Card
              key={ebook.id}
              className="flex flex-col h-full animate-fade-in-up hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center mb-4 overflow-hidden">
                  {ebook.image_url ? (
                    <img
                      src={ebook.image_url}
                      alt={ebook.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="w-16 h-16 text-muted-foreground/50" />
                  )}
                </div>
                <CardTitle className="font-heading">{ebook.name}</CardTitle>
                <CardDescription className="line-clamp-2">{ebook.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-2xl font-bold text-primary">
                  R$ {ebook.price?.toFixed(2).replace('.', ',')}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => {
                    trackEvent('cta_click', {
                      cta_text: 'Comprar Agora',
                      page_path: '/ebooks-pagos',
                    })
                    trackingService.trackEvent('ViewContent', {
                      content_name: ebook.name,
                      content_type: 'product',
                      value: ebook.price,
                      currency: 'BRL',
                    })
                    handleBuy(ebook)
                  }}
                  variant="cta"
                  className="w-full h-11 text-base font-semibold rounded-full min-h-[44px]"
                >
                  Comprar Agora
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedEbook} onOpenChange={(open) => !open && setSelectedEbook(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escolha a forma de pagamento</DialogTitle>
            <DialogDescription>
              Você está adquirindo: <strong>{selectedEbook?.name}</strong> por R${' '}
              {selectedEbook?.price?.toFixed(2).replace('.', ',')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              disabled={processing}
              onClick={() => processPayment('stripe')}
              className="h-12 bg-[#635BFF] hover:bg-[#635BFF]/90 text-white font-semibold"
            >
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ir para Checkout Stripe
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
