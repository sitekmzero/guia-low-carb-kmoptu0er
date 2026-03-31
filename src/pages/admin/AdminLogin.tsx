import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loadingLocal, setLoadingLocal] = useState(false)
  const navigate = useNavigate()
  const { session, isAdmin, loading } = useAuth()

  if (loading) return null
  if (session && isAdmin) return <Navigate to="/admin" replace />

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingLocal(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast({ title: 'Erro', description: 'Credenciais inválidas.', variant: 'destructive' })
      setLoadingLocal(false)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-soft border">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary font-heading">Acesso Admin</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            required
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            required
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            disabled={loadingLocal}
            className="w-full bg-secondary hover:bg-[#158A68] text-white"
          >
            {loadingLocal ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  )
}
