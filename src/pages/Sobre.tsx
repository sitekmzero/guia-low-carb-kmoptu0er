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
    c: 'Gabriel me disse que achava que estava fadado a ser gordo para sempre, até que finalmente entendeu que não era verdade. Essa jornada me mostrou que a verdadeira proteção não é só patrimonial, mas também blindar a saúde e o futuro da família com ciência e amor. Não por currículo. Por missão.',
    i: Heart,
  },
]

const pilares = [
  {
    t: 'Saúde Metabólica',
    c: 'Nutrição clínica com foco em diabetes, emagrecimento sustentável e longevidade. Embasamento com mais de 20 anos de pesquisa.',
    i: Heart,
  },
  {
    t: 'Proteção Patrimonial',
    c: 'Corretora SUSEP há mais de 20 anos. Soluções completas e seguras em seguros de vida, saúde, automóvel e empresarial.',
    i: Shield,
  },
  {
    t: 'Visão de Risco',
    c: 'Abordagem integrada única: protegemos o corpo através da saúde e blindamos a estabilidade financeira e o futuro da sua família.',
    i: Activity,
  },
]

export default function Sobre() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[400px] md:min-h-[600px] flex items-center justify-center bg-gradient-to-b from-primary/90 to-background/5 dark:to-background px-6 pt-24 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black/40 dark:bg-black/60">
          <img
            src="https://idtvwxzbmnqjcyxquqdk.supabase.co/storage/v1/object/public/Guia%20Low%20Carb/Imagens%20Adriana/Adriana%20jaleco%20fundo%20branco.jpeg"
            alt="Adriana de Freitas Oliveira Araújo"
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>
        <div className="relative z-10 text-center max-w-3xl animate-fade-in-up">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-md">
            Não por currículo. Por missão.
          </h1>
          <p className="text-lg md:text-2xl text-white/90 font-medium mb-10 drop-shadow">
            Ciência que transforma. Amor que inspira.
          </p>
          <Button
            size="lg"
            className="bg-primary text-white hover:bg-primary/80 rounded-full px-8 py-6 text-lg transition-transform hover:scale-105"
            asChild
          >
            <a href="#historia">Conheça minha história</a>
          </Button>
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
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">O Diferencial Único</h2>
          <h3 className="text-xl text-muted-foreground font-medium">
            Onde nutrição clínica encontra proteção patrimonial
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

      {/* Credenciais */}
      <Section>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Formação e Credenciais
          </h2>
          <h3 className="text-xl text-muted-foreground font-medium">
            Expertise construída ao longo de duas décadas
          </h3>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-muted/50 p-8 rounded-2xl border">
            <h4 className="text-xl font-bold text-primary mb-6 flex items-center gap-3">
              <Shield className="text-primary" /> Seguros & Proteção
            </h4>
            <ul className="space-y-4">
              {[
                'Habilitada pela SUSEP desde 2003',
                'CEO Km Zero Corretora de Seguros',
                'Bacharel em Administração (Uniube)',
                'Especialista em Seguros de Vida, Auto e Empresarial',
              ].map((item, j) => (
                <li key={j} className="flex items-start gap-3 text-foreground/80">
                  <CheckCircle2 size={20} className="text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-muted/50 p-8 rounded-2xl border">
            <h4 className="text-xl font-bold text-primary mb-6 flex items-center gap-3">
              <GraduationCap className="text-primary" /> Nutrição & Ciência
            </h4>
            <ul className="space-y-4">
              {[
                'Nutricionista Clínica (CRN 28762)',
                'Bacharel em Nutrição Clínica (UFTM)',
                'Especialista em Diabetes e Metabolismo',
                'Especialista em Nutrição Esportiva e Bariátrica',
              ].map((item, j) => (
                <li key={j} className="flex items-start gap-3 text-foreground/80">
                  <CheckCircle2 size={20} className="text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
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
              Transformar vidas através de nutrição clínica humanizada e proteção patrimonial
              integrada, combinando ciência rigorosa com amor genuíno pelo bem-estar.
            </p>
          </div>
          <div className="bg-card border p-8 md:p-10 rounded-2xl shadow-sm">
            <h3 className="text-2xl font-bold text-primary mb-4">Nossa Visão</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Ser referência em saúde integral e proteção financeira, criando um mundo onde cada
              pessoa tem acesso a segurança para proteger sua família.
            </p>
          </div>
        </div>
        <div className="text-center">
          <h4 className="text-xl font-bold text-primary mb-6">Nossos Valores</h4>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {['Ética', 'Humanização', 'Ciência', 'Transparência', 'Empatia', 'Inovação'].map(
              (v) => (
                <span
                  key={v}
                  className="px-6 py-2 bg-primary/10 text-primary font-medium rounded-full text-sm md:text-base"
                >
                  {v}
                </span>
              ),
            )}
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
              em Uberaba - MG e acredito que saúde e proteção não são luxos — são a base de qualquer
              projeto de vida que vale a pena construir.
            </p>
            <p className="text-lg font-bold text-white border-l-4 border-white/30 pl-4 py-2 italic">
              "Tudo o que fazemos é, em última análise, para proteger e cuidar de quem amamos."
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
          Você merece uma abordagem que cuida de você por inteiro, protegendo seu corpo e a sua
          família.
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
