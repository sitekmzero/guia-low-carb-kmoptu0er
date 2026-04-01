import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import Index from './pages/Index'
import Sobre from './pages/Sobre'
import Servicos from './pages/Servicos'
import Blog from './pages/Blog'
import Article from './pages/Article'
import Contato from './pages/Contato'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import VendasSeguros from './pages/VendasSeguros'
import VendasCursos from './pages/VendasCursos'
import EbookGratuito from './pages/EbookGratuito'
import ObrigadoEbook from './pages/ObrigadoEbook'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminPosts from './pages/admin/AdminPosts'
import AdminSettings from './pages/admin/AdminSettings'
import EbooksPagos from './pages/EbooksPagos'
import Cursos from './pages/Cursos'
import Teleconsulta from './pages/Teleconsulta'
import AdminAgendamentos from './pages/admin/AdminAgendamentos'
import { AuthProvider } from './hooks/use-auth'

const App = () => (
  <AuthProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<Article />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vendas-seguros" element={<VendasSeguros />} />
            <Route path="/vendas-cursos" element={<VendasCursos />} />
            <Route path="/ebook-gratuito" element={<EbookGratuito />} />
            <Route path="/obrigado-ebook" element={<ObrigadoEbook />} />
            <Route path="/ebooks-pagos" element={<EbooksPagos />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/teleconsulta" element={<Teleconsulta />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="agendamentos" element={<AdminAgendamentos />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AuthProvider>
)

export default App
