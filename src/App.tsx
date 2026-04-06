import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { lazy, Suspense } from 'react'
import { Navigate } from 'react-router-dom'
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
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminSettings from './pages/admin/AdminSettings'
import EbooksPagos from './pages/EbooksPagos'
import AdminAgendamentos from './pages/admin/AdminAgendamentos'
import { AuthProvider } from './hooks/use-auth'
import { PageTracker } from './components/PageTracker'
import { TrackingInitializer } from './components/TrackingInitializer'
import { Loader2 } from 'lucide-react'

const Cursos = lazy(() => import('./pages/Cursos'))
const Teleconsulta = lazy(() => import('./pages/Teleconsulta'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const NutricaoLowCarb = lazy(() => import('./pages/NutricaoLowCarb'))
const ConsultaNutricional = lazy(() => import('./pages/ConsultaNutricional'))
const AdminCampaigns = lazy(() => import('./pages/admin/AdminCampaigns'))
const AdminABTests = lazy(() => import('./pages/admin/AdminABTests'))
const AdminCROMetrics = lazy(() => import('./pages/admin/AdminCROMetrics'))
const AdminSecurity = lazy(() => import('./pages/admin/AdminSecurity'))
const AdminSMTP = lazy(() => import('./pages/admin/AdminSMTP'))
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'))
const AdminCRM = lazy(() => import('./pages/admin/AdminCRM'))
const AdminExecutiveDashboard = lazy(() => import('./pages/admin/AdminExecutiveDashboard'))
const AdminPurchases = lazy(() => import('./pages/admin/AdminPurchases'))
const AdminReports = lazy(() => import('./pages/admin/AdminReports'))
const AdminForms = lazy(() => import('./pages/admin/AdminForms'))
const AdminLeadAnalytics = lazy(() => import('./pages/admin/AdminLeadAnalytics'))
const AdminTracking = lazy(() => import('./pages/admin/AdminTracking'))

const StudentLogin = lazy(() => import('./pages/auth/StudentLogin'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'))
const ChangePassword = lazy(() => import('./pages/auth/ChangePassword'))
const StudentProfile = lazy(() => import('./pages/StudentProfile'))

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense
    fallback={
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    }
  >
    {children}
  </Suspense>
)

const App = () => (
  <AuthProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TrackingInitializer />
      <PageTracker />
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
            <Route
              path="/login"
              element={
                <SuspenseWrapper>
                  <StudentLogin />
                </SuspenseWrapper>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <SuspenseWrapper>
                  <ForgotPassword />
                </SuspenseWrapper>
              }
            />
            <Route
              path="/reset-password"
              element={
                <SuspenseWrapper>
                  <ResetPassword />
                </SuspenseWrapper>
              }
            />
            <Route
              path="/change-password"
              element={
                <SuspenseWrapper>
                  <ChangePassword />
                </SuspenseWrapper>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <SuspenseWrapper>
                  <StudentProfile />
                </SuspenseWrapper>
              }
            />
            <Route
              path="/cursos"
              element={
                <SuspenseWrapper>
                  <Cursos />
                </SuspenseWrapper>
              }
            />
            <Route
              path="/teleconsulta"
              element={
                <SuspenseWrapper>
                  <Teleconsulta />
                </SuspenseWrapper>
              }
            />
            <Route
              path="/nutricao-low-carb"
              element={
                <SuspenseWrapper>
                  <NutricaoLowCarb />
                </SuspenseWrapper>
              }
            />
            <Route
              path="/consulta-nutricional"
              element={
                <SuspenseWrapper>
                  <ConsultaNutricional />
                </SuspenseWrapper>
              }
            />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <SuspenseWrapper>
                <AdminLayout />
              </SuspenseWrapper>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route
              path="blog"
              element={
                <SuspenseWrapper>
                  <AdminBlog />
                </SuspenseWrapper>
              }
            />
            <Route path="posts" element={<Navigate replace to="/admin/blog" />} />
            <Route path="agendamentos" element={<AdminAgendamentos />} />
            <Route
              path="crm"
              element={
                <SuspenseWrapper>
                  <AdminCRM />
                </SuspenseWrapper>
              }
            />
            <Route
              path="dashboard-executivo"
              element={
                <SuspenseWrapper>
                  <AdminExecutiveDashboard />
                </SuspenseWrapper>
              }
            />
            <Route
              path="purchases"
              element={
                <SuspenseWrapper>
                  <AdminPurchases />
                </SuspenseWrapper>
              }
            />
            <Route
              path="reports"
              element={
                <SuspenseWrapper>
                  <AdminReports />
                </SuspenseWrapper>
              }
            />
            <Route
              path="forms"
              element={
                <SuspenseWrapper>
                  <AdminForms />
                </SuspenseWrapper>
              }
            />
            <Route
              path="lead-analytics"
              element={
                <SuspenseWrapper>
                  <AdminLeadAnalytics />
                </SuspenseWrapper>
              }
            />
            <Route
              path="campaigns"
              element={
                <SuspenseWrapper>
                  <AdminCampaigns />
                </SuspenseWrapper>
              }
            />
            <Route
              path="ab-tests"
              element={
                <SuspenseWrapper>
                  <AdminABTests />
                </SuspenseWrapper>
              }
            />
            <Route
              path="cro-metrics"
              element={
                <SuspenseWrapper>
                  <AdminCROMetrics />
                </SuspenseWrapper>
              }
            />
            <Route
              path="security"
              element={
                <SuspenseWrapper>
                  <AdminSecurity />
                </SuspenseWrapper>
              }
            />
            <Route
              path="tracking"
              element={
                <SuspenseWrapper>
                  <AdminTracking />
                </SuspenseWrapper>
              }
            />
            <Route
              path="smtp"
              element={
                <SuspenseWrapper>
                  <AdminSMTP />
                </SuspenseWrapper>
              }
            />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AuthProvider>
)

export default App
