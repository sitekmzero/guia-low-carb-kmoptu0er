import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { Search, Clock, Calendar, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [page, setPage] = useState(1)
  const postsPerPage = 6

  useEffect(() => {
    const fetchPosts = async () => {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_date', { ascending: false })
      const { data } = await query
      if (data) setPosts(data)
      setLoading(false)
    }
    fetchPosts()
  }, [])

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = activeCategory === 'Todos' || post.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const paginatedPosts = filteredPosts.slice((page - 1) * postsPerPage, page * postsPerPage)
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary to-primary/80 h-[250px] md:h-[400px] flex items-center justify-center text-center px-4">
        <div className="animate-fade-in-up">
          <h1 className="text-3xl md:text-5xl font-bold text-white font-heading mb-4">
            Guia Low Carb Blog
          </h1>
          <p className="text-base md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Nutrição, Proteção e Transformação. Acompanhe nossos últimos artigos e descubra como
            mudar sua vida.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container max-w-6xl py-12 px-4 md:px-8 flex-1">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {['Todos', 'Nutrição', 'Proteção', 'Disruptivo'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat)
                  setPage(1)
                }}
                className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                  activeCategory === cat
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-primary hover:border-primary/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar artigos..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1)
              }}
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : paginatedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPosts.map((post, index) => (
              <div
                key={post.id}
                className="group bg-card rounded-xl border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-[200px] w-full overflow-hidden bg-muted">
                  {post.featured_image_url && (
                    <img
                      src={post.featured_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  )}
                  <Badge className="absolute top-4 right-4 bg-primary text-white pointer-events-none">
                    {post.category}
                  </Badge>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-xl font-bold text-primary mb-3 line-clamp-2 leading-snug group-hover:text-primary/80 transition-colors">
                    <Link to={`/blog/${post.slug}`} className="before:absolute before:inset-0">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto pt-4 border-t">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{' '}
                      {new Date(post.published_date).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.reading_time_minutes} min
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-muted-foreground mb-2">
              Nenhum artigo encontrado
            </h3>
            <p className="text-muted-foreground">Tente ajustar sua busca ou filtro de categoria.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Anterior
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={page === i + 1 ? 'default' : 'outline'}
                  className={page === i + 1 ? 'bg-primary' : ''}
                  onClick={() => setPage(i + 1)}
                  size="icon"
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}
