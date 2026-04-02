import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Download, TrendingUp } from 'lucide-react'

export default function AdminCampaigns() {
  // Mock data for campaign dashboard
  const campaigns = [
    {
      name: 'Google Ads - Low Carb Init',
      source: 'google',
      medium: 'cpc',
      users: 1240,
      conversions: 45,
      revenue: 6750,
      roas: '3.2x',
    },
    {
      name: 'Meta Ads - Retargeting',
      source: 'facebook',
      medium: 'cpc',
      users: 850,
      conversions: 32,
      revenue: 5400,
      roas: '4.5x',
    },
    {
      name: 'Email List Welcome',
      source: 'newsletter',
      medium: 'email',
      users: 300,
      conversions: 15,
      revenue: 2250,
      roas: 'N/A',
    },
    {
      name: 'Organic Search',
      source: 'google',
      medium: 'organic',
      users: 2100,
      conversions: 28,
      revenue: 4200,
      roas: 'N/A',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Monitoramento de Campanhas</h2>
          <p className="text-muted-foreground">
            Acompanhe o ROI e performance de tráfego UTM (Integrado com GA4/Meta Pixel).
          </p>
        </div>
        <Button className="shrink-0">
          <Download className="mr-2 h-4 w-4" /> Exportar Relatório CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROAS Médio (Tráfego Pago)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.8x</div>
            <p className="text-xs text-muted-foreground">+0.4% em relação ao mês passado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Conversões</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance por Campanha UTM</CardTitle>
          <CardDescription>
            Métricas de conversão baseadas em rastreamento de origem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campanha</TableHead>
                  <TableHead>Origem / Mídia</TableHead>
                  <TableHead className="text-right">Usuários</TableHead>
                  <TableHead className="text-right">Conversões</TableHead>
                  <TableHead className="text-right">Tx. Conversão</TableHead>
                  <TableHead className="text-right">Receita Bruta</TableHead>
                  <TableHead className="text-right">ROAS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((c, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>
                      {c.source} / {c.medium}
                    </TableCell>
                    <TableCell className="text-right">{c.users}</TableCell>
                    <TableCell className="text-right">{c.conversions}</TableCell>
                    <TableCell className="text-right">
                      {((c.conversions / c.users) * 100).toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">
                      R$ {c.revenue.toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {c.roas}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
