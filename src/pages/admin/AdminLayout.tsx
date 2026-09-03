import { Link, Outlet, Navigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Settings,
  Shield,
  Mail,
  LogOut,
  Users,
  CalendarDays,
  FolderSync,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const NAV = [
  { name: 'CRM', path: '/admin', icon: LayoutDashboard },
  { name: 'Agendamentos', path: '/admin/agendamentos', icon: CalendarDays },
  { name: 'Estúdio IA', path: '/admin/estudio', icon: FileText },
  { name: 'Blog/Posts', path: '/admin/posts', icon: FileText },
  { name: 'Conteúdo Drive', path: '/admin/drive', icon: FolderSync },
  { name: 'Tema/Aparência', path: '/admin/settings', icon: Settings },
  { name: 'Segurança', path: '/admin/security', icon: Shield },
  { name: 'SMTP/CDN', path: '/admin/smtp', icon: Mail },
]

export default function AdminLayout() {
  const { session, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) return null
  if (!session || !isAdmin) return <Navigate to="/admin/login" replace />

  const handleLogout = () => supabase.auth.signOut()

  return (
    <div className="flex h-screen bg-muted/30">
      <aside className="w-64 bg-card border-r flex flex-col">
        <div className="p-6 border-b">
          <span className="font-heading font-bold text-primary text-xl">Admin Panel</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {NAV.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                location.pathname === item.path
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:bg-muted',
              )}
            >
              <item.icon size={18} /> {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-muted-foreground hover:text-destructive"
          >
            <LogOut size={18} className="mr-2" /> Sair
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8 max-w-[1200px] mx-auto w-full">
        <Outlet />
      </main>
    </div>
  )
}
