import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({ leads: 0, vendas: 0 })
  const [leads, setLeads] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      const [lc, ls, v] = await Promise.all([
        supabase.from('leads_cursos').select('id, name, email, whatsapp, created_at'),
        supabase.from('leads_seguros').select('id, name, email, whatsapp, interest, created_at'),
        supabase.from('vendas').select('*', { count: 'exact' }).eq('status', 'pago'),
      ])

      const allLeads = [
        ...(lc.data || []).map((l) => ({ ...l, type: 'Curso' })),
        ...(ls.data || []).map((l) => ({ ...l, type: 'Seguro' })),
      ]
      allLeads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setMetrics({ leads: allLeads.length, vendas: v.count || 0 })
      setLeads(allLeads.slice(0, 10))
    }
    fetchData()
  }, [])

  const chartData = [
    { name: 'Jan', leads: 40, vendas: 24 },
    { name: 'Fev', leads: 30, vendas: 13 },
    { name: 'Mar', leads: 20, vendas: 38 },
    { name: 'Abr', leads: 27, vendas: 39 },
    { name: 'Mai', leads: 18, vendas: 48 },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold font-heading text-primary">CRM & Métricas</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total de Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metrics.leads}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Vendas Realizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metrics.vendas}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Page Views (MOCK)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12.5k</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Usuários Únicos (MOCK)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">8.2k</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6">Tendências</h2>
        <ChartContainer
          config={{
            leads: { color: 'hsl(var(--primary))' },
            vendas: { color: 'hsl(var(--secondary))' },
          }}
          className="h-[300px] w-full"
        >
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="leads" fill="var(--color-leads)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="vendas" fill="var(--color-vendas)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Últimos Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.type}</TableCell>
                  <TableCell>{new Date(lead.created_at).toLocaleDateString('pt-BR')}</TableCell>
                </TableRow>
              ))}
              {leads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Nenhum lead encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
