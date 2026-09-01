import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { DollarSign, Users, ShoppingCart, TrendingUp, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function AdminExecutiveDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    receitaTotal: 0,
    totalClientes: 0,
    ticketMedio: 0,
    taxaConversao: 0,
    totalLeads: 0,
  })
  const [revenueData, setRevenueData] = useState<{ name: string; value: number }[]>([])

  const [date] = useState(
    new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  )

  useEffect(() => {
    async function loadRealData() {
      try {
        setLoading(true)
        const [purchasesRes, vendasRes, usersRes, leadsRes, crmRes] = await Promise.all([
          supabase.from('purchases').select('amount_paid, created_at, status'),
          supabase.from('vendas').select('amount, created_at, status'),
          supabase.from('user_profiles').select('id, created_at'),
          supabase.from('leads').select('id, created_at'),
          supabase.from('crm_leads').select('id, created_at'),
        ])

        const pList = (purchasesRes.data || [])
          .filter((p) => p.status === 'completed' || !p.status)
          .map((p) => ({ amount: Number(p.amount_paid) || 0, created_at: p.created_at }))

        const vList = (vendasRes.data || [])
          .filter((v) => v.status === 'pago' || !v.status)
          .map((v) => ({ amount: Number(v.amount) || 0, created_at: v.created_at }))

        const allTransactions = [...pList, ...vList]

        const receitaTotal = allTransactions.reduce((acc, curr) => acc + curr.amount, 0)

        const totalClientes = (usersRes.data || []).length
        const totalLeadsCount = (leadsRes.data || []).length + (crmRes.data || []).length
        const totalTransactions = allTransactions.length
        const ticketMedio = totalTransactions > 0 ? receitaTotal / totalTransactions : 0
        const totalInteractions = totalLeadsCount + totalTransactions
        const taxaConversao =
          totalInteractions > 0 ? (totalTransactions / totalInteractions) * 100 : 0

        setStats({
          receitaTotal,
          totalClientes,
          ticketMedio,
          taxaConversao,
          totalLeads: totalLeadsCount,
        })

        // Agrupamento por mês ou semana real
        if (allTransactions.length > 0) {
          const grouped: Record<string, number> = {}
          allTransactions.forEach((t) => {
            const d = new Date(t.created_at)
            const key = d.toLocaleDateString('pt-BR', { month: 'short' })
            grouped[key] = (grouped[key] || 0) + t.amount
          })
          setRevenueData(Object.entries(grouped).map(([name, value]) => ({ name, value })))
        } else {
          setRevenueData([])
        }
      } catch (err) {
        console.error('Erro ao carregar dados do Dashboard Executivo:', err)
      } finally {
        setLoading(false)
      }
    }

    loadRealData()
  }, [])

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary">Dashboard Executivo</h1>
          <p className="text-muted-foreground capitalize">{date}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                    <p className="text-3xl font-bold">
                      R$ {stats.receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-muted-foreground">Base de transações reais</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Clientes / Alunos</p>
                    <p className="text-3xl font-bold">{stats.totalClientes}</p>
                  </div>
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <Users className="h-5 w-5 text-secondary" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-muted-foreground">Cadastros confirmados</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Ticket Médio</p>
                    <p className="text-3xl font-bold">
                      R$ {stats.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-muted-foreground">Média por pedido aprovado</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Taxa de Conversão</p>
                    <p className="text-3xl font-bold">{stats.taxaConversao.toFixed(1)}%</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-muted-foreground">{stats.totalLeads} leads na base</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Receita</CardTitle>
              </CardHeader>
              <CardContent>
                {revenueData.length > 0 ? (
                  <ChartContainer
                    config={{ value: { color: 'hsl(var(--primary))' } }}
                    className="h-[300px] w-full"
                  >
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(val) => `R$ ${val}`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                    Nenhuma receita confirmada no período para gerar o gráfico.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumo de Operações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/40 rounded-lg flex justify-between items-center">
                  <span className="font-medium">Total de Leads Capturados</span>
                  <span className="text-xl font-bold">{stats.totalLeads}</span>
                </div>
                <div className="p-4 bg-muted/40 rounded-lg flex justify-between items-center">
                  <span className="font-medium">Total de Usuários Cadastrados</span>
                  <span className="text-xl font-bold">{stats.totalClientes}</span>
                </div>
                <div className="p-4 bg-muted/40 rounded-lg flex justify-between items-center">
                  <span className="font-medium">Status de Integração Stripe</span>
                  <span className="text-sm font-semibold text-primary">Pronto para ativação</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
