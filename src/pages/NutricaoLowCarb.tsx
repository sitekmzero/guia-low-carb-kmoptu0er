import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useSEO } from '@/services/seo'
import { SchemaMarkup } from '@/components/SchemaMarkup'
import { ExitIntentPopup } from '@/components/ExitIntentPopup'
import { trackEvent } from '@/services/analytics'
import { SocialProof } from '@/components/SocialProof'
import { ABTestVariant } from '@/components/ABTestVariant'
import { Award, HeartPulse, Activity, CheckCircle, ChevronRight } from 'lucide-react'

export default function NutricaoLowCarb() {
  useSEO(
    'Nutrição Low-Carb: Transforme Sua Saúde',
    'Descubra como a nutrição low-carb pode transformar sua saúde. Guia completo com receitas, dicas e consultoria de nutricionista clínica.',
  )

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Adriana Araújo, Nutricionista',
    image:
      'https://wfuwhozrwyqkqdovzers.supabase.co/storage/v1/object/public/Imagens/Fotos/Adriana%20consultorio.png',
    jobTitle: 'Nutricionista Clínica',
    url: 'https://www.guialowcarb.com.br',
  }

  const handleCTAClick = (location: string) => {
    trackEvent('cta_click', {
      cta_text: 'Baixar Guia Gratuito',
      cta_location: location,
      page_path: '/nutricao-low-carb',
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SchemaMarkup schema={schema} />
      <ExitIntentPopup />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 space-y-6 z-10 animate-fade-in-up">
            <ABTestVariant
              testName="seo-hero-headline"
              variants={{
                A: (
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight">
                    Nutrição Low-Carb: <span className="text-primary">Transforme Sua Saúde</span>
                  </h1>
                ),
                B: (
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight">
                    Emagrecimento Saudável com{' '}
                    <span className="text-primary">Nutrição Low-Carb</span>
                  </h1>
                ),
              }}
            />
            <p className="text-xl text-muted-foreground font-subheading">
              Guia completo para emagrecimento e bem-estar com nutrição clínica e foco no longo
              prazo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                size="lg"
                variant="cta"
                className="h-14 px-8 text-lg rounded-full w-full sm:w-auto"
                onClick={() => handleCTAClick('hero')}
              >
                <Link to="/ebook-gratuito">
                  Baixar Guia Gratuito <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="w-full md:w-1/2 relative animate-fade-in-up animation-delay-200">
            <img
              src="https://wfuwhozrwyqkqdovzers.supabase.co/storage/v1/object/public/Imagens/Fotos/Adriana%20consultorio.png"
              alt="Adriana Araújo Nutricionista"
              className="rounded-2xl shadow-2xl object-cover aspect-[4/5] md:aspect-square w-full"
              loading="lazy"
              width="600"
              height="600"
            />
            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-xl border flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Award className="text-primary w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-foreground">Nutricionista Clínica</p>
                <p className="text-sm text-muted-foreground">Especialista Certificada</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">20+ Anos de Experiência</h3>
              <p className="text-muted-foreground">Atendimento focado em resultados reais</p>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">Nutricionista Clínica</h3>
              <p className="text-muted-foreground">Abordagem científica e personalizada</p>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">Especialista em Diabetes</h3>
              <p className="text-muted-foreground">Reversão e controle da resistência à insulina</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
              Benefícios da Abordagem Low-Carb
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubra como a redução estratégica de carboidratos pode impactar seu corpo e sua
              mente.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                icon: Activity,
                title: 'Emagrecimento Saudável',
                desc: 'Perda de gordura consistente sem passar fome.',
              },
              {
                icon: HeartPulse,
                title: 'Controle de Diabetes',
                desc: 'Estabilização natural dos níveis de açúcar no sangue.',
              },
              {
                icon: CheckCircle,
                title: 'Mais Energia',
                desc: 'Fim dos picos e quedas de energia durante o dia.',
              },
              {
                icon: HeartPulse,
                title: 'Saúde Metabólica',
                desc: 'Melhora no colesterol e redução de inflamação.',
              },
              {
                icon: CheckCircle,
                title: 'Sem Restrições Severas',
                desc: 'Alimentação baseada em comida de verdade e saciedade.',
              },
            ].map((benefit, i) => (
              <div
                key={i}
                className="bg-card p-6 rounded-2xl shadow-sm border border-primary/5 hover:border-primary/20 transition-colors text-center"
              >
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center text-primary mb-12">
            Histórias de Sucesso
          </h2>
          <SocialProof />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center text-primary mb-12">
            Perguntas Frequentes
          </h2>
          <Accordion type="single" collapsible className="w-full bg-card rounded-2xl border p-2">
            {[
              {
                q: 'A dieta low-carb é segura para todos?',
                a: 'A abordagem low-carb é muito segura e baseada em evidências científicas. No entanto, se você tem condições médicas específicas, gestantes ou crianças, sempre recomendamos acompanhamento profissional para adaptar o plano.',
              },
              {
                q: 'Vou passar fome reduzindo carboidratos?',
                a: 'Pelo contrário! A dieta low-carb prioriza proteínas e gorduras boas, que trazem muito mais saciedade do que os carboidratos refinados. A maioria dos pacientes relata ausência de fome constante.',
              },
              {
                q: 'Como a dieta ajuda no controle da Diabetes?',
                a: 'Ao reduzir a ingestão de carboidratos (que viram açúcar no sangue), evitamos os picos de glicose e insulina, permitindo que o pâncreas descanse e a sensibilidade à insulina melhore.',
              },
              {
                q: 'Posso praticar exercícios fazendo low-carb?',
                a: 'Sim. Após um período de adaptação (ceto-adaptação), seu corpo se torna eficiente em queimar a própria gordura corporal como combustível, o que é excelente para o rendimento.',
              },
              {
                q: 'Quanto tempo leva para ver resultados?',
                a: 'Os resultados variam de pessoa para pessoa. Contudo, é muito comum ver redução de inchaço e peso já nas primeiras semanas, além do aumento imediato de disposição.',
              },
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b-0 px-4">
                <AccordionTrigger className="text-left font-semibold text-lg hover:text-primary transition-colors">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Pronto para Transformar Sua Saúde?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Deixe a ciência trabalhar a seu favor. Agende uma consulta online e tenha um plano feito
            exclusivamente para o seu metabolismo.
          </p>
          <Button
            asChild
            size="lg"
            variant="cta"
            className="h-14 px-8 text-lg font-bold rounded-full w-full sm:w-auto"
            onClick={() =>
              trackEvent('cta_click', {
                cta_text: 'Agendar Consulta Gratuita',
                cta_location: 'footer',
                page_path: '/nutricao-low-carb',
              })
            }
          >
            <Link to="/teleconsulta">Agendar Consulta Gratuita</Link>
          </Button>
        </div>
      </section>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md border-t md:hidden z-50">
        <Button
          asChild
          variant="cta"
          className="w-full h-12 text-lg font-bold"
          onClick={() => trackEvent('sticky_cta_click', { page_path: '/nutricao-low-carb' })}
        >
          <Link to="/teleconsulta">Agendar Consulta</Link>
        </Button>
      </div>
    </div>
  )
}
