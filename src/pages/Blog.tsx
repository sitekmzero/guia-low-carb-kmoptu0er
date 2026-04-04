import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { Calendar, Clock, User, ChevronLeft, ChevronRight, FileText, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export default function Blog() {
  const [activeCat, setActiveCat] = useState('Todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [posts, setPosts] = useState<any[]>([])
  const [categories, setCategories] = useState<{ name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const POSTS_PER_PAGE = 6

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const [postsRes, catsRes] = await Promise.all([
        supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('published_date', { ascending: false }),
        supabase.from('blog_categories').select('name'),
      ])

      if (postsRes.data) setPosts(postsRes.data)
      if (catsRes.data) setCategories(catsRes.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const filteredPosts = posts.filter((p) => {
    const matchesCat = activeCat === 'Todos' || p.category === activeCat
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  )

  const allCats = ['Todos', ...categories.map((c) => c.name)]

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#2D6A4F] to-transparent pt-32 pb-20 px-4 h-[250px] md:h-[400px] flex flex-col justify-center items-center text-center animate-fade-in-up">
        <h1 className="text-[32px] md:text-[48px] font-heading font-bold text-white mb-4">
          Guia Low Carb Blog
        </h1>
        <p className="text-[16px] md:text-[20px] text-gray-200 font-subheading max-w-2xl">
          Nutrição, Proteção e Transformação
        </p>
      </section>

      <div className="container mx-auto px-4 max-w-[1200px] -mt-8 relative z-10">
        {/* Search Bar */}
        <div className="bg-white p-2 rounded-full shadow-md flex items-center mb-10 max-w-md mx-auto border border-gray-100 animate-fade-in-up animation-delay-100">
          <Search className="w-5 h-5 text-gray-400 ml-3" />
          <input
            type="text"
            placeholder="Pesquisar artigos..."
            className="w-full bg-transparent border-none focus:outline-none px-3 py-2 text-gray-700"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up animation-delay-200">
          {allCats.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCat(cat)
                setCurrentPage(1)
              }}
              className={cn(
                'px-4 py-2 border-b-2 text-sm font-medium transition-all duration-300 cursor-pointer',
                activeCat === cat
                  ? 'border-[#2D6A4F] text-[#2D6A4F]'
                  : 'border-transparent text-gray-500 hover:border-[#2D6A4F]/50 hover:text-[#2D6A4F] hover:opacity-80',
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed">
            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">Nenhum artigo encontrado.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.map((post, index) => (
              <Link
                to={`/blog/${post.slug}`}
                key={post.id}
                className="group bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden hover:shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-[200px] w-full overflow-hidden">
                  <img
                    src={
                      post.featured_image_url || 'https://img.usecurling.com/p/600/400?q=article'
                    }
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 right-3 bg-[#2D6A4F] text-white px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>

                <div className="flex flex-col flex-grow p-4">
                  <h2 className="text-[20px] font-semibold text-[#2D6A4F] mb-3 leading-[1.4] line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-[14px] text-[#636E72] mb-4 leading-[1.6] line-clamp-2 flex-grow">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-4 text-[12px] text-[#95A5A6] mb-4">
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

                  <div className="mt-auto px-6 py-3 bg-[#2D6A4F] text-white rounded-md font-semibold text-center transition-all duration-300 group-hover:bg-[#1f4a37] group-hover:scale-[1.02]">
                    Ler Artigo
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-[#2D6A4F] text-[#2D6A4F] rounded hover:bg-[#2D6A4F] hover:text-white disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={cn(
                  'w-10 h-10 border border-[#2D6A4F] rounded font-medium transition-colors',
                  currentPage === i + 1
                    ? 'bg-[#2D6A4F] text-white'
                    : 'text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white',
                )}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-[#2D6A4F] text-[#2D6A4F] rounded hover:bg-[#2D6A4F] hover:text-white disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
