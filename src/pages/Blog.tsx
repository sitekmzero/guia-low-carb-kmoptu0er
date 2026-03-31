import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const CATEGORIES = ['Todos', 'Low Carb', 'Receitas', 'Proteção Financeira', 'Estilo de Vida']

const POSTS = Array(9)
  .fill(0)
  .map((_, i) => ({
    id: i + 1,
    title: [
      'O que é a Dieta Cetogênica e como começar',
      'Por que ter um Seguro de Vida antes dos 30?',
      'Receita: Pão Low Carb de Microondas em 3 minutos',
      'Resistência à insulina: O inimigo silencioso',
      'Consórcio Imobiliário vs Financiamento: Qual a melhor opção?',
      'Jejum Intermitente: Mitos e Verdades Científicas',
    ][i % 6],
    category: [
      'Low Carb',
      'Proteção Financeira',
      'Receitas',
      'Low Carb',
      'Proteção Financeira',
      'Estilo de Vida',
    ][i % 6],
    excerpt:
      'Neste artigo, vamos explorar os conceitos fundamentais para você entender as melhores práticas embasadas em estudos recentes.',
    image: `https://img.usecurling.com/p/600/400?q=article&seed=${i}`,
    date: '10 Out 2023',
    readTime: '5 min',
  }))

export default function Blog() {
  const [activeCat, setActiveCat] = useState('Todos')
  const [search, setSearch] = useState('')

  const filteredPosts = POSTS.filter((post) => {
    const matchesCat = activeCat === 'Todos' || post.category === activeCat
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
        <h1 className="text-4xl font-bold mb-4 font-heading">Blog & Artigos</h1>
        <p className="text-muted-foreground font-subheading">
          Informação clara, científica e prática para a sua saúde e bolso.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="flex overflow-x-auto pb-2 w-full md:w-auto hide-scrollbar gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border',
                activeCat === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-foreground/70 hover:bg-muted',
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar artigos..."
            className="pl-10 rounded-full bg-muted/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* AdSense Top */}
      <div className="mb-12 adsense-placeholder max-w-4xl mx-auto">
        Espaço Publicitário (AdSense Horizontal)
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link
              to={`/blog/${post.id}`}
              key={post.id}
              className="group flex flex-col h-full animate-fade-in"
            >
              <Card className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow duration-300 border-border/60">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
                    <span
                      className={cn(
                        'font-semibold uppercase tracking-wider',
                        post.category === 'Proteção Financeira' ? 'text-secondary' : 'text-primary',
                      )}
                    >
                      {post.category}
                    </span>
                    <span>{post.readTime} leitura</span>
                  </div>
                  <h2 className="text-xl font-bold font-heading mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="text-xs text-muted-foreground border-t pt-4 mt-auto">
                    Publicado em {post.date}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            Nenhum artigo encontrado para a sua busca.
          </div>
        )}
      </div>

      {filteredPosts.length > 0 && (
        <div className="mt-16 text-center">
          <Button variant="outline" size="lg" className="rounded-full">
            Carregar mais artigos
          </Button>
        </div>
      )}
    </div>
  )
}
