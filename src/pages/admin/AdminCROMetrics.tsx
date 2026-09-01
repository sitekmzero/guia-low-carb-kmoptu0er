import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TrendingUp, Users, ShoppingBag, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function AdminCROMetrics() {
  const [loading, setLoading] = useState(true)
  const [croData, setCroData] = useState({
    totalLeads: 0,
    totalConsultas: 0,
    totalVendas: 0,
    conversionRate: 0,
  })

  useEffect(() => {
    async function loadCROMetrics() {
      try {
        setLoading(true)
        const [leadsRes, crmRes, consultRes, purchRes] = await Promise.all([
          supabase.from('leads').select('id', { count: 'exact' }),
          supabase.from('crm_leads').select('id', { count: 'exact' }),
          supabase.from('consultations').select('id', { count: 'exact' }),
          supabase.from('purchases').select('id', { count: 'exact' }),
        ])

        const totalLeads = (leadsRes.count || 0) + (crmRes.count || 0)
        const totalConsultas = consultRes.count || 0
        const totalVendas = purchRes.count || 0
        const totalConverted = totalConsultas + totalVendas
        const rate = totalLeads > 0 ? (totalConverted / totalLeads) * 100 : 0

        setCroData({
          totalLeads,
          totalConsultas,
          totalVendas,
          conversionRate: rate,
        })
      } catch (err) {
        console.error('Erro ao carregar métricas CRO:', err)
      } finally {
        setLoading(false)
      }
    }

    loadCROMetrics()
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">CRO & Métricas de Conversão</h2>
        <p className="text-muted-foreground">
          Visão geral do funil baseada nos registros reais de banco de dados.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{croData.totalLeads}</div>
                <p className="text-xs text-muted-foreground">Capturas acumuladas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Teleconsultas</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{croData.totalConsultas}</div>
                <p className="text-xs text-muted-foreground">Agendamentos no banco</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas Concluídas</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{croData.totalVendas}</div>
                <p className="text-xs text-muted-foreground">Cursos e e-books</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa Lead &rarr; Cliente</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{croData.conversionRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Conversão real calculada</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Estrutura do Funil</CardTitle>
                <CardDescription>Status das etapas de conversão no site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted rounded-lg flex justify-between items-center">
                  <span>1. Captura de Lead (E-book / Contato)</span>
                  <span className="font-bold">{croData.totalLeads}</span>
                </div>
                <div className="p-3 bg-muted rounded-lg flex justify-between items-center">
                  <span>2. Agendamentos de Teleconsulta</span>
                  <span className="font-bold">{croData.totalConsultas}</span>
                </div>
                <div className="p-3 bg-muted rounded-lg flex justify-between items-center">
                  <span>3. Pedidos Concluídos</span>
                  <span className="font-bold">{croData.totalVendas}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Otimizações Recomendadas</CardTitle>
                <CardDescription>Ações ativas no ecossistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                  <div>
                    <p className="font-medium text-sm">Pop-up de Exit Intent Ativo</p>
                    <p className="text-xs text-muted-foreground">
                      Capturando visitantes antes da saída nas páginas de conversão.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                  <div>
                    <p className="font-medium text-sm">Integração Stripe Checkout</p>
                    <p className="text-xs text-muted-foreground">
                      Checkout direto sem atrito para cursos e materiais.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
