import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

export default function AdminAgendamentos() {
  const [consultations, setConsultations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConsultations()
  }, [])

  const fetchConsultations = async () => {
    const { data } = await supabase
      .from('consultations')
      .select('*')
      .order('scheduled_date', { ascending: true })
    if (data) setConsultations(data)
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('consultations').update({ status }).eq('id', id)
    if (error) {
      toast({ title: 'Erro', description: 'Falha ao atualizar status.', variant: 'destructive' })
      return
    }

    if (status === 'confirmed') {
      await supabase.functions.invoke('send-whatsapp-message', {
        body: {
          phone_number: '+5500000000000',
          message: 'Sua consulta foi confirmada!',
          message_type: 'confirmation',
        },
      })
    }

    toast({ title: 'Sucesso', description: 'Status da consulta atualizado.' })
    fetchConsultations()
  }

  if (loading)
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-heading text-primary">Gestão de Agendamentos</h1>
      <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data e Hora</TableHead>
              <TableHead>Tipo de Consulta</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consultations.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="font-medium">
                    {format(new Date(c.scheduled_date), 'dd MMM yyyy', { locale: ptBR })}
                  </div>
                  <div className="text-sm text-muted-foreground">{c.scheduled_time}</div>
                </TableCell>
                <TableCell className="capitalize">{c.consultation_type}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      c.status === 'confirmed'
                        ? 'default'
                        : c.status === 'cancelled'
                          ? 'destructive'
                          : 'secondary'
                    }
                  >
                    {c.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {c.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(c.id, 'confirmed')}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Confirmar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(c.id, 'cancelled')}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Cancelar
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {consultations.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Nenhum agendamento encontrado no sistema.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
