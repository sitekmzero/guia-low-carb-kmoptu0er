import { Link } from 'react-router-dom'
import { Heart, Shield, Activity, GraduationCap, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useRef, useState, ReactNode } from 'react'
import { cn } from '@/lib/utils'

function useReveal() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setIsVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, isVisible }
}

function Section({
  children,
  alt,
  className,
  id,
}: {
  children: ReactNode
  alt?: boolean
  className?: string
  id?: string
}) {
  const { ref, isVisible } = useReveal()
  return (
    <section
      id={id}
      ref={ref}
      className={cn(
        'py-16 md:py-24 px-6 md:px-12 transition-all duration-700 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12',
        alt ? 'bg-muted/30 dark:bg-muted/10' : 'bg-background',
        className,
      )}
    >
      <div className="max-w-5xl mx-auto">{children}</div>
    </section>
  )
}

const timeline = [
  {
    t: 'O Dia do Basta',
    s: 'Quando a vida nos força a escolher',
    c: 'Em 2015, o chão se abriu debaixo dos meus pés. Sentada no consultório de uma endocrinologista com meu filho Gabriel, então com pouco mais de 20 anos e quase 25 quilos acima do peso, ouvimos: síndrome metabólica. A palavra que eu ouvi foi: falha. Naquele dia tomei uma decisão: eu não ia aceitar aquilo. Fui para casa e comecei a estudar.',
    i: Activity,
  },
  {
    t: 'A Virada Científica',
    s: 'Quando a curiosidade se torna expertise',
    c: 'Mergulhei fundo em pesquisas sobre Low Carb. Testei em mim mesma e eliminei 14 quilos em três meses sem fome. Gabriel seguiu o caminho e eliminou quase 30 quilos em seis meses, revertendo a síndrome metabólica. Essa experiência transformadora me motivou a ir além: em 2022, formei-me em Nutrição Clínica pela UFTM.',
    i: GraduationCap,
  },
  {
    t: 'A Transformação de Gabriel',
    s: 'Quando a ciência encontra o amor de mãe',
    c: 'Gabriel me disse que achava que estava fadado a ser gordo para sempre, até que finalmente entendeu que não era verdade. Essa jornada me mostrou que a verdadeira proteção é blindar a saúde e a longevidade da família com ciência, acolhimento e amor. Não por currículo. Por missão.',
    i: Heart,
  },
]

const pilares = [
  {
    t: 'Saúde Metabólica',
    c: 'Nutrição clínica com foco em resistência insulínica, diabetes, emagrecimento sustentável e longevidade com embasamento científico.',
    i: Heart,
  },
  {
    t: 'Comportamento Alimentar',
    c: 'Compreensão profunda da relação entre mente e metabolismo, promovendo autonomia alimentar sem dietas punitivas.',
    i: Shield,
  },
  {
    t: 'Prevenção & Longevidade',
    c: 'Abordagem clínica focada em prevenir doenças crônicas, restaurar marcadores inflamatórios e garantir vitalidade.',
    i: Activity,
  },
]

import { useSEO } from '@/services/seo'

