import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useState } from 'react'
import { FileText, Download, Calendar, Mail, Settings, RefreshCw, Send } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'

export default function AdminReports() {
  const [generating, setGenerating] = useState<string | null>(null)

  const handleGenerateReport = async (reportType: string, reportName: string) => {
    setGenerating(reportType)
    try {
      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: { report_type: reportType, report_name: reportName },
      })

      if (error) throw error

      toast({
        title: 'Relatório Gerado!',
        description: `Relatório "${reportName}" gerado e notificação enviada ao Slack com sucesso.`,
      })
    } catch (err: any) {
      toast({
        title: 'Erro ao gerar relatório',
        description: err.message || 'Falha na execução da edge function.',
        variant: 'destructive',
      })
    } finally {
      setGenerating(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary">Relatórios e BI</h1>
          <p className="text-muted-foreground">
            Geração automática e agendamento de relatórios gerenciais com envio para Slack.
          </p>
        </div>
        <Button
          onClick={() => handleGenerateReport('relatorio_geral_bi', 'Relatório Geral Consolidado')}
          disabled={generating !== null}
          className="bg-primary gap-2"
        >
          {generating === 'relatorio_geral_bi' ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          Gerar e Enviar ao Slack
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Relatório Semanal</CardTitle>
            <CardDescription>Resumo de Vendas e Leads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center">
                  <Calendar className="w-4 h-4 mr-2" /> Envio: Segundas, 08h
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  disabled={generating !== null}
                  onClick={() =>
                    handleGenerateReport(
                      'semanal_vendas_leads',
                      'Relatório Semanal de Vendas e Leads',
                    )
                  }
                >
                  {generating === 'semanal_vendas_leads' ? (
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  Disparar Agora
                </Button>
                <Button size="sm" variant="secondary">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Fechamento Mensal</CardTitle>
            <CardDescription>Métricas financeiras e ROI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center">
                  <Calendar className="w-4 h-4 mr-2" /> Envio: Dia 01, 08h
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  disabled={generating !== null}
                  onClick={() =>
                    handleGenerateReport('mensal_financeiro_roi', 'Fechamento Mensal & ROI')
                  }
                >
                  {generating === 'mensal_financeiro_roi' ? (
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  Disparar Agora
                </Button>
                <Button size="sm" variant="secondary">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Envios</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Relatório</TableHead>
                <TableHead>Data de Geração</TableHead>
                <TableHead>Destinatários</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Fechamento de Março
                </TableCell>
                <TableCell>01/04/2026 08:00</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <Mail className="w-3 h-3 inline mr-1" /> adriana@...
                </TableCell>
                <TableCell>
                  <Badge className="bg-emerald-500">Enviado</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Visualizar
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Resumo Semanal (S14)
                </TableCell>
                <TableCell>30/03/2026 08:00</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <Mail className="w-3 h-3 inline mr-1" /> adriana@...
                </TableCell>
                <TableCell>
                  <Badge className="bg-emerald-500">Enviado</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Visualizar
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
