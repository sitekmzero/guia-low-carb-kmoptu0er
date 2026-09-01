import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

import { useSEO } from '@/services/seo'

export default function Index() {
  useSEO(
    'Guia Low Carb | Nutrição Clínica e Longevidade',
    'Nutrição clínica e longevidade metabólica com embasamento científico. Transforme seu metabolismo sem fome nem culpa com o Guia Low Carb.',
    'guialowcarb, low carb, nutricao clinica, saude metabolica, emagrecimento definitivo',
    '/og-image.png',
    'https://www.guialowcarb.com.br/',
    'https://www.guialowcarb.com.br/',
  )
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background pt-16 md:pt-28 pb-24 md:pb-32">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full md:w-1/2 space-y-8 animate-fade-in-up">
              <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wider uppercase border border-primary/20">
                Nutrição Clínica baseada em Ciência
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-foreground leading-tight tracking-tight">
                Transforme seu <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#158A68]">
                  Metabolismo
                </span>{' '}
                <br />
                sem fome nem culpa.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground font-subheading leading-relaxed max-w-lg">
                Descubra por que 95% das dietas convencionais falham e como a estratégia Low Carb
                correta pode restaurar sua saúde, energia e composição corporal de forma definitiva.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/servicos">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto text-lg h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    Agendar Consulta
                  </Button>
                </Link>
                <Link to="/ebook-gratuito">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto text-lg h-14 px-8 rounded-full border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    Baixar E-book Grátis
                  </Button>
                </Link>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex justify-center animate-fade-in-up animation-delay-200">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white/50 backdrop-blur-sm">
                <img
                  src="https://wfuwhozrwyqkqdovzers.supabase.co/storage/v1/object/public/Imagens/Fotos/Adriana%20consultorio.png"
                  alt="Adriana Araújo - Nutricionista Clínica"
                  loading="lazy"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
