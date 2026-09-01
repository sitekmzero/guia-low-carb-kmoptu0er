import { useState } from 'react'
import { MapPin, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'

import { useSEO } from '@/services/seo'

import { supabase } from '@/lib/supabase/client'

export default function Contato() {
  useSEO(
    'Contato | Guia Low Carb - Adriana Araújo',
    'Entre em contato para agendar sua consulta nutricional online ou presencial em Uberaba - MG.',
    'contato nutricionista, agendamento teleconsulta, nutricao uberaba',
    '/og-image.png',
    'https://www.guialowcarb.com.br/contato',
    'https://www.guialowcarb.com.br/contato',
  )
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    mensagem: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // 1. Salvar na tabela leads
      const { error: leadErr } = await supabase.from('leads').insert({
        name: formData.nome,
        email: formData.email,
        phone: formData.whatsapp,
        lead_source: 'formulario_contato',
        product_type: 'contato_site',
        notes: formData.mensagem,
      })

      if (leadErr) {
        console.error('Erro ao salvar lead:', leadErr)
      }

      // 2. Salvar ou atualizar no crm_leads
      await supabase.from('crm_leads').upsert(
        {
          name: formData.nome,
          email: formData.email,
          phone: formData.whatsapp,
          lead_source: 'contato_site',
          lead_status: 'new',
          lead_score: 30,
          notes: formData.mensagem,
        },
        { onConflict: 'email' },
      )

      // 3. Disparar notificação Brevo se configurada
      await supabase.functions
        .invoke('integrate-brevo', {
          body: {
            email: formData.email,
            nome: formData.nome,
            mensagem: formData.mensagem,
          },
        })
        .catch(() => {})

      toast({
        title: 'Mensagem enviada com sucesso!',
        description: 'Recebemos suas informações e entraremos em contato em breve.',
      })

      setFormData({
        nome: '',
        email: '',
        whatsapp: '',
        mensagem: '',
      })
    } catch (err: any) {
      toast({
        title: 'Erro ao enviar mensagem',
        description: err?.message || 'Tente novamente em instantes.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-[1200px]">
      <div className="text-center mb-16 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-primary">
          Fale com a Adriana
        </h1>
        <p className="text-muted-foreground font-subheading text-lg">
          Agende sua consulta ou tire suas dúvidas.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16 max-w-4xl mx-auto">
        <div className="bg-card p-8 rounded-2xl shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome</label>
              <Input
                required
                placeholder="Seu nome completo"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="bg-muted/50 border-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">E-mail</label>
              <Input
                type="email"
                required
                placeholder="Seu melhor e-mail"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-muted/50 border-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">WhatsApp</label>
              <Input
                type="tel"
                required
                placeholder="(00) 00000-0000"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="bg-muted/50 border-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mensagem</label>
              <Textarea
                required
                placeholder="Como posso te ajudar?"
                rows={4}
                value={formData.mensagem}
                onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                className="bg-muted/50 border-none"
              />
            </div>
            <Button
              type="submit"
              variant="cta"
              className="w-full rounded-full h-12 text-lg"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar Mensagem'}
            </Button>
          </form>
        </div>

        <div className="flex flex-col justify-center space-y-8">
          <div>
            <h3 className="font-heading text-2xl font-bold mb-6">Atendimento Direto</h3>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 text-foreground hover:text-primary transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                <MessageCircle size={24} />
              </div>
              <div>
                <p className="font-semibold">WhatsApp</p>
                <p className="text-muted-foreground text-sm">Clique para conversar agora</p>
              </div>
            </a>
          </div>

          <div>
            <h3 className="font-heading text-2xl font-bold mb-6">Localização</h3>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <p className="font-semibold">Uberaba – MG</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Atendimento presencial e online (teleconsulta) para todo o Brasil e exterior.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
