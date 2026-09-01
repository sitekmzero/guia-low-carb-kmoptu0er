import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'

export function SmtpMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" /> Métricas de Entrega de E-mails
        </CardTitle>
        <CardDescription>
          Status de envio via provedores integrados (Resend e Brevo)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-muted/40 rounded-lg">
            <p className="text-sm text-muted-foreground">Provedor Primário</p>
            <p className="text-xl font-bold text-primary">Resend (API)</p>
            <p className="text-xs text-muted-foreground mt-1">
              E-mails de confirmação e boas-vindas
            </p>
          </div>
          <div className="p-4 bg-muted/40 rounded-lg">
            <p className="text-sm text-muted-foreground">Provedor Secundário / CRM</p>
            <p className="text-xl font-bold text-secondary">Brevo (API)</p>
            <p className="text-xs text-muted-foreground mt-1">Automação de leads e listas</p>
          </div>
          <div className="p-4 bg-muted/40 rounded-lg">
            <p className="text-sm text-muted-foreground">Monitoramento de Entregas</p>
            <p className="text-xl font-bold text-green-600">Ativo</p>
            <p className="text-xs text-muted-foreground mt-1">
              Logs disponíveis no console Supabase
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
