import { Link } from 'react-router-dom'
import { BookOpen, MonitorPlay, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'

import { useSEO } from '@/services/seo'

export default function VendasCursos() {
  useSEO(
    'Cursos Online de Nutrição Low Carb | Guia Low Carb',
    'Aprenda com metodologia comprovada como aplicar a alimentação Low Carb no seu dia a dia.',
    'cursos low carb, aulas nutricao, dieta cetogenica, emagrecimento',
    '/og-image.png',
    'https://www.guialowcarb.com.br/vendas-cursos',
    'https://www.guialowcarb.com.br/vendas-cursos',
  )
  const produtos = [
    {
      title: 'E-book Premium',
      subtitle: 'Inicie a sua transformação',
      icon: BookOpen,
      desc: 'Receitas exclusivas e base científica simplificada.',
      price: 'R$ 47,90',
    },
    {
      title: 'Curso de Emagrecimento',
      subtitle: 'Transforme Seu Metabolismo',
      icon: MonitorPlay,
      desc: 'Módulos completos em vídeo com metodologia passo a passo.',
      price: 'R$ 297,00',
    },
    {
      title: 'Consultoria Personalizada',
      subtitle: 'Acompanhamento Premium',
      icon: Users,
      desc: 'Acesso direto e acompanhamento individualizado.',
      price: 'Sob Consulta',
    },
  ]

  return (
    <div className="flex flex-col w-full bg-background pb-24 pt-16 max-w-[1200px] mx-auto px-4">
      <div className="text-center mb-16 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-primary">
          Cursos e Materiais para Transformar Sua Saúde
        </h1>
        <p className="text-muted-foreground font-subheading text-lg">
          Nutrição clínica acessível: de iniciantes a avançados
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {produtos.map((p, i) => (
          <Card
            key={i}
            className="flex flex-col border-none shadow-soft hover:shadow-lg transition-shadow bg-card text-center"
          >
            <CardHeader>
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <p.icon size={32} />
              </div>
              <CardTitle className="font-heading text-2xl mb-1">{p.title}</CardTitle>
              <p className="text-secondary font-semibold text-sm">{p.subtitle}</p>
            </CardHeader>
            <CardContent className="flex-grow text-muted-foreground">
              <p className="mb-6">{p.desc}</p>
              <p className="text-2xl font-bold text-foreground">{p.price}</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="cta" className="w-full rounded-full h-12">
                <Link to="#">Adquira Agora</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
