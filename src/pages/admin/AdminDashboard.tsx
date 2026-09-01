import { useEffect, useState, useRef } from 'react'
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
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({ leads: 0, vendas: 0, consultorias: 0, trackingViews: 0 })
  const [leads, setLeads] = useState<any[]>([])
  const [chartData, setChartData] = useState<{ name: string; leads: number; vendas: number }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchData() {
      const [lc, ld, crm, v, p, c, track] = await Promise.all([
        supabase.from('leads_cursos').select('id, name, email, whatsapp, created_at'),
        supabase.from('leads').select('id, name, email, phone, created_at, product_type'),
        supabase.from('crm_leads').select('id, name, email, phone, created_at, lead_source'),
        supabase.from('vendas').select('id, amount, created_at').eq('status', 'pago'),
        supabase.from('purchases').select('id, amount_paid, created_at').eq('status', 'completed'),
        supabase.from('consultations').select('id, created_at'),
        supabase.from('channel_tracking').select('id', { count: 'exact' }),
      ])

      const allLeads = [
        ...(lc.data || []).map((l) => ({ ...l, type: 'Curso' })),
        ...(ld.data || []).map((l) => ({ ...l, type: l.product_type || 'Nutrição Geral' })),
        ...(crm.data || []).map((l) => ({ ...l, type: l.lead_source || 'CRM Nutrição' })),
      ]
      allLeads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      const totalVendas = (v.data || []).length + (p.data || []).length

      setMetrics({
        leads: allLeads.length,
        vendas: totalVendas,
        consultorias: (c.data || []).length,
        trackingViews: track.count || 0,
      })
      setLeads(allLeads.slice(0, 10))

      // Gerar gráfico real agrupando os últimos 4 meses
      const months = [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
      ]
      const currentMonthIdx = new Date().getMonth()
      const lastMonths = [
        (currentMonthIdx - 3 + 12) % 12,
        (currentMonthIdx - 2 + 12) % 12,
        (currentMonthIdx - 1 + 12) % 12,
        currentMonthIdx,
      ]

      const realChart = lastMonths.map((mIdx) => {
        const mName = months[mIdx]
        const mLeads = allLeads.filter((l) => new Date(l.created_at).getMonth() === mIdx).length
        const mVendas =
          (v.data || []).filter((item) => new Date(item.created_at).getMonth() === mIdx).length +
          (p.data || []).filter((item) => new Date(item.created_at).getMonth() === mIdx).length
        return { name: mName, leads: mLeads, vendas: mVendas }
      })

      setChartData(realChart)
    }
    fetchData()
  }, [])

  const handleTestBrevo = async () => {
    try {
      const res = await supabase.functions.invoke('integrate-brevo', {
        body: {
          email: 'contato@guialowcarb.com.br',
          nome: 'Adriana',
          mensagem: 'Teste de integração Brevo - Guia Low Carb',
        },
      })
      if (res.error) throw res.error
      toast({ title: 'Sucesso', description: 'Teste Brevo enviado com sucesso!' })
    } catch (e) {
      console.error(e)
      toast({ title: 'Erro', description: 'Erro ao testar Brevo', variant: 'destructive' })
    }
  }

  const handleSyncHotmart = async () => {
    try {
      const res = await supabase.functions.invoke('hotmart-sync', {
        body: {
          product: 'E-book Low Carb Avançado',
          buyer_email: 'contato@guialowcarb.com.br',
          status: 'pago',
          amount: 27.0,
        },
      })
      if (res.error) throw res.error
      toast({ title: 'Sucesso', description: 'Sincronização Hotmart mock acionada!' })
    } catch (e) {
      console.error(e)
      toast({ title: 'Erro', description: 'Erro na sincronização', variant: 'destructive' })
    }
  }

  const handleUploadEbook = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file)
      return toast({
        title: 'Aviso',
        description: 'Selecione um arquivo PDF',
        variant: 'destructive',
      })

    try {
      const { error } = await supabase.storage
        .from('materiais')
        .upload(`ebooks-gratuitos/ebook-gratuito.pdf`, file, {
          upsert: true,
        })
      if (error) throw error
      toast({ title: 'Sucesso', description: 'E-book atualizado com sucesso!' })
    } catch (e) {
      console.error(e)
      toast({
        title: 'Erro',
        description: 'Falha ao fazer upload do e-book',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <h1 className="text-3xl font-bold font-heading text-primary">CRM & Métricas</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total de Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{metrics.leads}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Vendas Realizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-secondary">{metrics.vendas}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Teleconsultas Agendadas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metrics.consultorias}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Eventos Rastreados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metrics.trackingViews}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-primary/20 shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-primary flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
            Gestão de Materiais (Storage)
          </h2>
          <div className="flex flex-col gap-4">
            <div className="p-4 bg-muted/30 rounded-lg border">
              <label className="text-sm font-medium mb-3 block">
                Upload E-book Gratuito (.pdf)
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="file"
                  accept=".pdf"
                  ref={fileInputRef}
                  className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 bg-background border rounded-md px-3 py-2 cursor-pointer"
                />
                <Button onClick={handleUploadEbook} className="bg-primary whitespace-nowrap">
                  Subir PDF
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                O arquivo ficará disponível imediatamente para novos leads na página
                /ebook-gratuito.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-secondary/20 shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-secondary flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m11.5 15.5 3-3-3-3" />
              <path d="M21.5 12.5h-10" />
              <path d="M15.5 11.5v-7a2 2 0 0 0-2-2h-10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" />
            </svg>
            Integrações & Automação
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={handleTestBrevo}
              variant="outline"
              className="border-blue-600/30 hover:bg-blue-50 hover:text-blue-700 text-blue-600 bg-transparent flex-1 min-w-[140px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Testar Brevo API
            </Button>
            <Button
              onClick={async () => {
                try {
                  const res = await supabase.functions.invoke('send-resend-email', {
                    body: {
                      from: 'onboarding@resend.dev',
                      to: 'guialowcarb@gmail.com',
                      subject: 'Teste de Envio Resend - Guia Low Carb',
                      html: '<p>Teste de envio com sucesso via <strong>Resend</strong>!</p>',
                    },
                  })
                  if (res.error) throw res.error
                  toast({ title: 'Sucesso', description: 'E-mail enviado com sucesso via Resend!' })
                } catch (e) {
                  console.error(e)
                  toast({
                    title: 'Erro',
                    description: 'Erro ao enviar e-mail via Resend',
                    variant: 'destructive',
                  })
                }
              }}
              variant="outline"
              className="border-emerald-600/30 hover:bg-emerald-50 hover:text-emerald-700 text-emerald-600 bg-transparent flex-1 min-w-[140px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
              Testar Resend API
            </Button>
            <Button
              onClick={handleSyncHotmart}
              className="bg-orange-500 hover:bg-orange-600 text-white flex-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M2 12h4l3-9 5 18 3-9h5" />
              </svg>
              Sync Webhook Hotmart
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Teste o envio de e-mails via Brevo e Resend, além da simulação de webhook de compra da
            Hotmart.
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
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

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Últimos Leads</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">Nome</TableHead>
                  <TableHead className="px-4">Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium px-4 py-3">
                      <div className="truncate w-[120px] sm:w-auto" title={lead.email}>
                        {lead.name}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-secondary/10 text-secondary whitespace-nowrap">
                        {lead.type}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {leads.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">
                      Nenhum lead encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
