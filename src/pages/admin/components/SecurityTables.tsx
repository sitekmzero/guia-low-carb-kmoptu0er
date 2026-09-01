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
import { Users, Activity } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export function SecurityUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfiles() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id, email, full_name, is_admin, role, created_at')
          .order('created_at', { ascending: false })

        if (error) throw error
        setUsers(data || [])
      } catch (err) {
        console.error('Erro ao buscar perfis:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfiles()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" /> Perfis e Acesso Administrativo
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Carregando usuários...
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Nível de Acesso</TableHead>
                <TableHead>Criado Em</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.email || 'Sem e-mail'}</TableCell>
                  <TableCell>{u.full_name || 'Usuário'}</TableCell>
                  <TableCell>
                    <Badge variant={u.is_admin ? 'default' : 'outline'}>
                      {u.is_admin ? 'Admin' : u.role || 'Usuário'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString('pt-BR') : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-600">Ativo</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    Nenhum perfil de usuário retornado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

export function SecurityAuditLog() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAuditLogs() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20)

        if (error) {
          setLogs([])
        } else {
          setLogs(data || [])
        }
      } catch (err) {
        console.error('Erro ao buscar logs:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAuditLogs()
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" /> Log de Auditoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">Carregando logs...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Entidade</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground text-xs">
                    {new Date(l.created_at).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="font-medium">{l.action}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {l.entity_type}
                  </TableCell>
                  <TableCell className="text-sm">
                    {l.user_email || l.user_id || 'Sistema'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        l.status === 'Success' || l.status === 'completed' ? 'default' : 'secondary'
                      }
                    >
                      {l.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {logs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    Nenhum registro de auditoria gravado ainda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
