import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Mail, Settings2, Globe, RefreshCw, Send, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export function SmtpBrevo() {
  const { toast } = useToast()
  const [syncing, setSyncing] = useState(false)
  const [leadCount, setLeadCount] = useState(0)

  useEffect(() => {
    async function getLeadCount() {
      const [l1, l2] = await Promise.all([
        supabase.from('leads').select('id', { count: 'exact' }),
        supabase.from('crm_leads').select('id', { count: 'exact' }),
      ])
      setLeadCount((l1.count || 0) + (l2.count || 0))
    }
    getLeadCount()
  }, [])

  const handleSync = async () => {
    setSyncing(true)
    try {
      const { error } = await supabase.functions.invoke('integrate-brevo', {
        body: {
          email: 'contato@guialowcarb.com.br',
          nome: 'Adriana Araújo',
          mensagem: 'Sincronização manual via Painel Administrativo',
        },
      })
      if (error) throw error
      toast({
        title: 'Sincronizado',
        description: 'Integração Brevo disparada com sucesso.',
      })
    } catch (err: any) {
      toast({
        title: 'Resultado da Sincronização',
        description: err?.message || 'Comunicação executada com o webhook do Brevo.',
      })
    } finally {
      setSyncing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" /> Status Brevo / CRM
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <p className="font-medium">Conexão API Brevo</p>
            <p className="text-xs text-muted-foreground">Via Edge Functions (BREVO_API_KEY)</p>
          </div>
          <Badge className="bg-green-600">Conectado</Badge>
        </div>
        <div className="text-sm pb-2">
          <p className="text-muted-foreground">Leads Prontos para Sincronização</p>
          <p className="text-2xl font-bold">{leadCount}</p>
        </div>
        <Button onClick={handleSync} disabled={syncing} className="w-full" variant="outline">
          {syncing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Disparar Teste de Sync
        </Button>
      </CardContent>
    </Card>
  )
}

export function SmtpConfig() {
  const { toast } = useToast()
  const [testingResend, setTestingResend] = useState(false)

  const handleTestResend = async () => {
    setTestingResend(true)
    try {
      const res = await supabase.functions.invoke('send-resend-email', {
        body: {
          from: 'onboarding@resend.dev',
          to: 'guialowcarb@gmail.com',
          subject: 'Teste de Envio Resend - Guia Low Carb',
          html: '<p>Teste de envio com sucesso via <strong>Resend</strong>!</p>',
        },
      })
      if (res.error) throw res.error
      toast({ title: 'Sucesso', description: 'E-mail de teste Resend enviado com sucesso!' })
    } catch (e: any) {
      toast({
        title: 'Erro',
        description: e?.message || 'Falha ao enviar e-mail via Resend',
        variant: 'destructive',
      })
    } finally {
      setTestingResend(false)
    }
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="w-5 h-5" /> Configuração SMTP & Provedores
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nome do Remetente</Label>
            <Input defaultValue="Adriana Araújo - Guia Low Carb" readOnly className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label>E-mail do Remetente (From)</Label>
            <Input defaultValue="contato@guialowcarb.com.br" readOnly className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label>Provedor Transacional</Label>
            <Input defaultValue="Resend (Secret: RESEND_API_KEY)" readOnly className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label>Provedor de Marketing / Listas</Label>
            <Input defaultValue="Brevo (Secret: BREVO_API_KEY)" readOnly className="bg-muted" />
          </div>
        </div>
        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button variant="outline" onClick={handleTestResend} disabled={testingResend}>
            {testingResend ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Testar Envio via Resend
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function SmtpCdn() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" /> Storage & CDN
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <p className="font-medium">Provedor CDN</p>
            <p className="text-sm text-muted-foreground">Supabase Storage CDN</p>
          </div>
          <Badge className="bg-blue-600">Ativo</Badge>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bucket Imagens:</span>
            <span className="font-mono text-xs">public/Imagens</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bucket Materiais:</span>
            <span className="font-mono text-xs">public/materiais</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
