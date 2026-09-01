import React, { useEffect } from 'react'
import { useSEO } from '@/services/seo'
import { trackEvent } from '@/services/analytics'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Clock, Award, Star } from 'lucide-react'

export default function ConsultaNutricional() {
  useSEO(
    'Consulta Nutricional Personalizada: Plano Customizado',
    'Agende sua consulta nutricional. Plano personalizado para emagrecimento, diabetes e bem-estar.',
  )

  useEffect(() => {
    // Hidden tracking for page entry on ad landing page
    trackEvent('ad_landing_page_view', { page: '/consulta-nutricional' })
  }, [])

  const handleConsultationClick = () => {
    trackEvent('consulta_cta_click', {
      event_category: 'conversion',
      page_path: '/consulta-nutricional',
    })
    window.location.href = '/teleconsulta'
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Minimal Header */}
      <header className="py-6 border-b">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-heading font-bold text-primary">Adriana Araújo</h1>
          <p className="text-sm text-muted-foreground">Nutricionista Clínica Especializada</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 relative">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <span className="inline-block px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-bold mb-6">
            ⏳ Primeira Consulta com 30% de Desconto
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-foreground leading-tight">
            Consulta Nutricional <span className="text-primary">Personalizada</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Descubra o plano nutricional ideal para você. Emagrecimento, energia e controle de
            diabetes sem passar fome.
          </p>

          <Button
            onClick={handleConsultationClick}
            variant="cta"
            className="w-full sm:w-auto h-16 px-10 text-xl font-bold shadow-lg transition-transform hover:scale-105"
          >
            Agendar Consulta Agora
          </Button>

          <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-sm text-muted-foreground font-medium">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" /> Nutricionista Certificada
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> 20+ Anos de Experiência
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-muted/30 border-y">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid sm:grid-cols-2 gap-8">
            {[
              {
                title: 'Plano Personalizado',
                desc: 'Feito exclusivamente para seu metabolismo, rotina e preferências.',
              },
              {
                title: 'Acompanhamento Contínuo',
                desc: 'Suporte humanizado para garantir que você atinja suas metas.',
              },
              {
                title: 'Resultados Comprovados',
                desc: 'Metodologia baseada em ciência e aplicada em centenas de pacientes.',
              },
              {
                title: 'Suporte Especializado',
                desc: 'Orientação precisa para reversão de resistência à insulina e inflamação.',
              },
            ].map((prop, i) => (
              <div key={i} className="flex gap-4 items-start bg-card p-6 rounded-xl border">
                <ShieldCheck className="w-8 h-8 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2">{prop.title}</h3>
                  <p className="text-muted-foreground">{prop.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-heading font-bold mb-10">O que nossos pacientes dizem</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                name: 'Ricardo Oliveira',
                text: 'Perdi 12kg sem passar fome. A Adriana mudou minha relação com a comida.',
              },
              {
                name: 'Fernanda Lima',
                text: 'Minha glicemia normalizou no segundo mês de acompanhamento. Excelente!',
              },
              {
                name: 'Camila Silva',
                text: 'Finalmente encontrei uma nutri que entende minha rotina corrida.',
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-card p-6 rounded-xl border shadow-sm flex flex-col items-center text-center"
              >
                <div className="flex gap-1 text-yellow-500 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm italic mb-4 flex-grow">"{t.text}"</p>
                <p className="font-bold text-primary">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Objections / FAQ */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-heading font-bold text-center mb-10">Dúvidas Comuns</h2>
          <div className="space-y-6">
            <div className="bg-background p-6 rounded-xl border">
              <h3 className="text-xl font-bold mb-2 text-primary">Quanto custa?</h3>
              <p className="text-muted-foreground">
                O investimento na sua saúde começa com a teleconsulta. Aproveite o desconto de 30%
                na primeira sessão para conhecer nossa metodologia e receber seu plano inicial.
              </p>
            </div>
            <div className="bg-background p-6 rounded-xl border">
              <h3 className="text-xl font-bold mb-2 text-primary">
                Quanto tempo leva para ver resultados?
              </h3>
              <p className="text-muted-foreground">
                A grande maioria dos pacientes relata melhoria na energia, qualidade do sono e
                desinchaço logo na primeira semana de plano adequado.
              </p>
            </div>
            <div className="bg-background p-6 rounded-xl border">
              <h3 className="text-xl font-bold mb-2 text-primary">Funciona para mim?</h3>
              <p className="text-muted-foreground">
                Sim! O plano é 100% personalizado. Não entregamos dietas de gaveta. Analisamos seu
                histórico, exames e rotina para criar algo que seja sustentável para você.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-4xl font-heading font-bold mb-6">Não deixe para depois</h2>
          <p className="text-xl mb-10 opacity-90">
            Sua saúde é o seu maior patrimônio. Dê o primeiro passo hoje mesmo.
          </p>
          <Button
            onClick={handleConsultationClick}
            size="lg"
            variant="cta"
            className="w-full sm:w-auto h-16 px-12 text-xl font-bold rounded-full shadow-xl"
          >
            Agendar Agora com 30% OFF
          </Button>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Guia Low Carb. Todos os direitos reservados.</p>
      </footer>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t md:hidden z-50">
        <Button
          onClick={handleConsultationClick}
          variant="cta"
          className="w-full h-14 text-lg font-bold shadow-lg"
        >
          Agendar Consulta Agora
        </Button>
      </div>
    </div>
  )
}
