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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { FileText, Webhook, Eye } from 'lucide-react'

const MOCK_TEMPLATES = [
  { name: 'Welcome Email', status: 'Active', updated: '2024-03-10' },
  { name: 'Purchase Confirmation', status: 'Active', updated: '2024-04-01' },
  { name: 'Consultation Reminder', status: 'Active', updated: '2024-03-25' },
  { name: 'Newsletter', status: 'Inactive', updated: '2024-01-15' },
]

const MOCK_WEBHOOKS = [
  {
    event: 'Purchase completed',
    url: 'https://api.guialowcarb.com.br/hook',
    status: 'Active',
    lastTrigger: 'Hoje, 09:40',
  },
  {
    event: 'Consultation booked',
    url: 'https://api.guialowcarb.com.br/hook',
    status: 'Active',
    lastTrigger: 'Ontem, 14:20',
  },
  {
    event: 'Lead captured',
    url: 'https://api.guialowcarb.com.br/lead',
    status: 'Active',
    lastTrigger: 'Hoje, 11:05',
  },
]

export function SmtpTemplates() {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  const handleSave = () => {
    toast({ title: 'Sucesso', description: 'Template atualizado com sucesso!' })
    setIsOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" /> Templates de E-mail
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Template</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Atualizado</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_TEMPLATES.map((t) => (
              <TableRow key={t.name}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell>
                  <Badge variant={t.status === 'Active' ? 'default' : 'secondary'}>
                    {t.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{t.updated}</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" /> Preview
                  </Button>
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Editar {t.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Assunto</p>
                          <Input defaultValue={`[Guia Low Carb] ${t.name}`} />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Corpo HTML</p>
                          <textarea
                            className="w-full min-h-[150px] p-3 rounded-md border"
                            defaultValue="<h1>Olá {{nome}},</h1>..."
                          />
                        </div>
                        <Button onClick={handleSave} className="w-full">
                          Salvar Template
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

export function SmtpWebhooks() {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  const action = (msg: string) => {
    toast({ title: 'Sucesso', description: msg })
    setIsOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook className="w-5 h-5" /> Webhooks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Evento</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último Disparo</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_WEBHOOKS.map((w) => (
              <TableRow key={w.event}>
                <TableCell className="font-medium">{w.event}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground max-w-[150px] truncate">
                  {w.url}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-green-500 text-green-600">
                    {w.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{w.lastTrigger}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => action('Webhook de teste enviado!')}
                  >
                    Testar
                  </Button>
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Webhook</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">URL do Endpoint</p>
                          <Input defaultValue={w.url} />
                        </div>
                        <Button
                          onClick={() => action('Webhook atualizado com sucesso!')}
                          className="w-full"
                        >
                          Salvar URL
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
