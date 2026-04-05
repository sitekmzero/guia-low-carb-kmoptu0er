import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  FileText,
  Download,
  PlayCircle,
  BookOpen,
  LogOut,
  Settings,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function Dashboard() {
  const [purchases, setPurchases] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchStudentData = async () => {
      try {
        // Fetch purchases to display e-books and general products
        const { data: pData, error: pError } = await supabase
          .from('purchases')
          .select('*, products(*)')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .order('purchased_at', { ascending: false })

        if (pError) throw pError

        // Fetch user courses (differentiated from simple purchases)
        const { data: cData, error: cError } = await supabase
          .from('user_courses')
          .select('*, products(*)')
          .eq('user_id', user.id)

        if (cError) throw cError

        setPurchases(pData || [])
        setCourses(cData || [])
      } catch (err) {
        console.error(err)
        toast({
          title: 'Erro',
          description: 'Falha ao carregar seus materiais.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [user, navigate])

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const handleDownload = async (item: any) => {
    toast({
      title: 'Download Iniciado',
      description: `Baixando ${item.products?.name || 'Arquivo'}...`,
    })
    // In a real app, track download here in download_history table
    try {
      if (user) {
        await supabase.from('download_history').insert({
          user_id: user.id,
          product_id: item.product_id,
          product_name: item.products?.name || 'Arquivo',
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-6xl py-10">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  const hasContent = purchases.length > 0 || courses.length > 0

  return (
    <div className="min-h-[calc(100vh-80px)] bg-muted/10 pb-12">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container max-w-6xl py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading text-primary">Painel do Aluno</h1>
            <p className="text-muted-foreground text-sm">
              Bem-vindo(a) de volta! Continue seu aprendizado.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard/profile">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" /> Meu Perfil
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl py-8 space-y-10">
        {!hasContent ? (
          <Card className="border-dashed border-2 py-12 text-center bg-transparent">
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold">Você ainda não tem nenhum conteúdo</h2>
              <p className="text-muted-foreground max-w-md">
                Adquira nossos cursos ou e-books para começar sua jornada de transformação e
                proteção.
              </p>
              <Link to="/cursos" className="mt-4">
                <Button className="bg-primary">Explorar Produtos</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Courses Section */}
            {courses.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <PlayCircle className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Meus Cursos</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => {
                    const expiryDate = course.access_until ? new Date(course.access_until) : null
                    const isExpired = expiryDate ? expiryDate < new Date() : false

                    return (
                      <Card
                        key={course.id}
                        className="overflow-hidden hover:shadow-md transition-all flex flex-col"
                      >
                        <div className="h-32 bg-primary/10 relative">
                          {course.products?.image_url && (
                            <img
                              src={course.products.image_url}
                              alt={course.products.name}
                              className="w-full h-full object-cover opacity-80 mix-blend-multiply"
                            />
                          )}
                          {isExpired && (
                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm">
                              <span className="bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Acesso Expirado
                              </span>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-5 flex-1 flex flex-col">
                          <h3 className="font-bold text-lg mb-2 line-clamp-2">
                            {course.products?.name || 'Curso em Vídeo'}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                            {course.products?.description}
                          </p>

                          <div className="mt-auto space-y-4">
                            {!isExpired && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs font-medium">
                                  <span>Progresso</span>
                                  <span className="text-primary">0%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-primary" style={{ width: '0%' }}></div>
                                </div>
                              </div>
                            )}

                            {expiryDate && (
                              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>Acesso até: {expiryDate.toLocaleDateString('pt-BR')}</span>
                              </div>
                            )}

                            <Button
                              className={`w-full ${isExpired ? 'bg-secondary hover:bg-secondary/90' : 'bg-primary'}`}
                              disabled={isExpired}
                            >
                              {isExpired ? 'Renovar Acesso' : 'Continuar Assistindo'}
                              {!isExpired && <ArrowRight className="w-4 h-4 ml-2" />}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </section>
            )}

            {/* E-books Section */}
            {purchases.filter((p) => p.products?.category === 'e-book').length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="w-6 h-6 text-secondary" />
                  <h2 className="text-2xl font-bold">Meus E-books & Materiais</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {purchases
                    .filter((p) => p.products?.category === 'e-book')
                    .map((purchase) => (
                      <Card
                        key={purchase.id}
                        className="hover:border-secondary/50 transition-colors"
                      >
                        <CardContent className="p-4 flex flex-col h-full">
                          <div className="w-10 h-10 rounded bg-secondary/10 text-secondary flex items-center justify-center mb-3">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <h4 className="font-semibold text-sm mb-1 leading-tight">
                            {purchase.products?.name || 'Material PDF'}
                          </h4>
                          <p className="text-[10px] text-muted-foreground mt-auto mb-3">
                            Adquirido em:{' '}
                            {new Date(purchase.purchased_at).toLocaleDateString('pt-BR')}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-xs"
                            onClick={() => handleDownload(purchase)}
                          >
                            <Download className="w-3 h-3 mr-2" /> Baixar PDF
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}
