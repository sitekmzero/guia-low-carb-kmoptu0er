import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { BarChart, Activity, DollarSign, Users, MousePointerClick, RefreshCw } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function AdminTracking() {
  const [validating, setValidating] = useState(false)

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
        description: 'Falha ao validar os scripts de rastreamento. Verifique os logs.',
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
          <h1 className="text-3xl font-bold font-heading">Dashboard de Conversão</h1>
          <p className="text-muted-foreground">
            Métricas e eventos de Meta Pixel, Google Ads e GA4
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2">
            Exportar CSV
          </Button>
          <Button onClick={handleValidate} disabled={validating} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${validating ? 'animate-spin' : ''}`} />
            Validar Scripts
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Meta Pixel (Últimos 7 dias)
              <Activity className="w-4 h-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground">+12% em relação à semana anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Google Ads Conversões (Últimos 7 dias)
              <DollarSign className="w-4 h-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84</div>
            <p className="text-xs text-muted-foreground">+5% em relação à semana anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              GA4 Eventos (Últimos 7 dias)
              <BarChart className="w-4 h-4 text-orange-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,592</div>
            <p className="text-xs text-muted-foreground">+18% em relação à semana anterior</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Funil de Conversão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Visitantes (Total)</span>
              </div>
              <span className="font-bold">12,500</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <MousePointerClick className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Leads Gerados</span>
              </div>
              <span className="font-bold">850</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Clientes (Compras/Consultas)</span>
              </div>
              <span className="font-bold">124</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Breakdown de Eventos de Conversão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 border-b">
              <span className="font-medium text-muted-foreground">ViewContent</span>
              <span className="font-bold">3,200</span>
            </div>
            <div className="flex justify-between items-center p-3 border-b">
              <span className="font-medium text-muted-foreground">Lead (Captura E-book)</span>
              <span className="font-bold">850</span>
            </div>
            <div className="flex justify-between items-center p-3 border-b">
              <span className="font-medium text-muted-foreground">ConsultationBooked</span>
              <span className="font-bold">45</span>
            </div>
            <div className="flex justify-between items-center p-3 border-b border-transparent">
              <span className="font-medium text-muted-foreground">CourseEnrolled</span>
              <span className="font-bold">79</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ROI por Canal (Estimado)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="font-medium">Meta Pixel ROI</span>
            <span className="font-bold text-green-600">340%</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="font-medium">Google Ads ROI</span>
            <span className="font-bold text-green-600">415%</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="font-medium">Orgânico (SEO)</span>
            <span className="font-bold text-green-600">1,250%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
