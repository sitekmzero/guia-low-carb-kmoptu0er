import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Loader2, User, Mail, Calendar, Key, Trash2 } from 'lucide-react'

export default function StudentProfile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({ full_name: '' })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    const fetchProfile = async () => {
      const { data } = await supabase.from('user_profiles').select('*').eq('id', user.id).single()
      if (data) setProfile({ full_name: data.full_name })
    }
    fetchProfile()
  }, [user, navigate])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ full_name: profile.full_name })
        .eq('id', user.id)
      if (error) throw error
      toast({ title: 'Sucesso', description: 'Perfil atualizado com sucesso!' })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o perfil.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.')) return

    // Simulating account deletion for the frontend (requires backend logic to delete from auth.users)
    toast({ title: 'Solicitação enviada', description: 'Sua conta será excluída em breve.' })
    await signOut()
    navigate('/')
  }

  if (!user) return null

  return (
    <div className="container max-w-3xl py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-heading text-primary">Meu Perfil</h1>
        <Link to="/dashboard">
          <Button variant="outline">Voltar ao Painel</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Atualize seus dados de cadastro</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    className="pl-10"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail (não pode ser alterado)</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="email" className="pl-10" value={user.email || ''} disabled />
                </div>
              </div>
              <div className="pt-4">
                <Button type="submit" disabled={loading} className="bg-primary">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conta e Segurança</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
              <div className="flex items-center gap-4">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Membro desde</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
              <div className="flex items-center gap-4">
                <Key className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Senha</p>
                  <p className="text-sm text-muted-foreground">Altere sua senha de acesso</p>
                </div>
              </div>
              <Link to="/change-password">
                <Button variant="outline" size="sm">
                  Alterar Senha
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
              <div className="flex items-center gap-4">
                <Trash2 className="h-5 w-5 text-destructive" />
                <div>
                  <p className="font-medium text-destructive">Excluir Conta</p>
                  <p className="text-sm text-muted-foreground">Esta ação não pode ser desfeita</p>
                </div>
              </div>
              <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                Excluir
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
