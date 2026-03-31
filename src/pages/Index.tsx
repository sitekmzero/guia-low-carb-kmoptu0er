import { Link } from 'react-router-dom'
import { ArrowRight, Download, ShieldCheck, HeartPulse, BookOpen, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { toast } from '@/hooks/use-toast'

export default function Index() {
  const handleLeadCapture = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Sucesso!',
      description: 'Seu E-book foi enviado para o email cadastrado.',
      className: 'bg-primary text-primary-foreground border-none',
    })
  }

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Split */}
        <div className="absolute inset-0 flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 h-1/2 md:h-full relative">
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10" />
            <img
              src="https://img.usecurling.com/p/800/800?q=healthy%20food"
              alt="Nutrição"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 h-1/2 md:h-full relative">
            <div className="absolute inset-0 bg-secondary/10 mix-blend-multiply z-10" />
            <img
              src="https://img.usecurling.com/p/800/800?q=family%20insurance"
              alt="Proteção"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Overlay gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-background/95 via-background/80 to-transparent z-20" />
        </div>

        <div className="container mx-auto px-4 relative z-30">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              Saúde & Segurança Integradas
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Transforme seu corpo e proteja seu futuro.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 font-subheading">
              A união perfeita entre ciência nutricional para uma vida leve e planejamento
              estratégico para sua tranquilidade financeira.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-primary hover:bg-primary/90 text-md"
              >
                <Link to="/servicos">
                  Conheça os Serviços <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full text-md border-primary/20 hover:bg-primary/5"
              >
                <Link to="/sobre">Minha História</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-2xl shadow-soft p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 border border-border/50">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative w-48 h-64 bg-background shadow-xl rounded-md border transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 p-4 flex flex-col justify-between">
                  <h3 className="font-heading font-bold text-xl text-primary leading-tight">
                    Guia Low Carb
                  </h3>
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Para Iniciantes
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-3xl font-bold mb-4">
                Baixe Gratuitamente o E-book Guia Low Carb
              </h2>
              <p className="text-muted-foreground mb-8 font-subheading">
                Dê o primeiro passo para uma vida mais leve com nosso material exclusivo. Receitas
                fáceis e a base científica explicada de forma simples.
              </p>
              <form
                onSubmit={handleLeadCapture}
                className="flex flex-col sm:flex-row gap-3 max-w-lg"
              >
                <Input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  required
                  className="flex-1 bg-background"
                />
                <Button
                  type="submit"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground whitespace-nowrap"
                >
                  <Download className="mr-2 w-4 h-4" /> Quero meu PDF
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Soluções Completas para Você</h2>
            <p className="text-muted-foreground font-subheading">
              Atuamos em duas frentes essenciais: a manutenção da sua saúde física e a garantia do
              seu bem-estar financeiro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-md transition-all duration-300 border-primary/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <HeartPulse size={24} />
                </div>
                <CardTitle>Consultoria Nutricional</CardTitle>
                <CardDescription>
                  Acompanhamento focado em Low Carb e saúde metabólica.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Planos alimentares personalizados, focados em emagrecimento saudável, controle de
                  glicemia e longevidade.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="p-0 text-primary" asChild>
                  <Link to="/servicos">
                    Saiba mais <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="group hover:shadow-md transition-all duration-300 border-secondary/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={24} />
                </div>
                <CardTitle>Seguros e Consórcios</CardTitle>
                <CardDescription>
                  Proteção para sua família e planejamento do futuro.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Assessoria completa em seguros de vida, saúde e planos de consórcio para
                  construção de patrimônio sólido.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="p-0 text-secondary" asChild>
                  <Link to="/servicos">
                    Saiba mais <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="group hover:shadow-md transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-foreground mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen size={24} />
                </div>
                <CardTitle>Área do Aluno Premium</CardTitle>
                <CardDescription>Cursos, E-books e materiais exclusivos.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Acesso vitalício a uma biblioteca de conteúdos profundos sobre nutrição clínica e
                  estratégias financeiras.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="p-0" asChild>
                  <Link to="/dashboard">
                    Acessar portal <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Últimos Artigos</h2>
              <p className="text-muted-foreground font-subheading">
                Informação baseada em evidências.
              </p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link to="/blog">Ver todos</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Link to={`/blog/artigo-${i}`} key={i} className="group block">
                <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={`https://img.usecurling.com/p/600/400?q=diet&seed=${i}`}
                      alt="Thumbnail"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 block">
                      Nutrição
                    </span>
                    <h3 className="font-heading text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      Como a dieta Low Carb afeta a resistência à insulina?
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      Descubra os mecanismos fisiológicos por trás da redução de carboidratos e como
                      isso pode reverter quadros pré-diabéticos.
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild className="w-full">
              <Link to="/blog">Ver todos os artigos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-background overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">O que dizem nossos clientes</h2>
            <div className="flex justify-center gap-1 text-secondary">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} fill="currentColor" size={20} />
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <Carousel opts={{ align: 'start', loop: true }} className="w-full">
              <CarouselContent>
                {[1, 2, 3, 4].map((i) => (
                  <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/2 pl-4">
                    <div className="bg-card p-8 rounded-xl border shadow-sm h-full flex flex-col">
                      <p className="italic text-muted-foreground mb-6 flex-grow">
                        "O acompanhamento foi um divisor de águas. Não só perdi 15kg de forma
                        saudável com a Low Carb, mas a consultoria em seguros me deu a paz de
                        espírito que eu precisava para focar na minha saúde."
                      </p>
                      <div className="flex items-center gap-4 mt-auto">
                        <img
                          src={`https://img.usecurling.com/ppl/thumbnail?gender=${i % 2 === 0 ? 'female' : 'male'}&seed=${i}`}
                          alt="Avatar"
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <p className="font-bold text-sm">Cliente {i}</p>
                          <p className="text-xs text-muted-foreground">Consultoria Completa</p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-8 gap-4">
                <CarouselPrevious className="position-static transform-none w-10 h-10 border-primary text-primary hover:bg-primary hover:text-white" />
                <CarouselNext className="position-static transform-none w-10 h-10 border-primary text-primary hover:bg-primary hover:text-white" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>
    </div>
  )
}
