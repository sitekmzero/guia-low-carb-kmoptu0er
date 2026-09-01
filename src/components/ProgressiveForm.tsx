import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { calculateLeadScore } from '@/services/leadScoring'
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react'

export function ProgressiveForm({ source = 'landing-page' }: { source?: string }) {
  const [stage, setStage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    interests: [] as string[],
  })

  const toggleInterest = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter((i) => i !== value)
        : [...prev.interests, value],
    }))
  }

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (stage === 1) {
        if (!formData.email) throw new Error('E-mail é obrigatório')
        await supabase
          .from('crm_leads')
          .upsert(
            { email: formData.email, lead_source: source, name: 'Pendente' },
            { onConflict: 'email' },
          )
        setStage(2)
      } else if (stage === 2) {
        if (!formData.name) throw new Error('Nome é obrigatório')
        await supabase
          .from('crm_leads')
          .update({ name: formData.name, phone: formData.phone })
          .eq('email', formData.email)
        setStage(3)
      } else if (stage === 3) {
        if (formData.interests.length === 0) throw new Error('Selecione pelo menos um interesse')
        const scoreData = calculateLeadScore({
          lead_source: source,
          product_interest: formData.interests,
          phone: formData.phone,
        })
        await supabase
          .from('crm_leads')
          .update({
            product_interest: formData.interests,
            lead_score: scoreData.leadScore,
          })
          .eq('email', formData.email)

        toast({ title: 'Sucesso!', description: 'Recebemos suas informações.' })
        setStage(4)
      }
    } catch (error: any) {
      toast({
        title: 'Aviso',
        description: error.message || 'Ocorreu um erro.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-xl shadow-sm border animate-fade-in">
      {/* Progress Indicator */}
      {stage < 4 && (
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${stage >= i ? 'bg-primary' : 'bg-muted'}`}
            />
          ))}
        </div>
      )}

      {stage === 4 ? (
        <div className="text-center py-8 space-y-4 animate-fade-in-up">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          <h3 className="text-2xl font-bold font-heading">Tudo pronto!</h3>
          <p className="text-muted-foreground">
            Obrigado pelo seu interesse. Entraremos em contato muito em breve.
          </p>
        </div>
      ) : (
        <form onSubmit={handleNext} className="space-y-4 animate-fade-in">
          {stage === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Qual o seu melhor e-mail?</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          {stage === 2 && (
            <div className="space-y-4 animate-slide-up">
              <div className="space-y-2">
                <Label htmlFor="name">Como podemos te chamar?</Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Seu WhatsApp (opcional)</Label>
                <Input
                  id="phone"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
          )}

          {stage === 3 && (
            <div className="space-y-4 animate-slide-up">
              <Label>O que mais te interessa?</Label>
              <div className="space-y-3">
                <div
                  className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => toggleInterest('emagrecimento')}
                >
                  <Checkbox id="int-1" checked={formData.interests.includes('emagrecimento')} />
                  <Label htmlFor="int-1" className="cursor-pointer font-medium">
                    Emagrecimento Saudável & Low Carb
                  </Label>
                </div>
                <div
                  className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => toggleInterest('diabetes')}
                >
                  <Checkbox id="int-2" checked={formData.interests.includes('diabetes')} />
                  <Label htmlFor="int-2" className="cursor-pointer font-medium">
                    Controle de Diabetes & Resistência Insulínica
                  </Label>
                </div>
                <div
                  className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => toggleInterest('bariatrica')}
                >
                  <Checkbox id="int-3" checked={formData.interests.includes('bariatrica')} />
                  <Label htmlFor="int-3" className="cursor-pointer font-medium">
                    Acompanhamento Bariátrico & Longevidade
                  </Label>
                </div>
              </div>
            </div>
          )}

          <Button type="submit" variant="cta" className="w-full mt-6" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {stage === 3 ? 'Finalizar' : 'Continuar'}
            {!loading && stage < 3 && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </form>
      )}
    </div>
  )
}
