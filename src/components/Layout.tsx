import { Link, Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Menu, X, ArrowUp, Instagram, Facebook, Linkedin, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { name: 'Início', path: '/' },
  { name: 'Sobre Mim', path: '/sobre' },
  { name: 'Serviços', path: '/servicos' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contato', path: '/contato' },
]

export default function Layout() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showTopBtn, setShowTopBtn] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      setShowTopBtn(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Top progress bar simulation on route change
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    setProgress(100)
    const timer = setTimeout(() => setProgress(0), 500)
    window.scrollTo(0, 0)
    return () => clearTimeout(timer)
  }, [location.pathname])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Loading Progress */}
      <div
        className="fixed top-0 left-0 h-1 bg-primary z-[100] transition-all duration-300 ease-out"
        style={{ width: `${progress}%`, opacity: progress > 0 ? 1 : 0 }}
      />

      {/* Header */}
      <header
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-300',
          isScrolled ? 'glass-header py-3' : 'bg-transparent py-5',
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="https://idtvwxzbmnqjcyxquqdk.supabase.co/storage/v1/object/public/Guia%20Low%20Carb/Logo/Guia%20Low%20Carb%20nova%20logo%20transp.svg"
              alt="Guia Low Carb"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-sm font-medium font-subheading transition-colors hover:text-primary link-underline pb-1',
                  location.pathname === link.path ? 'text-primary' : 'text-foreground/80',
                )}
              >
                {link.name}
              </Link>
            ))}
            <Button
              asChild
              className="rounded-full px-6 bg-primary hover:bg-[#158A68] text-white transition-colors"
            >
              <Link to="/vendas-cursos">Saiba Mais</Link>
            </Button>
          </nav>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col pt-16">
                <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                <nav className="flex flex-col gap-6">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={cn(
                        'text-lg font-medium font-subheading transition-colors hover:text-primary',
                        location.pathname === link.path ? 'text-primary' : 'text-foreground',
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      asChild
                      className="w-full rounded-full bg-primary hover:bg-[#158A68] text-white"
                    >
                      <Link to="/vendas-cursos">Saiba Mais</Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-card border-t pt-16 pb-8 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1">
              <Link to="/" className="block mb-4">
                <img
                  src="https://idtvwxzbmnqjcyxquqdk.supabase.co/storage/v1/object/public/Guia%20Low%20Carb/Logo/Guia%20Low%20Carb%20nova%20logo%20transp.svg"
                  alt="Guia Low Carb"
                  className="h-10 w-auto"
                />
              </Link>
              <p className="text-muted-foreground text-sm font-subheading mb-6">
                Ciência que transforma. Amor que inspira.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-lg mb-4">Links Rápidos</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link to="/sobre" className="hover:text-primary transition-colors">
                    Sobre Mim
                  </Link>
                </li>
                <li>
                  <Link to="/servicos" className="hover:text-primary transition-colors">
                    Serviços e Consultoria
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-primary transition-colors">
                    Blog Low Carb
                  </Link>
                </li>
                <li>
                  <Link to="/contato" className="hover:text-primary transition-colors">
                    Fale Conosco
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-lg mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Política de Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Aviso Médico
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-lg mb-4">Publicidade</h4>
              {/* AdSense Placeholder */}
              <div className="adsense-placeholder">Espaço Publicitário (AdSense)</div>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Guia Low Carb. Todos os direitos reservados.</p>
            <p className="mt-2 md:mt-0">Desenvolvido com foco em conversão e saúde.</p>
          </div>
        </div>
      </footer>

      {/* Floating Actions */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <a
          href="https://wa.me/5511999999999"
          target="_blank"
          rel="noreferrer"
          className="bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center group"
          aria-label="Contato via WhatsApp"
        >
          <MessageCircle size={24} />
          <span className="absolute right-full mr-4 bg-foreground text-background text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Fale comigo
          </span>
        </a>

        {showTopBtn && (
          <button
            onClick={scrollToTop}
            className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 hover:scale-110 transition-all animate-fade-in"
            aria-label="Voltar ao topo"
          >
            <ArrowUp size={24} />
          </button>
        )}
      </div>
    </div>
  )
}
