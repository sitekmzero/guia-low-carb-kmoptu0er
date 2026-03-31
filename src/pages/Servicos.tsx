import { Link } from 'react-router-dom'
import { Calendar, Check, ExternalLink, Activity, ShieldPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Servicos() {
  return (
    <div className="flex flex-col w-full pb-20">
      {/* Header */}
      <section className="bg-muted py-16 md:py-24 text-center">
        <div className="container mx-auto px-4 max-w-3xl animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Como Posso Ajudar Você?</h1>
          <p className="text-lg text-muted-foreground font-subheading">
            Conheça nossos pilares de atuação: Consultoria Nutricional especializada e Soluções em
            Proteção Financeira e Patrimonial.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 -mt-10 relative z-10">
        <Tabs defaultValue="nutricao" className="w-full max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 h-14 bg-background border shadow-sm rounded-xl p-1">
            <TabsTrigger
              value="nutricao"
              className="rounded-lg text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Activity className="w-4 h-4 mr-2" /> Nutrição Clínica
            </TabsTrigger>
            <TabsTrigger
              value="protecao"
              className="rounded-lg text-base font-semibold data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
            >
              <ShieldPlus className="w-4 h-4 mr-2" /> Proteção Financeira
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nutricao" className="mt-8 space-y-12 animate-fade-in">
            {/* Description */}
            <div className="grid md:grid-cols-2 gap-10 items-center bg-card p-8 rounded-2xl border shadow-sm">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-primary">
                  Consultoria em Saúde Metabólica
                </h3>
                <p className="text-muted-foreground mb-6">
                  Um acompanhamento focado em resultados reais através da abordagem Low Carb e
                  Cetogênica. Ideal para quem busca emagrecimento definitivo, controle de glicemia,
                  energia constante e longevidade.
                </p>
                <ul className="space-y-3">
                  {[
                    'Avaliação clínica detalhada e requisição de exames',
                    'Plano alimentar 100% individualizado',
                    'Acesso ao aplicativo exclusivo',
                    'Suporte via WhatsApp para dúvidas',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-5 h-5 text-primary shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="aspect-video bg-muted rounded-xl flex items-center justify-center relative overflow-hidden">
                <img
                  src="https://img.usecurling.com/p/600/400?q=salad"
                  alt="Consultoria"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            </div>

            {/* Pricing / Products */}
            <div>
              <h3 className="text-2xl font-bold mb-8 text-center">
                Acesse Nossos Materiais Premium
              </h3>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* E-book */}
                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle>E-book Receitas Low Carb</CardTitle>
                    <CardDescription>Para o dia a dia prático.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="text-3xl font-bold mb-4">R$ 47,90</div>
                    <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" /> +100 Receitas testadas
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" /> Opções doces e salgadas
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" /> Lista de compras
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-[#F36324] hover:bg-[#F36324]/90 text-white"
                      asChild
                    >
                      <a href="https://hotmart.com" target="_blank" rel="noreferrer">
                        Comprar na Hotmart <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>

                {/* Course */}
                <Card className="flex flex-col border-primary shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    MAIS VENDIDO
                  </div>
                  <CardHeader>
                    <CardTitle>Programa Domine Seu Metabolismo</CardTitle>
                    <CardDescription>Curso completo + Área do Aluno.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="text-3xl font-bold mb-4">
                      R$ 297,00{' '}
                      <span className="text-sm font-normal text-muted-foreground line-through">
                        R$ 497
                      </span>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" /> 6 Módulos em texto/PDF
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" /> Acesso vitalício na Área do Aluno
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" /> Grupo VIP de apoio
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-[#F36324] hover:bg-[#F36324]/90 text-white"
                      asChild
                    >
                      <a href="https://hotmart.com" target="_blank" rel="noreferrer">
                        Garantir Vaga <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="protecao" className="mt-8 space-y-12 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-10 items-center bg-card p-8 rounded-2xl border shadow-sm">
              <div className="order-2 md:order-1 aspect-video bg-muted rounded-xl relative overflow-hidden">
                <img
                  src="https://img.usecurling.com/p/600/400?q=family%20home"
                  alt="Proteção"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-2xl font-bold mb-4 text-secondary">Planejamento e Segurança</h3>
                <p className="text-muted-foreground mb-6">
                  Imprevistos não avisam quando vão chegar. Nossa assessoria ajuda você a construir
                  um escudo protetor ao redor do seu patrimônio e da sua família, garantindo paz de
                  espírito.
                </p>
                <ul className="space-y-3">
                  {[
                    'Seguro de Vida e Doenças Graves',
                    'Planos de Saúde (Pessoa Física e Jurídica)',
                    'Consórcios para Imóveis e Veículos',
                    'Análise de perfil sem custo',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-5 h-5 text-secondary shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  asChild
                >
                  <a href="#agendamento">Agendar Diagnóstico Gratuito</a>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Calendly Integration */}
      <section id="agendamento" className="py-24 bg-muted/20 mt-20 border-t">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-4">Agende Sua Sessão</h2>
            <p className="text-muted-foreground">
              Escolha o melhor horário na agenda abaixo para conversarmos, seja sobre nutrição ou
              planejamento financeiro.
            </p>
          </div>

          {/* Mock Calendly Wrapper */}
          <div className="bg-card rounded-xl shadow-lg border p-1 border-border/50 h-[600px] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-background/50 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
              <Calendar className="w-16 h-16 text-primary mb-4 opacity-50" />
              <p className="font-semibold text-lg">Integração Calendly</p>
              <p className="text-sm text-muted-foreground mb-4">
                Widget carregaria aqui em produção
              </p>
              <Button
                onClick={() =>
                  toast({
                    title: 'Agendamento Simulado',
                    description: 'O widget do Calendly abriria aqui.',
                  })
                }
              >
                Simular Agendamento
              </Button>
            </div>
            {/* Visual background for the mock */}
            <div className="w-full h-full bg-slate-50 flex items-start p-8">
              <div className="w-1/3 border-r h-full pr-8">
                <div className="w-16 h-16 bg-slate-200 rounded-full mb-4"></div>
                <div className="h-6 w-3/4 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
              </div>
              <div className="w-2/3 pl-8">
                <div className="h-8 w-1/3 bg-slate-200 rounded mb-8"></div>
                <div className="grid grid-cols-7 gap-2">
                  {Array(31)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="aspect-square bg-slate-100 rounded-full"></div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
