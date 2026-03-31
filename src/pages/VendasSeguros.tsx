import { ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function VendasSeguros() {
  return (
    <div className="container mx-auto px-4 py-32 text-center max-w-3xl">
      <ShieldCheck className="w-24 h-24 mx-auto text-secondary mb-8" />
      <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary">
        Cotação de Seguros
      </h1>
      <p className="text-muted-foreground mb-12 text-lg">
        Em breve, nossa plataforma completa de cotação estará disponível aqui. Fale diretamente com
        a equipe para uma análise de perfil gratuita.
      </p>
      <Button
        asChild
        size="lg"
        className="bg-secondary hover:bg-[#158A68] text-white rounded-full h-14 px-8 text-lg font-bold shadow-soft"
      >
        <a href="https://wa.me/5511999999999" target="_blank" rel="noreferrer">
          Falar no WhatsApp
        </a>
      </Button>
    </div>
  )
}
