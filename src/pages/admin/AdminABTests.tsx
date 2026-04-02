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
import { Badge } from '@/components/ui/badge'
import { Activity, Plus } from 'lucide-react'

export default function AdminABTests() {
  const tests = [
    {
      name: 'seo-hero-headline',
      status: 'active',
      varA: 'Transforme Sua Saúde',
      varB: 'Emagrecimento Saudável',
      impA: 1500,
      impB: 1480,
      convA: 45,
      convB: 62,
      duration: '14 dias',
    },
    {
      name: 'ebook-form-fields',
      status: 'active',
      varA: '3 Campos',
      varB: '2 Campos',
      impA: 800,
      impB: 820,
      convA: 120,
      convB: 165,
      duration: '8 dias',
    },
    {
      name: 'consulta-cta-color',
      status: 'completed',
      varA: 'Primary Green',
      varB: 'Accent Orange',
      impA: 3000,
      impB: 3000,
      convA: 210,
      convB: 180,
      duration: '30 dias',
    },
  ]

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
              <Activity className="w-5 h-5 text-primary" /> Insight Automático
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">
              A Variante B (2 Campos) do teste "ebook-form-fields" está vencendo com uma taxa de
              conversão 34% maior (Confiança: 98%).
            </p>
            <Button variant="outline" size="sm" className="mt-4 w-full">
              Aplicar Vencedor a 100%
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Testes em Andamento e Concluídos</CardTitle>
          <CardDescription>Métricas de impressão e conversão por variante.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Teste</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead className="text-right">Tx. Variante A</TableHead>
                  <TableHead className="text-right">Tx. Variante B</TableHead>
                  <TableHead className="text-center">Vencedor Parcial</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((t, i) => {
                  const rateA = ((t.convA / t.impA) * 100).toFixed(1)
                  const rateB = ((t.convB / t.impB) * 100).toFixed(1)
                  const winner = parseFloat(rateB) > parseFloat(rateA) ? 'Variante B' : 'Variante A'

                  return (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell>
                        <Badge variant={t.status === 'active' ? 'default' : 'secondary'}>
                          {t.status === 'active' ? 'Rodando' : 'Concluído'}
                        </Badge>
                      </TableCell>
                      <TableCell>{t.duration}</TableCell>
                      <TableCell className="text-right">
                        {rateA}% <span className="text-xs text-muted-foreground">({t.convA})</span>
                      </TableCell>
                      <TableCell className="text-right">
                        {rateB}% <span className="text-xs text-muted-foreground">({t.convB})</span>
                      </TableCell>
                      <TableCell className="text-center font-bold text-primary">{winner}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
