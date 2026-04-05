import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowRight, PlayCircle, BookOpen } from 'lucide-react'

export default function Obrigado() {
  const [countdown, setCountdown] = useState(15)
  const navigate = useNavigate()

  useEffect(() => {
    if (countdown <= 0) {
      navigate('/')
      return
    }
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown, navigate])

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in py-12 bg-muted/10">
      <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-8 shadow-sm">
        <CheckCircle2 className="w-12 h-12 text-emerald-600" />
      </div>

      <h1 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-4">Tudo certo!</h1>

      <p className="text-xl text-muted-foreground max-w-lg mb-10 leading-relaxed">
        Seu cadastro foi realizado com sucesso. Em breve você receberá nossas comunicações no seu
        e-mail.
      </p>

      <div className="bg-card border rounded-2xl p-8 shadow-sm max-w-2xl w-full mb-10">
        <h3 className="font-bold text-lg mb-6">Enquanto isso, que tal explorar?</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/cursos" className="group">
            <div className="flex flex-col p-6 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors h-full">
              <PlayCircle className="w-8 h-8 text-primary mb-3" />
              <h4 className="font-semibold text-primary mb-2">Conheça os Cursos</h4>
              <p className="text-sm text-muted-foreground flex-1">
                Comece sua transformação com nossos treinamentos em vídeo.
              </p>
              <div className="mt-4 text-primary text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                Acessar <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          <Link to="/teleconsulta" className="group">
            <div className="flex flex-col p-6 rounded-xl border border-secondary/20 bg-secondary/5 hover:bg-secondary/10 transition-colors h-full">
              <BookOpen className="w-8 h-8 text-secondary mb-3" />
              <h4 className="font-semibold text-secondary mb-2">Agende sua Consulta</h4>
              <p className="text-sm text-muted-foreground flex-1">
                Atendimento personalizado e planejamento estratégico.
              </p>
              <div className="mt-4 text-secondary text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                Agendar <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      <p className="text-sm text-muted-foreground font-medium">
        Você será redirecionado para a página inicial em{' '}
        <span className="text-primary">{countdown}</span> segundos...
      </p>
    </div>
  )
}
