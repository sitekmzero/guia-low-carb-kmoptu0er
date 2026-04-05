import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminLeadAnalytics() {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary">Analytics de Leads</h1>
          <p className="text-muted-foreground">
            Análise profunda da jornada e qualificação dos contatos.
          </p>
        </div>
      </div>

      <Card className="border-dashed py-12 text-center bg-transparent">
        <CardContent>
          <h2 className="text-xl font-bold text-muted-foreground">Módulo de Análise BI</h2>
          <p className="text-muted-foreground max-w-md mx-auto mt-2">
            Os gráficos detalhados de Scoring, Tempo até Conversão e Atribuição de Origem estão
            sendo compilados a partir dos dados do CRM.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
