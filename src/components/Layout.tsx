import { Link, Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-4 flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="https://idtvwxzbmnqjcyxquqdk.supabase.co/storage/v1/object/public/Guia%20Low%20Carb/Imagens%20Adriana/AdrianaA.jpeg"
              alt="Guia Low Carb Logo"
              className="h-12 w-auto object-cover rounded-full shadow-md border-2 border-primary/20"
            />
            <span className="font-bold font-heading text-xl text-primary hidden md:inline-block">
              Guia Low Carb
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/sobre" className="text-sm font-medium hover:text-primary transition-colors">
              Sobre
            </Link>
            <Link
              to="/servicos"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Serviços
            </Link>
            <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">
              Blog
            </Link>
            <Link
              to="/ebook-gratuito"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              E-book Grátis
            </Link>
            <Link
              to="/contato"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Contato
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button
                variant="default"
                className="hidden md:flex bg-primary hover:bg-primary/90 text-white rounded-full px-6"
              >
                Área do Aluno
              </Button>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-primary">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-6 mt-12">
                  <Link to="/" className="text-lg font-medium hover:text-primary">
                    Home
                  </Link>
                  <Link to="/sobre" className="text-lg font-medium hover:text-primary">
                    Sobre
                  </Link>
                  <Link to="/servicos" className="text-lg font-medium hover:text-primary">
                    Serviços
                  </Link>
                  <Link to="/blog" className="text-lg font-medium hover:text-primary">
                    Blog
                  </Link>
                  <Link to="/ebook-gratuito" className="text-lg font-medium hover:text-primary">
                    E-book Gratuito
                  </Link>
                  <Link to="/contato" className="text-lg font-medium hover:text-primary">
                    Contato
                  </Link>
                  <Link to="/dashboard" className="text-lg font-bold mt-6 text-primary">
                    Área do Aluno
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col w-full">
        <Outlet />
      </main>

      <footer className="border-t bg-muted/30 py-10 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Guia Low Carb - Nutrição Clínica Avançada. Todos os
            direitos reservados.
          </p>
          <div className="mt-4 flex justify-center gap-4 text-xs text-muted-foreground">
            <Link to="#" className="hover:text-primary transition-colors">
              Termos de Uso
            </Link>
            <Link to="#" className="hover:text-primary transition-colors">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
