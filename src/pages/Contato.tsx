import { useState } from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'

export default function Contato() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: 'Mensagem enviada!',
        description: 'Entraremos em contato em breve.',
        className: 'bg-primary text-primary-foreground border-none',
      })
      ;(e.target as HTMLFormElement).reset()
    }, 1000)
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
      <div className="text-center mb-16 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">Fale Conosco</h1>
        <p className="text-muted-foreground font-subheading">
          Estamos aqui para tirar suas dúvidas e ajudar no seu planejamento.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
        {/* Contact Info */}
        <div className="space-y-10 animate-fade-in-up animation-delay-100">
          <div>
            <h3 className="text-2xl font-bold mb-6">Informações de Contato</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">WhatsApp / Telefone</p>
                  <p className="text-muted-foreground text-sm">+55 (11) 99999-9999</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">E-mail</p>
                  <p className="text-muted-foreground text-sm">contato@guialowcarb.com.br</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Atendimento Presencial e Online</p>
                  <p className="text-muted-foreground text-sm">
                    Av. Paulista, 1000 - Bela Vista, São Paulo - SP
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Horário de Atendimento</p>
                  <p className="text-muted-foreground text-sm">Segunda a Sexta, das 09h às 18h</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted p-6 rounded-xl border border-border/50">
            <h4 className="font-semibold mb-2">Já é aluno?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Para suporte relacionado aos cursos ou área de membros, utilize o email específico de
              suporte ou abra um chamado na plataforma Hotmart.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-card p-8 md:p-10 rounded-2xl shadow-soft border animate-fade-in-up animation-delay-200">
          <h3 className="text-2xl font-bold mb-6">Envie uma Mensagem</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome Completo
              </label>
              <Input id="name" required placeholder="Ex: João da Silva" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                E-mail
              </label>
              <Input id="email" type="email" required placeholder="Ex: joao@email.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Assunto
              </label>
              <select
                id="subject"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="consultoria">Consultoria Nutricional</option>
                <option value="seguros">Seguros e Consórcios</option>
                <option value="duvida">Dúvida Geral</option>
                <option value="parceria">Parcerias</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Mensagem
              </label>
              <Textarea id="message" required placeholder="Como podemos ajudar?" rows={5} />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar Mensagem'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
