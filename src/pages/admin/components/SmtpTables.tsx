import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Webhook, Send, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

const EMAIL_TEMPLATES = [
  {
    name: 'Confirmação de Agendamento (Teleconsulta)',
    trigger: 'Ao concluir agendamento na teleconsulta',
    status: 'Ativo',
  },
  {
    name: 'Confirmação de Compra (Cursos & E-books)',
    trigger: 'Ao processar pagamento via Stripe / Webhook',
    status: 'Ativo',
  },
  {
    name: 'Entrega de E-book Gratuito',
    trigger: 'Ao preencher formulário de e-book',
    status: 'Ativo',
  },
]

const SYSTEM_WEBHOOKS = [
  {
    event: 'stripe-webhook',
    url: 'https://wfuwhozrwyqkqdovzers.supabase.co/functions/v1/stripe-webhook',
    status: 'Ativo',
    purpose: 'Processamento de compras e checkout Stripe',
  },
  {
    event: 'hotmart-sync',
    url: 'https://wfuwhozrwyqkqdovzers.supabase.co/functions/v1/hotmart-sync',
    status: 'Ativo',
    purpose: 'Sincronização de vendas Hotmart',
  },
  {
    event: 'meta-webhook',
    url: 'https://wfuwhozrwyqkqdovzers.supabase.co/functions/v1/meta-webhook',
    status: 'Ativo',
    purpose: 'Recepção de eventos Meta Ads / Pixel',
  },
]

export function SmtpTemplates() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" /> Fluxos de E-mail Cadastrados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Template / Finalidade</TableHead>
              <TableHead>Gatilho (Trigger)</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {EMAIL_TEMPLATES.map((t) => (
              <TableRow key={t.name}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{t.trigger}</TableCell>
                <TableCell>
                  <Badge variant="default">{t.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export function SmtpWebhooks() {
  const { toast } = useToast()
  const [testing, setTesting] = useState<string | null>(null)

  const testWebhook = async (slug: string) => {
    setTesting(slug)
    try {
      const { data, error } = await supabase.functions.invoke(slug, {
        body: { test: true, ping: new Date().toISOString() },
      })
      if (error) throw error
      toast({
        title: 'Webhook Testado com Sucesso',
        description: `Função ${slug} respondeu positivamente.`,
      })
    } catch (err: any) {
      toast({
        title: 'Resposta do Webhook',
        description: `Executado: ${err?.message || 'Verifique logs no Supabase'}`,
      })
    } finally {
      setTesting(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook className="w-5 h-5" /> Webhooks Ativos no Backend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Função</TableHead>
              <TableHead>Endpoint</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SYSTEM_WEBHOOKS.map((w) => (
              <TableRow key={w.event}>
                <TableCell className="font-medium">
                  <div>{w.event}</div>
                  <div className="text-xs text-muted-foreground">{w.purpose}</div>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground max-w-[150px] truncate">
                  {w.url}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-green-600 text-green-700">
                    {w.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={testing === w.event}
                    onClick={() => testWebhook(w.event)}
                  >
                    {testing === w.event ? (
                      <Loader2 className="w-3 h-3 animate-spin mr-1" />
                    ) : (
                      <Send className="w-3 h-3 mr-1" />
                    )}
                    Testar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
