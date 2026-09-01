import { useEffect, useState } from 'react'
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
import { Download, TrendingUp, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function AdminCampaigns() {
  const [loading, setLoading] = useState(true)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [totalConversions, setTotalConversions] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)

  useEffect(() => {
    async function loadCampaignData() {
      try {
        setLoading(true)
        const [trackingRes, purchasesRes] = await Promise.all([
          supabase.from('channel_tracking').select('*'),
          supabase.from('purchases').select('amount_paid, created_at, status'),
        ])

        const trackingData = trackingRes.data || []
        const purchasesData = (purchasesRes.data || []).filter(
          (p) => p.status === 'completed' || !p.status,
        )

        const totalRev = purchasesData.reduce(
          (acc, curr) => acc + (Number(curr.amount_paid) || 0),
          0,
        )
        setTotalRevenue(totalRev)

        // Agrupar por source / medium / campaign
        const grouped: Record<string, any> = {}

        trackingData.forEach((row) => {
          const key = `${row.source || 'direto'}_${row.medium || 'nenhum'}_${row.campaign || 'organico'}`
          if (!grouped[key]) {
            grouped[key] = {
              name: row.campaign || 'Tráfego Geral',
              source: row.source || 'direto',
              medium: row.medium || 'organico',
              users: 0,
              conversions: 0,
              revenue: 0,
            }
          }
          grouped[key].users += 1
          if (
            row.event_name === 'purchase' ||
            row.event_name === 'lead' ||
            row.event_name === 'consultation_booked'
          ) {
            grouped[key].conversions += 1
            grouped[key].revenue += Number(row.conversion_value) || 0
          }
        })

        const campaignList = Object.values(grouped)
        setCampaigns(campaignList)
        setTotalConversions(campaignList.reduce((acc, c) => acc + c.conversions, 0))
      } catch (err) {
        console.error('Erro ao carregar campanhas:', err)
      } finally {
        setLoading(false)
      }
    }

    loadCampaignData()
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Monitoramento de Campanhas</h2>
          <p className="text-muted-foreground">
            Acompanhe o ROI e performance de tráfego UTM (Integrado com GA4 / Meta Pixel / Channel
            Tracking).
          </p>
        </div>
        <Button className="shrink-0" variant="outline">
          <Download className="mr-2 h-4 w-4" /> Exportar Relatório CSV
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Conversões Registradas
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalConversions}</div>
                <p className="text-xs text-muted-foreground">Base real de eventos e leads</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita de Vendas</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total acumulado de pedidos confirmados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Campanhas Rastreadas</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaigns.length}</div>
                <p className="text-xs text-muted-foreground">Parâmetros UTM ativos</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance por Campanha UTM</CardTitle>
              <CardDescription>
                Métricas de conversão baseadas em rastreamento real de origem.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campanha</TableHead>
                      <TableHead>Origem / Mídia</TableHead>
                      <TableHead className="text-right">Acessos Rastreados</TableHead>
                      <TableHead className="text-right">Conversões</TableHead>
                      <TableHead className="text-right">Tx. Conversão</TableHead>
                      <TableHead className="text-right">Receita Bruta</TableHead>
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
                          {c.users > 0 ? ((c.conversions / c.users) * 100).toFixed(1) : 0}%
                        </TableCell>
                        <TableCell className="text-right">
                          R$ {c.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                    {campaigns.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Nenhuma campanha com tráfego registrado até o momento. As visitas com
                          parâmetros UTM (?utm_source=...) aparecerão aqui automaticamente.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
