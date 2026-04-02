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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Users, Activity } from 'lucide-react'

const MOCK_USERS = [
  {
    email: 'admin@guialowcarb.com.br',
    role: 'admin',
    lastLogin: '2024-04-02 10:30',
    status: 'Active',
  },
  {
    email: 'suporte@guialowcarb.com.br',
    role: 'user',
    lastLogin: '2024-04-01 15:45',
    status: 'Active',
  },
]

const MOCK_LOGS = [
  {
    date: '2024-04-02 10:30:15',
    action: 'Login',
    user: 'admin@guialowcarb.com.br',
    ip: '192.168.1.1',
    status: 'Success',
  },
  {
    date: '2024-04-01 18:20:00',
    action: 'API Key Update',
    user: 'admin@guialowcarb.com.br',
    ip: '192.168.1.1',
    status: 'Success',
  },
  {
    date: '2024-04-01 15:45:10',
    action: 'Login',
    user: 'suporte@guialowcarb.com.br',
    ip: '10.0.0.5',
    status: 'Success',
  },
  {
    date: '2024-03-30 09:15:00',
    action: 'Database Backup',
    user: 'System',
    ip: 'localhost',
    status: 'Success',
  },
]

export function SecurityUsers() {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  const handleAction = (action: string) => {
    toast({ title: 'Sucesso', description: `Usuário ${action} com sucesso!` })
    setIsOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" /> Controle de Acesso
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Último Login</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_USERS.map((u) => (
              <TableRow key={u.email}>
                <TableCell className="font-medium">{u.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{u.role}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{u.lastLogin}</TableCell>
                <TableCell>
                  <Badge className="bg-green-500">{u.status}</Badge>
                </TableCell>
                <TableCell className="flex gap-2">
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Acesso - {u.email}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Select defaultValue={u.role}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="user">Usuário Padrão</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button onClick={() => handleAction('atualizado')} className="w-full">
                          Salvar Alterações
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" size="sm" onClick={() => handleAction('removido')}>
                    Remover
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

export function SecurityAuditLog() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" /> Log de Auditoria
        </CardTitle>
        <Button variant="outline" size="sm">
          Exportar CSV
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_LOGS.map((l, i) => (
              <TableRow key={i}>
                <TableCell className="whitespace-nowrap text-muted-foreground">{l.date}</TableCell>
                <TableCell className="font-medium">{l.action}</TableCell>
                <TableCell>{l.user}</TableCell>
                <TableCell className="font-mono text-xs">{l.ip}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{l.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
