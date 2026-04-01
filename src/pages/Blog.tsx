import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { FileText, Calendar } from 'lucide-react'

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
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (data && !error) {
        setPosts(data)
      }
      setLoading(false)
    }
    fetchPosts()
  }, [])

  const filteredPosts =
    activeCat === 'Todos' ? posts : posts.filter((p) => p.category === activeCat)

  return (
    <div className="container mx-auto px-4 py-16 max-w-[1200px] min-h-screen">
      <div className="text-center mb-16 animate-fade-in-up">
        <span className="bg-secondary/20 text-secondary font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-4 inline-block">
          Artigos & Conhecimento
        </span>
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-primary">
          O Blog do Guia Low Carb
        </h1>
        <p className="text-muted-foreground font-subheading text-lg max-w-2xl mx-auto">
          Nutrição de verdade, explicada de forma simples, prática e focada em resultados reais para
          a sua saúde e metabolismo.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={cn(
              'px-5 py-2.5 rounded-full text-sm font-medium transition-all border shadow-sm',
              activeCat === cat
                ? 'bg-primary text-white border-primary shadow-md'
                : 'bg-card text-foreground/70 hover:bg-muted border-border hover:border-primary/30',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link to={`/blog/${post.id}`} key={post.id} className="group flex">
              <Card className="w-full flex flex-col overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card">
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
                    {post.content
                      ? post.content.substring(0, 120) + '...'
                      : 'Leia o artigo completo para descobrir mais sobre este importante tema da nutrição clínica...'}
                  </p>

                  <div className="flex items-center text-primary font-medium text-sm mt-auto group-hover:underline underline-offset-4">
                    Ler Artigo Completo
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {filteredPosts.length === 0 && (
            <div className="col-span-full text-center py-20 bg-muted/20 rounded-2xl border border-dashed">
              <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">
                Nenhum artigo encontrado nesta categoria.
              </h3>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
