import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Database, Key, ShieldCheck } from 'lucide-react'

const API_INTEGRATIONS = [
  {
    name: 'Stripe Checkout',
    serviceType: 'Pagamento',
    status: 'Pendente Configuração',
    statusVariant: 'secondary' as const,
    description: 'Requer segredos STRIPE_SECRET_KEY / STRIPE_PUBLIC_API_KEY no Supabase',
  },
  {
    name: 'Brevo API',
    serviceType: 'E-mail Transacional / CRM',
    status: 'Ativo via Edge Functions',
    statusVariant: 'default' as const,
    description: 'Secret BREVO_API_KEY registrado no Supabase',
  },
  {
    name: 'Resend API',
    serviceType: 'E-mail Transacional',
    status: 'Ativo via Edge Functions',
    statusVariant: 'default' as const,
    description: 'Secret RESEND_API_KEY registrado no Supabase',
  },
  {
    name: 'Meta Pixel / Webhook',
    serviceType: 'Tracking / Conversão',
    status: 'Ativo',
    statusVariant: 'default' as const,
    description: 'Pixel ID 181692372415384 + meta-webhook ativo',
  },
  {
    name: 'Hotmart Webhook',
    serviceType: 'Vendas Externas',
    status: 'Ativo via Webhook',
    statusVariant: 'default' as const,
    description: 'Edge Function hotmart-sync disponível para integrações',
  },
]

export function SecurityApiKeys() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" /> Status de Chaves & Integrações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serviço</TableHead>
              <TableHead>Finalidade</TableHead>
              <TableHead>Status Backend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {API_INTEGRATIONS.map((k) => (
              <TableRow key={k.name}>
                <TableCell className="font-medium">
                  <div>{k.name}</div>
                  <div className="text-xs text-muted-foreground">{k.description}</div>
                </TableCell>
                <TableCell className="text-sm">{k.serviceType}</TableCell>
                <TableCell>
                  <Badge variant={k.statusVariant}>{k.status}</Badge>
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" /> Banco de Dados & Infraestrutura
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <p className="font-medium">Provedor de Banco de Dados</p>
            <p className="text-sm text-muted-foreground">Supabase PostgreSQL (Managed)</p>
          </div>
          <Badge className="bg-green-600">Conectado</Badge>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Segurança de Acesso (RLS)</p>
            <p className="text-muted-foreground">Políticas ativas em todas as tabelas</p>
          </div>
          <div>
            <p className="font-medium">Backups Automáticos</p>
            <p className="text-muted-foreground">Gerenciados pela plataforma</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function SecurityTwoFactor() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" /> Proteção de Acesso Administrativo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted/40 rounded-lg text-sm space-y-2">
          <p className="font-semibold text-foreground">Controle Baseado em Perfis (RBAC)</p>
          <p className="text-muted-foreground">
            O acesso às rotas{' '}
            <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">/admin/*</code> é
            protegido por checagem de perfil (user_profiles.is_admin = true) e JWT de autenticação
            do Supabase.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
