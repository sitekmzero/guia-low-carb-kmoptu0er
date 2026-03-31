import { CheckCircle2 } from 'lucide-react'

export default function Sobre() {
  return (
    <div className="flex flex-col w-full pb-20">
      {/* Bio Section */}
      <section className="pt-10 pb-20 container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2 relative">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl transform translate-x-4 translate-y-4 -z-10"></div>
            <img
              src="https://img.usecurling.com/ppl/large?gender=female&seed=1"
              alt="Profissional"
              className="w-full h-auto rounded-2xl shadow-lg object-cover aspect-[3/4]"
            />
          </div>
          <div className="w-full md:w-1/2 animate-fade-in-up animation-delay-100">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Muito prazer, sou a voz por trás do{' '}
              <span className="text-primary">Guia Low Carb</span>.
            </h1>
            <h2 className="text-xl font-subheading text-muted-foreground mb-8">
              Unindo a ciência da nutrição à segurança do planejamento financeiro.
            </h2>
            <div className="space-y-4 text-foreground/80 leading-relaxed">
              <p>
                Acredito profundamente que a saúde não é apenas a ausência de doenças físicas, mas
                um estado completo de bem-estar que engloba o corpo e a mente — e a tranquilidade de
                um futuro seguro é parte fundamental disso.
              </p>
              <p>
                Há mais de 10 anos atuo na área clínica, me especializando em estratégias de baixo
                carboidrato (Low Carb e Cetogênica) para tratamento de condições metabólicas,
                emagrecimento sustentável e performance.
              </p>
              <p>
                Com o tempo, percebi que muitos pacientes adoeciam devido ao estresse financeiro.
                Foi então que expandi minha atuação para a proteção familiar, certificando-me em
                seguros e consórcios, criando um ecossistema único de cuidado integral.
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row gap-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-heading font-bold text-secondary">10+</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                  Anos de
                  <br />
                  Experiência
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-heading font-bold text-primary">5k+</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                  Vidas
                  <br />
                  Transformadas
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-16">Nossos Pilares</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Ciência Aplicada',
                desc: 'Todas as condutas nutricionais são baseadas em evidências científicas sólidas e atualizadas.',
              },
              {
                title: 'Transparência',
                desc: 'Na recomendação de planos de seguro ou saúde, a clareza e honestidade vêm em primeiro lugar.',
              },
              {
                title: 'Cuidado Integral',
                desc: 'Olhamos para você como um todo: sua biologia, sua rotina e seu legado familiar.',
              },
            ].map((v, i) => (
              <div
                key={i}
                className="bg-background p-8 rounded-xl shadow-sm border text-left flex flex-col"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <CheckCircle2 size={20} />
                </div>
                <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                <p className="text-muted-foreground text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">Trajetória Profissional</h2>
        <div className="max-w-3xl mx-auto">
          <div className="relative border-l border-primary/30 ml-3 md:ml-0 md:left-1/2 transform md:-translate-x-1/2 space-y-12 pb-8">
            {[
              {
                year: '2023',
                title: 'Fundação do Ecossistema Guia Low Carb',
                desc: 'Integração oficial dos serviços de saúde metabólica e proteção financeira em uma única plataforma digital.',
              },
              {
                year: '2020',
                title: 'Certificação SUSEP',
                desc: 'Habilitação como corretora oficial para atuação com Seguros de Vida e Previdência.',
              },
              {
                year: '2015',
                title: 'Especialização em Nutrição Clínica Avançada',
                desc: 'Foco em estratégias low carb e jejum intermitente para reversão de diabetes tipo 2.',
              },
              {
                year: '2012',
                title: 'Graduação em Nutrição',
                desc: 'O início de uma jornada movida pela paixão em entender o metabolismo humano.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`relative flex flex-col md:flex-row items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="absolute w-6 h-6 rounded-full bg-primary border-4 border-background -left-3 md:left-1/2 transform md:-translate-x-1/2"></div>
                <div
                  className={`ml-8 md:ml-0 w-full md:w-1/2 ${i % 2 === 0 ? 'md:pl-12' : 'md:pr-12 text-left md:text-right'}`}
                >
                  <span className="text-secondary font-bold text-sm mb-1 block">{item.year}</span>
                  <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
