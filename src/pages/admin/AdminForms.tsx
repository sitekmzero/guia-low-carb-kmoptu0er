import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Eye, Users, FileText, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function AdminForms() {
  const [loading, setLoading] = useState(true)
  const [counts, setCounts] = useState({
    leadsGratuito: 0,
    leadsCursos: 0,
    leadsContato: 0,
    totalViews: 0,
  })

  useEffect(() => {
    async function loadFormsData() {
      try {
        setLoading(true)
        const [lgRes, lcRes, ldRes, trRes] = await Promise.all([
          supabase
            .from('leads')
            .select('id', { count: 'exact' })
            .eq('product_type', 'ebook-gratuito'),
          supabase.from('leads_cursos').select('id', { count: 'exact' }),
          supabase.from('leads').select('id', { count: 'exact' }),
          supabase.from('channel_tracking').select('id', { count: 'exact' }),
        ])

        setCounts({
          leadsGratuito: lgRes.count || 0,
          leadsCursos: lcRes.count || 0,
          leadsContato: ldRes.count || 0,
          totalViews: trRes.count || 0,
        })
      } catch (err) {
        console.error('Erro ao carregar dados de formulários:', err)
      } finally {
        setLoading(false)
      }
    }

    loadFormsData()
  }, [])

  const totalLeads = counts.leadsContato + counts.leadsCursos

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary">Captura & Formulários</h1>
          <p className="text-muted-foreground">
            Monitoramento das taxas de captura dos formulários ativos no site.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Eye className="w-4 h-4 mr-2 text-primary" /> Visualizações Rastreadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{counts.totalViews}</p>
                <p className="text-xs text-muted-foreground">Eventos de acesso registrados</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-secondary" /> Formulários Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">E-book, Contato e Cursos</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Users className="w-4 h-4 mr-2 text-emerald-600" /> Leads Capturados (Total)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-emerald-600">{totalLeads}</p>
                <p className="text-xs text-muted-foreground">Registros reais no banco</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Formulários do Site</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Formulário / Página</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Tabela Destino</TableHead>
                    <TableHead className="text-right">Leads Gravados</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">E-book Gratuito (/ebook-gratuito)</TableCell>
                    <TableCell>Progressive Form / Modal</TableCell>
                    <TableCell className="font-mono text-xs">public.leads</TableCell>
                    <TableCell className="text-right font-bold">{counts.leadsGratuito}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Formulário de Contato (/contato)</TableCell>
                    <TableCell>In-Page Form</TableCell>
                    <TableCell className="font-mono text-xs">public.leads / crm_leads</TableCell>
                    <TableCell className="text-right font-bold">{counts.leadsContato}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Interesse em Cursos (/cursos)</TableCell>
                    <TableCell>Inscrição Direta</TableCell>
                    <TableCell className="font-mono text-xs">public.leads_cursos</TableCell>
                    <TableCell className="text-right font-bold">{counts.leadsCursos}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
