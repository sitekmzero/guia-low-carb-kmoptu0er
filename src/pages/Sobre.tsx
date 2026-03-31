import { Link } from 'react-router-dom'
import { CheckCircle2, GraduationCap, Heart, Sparkles, BrainCircuit } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Sobre() {
  return (
    <div className="flex flex-col w-full bg-background pb-20">
      <section className="pt-24 pb-20 container mx-auto px-4 max-w-[1200px]">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-center">
          <div className="w-full md:w-1/2 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-primary">
              Quem é Adriana Araújo
            </h1>
            <h2 className="text-xl font-subheading text-secondary mb-8">
              Ciência que transforma. Amor que inspira.
            </h2>
            <div className="space-y-4 text-foreground/80 leading-relaxed font-sans">
              <p>
                Acredito que o verdadeiro cuidado vai além do prato. Com uma visão integrativa,
                dedico minha trajetória a entender a complexidade do metabolismo humano e como ele
                se conecta às nossas emoções e decisões de vida.
              </p>
              <p>
                A nutrição low carb e as estratégias metabólicas não são apenas dietas, são
                ferramentas científicas poderosas para devolver a liberdade de viver com saúde,
                energia e sem medo da comida.
              </p>
            </div>
            <div className="mt-10">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-primary hover:bg-[#158A68] text-white"
              >
                <Link to="/contato">Quero iniciar minha transformação</Link>
              </Button>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center animate-fade-in-up animation-delay-200">
            <div className="relative rounded-2xl overflow-hidden shadow-xl w-full max-w-md aspect-[4/5]">
              <img
                src="https://idtvwxzbmnqjcyxquqdk.supabase.co/storage/v1/object/public/Guia%20Low%20Carb/Imagens%20Adriana/Adriana%20jaleco%20fundo%20branco.jpeg"
                alt="Adriana Araújo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <h2 className="text-3xl font-heading font-bold text-center mb-16">Minha Abordagem</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'Ciência',
                desc: 'Protocolos fundamentados em evidências sólidas.',
              },
              {
                icon: Heart,
                title: 'Acolhimento',
                desc: 'Atendimento humanizado e sem julgamentos.',
              },
              {
                icon: BrainCircuit,
                title: 'Metabolismo',
                desc: 'Foco na causa raiz e regulação hormonal.',
              },
              {
                icon: CheckCircle2,
                title: 'Comportamento',
                desc: 'Respeito à relação individual com a comida.',
              },
            ].map((v, i) => (
              <div
                key={i}
                className="bg-card p-8 rounded-xl shadow-soft text-center flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <v.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="font-heading text-xl font-bold mb-3">{v.title}</h3>
                <p className="text-muted-foreground text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4 max-w-[1200px]">
        <div className="max-w-3xl mx-auto text-center">
          <GraduationCap className="w-16 h-16 mx-auto text-secondary mb-6" />
          <h2 className="text-3xl font-heading font-bold mb-10">Minhas Credenciais</h2>
          <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-12">
            <div className="bg-muted px-8 py-4 rounded-full font-semibold">Nutricionista (CRN)</div>
            <div className="bg-muted px-8 py-4 rounded-full font-semibold">
              Administração & SUSEP
            </div>
            <div className="bg-muted px-8 py-4 rounded-full font-semibold">CEO Km Zero</div>
          </div>
        </div>
      </section>
    </div>
  )
}
