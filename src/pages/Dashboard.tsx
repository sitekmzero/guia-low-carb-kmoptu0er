import { useState, useEffect } from 'react'
import {
  FileText,
  Download,
  PlayCircle,
  BookOpen,
  LogOut,
  Lock,
  CheckCircle2,
  Unlock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

const INITIAL_MODULES = [
  {
    id: 1,
    title: 'Módulo 1: Fundamentos da Low Carb',
    type: 'text',
    progress: 100,
    items: [
      { id: 101, title: 'O que é resistência à insulina', completed: true },
      { id: 102, title: 'Adaptando o corpo a queimar gordura', completed: true },
    ],
  },
  {
    id: 2,
    title: 'Módulo 2: Montando seu Prato',
    type: 'text',
    progress: 50,
    items: [
      { id: 201, title: 'Proteínas, Gorduras e Fibras', completed: true },
      { id: 202, title: 'Lista de compras essencial', completed: false },
    ],
  },
  {
    id: 3,
    title: 'Material Complementar Premium',
    type: 'pdf',
    progress: 0,
    items: [
      {
        id: 301,
        title: 'E-book: 100 Receitas Low Carb',
        size: '15MB',
        downloadUrl: '#',
        locked: false,
      },
      {
        id: 302,
        title: 'Planner de Refeições 30 Dias',
        size: '5MB',
        downloadUrl: '#',
        locked: false,
      },
      {
        id: 303,
        title: 'Low Carb Avançado (50 págs)',
        size: '12MB',
        downloadUrl: '#',
        locked: true,
        isPremium: true,
      },
    ],
  },
]

export default function Dashboard() {
  const [modules, setModules] = useState(INITIAL_MODULES)
  const [activeModule, setActiveModule] = useState(INITIAL_MODULES[0])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isCheckingPayment, setIsCheckingPayment] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    // Sync active module with modules state if it changes
    const updatedActive = modules.find((m) => m.id === activeModule.id)
    if (updatedActive) setActiveModule(updatedActive)
  }, [modules])

  const handleDownload = async (item: any) => {
    if (item.locked && !item.isPremium) {
      toast({
        title: 'Conteúdo Bloqueado',
        description: 'Adquira na Hotmart para liberar.',
        variant: 'destructive',
      })
      return
    }

    if (item.isPremium && item.locked) {
      // Mock flow to unlock Premium Material
      setIsCheckingPayment(true)
      try {
        const emailToCheck = user?.email || 'adriana.araujo@kmzero.com.br' // fallback for demo

        // Verifica se existe compra paga para este e-book
        const { data, error } = await supabase
          .from('vendas')
          .select('*')
          .eq('buyer_email', emailToCheck)
          .eq('status', 'pago')
          .limit(1)

        if (data && data.length > 0) {
          toast({
            title: 'Pagamento Confirmado!',
            description: 'Gerando link seguro de download...',
            className: 'bg-primary text-white border-none',
          })

          // Gera URL Assinada (Mocked for Demo since file might not exist yet)
          // In real prod, this calls: supabase.storage.from('materiais').createSignedUrl('ebooks-pagos/avancado.pdf', 3600)

          setTimeout(() => {
            // Unlock locally
            const newModules = [...modules]
            const premiumModuleIndex = newModules.findIndex((m) => m.id === 3)
            const premiumItemIndex = newModules[premiumModuleIndex].items.findIndex(
              (i: any) => i.id === 303,
            )

            newModules[premiumModuleIndex].items[premiumItemIndex].locked = false
            setModules(newModules)
            toast({
              title: 'Acesso Liberado',
              description: 'O material agora está disponível para download.',
            })
          }, 1500)
        } else {
          toast({
            title: 'Pagamento não encontrado',
            description:
              'Não localizamos uma venda aprovada para o seu e-mail. Adquira via Hotmart primeiro.',
            variant: 'destructive',
          })
        }
      } catch (e) {
        console.error(e)
      } finally {
        setIsCheckingPayment(false)
      }
      return
    }

    toast({ title: 'Download Iniciado', description: `Baixando ${item.title}...` })
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-muted/20 border-t">
      {/* Sidebar Navigation */}
      <aside
        className={`bg-card border-r transition-all duration-300 flex-shrink-0 z-20 ${isSidebarOpen ? 'w-full md:w-80' : 'w-0 overflow-hidden md:w-0'}`}
      >
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="font-bold text-lg font-heading">Meus Cursos</h2>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-140px)]">
          {modules.map((mod) => (
            <div key={mod.id} className="border-b last:border-0">
              <button
                className={`w-full text-left p-4 hover:bg-muted/50 transition-colors flex flex-col gap-2 ${activeModule.id === mod.id ? 'bg-muted/80 border-l-4 border-primary' : ''}`}
                onClick={() => setActiveModule(mod)}
              >
                <div className="flex items-center gap-3">
                  {mod.type === 'pdf' ? (
                    <BookOpen className="w-5 h-5 text-secondary" />
                  ) : (
                    <PlayCircle className="w-5 h-5 text-primary" />
                  )}
                  <span className="font-semibold text-sm">{mod.title}</span>
                </div>
                <div className="flex items-center gap-2 pl-8 w-full">
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${mod.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{mod.progress}%</span>
                </div>
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col ${!isSidebarOpen ? 'ml-0' : ''}`}>
        <div className="md:hidden bg-card border-b p-4 flex justify-between items-center">
          <Button variant="outline" size="sm" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? 'Ver Conteúdo' : 'Ver Módulos'}
          </Button>
          <span className="font-semibold text-sm truncate ml-4">{activeModule.title}</span>
        </div>

        <div className="flex-1 p-6 md:p-10 overflow-y-auto max-w-4xl mx-auto w-full animate-fade-in">
          <div className="mb-8">
            <span className="inline-block py-1 px-3 rounded bg-muted text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-3">
              {activeModule.type === 'pdf' ? 'Downloads' : 'Aulas em Texto'}
            </span>
            <h1 className="text-3xl font-bold font-heading text-primary">{activeModule.title}</h1>
          </div>

          <div className="bg-card rounded-xl border shadow-sm p-6 md:p-8">
            {activeModule.type === 'text' ? (
              <div className="space-y-6">
                <p className="text-muted-foreground mb-6 text-lg">
                  Neste módulo, você aprenderá a base conceitual para aplicar as estratégias no seu
                  dia a dia.
                </p>
                <div className="space-y-4">
                  {activeModule.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 transition-colors bg-background"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium text-sm md:text-base">{item.title}</span>
                      </div>
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : (
                        <Button size="sm" variant="ghost" className="text-muted-foreground">
                          Marcar concluído
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-10 border-t prose prose-sm md:prose-base dark:prose-invert max-w-none font-sans">
                  <h3 className="text-primary font-heading text-2xl">Conteúdo da Aula</h3>
                  <p>
                    A resistência à insulina é um mecanismo de defesa do corpo contra o excesso de
                    energia crônico, originado principalmente por carboidratos refinados e
                    ultraprocessados.
                  </p>
                  <p>
                    Para reverter esse quadro, precisamos "esvaziar" os estoques de glicogênio. É aí
                    que a dieta Low Carb entra como uma ferramenta terapêutica fantástica,
                    permitindo que seus hormônios voltem a um estado de equilíbrio.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground mb-6 text-lg">
                  Acesse seus materiais de apoio, e-books e planilhas exclusivas.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeModule.items.map((item: any) => (
                    <div
                      key={item.id}
                      className={`flex flex-col p-6 rounded-xl border bg-background relative overflow-hidden transition-all ${item.locked ? 'border-dashed border-muted-foreground/30 bg-muted/10' : 'border-primary/20 hover:shadow-md'}`}
                    >
                      {item.locked && !item.isPremium && (
                        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                          <div className="bg-card p-3 rounded-full shadow-md">
                            <Lock className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </div>
                      )}
                      <div className="flex items-start justify-between mb-4 relative z-20">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.locked ? 'bg-muted text-muted-foreground' : 'bg-secondary/10 text-secondary'}`}
                        >
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded bg-muted text-muted-foreground">
                          {item.size}
                        </span>
                      </div>

                      <h4 className="font-semibold text-lg mb-2 relative z-20">{item.title}</h4>

                      {item.isPremium && item.locked && (
                        <p className="text-xs text-muted-foreground mb-4">
                          Material premium (R$27). Valide sua compra para liberar o download.
                        </p>
                      )}

                      <div className="mt-auto pt-4 relative z-20">
                        <Button
                          onClick={() => handleDownload(item)}
                          disabled={isCheckingPayment && item.isPremium}
                          variant={
                            item.locked ? (item.isPremium ? 'default' : 'outline') : 'default'
                          }
                          className={`w-full ${!item.locked ? 'bg-primary hover:bg-primary/90 text-white' : ''} ${item.isPremium && item.locked ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}
                        >
                          {isCheckingPayment && item.isPremium ? (
                            'Verificando...'
                          ) : item.locked ? (
                            item.isPremium ? (
                              <>
                                <Unlock className="w-4 h-4 mr-2" /> Liberar Acesso
                              </>
                            ) : (
                              'Desbloquear'
                            )
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" /> Baixar PDF
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 flex justify-end">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sair da Plataforma
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
