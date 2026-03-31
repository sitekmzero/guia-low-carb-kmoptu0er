import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  Home,
  Car,
  Building2,
  Briefcase,
  Landmark,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function Index() {
  const products = [
    { name: 'Seguro de Vida Mulher/Homem', icon: HeartPulse },
    { name: 'Seguro Residência', icon: Home },
    { name: 'Previdência', icon: Landmark },
    { name: 'Seguro Auto', icon: Car },
    { name: 'Seguro Empresa', icon: Building2 },
    { name: 'Seguro Saúde', icon: ShieldCheck },
    { name: 'Consórcios', icon: Briefcase },
  ]

  return (
    <div className="flex flex-col w-full bg-background">
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12 max-w-[1200px]">
          <div className="w-full md:w-1/2 animate-fade-in-up z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-primary leading-tight">
              Saúde que Liberta. Proteção que Permanece.
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-8 font-subheading leading-relaxed">
              Nutrição clínica que transforma seu metabolismo — e a visão de quem entende que
              proteger a saúde e o patrimônio são dois lados da mesma decisão inteligente.
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-secondary hover:bg-[#158A68] text-white text-lg px-8 h-14 shadow-soft transition-all hover:scale-105"
            >
              <Link to="/vendas-seguros">
                Quero minha cotação <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>

          <div className="w-full md:w-1/2 flex justify-center animate-fade-in-up animation-delay-200">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[3/4] max-w-md w-full">
              <img
                src="https://idtvwxzbmnqjcyxquqdk.supabase.co/storage/v1/object/public/Guia%20Low%20Carb/Imagens%20Adriana/Adriana%20jaleco%20rosto.jpeg"
                alt="Adriana Araújo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground">
              Soluções Km Zero
            </h2>
            <p className="text-muted-foreground font-subheading">
              Proteja seu presente e garanta seu futuro com nossas soluções completas.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, i) => {
              const Icon = product.icon
              return (
                <Card
                  key={i}
                  className="group hover:shadow-md transition-all duration-300 border-none bg-card hover:bg-primary/5"
                >
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Icon size={28} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-semibold text-sm md:text-base">{product.name}</h3>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