export default function Sobre() {
  useSEO(
    'Sobre Adriana Araújo | Nutricionista Clínica Guia Low Carb',
    'Conheça a história, formação e compromisso da nutricionista Adriana Araújo com a nutrição clínica baseada em evidências.',
    'sobre nutricionista, adriana araujo, nutricao clinica, uftm',
    '/og-image.png',
    'https://www.guialowcarb.com.br/sobre',
    'https://www.guialowcarb.com.br/sobre',
  )
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[580px] md:min-h-[680px] flex items-center justify-center bg-gradient-to-b from-primary/95 via-primary/85 to-background dark:to-background px-6 pt-28 pb-20 overflow-hidden">
        <div className="container max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="w-full md:w-3/5 text-center md:text-left animate-fade-in-up">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-sm font-semibold border border-white/20">
              Nutrição Clínica & Ciência Metabólica
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-md font-heading">
              Não por currículo. Por missão.
            </h1>
            <p className="text-lg md:text-2xl text-white/90 font-medium mb-8 drop-shadow">
              Ciência que transforma. Amor que inspira.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-bold rounded-full px-8 py-6 text-lg transition-transform hover:scale-105 shadow-xl"
                asChild
              >
                <a href="#historia">Conheça Minha História</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6 text-lg border-white text-white hover:bg-white/10"
                asChild
              >
                <Link to="/teleconsulta">Agendar Consulta</Link>
              </Button>
            </div>
          </div>
          <div className="w-full md:w-2/5 flex justify-center animate-fade-in-up animation-delay-200">
            <div className="relative w-full max-w-xs md:max-w-sm rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/30 bg-primary-foreground/10 backdrop-blur-sm">
              <img
                src="https://wfuwhozrwyqkqdovzers.supabase.co/storage/v1/object/public/Imagens/Fotos/Adriana%20consultorio.png"
                alt="Adriana de Freitas Oliveira Araújo"
                className="w-full h-auto object-contain object-top"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <Section id="historia">
        <div className="space-y-16 md:space-y-24 relative before:absolute before:inset-0 before:ml-5 md:before:mx-auto before:-translate-x-px md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary/30 before:to-transparent">
          {timeline.map((item, i) => (
            <div
              key={i}
              className={cn(
                'relative flex flex-col md:flex-row gap-8 md:gap-16 items-start',
                i % 2 === 0 ? 'md:flex-row-reverse' : '',
              )}
            >
              <div className="hidden md:flex w-1/2 justify-end" />
              <div className="absolute left-0 md:left-1/2 w-10 h-10 -ml-5 md:-ml-5 rounded-full bg-primary flex items-center justify-center text-white border-4 border-background z-10 shadow-lg">
                <item.i size={18} />
              </div>
              <div className="w-full md:w-1/2 pl-12 md:pl-0">
                <div
                  className={cn(
                    'bg-card p-6 md:p-8 rounded-2xl shadow-soft border border-border/50',
                    i % 2 === 0 ? 'md:text-right' : 'md:text-left',
                  )}
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">{item.t}</h2>
                  <h3 className="text-lg text-muted-foreground mb-4 font-medium">{item.s}</h3>
                  <p className="text-foreground/80 leading-relaxed">{item.c}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Diferencial */}
      <Section alt>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Pilares do Cuidado Clínico
          </h2>
          <h3 className="text-xl text-muted-foreground font-medium">
            Nutrição baseada em evidências e humanização individualizada
          </h3>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {pilares.map((p, i) => (
            <div
              key={i}
              className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <p.i size={28} />
              </div>
              <h4 className="text-xl font-bold text-primary mb-3">{p.t}</h4>
              <p className="text-muted-foreground leading-relaxed">{p.c}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Credenciais e Foto */}
      <Section>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Formação e Credenciais
          </h2>
          <h3 className="text-xl text-muted-foreground font-medium">
            Qualificação técnica e compromisso com o Código de Ética do Nutricionista
          </h3>
        </div>
        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-primary/20 bg-background/50">
              <img
                src="https://wfuwhozrwyqkqdovzers.supabase.co/storage/v1/object/public/Imagens/Fotos/Adriana%20consultorio.png"
                alt="Adriana Araújo Nutricionista Clínica"
                className="w-full h-auto object-contain object-top"
              />
            </div>
          </div>
          <div className="md:col-span-7 bg-muted/50 p-8 md:p-10 rounded-2xl border space-y-6">
            <h4 className="text-2xl font-bold text-primary flex items-center gap-3">
              <GraduationCap className="text-primary w-7 h-7" /> Nutrição & Ciência Clínica
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              Atuação pautada estritamente nas melhores práticas de nutrição clínica, respeitando a
              individualidade bioquímica de cada paciente e aplicando estratégias Low Carb validadas
              pela literatura internacional.
            </p>
            <ul className="space-y-4 pt-2">
              {[
                'Nutricionista Clínica (CRN 28762)',
                'Bacharel em Nutrição Clínica (UFTM)',
                'Especialista em Diabetes, Resistência Insulínica e Metabolismo',
                'Especialista em Nutrição Esportiva e Acompanhamento Bariátrico',
                'Pesquisadora contínua em estratégias Low Carb e Cetogênicas',
              ].map((item, j) => (
                <li key={j} className="flex items-start gap-3 text-foreground/90">
                  <CheckCircle2 size={20} className="text-primary shrink-0 mt-0.5" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Missão e Visão */}
      <Section alt>
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-primary text-white p-8 md:p-10 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Nossa Missão</h3>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              Transformar vidas através de nutrição clínica humanizada, combinando ciência rigorosa
              com acolhimento genuíno para devolver a liberdade metabólica a cada paciente.
            </p>
          </div>
          <div className="bg-card border p-8 md:p-10 rounded-2xl shadow-sm">
            <h3 className="text-2xl font-bold text-primary mb-4">Nossa Visão</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Ser referência em saúde metabólica, nutrição preventiva e longevidade no Brasil,
              inspirando uma relação livre de culpa com a alimentação e resultados duradouros.
            </p>
          </div>
        </div>
        <div className="text-center">
          <h4 className="text-xl font-bold text-primary mb-6">Nossos Valores</h4>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {[
              'Ética Profissional',
              'Humanização',
              'Ciência',
              'Transparência',
              'Empatia',
              'Inovação',
            ].map((v) => (
              <span
                key={v}
                className="px-6 py-2 bg-primary/10 text-primary font-medium rounded-full text-sm md:text-base"
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* Família */}
      <Section className="bg-gradient-to-br from-primary/90 to-primary text-white">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
            <img
              src="https://img.usecurling.com/p/800/600?q=family&color=green"
              alt="Família"
              className="rounded-2xl shadow-xl hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Família e Raízes</h2>
            <h3 className="text-xl text-primary-foreground/80 mb-8 font-medium">
              O coração por trás da profissão
            </h3>
            <p className="text-lg text-primary-foreground/90 leading-relaxed mb-6">
              Sou esposa de Luiz Fernando, mãe de Lucas e Gabriel, e avó apaixonada do Arthur. Vivo
              em Uberaba - MG e acredito que saúde integral e bem-estar não são luxos — são a base
              de qualquer projeto de vida que vale a pena construir.
            </p>
            <p className="text-lg font-bold text-white border-l-4 border-white/30 pl-4 py-2 italic">
              "Tudo o que fazemos é, em última análise, para devolver vitalidade e cuidar de quem
              amamos."
            </p>
          </div>
        </div>
      </Section>

      {/* CTA Final */}
      <Section className="text-center pb-24">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
          Vamos Transformar Seu Futuro?
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Você merece uma abordagem que cuida do seu metabolismo por inteiro, trazendo saúde
          duradoura e qualidade de vida.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="rounded-full text-lg px-8 py-6" asChild>
            <Link to="/teleconsulta">Agendar Consulta</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full text-lg px-8 py-6 border-primary text-primary"
            asChild
          >
            <Link to="/ebooks-pagos">Conhecer Produtos</Link>
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="rounded-full text-lg px-8 py-6 text-primary hover:bg-primary/5"
            asChild
          >
            <Link to="/contato">Falar com Adriana</Link>
          </Button>
        </div>
      </Section>
    </div>
  )
}
