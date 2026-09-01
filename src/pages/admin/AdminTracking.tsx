import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import {
  BarChart,
  Activity,
  DollarSign,
  Users,
  MousePointerClick,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function AdminTracking() {
  const [validating, setValidating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    metaEventsCount: 0,
    leadsCount: 0,
    purchasesCount: 0,
    consultationsCount: 0,
    trackingViewsCount: 0,
  })

  useEffect(() => {
    async function loadRealTrackingData() {
      try {
        setLoading(true)
        const [metaRes, leadsRes, crmRes, purchasesRes, consultRes, trackRes] = await Promise.all([
          supabase.from('meta_webhook_events').select('id', { count: 'exact' }),
          supabase.from('leads').select('id', { count: 'exact' }),
          supabase.from('crm_leads').select('id', { count: 'exact' }),
          supabase.from('purchases').select('id', { count: 'exact' }),
          supabase.from('consultations').select('id', { count: 'exact' }),
          supabase.from('channel_tracking').select('id', { count: 'exact' }),
        ])

        const totalLeads = (leadsRes.count || 0) + (crmRes.count || 0)

        setMetrics({
          metaEventsCount: metaRes.count || 0,
          leadsCount: totalLeads,
          purchasesCount: purchasesRes.count || 0,
          consultationsCount: consultRes.count || 0,
          trackingViewsCount: trackRes.count || 0,
        })
      } catch (err) {
        console.error('Erro ao carregar métricas de tracking:', err)
      } finally {
        setLoading(false)
      }
    }

    loadRealTrackingData()
  }, [])

  const handleValidate = async () => {
    setValidating(true)
    try {
      const { error } = await supabase.functions.invoke('validate-tracking')
      if (error) throw error
      toast({
        title: 'Validação Concluída',
        description: 'Eventos de teste enviados e verificados com sucesso pelas plataformas.',
      })
    } catch (err) {
      toast({
        title: 'Erro de Validação',
        description:
          'Falha ao validar os scripts de rastreamento. Verifique os logs da edge function.',
        variant: 'destructive',
      })
    } finally {
      setValidating(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">Dashboard de Conversão & Tracking</h1>
          <p className="text-muted-foreground">
            Métricas reais de Meta Pixel, Google Ads, GA4 e eventos no banco de dados.
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={handleValidate} disabled={validating} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${validating ? 'animate-spin' : ''}`} />
            Validar Scripts
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Meta Webhook Events
                  <Activity className="w-4 h-4 text-blue-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.metaEventsCount}</div>
                <p className="text-xs text-muted-foreground">Eventos recebidos no webhook</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Leads Capturados (Banco)
                  <DollarSign className="w-4 h-4 text-green-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.leadsCount}</div>
                <p className="text-xs text-muted-foreground">Formulários e e-books</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Visualizações Rastreadas
                  <BarChart className="w-4 h-4 text-orange-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.trackingViewsCount}</div>
                <p className="text-xs text-muted-foreground">Eventos de página registrados</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Funil de Conversão Real</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">Sessões Rastreadas</span>
                  </div>
                  <span className="font-bold">{metrics.trackingViewsCount}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <MousePointerClick className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">Leads Gerados</span>
                  </div>
                  <span className="font-bold">{metrics.leadsCount}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">Compras Confirmadas</span>
                  </div>
                  <span className="font-bold">{metrics.purchasesCount}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">Teleconsultas Agendadas</span>
                  </div>
                  <span className="font-bold">{metrics.consultationsCount}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuração de Rastreamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 border-b">
                  <span className="font-medium">Google Tag Manager</span>
                  <span className="font-mono text-xs bg-muted px-2 py-1 rounded">GTM-NHWQM369</span>
                </div>
                <div className="flex justify-between items-center p-3 border-b">
                  <span className="font-medium">Google Analytics (GA4)</span>
                  <span className="font-mono text-xs bg-muted px-2 py-1 rounded">G-70KXRPCMP7</span>
                </div>
                <div className="flex justify-between items-center p-3 border-b">
                  <span className="font-medium">Google Ads Conversion</span>
                  <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                    AW-18054612571
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 border-b">
                  <span className="font-medium">Meta Pixel</span>
                  <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                    181692372415384
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 border-b border-transparent">
                  <span className="font-medium">Facebook Domain Verification</span>
                  <span className="font-mono text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Ativo no HTML
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
