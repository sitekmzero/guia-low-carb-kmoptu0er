import { Link } from 'react-router-dom'
import { Activity, Scale, Stethoscope, Brain, Apple } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

import { useSEO } from '@/services/seo'

export default function Servicos() {
  useSEO(
    'Serviços e Tratamentos | Guia Low Carb',
    'Conheça nossos atendimentos e programas em nutrição clínica: emagrecimento metabólico, resistência insulínica e pós-bariátrica.',
    'servicos nutricao, emagrecimento metabolico, resistencia insulinica, bariatrica',
    '/og-image.png',
    'https://www.guialowcarb.com.br/servicos',
    'https://www.guialowcarb.com.br/servicos',
  )
  const servicos = [
    {
      title: 'Emagrecimento Metabólico',
      desc: 'Abordagem focada em otimização hormonal para um emagrecimento sustentável, utilizando estratégias de baixo carboidrato de forma inteligente.',
      icon: Scale,
    },
    {
      title: 'Resistência Insulínica e Pré-Diabetes',
      desc: 'Tratamento nutricional específico para acompanhar a resistência à insulina, apoiar o controle da glicemia e a saúde metabólica.',
      icon: Activity,
    },
    {
      title: 'Nutrição Bariátrica / Pós-Bariátrica',
      desc: 'Acompanhamento focado para pacientes bariátricos, com foco em absorção de nutrientes, manutenção de massa magra e prevenção de reganho de peso.',
      icon: Stethoscope,
    },
    {
      title: 'Mentoria Nutrição Inteligente',
      desc: 'Programa aprofundado para quem deseja dominar o próprio metabolismo e aplicar a nutrição baseada em evidências de forma autônoma.',
      icon: Apple,
    },
    {
      title: 'Comportamento Alimentar',
      desc: 'Integração mente e metabolismo: estratégias para lidar com fome emocional, compulsão e construir uma relação saudável com a comida.',
      icon: Brain,
    },
  ]

  return (
    <div className="flex flex-col w-full bg-background pb-24 pt-12 max-w-[1200px] mx-auto px-4">
      <div className="text-center mb-16 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-primary">
          Como posso te ajudar?
        </h1>
        <p className="text-muted-foreground font-subheading text-lg">
          Soluções premium e individualizadas para transformar sua saúde de dentro para fora.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {servicos.map((s, i) => (
          <Card
            key={i}
            className="flex flex-col border-none shadow-soft hover:shadow-lg transition-shadow bg-card h-full"
          >
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <s.icon size={32} strokeWidth={1.5} />
              </div>
              <CardTitle className="font-heading text-xl">{s.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow text-center text-muted-foreground text-sm leading-relaxed">
              <p>{s.desc}</p>
            </CardContent>
            <CardFooter className="pt-4 justify-center">
              <Button asChild variant="cta" className="w-full rounded-full">
                <Link to="/contato">Agendar Teleconsulta</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Rodapé de Serviços (Aviso Obrigatório CFN) */}
      <div className="mt-16 p-6 rounded-2xl bg-muted/40 border border-border text-center max-w-3xl mx-auto space-y-2">
        <p className="font-semibold text-primary text-sm flex items-center justify-center gap-2">
          <span>ℹ️</span> Informação Institucional e Responsabilidade Profissional
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          As informações apresentadas nesta página têm caráter meramente informativo e orientativo
          sobre as áreas de atuação clínica, não substituindo a consulta e o diagnóstico nutricional
          individualizado. Todo atendimento clínico é realizado de acordo com as normas éticas do
          Conselho Federal de Nutricionistas (CFN).
        </p>
        <p className="text-xs font-medium text-foreground pt-1">
          Nutricionista Responsável: <strong>Adriana de Freitas Oliveira Araújo</strong> •{' '}
          <strong>CRN-9 28762</strong>
        </p>
      </div>
    </div>
  )
}
