import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Database, Key, ShieldCheck, QrCode } from 'lucide-react'

const MOCK_KEYS = [
  { name: 'Stripe', status: 'Connected', lastUpdated: '2024-03-01', key: 'sk_live_...4829' },
  { name: 'Mercado Pago', status: 'Connected', lastUpdated: '2024-02-15', key: 'APP_USR_...9182' },
  { name: 'Brevo', status: 'Connected', lastUpdated: '2024-04-01', key: 'xkeysib-...8a2b' },
  { name: 'Hotmart', status: 'Disconnected', lastUpdated: '2023-11-20', key: 'Not configured' },
]

export function SecurityApiKeys() {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<(typeof MOCK_KEYS)[0] | null>(null)

  const handleSave = () => {
    toast({ title: 'Sucesso', description: 'API Key atualizada com sucesso!' })
    setIsOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" /> API Keys
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serviço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Atualizado</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_KEYS.map((k) => (
              <TableRow key={k.name}>
                <TableCell className="font-medium">{k.name}</TableCell>
                <TableCell>
                  <Badge variant={k.status === 'Connected' ? 'default' : 'secondary'}>
                    {k.status}
                  </Badge>
                </TableCell>
                <TableCell>{k.lastUpdated}</TableCell>
                <TableCell>
                  <Dialog
                    open={isOpen && selected?.name === k.name}
                    onOpenChange={(v) => {
                      setIsOpen(v)
                      setSelected(k)
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Ver/Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Atualizar API Key - {k.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Chave Atual</p>
                          <p className="text-sm text-muted-foreground">{k.key}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Nova Chave</p>
                          <Input type="password" placeholder="Cole a nova API key aqui..." />
                        </div>
                        <Button onClick={handleSave} className="w-full">
                          Atualizar Chave
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export function SecurityDatabase() {
  const { toast } = useToast()
  const handleBackup = () =>
    toast({ title: 'Backup Iniciado', description: 'Backup realizado com sucesso!' })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" /> Banco de Dados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <p className="font-medium">Status da Conexão</p>
            <p className="text-sm text-muted-foreground">guia-low-carb-db</p>
          </div>
          <Badge className="bg-green-500">Connected</Badge>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Último Backup</p>
            <p className="text-muted-foreground">Hoje, 03:00 AM</p>
          </div>
          <div>
            <p className="font-medium">Frequência</p>
            <p className="text-muted-foreground">Diário</p>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Fazer Backup Agora</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Backup</DialogTitle>
            </DialogHeader>
            <p>Deseja fazer backup do banco de dados agora?</p>
            <Button onClick={handleBackup}>Confirmar</Button>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export function SecurityTwoFactor() {
  const { toast } = useToast()
  const [enabled, setEnabled] = useState(false)

  const toggle2FA = () => {
    setEnabled(!enabled)
    toast({
      title: !enabled ? '2FA Ativado' : '2FA Desativado',
      description: 'Configurações de segurança atualizadas.',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" /> Autenticação 2 Fatores (2FA)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Ativar Autenticação de Dois Fatores</p>
            <p className="text-sm text-muted-foreground">
              Adicione uma camada extra de segurança à sua conta.
            </p>
          </div>
          <Switch checked={enabled} onCheckedChange={toggle2FA} />
        </div>
        {enabled && (
          <div className="bg-muted p-4 rounded-lg flex gap-4 items-center">
            <div className="bg-white p-2 rounded">
              <QrCode className="w-16 h-16" />
            </div>
            <div className="text-sm space-y-1">
              <p className="font-medium">Códigos de Backup</p>
              <p className="text-muted-foreground font-mono bg-background px-2 py-1 rounded border">
                8A2B-9C1D, 4F5G-6H7J...
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
