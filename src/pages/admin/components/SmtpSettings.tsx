import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Mail, Settings2, Globe, RefreshCw, Send, Trash2, Image as ImageIcon } from 'lucide-react'

export function SmtpBrevo() {
  const { toast } = useToast()
  const [syncing, setSyncing] = useState(false)

  const handleSync = () => {
    setSyncing(true)
    setTimeout(() => {
      setSyncing(false)
      toast({
        title: 'Sincronizado',
        description: 'Sincronização com Brevo realizada com sucesso!',
      })
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" /> Status Brevo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <p className="font-medium">Conexão API</p>
            <p className="text-sm text-muted-foreground">Última sync: Hoje, 10:00</p>
          </div>
          <Badge className="bg-green-500">Connected</Badge>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm pb-2">
          <div>
            <p className="text-muted-foreground">Contatos Ativos</p>
            <p className="text-2xl font-bold">1,240</p>
          </div>
          <div>
            <p className="text-muted-foreground">Taxa de Bounce</p>
            <p className="text-2xl font-bold">1.2%</p>
          </div>
        </div>
        <Button onClick={handleSync} disabled={syncing} className="w-full" variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} /> Sincronizar
          Agora
        </Button>
      </CardContent>
    </Card>
  )
}

export function SmtpConfig() {
  const { toast } = useToast()
  const handleTest = () =>
    toast({ title: 'Sucesso', description: 'Email de teste enviado com sucesso!' })
  const handleSave = () =>
    toast({ title: 'Salvo', description: 'Configurações de e-mail atualizadas!' })

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="w-5 h-5" /> Configuração SMTP
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>From Name</Label>
            <Input defaultValue="GuiaLowCarb" />
          </div>
          <div className="space-y-2">
            <Label>From Email</Label>
            <Input defaultValue="admin@guialowcarb.com.br" />
          </div>
          <div className="space-y-2">
            <Label>Reply-To Email</Label>
            <Input defaultValue="contato@guialowcarb.com.br" />
          </div>
          <div className="space-y-2">
            <Label>Servidor SMTP</Label>
            <Input defaultValue="smtp-relay.brevo.com" />
          </div>
          <div className="space-y-2">
            <Label>Porta SMTP</Label>
            <Input type="number" defaultValue={587} />
          </div>
          <div className="space-y-2">
            <Label>Usuário SMTP</Label>
            <Input type="password" defaultValue="admin@guialowcarb.com.br" />
          </div>
        </div>
        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button variant="secondary" onClick={handleTest}>
            <Send className="w-4 h-4 mr-2" /> Testar Envio
          </Button>
          <Button onClick={handleSave}>Salvar Configurações</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function SmtpCdn() {
  const { toast } = useToast()
  const action = (msg: string) => toast({ title: 'Sucesso', description: msg })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" /> Configuração CDN
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <p className="font-medium">Status CDN</p>
            <p className="text-sm text-muted-foreground">Supabase Storage</p>
          </div>
          <Badge className="bg-blue-500">Active</Badge>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm pb-4">
          <div>
            <p className="text-muted-foreground">Armazenamento</p>
            <p className="font-medium">1.2 GB / 5 GB</p>
          </div>
          <div>
            <p className="text-muted-foreground">Bucket</p>
            <p className="font-medium">public-assets</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            className="w-full"
            variant="outline"
            onClick={() => action('Cache CDN limpo com sucesso!')}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Limpar Cache
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => action('Imagens em otimização...')}
          >
            <ImageIcon className="w-4 h-4 mr-2" /> Otimizar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
