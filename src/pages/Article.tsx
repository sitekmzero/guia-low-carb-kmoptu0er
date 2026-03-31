import { useParams, Link } from 'react-router-dom'
import { ChevronRight, Clock, Share2, Facebook, Twitter, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Article() {
  const { slug } = useParams()

  return (
    <article className="pb-20">
      {/* Header */}
      <header className="bg-muted/30 pt-10 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              Início
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/blog" className="hover:text-primary transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-foreground truncate">O que é a Dieta Cetogênica...</span>
          </nav>

          <span className="inline-block py-1 px-3 rounded bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            Low Carb
          </span>
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-6 leading-tight">
            O que é a Dieta Cetogênica e como começar de forma segura
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-4 border-t pt-6">
            <div className="flex items-center gap-3">
              <img
                src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1"
                alt="Autor"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold text-sm">Dra. Nome Sobrenome</p>
                <p className="text-xs text-muted-foreground">Atualizado em 10 Out 2023</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" /> 5 min de leitura
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="container mx-auto px-4 max-w-4xl -mt-8 relative z-10 mb-12">
        <img
          src="https://img.usecurling.com/p/800/400?q=avocado%20salmon"
          alt="Capa do Artigo"
          className="w-full h-[400px] object-cover rounded-xl shadow-md"
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="prose prose-lg dark:prose-invert prose-headings:font-heading prose-a:text-primary hover:prose-a:text-primary/80 max-w-none">
          <p className="lead text-xl text-muted-foreground mb-8">
            A dieta cetogênica (keto) ganhou enorme popularidade nos últimos anos, mas ainda gera
            muitas dúvidas. Diferente de uma simples restrição calórica, ela promove uma mudança no
            combustível principal do seu corpo.
          </p>

          <h2>O Princípio Básico</h2>
          <p>
            Normalmente, o corpo humano utiliza a glicose (vinda dos carboidratos) como principal
            fonte de energia. Na dieta cetogênica, reduzimos drasticamente o consumo de carboidratos
            e aumentamos a ingestão de gorduras saudáveis. Isso coloca o corpo em um estado
            metabólico chamado <strong>cetose</strong>.
          </p>

          {/* AdSense In-article */}
          <div className="my-10 adsense-placeholder not-prose">
            Espaço Publicitário (AdSense In-Article)
          </div>

          <h2>Quais os benefícios comprovados?</h2>
          <ul>
            <li>
              <strong>Perda de peso eficiente:</strong> O corpo passa a queimar a própria gordura
              armazenada.
            </li>
            <li>
              <strong>Estabilidade glicêmica:</strong> Excelente para pré-diabéticos e diabéticos
              tipo 2.
            </li>
            <li>
              <strong>Clareza mental:</strong> Cetonas são uma fonte de energia muito estável para o
              cérebro.
            </li>
            <li>
              <strong>Redução da fome:</strong> Gorduras e proteínas promovem maior saciedade.
            </li>
          </ul>

          <blockquote>
            "A nutrição não é sobre restrição, é sobre fornecer ao corpo a informação correta para
            ele funcionar em sua potência máxima."
          </blockquote>

          <h2>Alimentos Permitidos vs Evitados</h2>
          <p>
            O foco deve estar em comida de verdade. Carnes, ovos, azeite, abacate, castanhas e
            vegetais de baixo amido (como brócolis, espinafre e abobrinha) são a base. Evite
            açúcares, pães, massas, arroz e tubérculos ricos em amido.
          </p>

          {/* AdSense In-article */}
          <div className="my-10 adsense-placeholder not-prose">
            Espaço Publicitário (AdSense In-Article)
          </div>

          <h2>Conclusão</h2>
          <p>
            Antes de iniciar qualquer mudança drástica na alimentação, é fundamental buscar
            orientação profissional. A individualidade bioquímica deve sempre ser respeitada para
            garantir que a estratégia seja segura e sustentável a longo prazo.
          </p>
        </div>

        {/* Share and Tags */}
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">
              Keto
            </span>
            <span className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">
              Emagrecimento
            </span>
            <span className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">
              Saúde
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Compartilhar:
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Facebook className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Twitter className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Linkedin className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-primary/10 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Quer um acompanhamento personalizado?</h3>
          <p className="text-muted-foreground mb-6">
            Agende uma consulta e descubra como a abordagem Low Carb pode transformar sua vida.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link to="/servicos">Conhecer Consultoria</Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
