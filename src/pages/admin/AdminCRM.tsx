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
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { Loader2, Search, Filter, Phone, Mail, User } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function AdminCRM() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchLeads = async () => {
      const { data, error } = await supabase
        .from('crm_leads')
        .select('*')
        .order('lead_score', { ascending: false })
        .limit(50)

      if (data) setLeads(data)
      setLoading(false)
    }
    fetchLeads()
  }, [])

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-red-100 text-red-800 border-red-200'
    if (score >= 40) return 'bg-orange-100 text-orange-800 border-orange-200'
    return 'bg-blue-100 text-blue-800 border-blue-200'
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold font-heading text-primary">CRM & Pipeline</h1>
        <Button className="bg-primary">Adicionar Lead Manual</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col">
            <span className="text-sm text-muted-foreground mb-1">Total de Leads</span>
            <span className="text-2xl font-bold">{leads.length}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col">
            <span className="text-sm text-muted-foreground mb-1">
              Leads Quentes (Score &gt; 70)
            </span>
            <span className="text-2xl font-bold text-red-600">
              {leads.filter((l) => l.lead_score >= 70).length}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col">
            <span className="text-sm text-muted-foreground mb-1">Em Negociação</span>
            <span className="text-2xl font-bold text-orange-600">
              {leads.filter((l) => l.lead_status === 'negotiating').length}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col">
            <span className="text-sm text-muted-foreground mb-1">Taxa de Conversão</span>
            <span className="text-2xl font-bold text-green-600">4.2%</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b flex flex-col sm:flex-row items-center justify-between gap-4">
          <CardTitle className="text-lg">Gestão de Leads</CardTitle>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou e-mail..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Último Contato</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <span className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" /> {lead.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getScoreColor(lead.lead_score)}>
                        {lead.lead_score} pts
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {lead.lead_status.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {lead.lead_source || 'Desconhecido'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {lead.last_contacted
                        ? new Date(lead.last_contacted).toLocaleDateString('pt-BR')
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {lead.lead_score >= 70 ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-600 hover:bg-red-50 text-xs"
                          onClick={async () => {
                            try {
                              await supabase.functions.invoke('update-lead-score', {
                                body: { lead_id: lead.id, points: 0, action: 'manual_alert' },
                              })
                              toast({
                                title: 'Alerta Enviado ao Slack',
                                description: `Notificação de Lead Quente para ${lead.name} reenviada.`,
                              })
                            } catch (e: any) {
                              toast({
                                title: 'Erro ao notificar',
                                description: e.message,
                                variant: 'destructive',
                              })
                            }
                          }}
                        >
                          Notificar Slack
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm">
                          Ver Detalhes
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLeads.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum lead encontrado para os filtros atuais.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
