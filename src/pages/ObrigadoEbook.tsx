import { Link } from 'react-router-dom'
import { CheckCircle, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ObrigadoEbook() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-20 text-center">
      <div className="max-w-2xl animate-fade-in-up">
        <CheckCircle className="w-24 h-24 text-primary mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">Parabéns!</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Seu e-book gratuito está pronto. Clique abaixo para fazer o download ou verifique seu
          e-mail.
        </p>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full border-primary text-primary hover:bg-primary/5 mb-16"
        >
          <Download className="mr-2 w-5 h-5" /> Baixar E-book
        </Button>

        <div className="bg-muted p-8 rounded-2xl border border-border/50">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary mb-2 block">
            OFERTA ESPECIAL
          </span>
          <h2 className="text-2xl font-heading font-bold mb-4">Pronto para dar o próximo passo?</h2>
          <p className="text-muted-foreground mb-6">
            O e-book é só o começo. Conheça o curso completo "Transforme Seu Metabolismo" e mude sua
            vida de vez.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-full bg-secondary hover:bg-secondary/90 text-white w-full sm:w-auto h-14 px-8 text-lg font-bold"
          >
            <Link to="/vendas-cursos">Conheça o Curso Completo</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
