import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

import { useSEO } from '@/services/seo'

export default function Index() {
  useSEO(
    'Guia Low Carb | Nutrição Clínica e Longevidade',
    'Nutrição clínica e longevidade metabólica com embasamento científico. Transforme seu metabolismo sem fome nem culpa com o Guia Low Carb.',
    'guialowcarb, low carb, nutricao clinica, saude metabolica, emagrecimento sustentavel',
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <img
                  src="https://wfuwhozrwyqkqdovzers.supabase.co/storage/v1/object/public/Imagens/Logos/Logo%20guialowcarb2.png"
                  alt="Logo Oficial Guia Low Carb"
                  className="h-24 sm:h-28 md:h-32 lg:h-36 max-w-[280px] sm:max-w-[340px] w-auto object-contain drop-shadow-md -ml-1"
                />
                <span className="inline-block py-2 px-4 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-bold tracking-wider uppercase border border-primary/20 shrink-0">
                  Nutrição Clínica & Ciência
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-foreground leading-tight tracking-tight">
                Transforme seu <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Metabolismo
                </span>{' '}
                <br />
                sem fome nem culpa.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground font-subheading leading-relaxed max-w-lg">
                Descubra por que a maioria das dietas convencionais falha e como a estratégia Low
                Carb correta pode restaurar sua saúde, disposição e sustentabilidade alimentar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/servicos">
                  <Button
                    size="lg"
                    variant="cta"
                    className="w-full sm:w-auto text-lg h-14 px-8 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    Agendar Consulta
                  </Button>
                </Link>
                <Link to="/ebook-gratuito">
                  <Button
                    size="lg"
                    variant="cta"
                    className="w-full sm:w-auto text-lg h-14 px-8 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    Baixar E-book Grátis
                  </Button>
                </Link>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex justify-center animate-fade-in-up animation-delay-200">
              <div className="relative w-full max-w-lg lg:max-w-xl aspect-[16/9] rounded-3xl lg:rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white/70 dark:border-white/20 backdrop-blur-sm bg-muted/20">
                <img
                  src="https://wfuwhozrwyqkqdovzers.supabase.co/storage/v1/object/public/Imagens/Fotos/Adriana%20home%20site.png"
                  alt="Adriana Araújo - Nutricionista Clínica"
                  loading="lazy"
                  className="w-full h-full object-contain md:object-cover object-center hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
