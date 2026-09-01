import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Activity, Plus, FlaskConical } from 'lucide-react'

export default function AdminABTests() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Testes A/B</h2>
          <p className="text-muted-foreground">
            Otimização de conversão de landing pages e formulários.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Novo Teste A/B
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Motor de Testes A/B
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">
              O componente{' '}
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
                ABTestVariant
              </code>{' '}
              está ativo no código. Crie novos experimentos ou vincule testes no Google Optimize /
              PostHog.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Experimentos Ativos</CardTitle>
          <CardDescription>Métricas de impressão e conversão por variante.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-3">
            <FlaskConical className="w-12 h-12 text-muted-foreground/40" />
            <p className="text-base font-medium">Nenhum teste A/B em execução no momento.</p>
            <p className="text-xs max-w-md">
              Configure variantes utilizando o componente de teste A/B para comparar headlines e
              formulários com dados reais de visualização e conversão.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
