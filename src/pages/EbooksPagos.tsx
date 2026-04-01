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

export default function EbooksPagos() {
  const [ebooks, setEbooks] = useState<any[]>([])
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
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const { error } = await supabase.from('purchases').insert({
        user_id: session?.user.id,
        product_id: selectedEbook.id,
        amount_paid: selectedEbook.price,
        payment_method: method,
        transaction_id: `txn_${Math.random().toString(36).substr(2, 9)}`,
        status: 'completed',
      })
      if (error) throw error

      await supabase.functions.invoke('send-brevo-email', {
        body: {
          email: session?.user.email,
          list_name: 'Clientes Pagos',
          automation_name: 'Confirmação de Compra',
          user_data: { product: selectedEbook.name },
        },
      })

      toast({ title: 'Sucesso!', description: 'Compra realizada. Verifique seu e-mail.' })
      setSelectedEbook(null)
    } catch (err) {
      toast({ title: 'Erro', description: 'Falha no pagamento.', variant: 'destructive' })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-[1200px]">
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
                  onClick={() => handleBuy(ebook)}
                  className="w-full h-11 text-base font-semibold rounded-full"
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
              className="h-12 bg-[#635BFF] hover:bg-[#635BFF]/90"
            >
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Pagar com Stripe
            </Button>
            <Button
              disabled={processing}
              onClick={() => processPayment('mercado_pago')}
              className="h-12 bg-[#009EE3] hover:bg-[#009EE3]/90 text-white"
            >
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Pagar com Mercado Pago
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
