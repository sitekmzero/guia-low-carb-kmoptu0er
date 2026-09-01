import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TrendingUp, Users, MousePointerClick, ShoppingBag } from 'lucide-react'

export default function AdminCROMetrics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">CRO & Métricas de Conversão</h2>
        <p className="text-muted-foreground">Visão geral do funil de vendas e captura de leads.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tx. Captura E-book (Global)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5%</div>
            <p className="text-xs text-muted-foreground">Excelente (+2% mês)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abandono de Carrinho</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">62%</div>
            <p className="text-xs text-muted-foreground">
              Requer atenção. Sugestão: Pop-up de Exit-Intent
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tx. Conversão Consulta</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">Acima da média do mercado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliques em CTA / View</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18%</div>
            <p className="text-xs text-muted-foreground">CTR médio nos botões principais</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Funil de Teleconsulta</CardTitle>
            <CardDescription>Conversão step-by-step</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">1. Page Views (/teleconsulta)</span>
                <span>100% (2.500)</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-full"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">2. Clique em 'Selecionar'</span>
                <span>45% (1.125)</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[45%]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">3. Formulário Preenchido</span>
                <span>15% (375)</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[15%]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">4. Pagamento Concluído</span>
                <span>3.2% (80)</span>
              </div>
              <div className="h-2 w-full bg-secondary/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[3.2%]"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Análise de Engajamento</CardTitle>
            <CardDescription>Tempo de retenção em páginas chave</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">/nutricao-low-carb (Orgânico)</p>
                <p className="text-xs text-muted-foreground">Tempo médio na página</p>
              </div>
              <div className="font-bold text-lg">03m 45s</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">/consulta-nutricional (Ads)</p>
                <p className="text-xs text-muted-foreground">Tempo médio na página</p>
              </div>
              <div className="font-bold text-lg">01m 20s</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">/blog/*</p>
                <p className="text-xs text-muted-foreground">Tempo médio na página</p>
              </div>
              <div className="font-bold text-lg">04m 10s</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
