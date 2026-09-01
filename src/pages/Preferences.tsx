import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Bell, Mail, MessageSquare, Loader2 } from 'lucide-react'

export default function Preferences() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [prefs, setPrefs] = useState({
    marketing: true,
    newsletter: true,
    whatsapp: false,
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast({
        title: 'Aviso',
        description: 'Informe seu e-mail para salvar preferências.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const { supabase } = await import('@/lib/supabase/client')
      const { error } = await supabase.from('user_preferences').upsert(
        {
          email: email.trim().toLowerCase(),
          newsletter: prefs.newsletter,
          marketing: prefs.marketing,
          whatsapp: prefs.whatsapp,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' },
      )

      if (error) throw error

      toast({
        title: 'Preferências Atualizadas',
        description: 'Suas opções de comunicação foram salvas com sucesso no banco.',
      })
    } catch (err: any) {
      toast({
        title: 'Erro ao salvar',
        description: err?.message || 'Falha ao gravar preferências.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center py-16 px-4 bg-muted/10 animate-fade-in">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold font-heading text-primary">
            Preferências de Comunicação
          </h1>
          <p className="text-muted-foreground mt-2">
            Personalize como você deseja receber nossos conteúdos e ofertas.
          </p>
        </div>

        <Card className="shadow-sm">
          <form onSubmit={handleSave}>
            <CardHeader>
              <CardTitle className="text-lg">Identificação</CardTitle>
              <CardDescription>
                Para atualizar suas preferências, informe o e-mail cadastrado.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="pt-4 border-t space-y-4">
                <h3 className="font-semibold flex items-center gap-2 text-primary">
                  <Mail className="w-4 h-4" /> Canais de Contato
                </h3>

                <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                  <div className="space-y-0.5">
                    <Label className="text-base">Newsletter Semanal</Label>
                    <p className="text-sm text-muted-foreground">
                      Artigos, dicas e novidades sobre saúde.
                    </p>
                  </div>
                  <Switch
                    checked={prefs.newsletter}
                    onCheckedChange={(c) => setPrefs({ ...prefs, newsletter: c })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                  <div className="space-y-0.5">
                    <Label className="text-base">Ofertas e Promoções</Label>
                    <p className="text-sm text-muted-foreground">
                      Lançamentos de cursos e descontos exclusivos.
                    </p>
                  </div>
                  <Switch
                    checked={prefs.marketing}
                    onCheckedChange={(c) => setPrefs({ ...prefs, marketing: c })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                  <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-green-500" /> Alertas por WhatsApp
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Notificações importantes e lembretes de consultas.
                    </p>
                  </div>
                  <Switch
                    checked={prefs.whatsapp}
                    onCheckedChange={(c) => setPrefs({ ...prefs, whatsapp: c })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 pt-6">
              <Button type="submit" className="w-full bg-primary" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Salvar Preferências
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
