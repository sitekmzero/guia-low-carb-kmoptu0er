import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  'Todos',
  'Emagrecimento Metabólico',
  'Resistência Insulínica',
  'Trauma Alimentar',
  'Low Carb na Prática',
  'Estudos Científicos',
]

export default function Blog() {
  const [activeCat, setActiveCat] = useState('Todos')
  const posts = [
    {
      id: 1,
      title: 'Por que calorias não são todas iguais?',
      category: 'Estudos Científicos',
      excerpt:
        'Entenda como diferentes macronutrientes afetam seus hormônios e por que a qualidade importa mais que a quantidade.',
    },
    {
      id: 2,
      title: 'Sinais ocultos da Resistência à Insulina',
      category: 'Resistência Insulínica',
      excerpt:
        'Acantose nigricans, cansaço após refeições e outros sinais de que seu metabolismo precisa de atenção.',
    },
    {
      id: 3,
      title: 'Guia de compras Low Carb',
      category: 'Low Carb na Prática',
      excerpt:
        'O que não pode faltar no seu carrinho de supermercado para manter a dieta sem sofrimento.',
    },
  ]

  const filteredPosts =
    activeCat === 'Todos' ? posts : posts.filter((p) => p.category === activeCat)

  return (
    <div className="container mx-auto px-4 py-16 max-w-[1200px]">
      <div className="text-center mb-16 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-primary">
          Artigos sobre Nutrição e Metabolismo
        </h1>
        <p className="text-muted-foreground font-subheading text-lg">
          Ciência simples, prática e transformadora.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={cn(
              'px-5 py-2 rounded-full text-sm font-medium transition-colors border',
              activeCat === cat
                ? 'bg-primary text-white border-primary'
                : 'bg-card text-foreground/70 hover:bg-muted border-border',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <Link to={`/blog/${post.id}`} key={post.id} className="group">
            <Card className="h-full overflow-hidden border-none shadow-soft hover:shadow-md transition-shadow bg-card">
              <div className="aspect-video bg-muted relative overflow-hidden">
                <img
                  src={`https://img.usecurling.com/p/600/400?q=nutrition&seed=${post.id}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Thumbnail"
                />
              </div>
              <CardContent className="p-6">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider mb-2 block">
                  {post.category}
                </span>
                <h3 className="font-heading text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
