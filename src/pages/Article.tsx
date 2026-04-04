import { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import {
  Calendar,
  User,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Share2,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Article() {
  const { slug } = useParams()
  const [post, setPost] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    async function fetchPost() {
      setLoading(true)
      const { data } = await supabase.from('blog_posts').select('*').eq('slug', slug).single()
      if (data) {
        setPost(data)
        // Fetch related
        const { data: relData } = await supabase
          .from('blog_posts')
          .select(
            'id, title, slug, excerpt, featured_image_url, category, author, published_date, reading_time_minutes',
          )
          .eq('category', data.category)
          .neq('slug', slug)
          .eq('published', true)
          .limit(3)
        if (relData) setRelated(relData)

        // Increment views safely (RPC)
        supabase.rpc('increment_blog_view', { post_slug: slug }).catch(console.error)
      }
      setLoading(false)
      window.scrollTo(0, 0)
    }
    if (slug) fetchPost()
  }, [slug])

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scroll = `${totalScroll / windowHeight}`
      setProgress(Number(scroll) * 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const parsedContent = useMemo(() => {
    if (!post?.content) return { html: '', toc: [] }
    const parser = new DOMParser()
    const doc = parser.parseFromString(post.content, 'text/html')
    const headings = Array.from(doc.querySelectorAll('h2'))
    const toc = headings.map((h, i) => {
      const id = `heading-${i}`
      h.id = id
      return { id, text: h.textContent || '' }
    })
    return { html: doc.body.innerHTML, toc }
  }, [post?.content])

  const shareUrl = window.location.href
  const shareText = post?.title || 'Artigo Guia Low Carb'

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-32 text-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4 text-[#2D6A4F]">Artigo não encontrado</h2>
        <Button asChild className="bg-[#2D6A4F] hover:bg-[#1f4a37]">
          <Link to="/blog">Voltar para o Blog</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative pb-20">
      <div
        className="fixed top-0 left-0 h-1 bg-[#2D6A4F] z-50 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />

      {/* Hero */}
      <section className="relative h-[300px] md:h-[500px] w-full animate-fade-in">
        <img
          src={post.featured_image_url || 'https://img.usecurling.com/p/1200/600?q=article'}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 container mx-auto text-white">
          <span className="inline-block bg-[#2D6A4F] text-white px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider mb-4">
            {post.category}
          </span>
          <h1 className="text-[32px] md:text-[48px] font-heading font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" /> {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />{' '}
              {new Date(post.published_date).toLocaleDateString('pt-BR')}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {post.reading_time_minutes} min de leitura
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-[800px] mx-auto px-4 md:px-5 py-10 animate-fade-in-up">
        {/* Share Buttons */}
        <div className="flex flex-wrap gap-3 mb-10 animate-fade-in-up animation-delay-200">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="w-11 h-11 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Share2 className="w-5 h-5" />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="w-11 h-11 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noreferrer"
            className="w-11 h-11 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="w-11 h-11 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`}
            className="w-11 h-11 rounded-full bg-gray-500 text-white flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>

        {/* TOC */}
        {parsedContent.toc.length > 0 && (
          <div className="bg-[#F8F4EF] p-6 rounded-lg mb-8">
            <h3 className="text-base font-semibold text-[#2D6A4F] mb-3">Neste artigo:</h3>
            <ul className="space-y-2 list-none">
              {parsedContent.toc.map((h) => (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    className="text-sm text-[#636E72] hover:text-[#2D6A4F] hover:underline transition-colors"
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* HTML Body */}
        <div
          className="prose prose-lg md:prose-xl max-w-none text-[#2D3436] font-sans leading-[1.8] prose-h2:text-[#2D6A4F] prose-h2:text-[32px] prose-h2:font-semibold prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-[#52A86A] prose-h3:text-[24px] prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3 prose-p:mb-4 prose-blockquote:border-l-4 prose-blockquote:border-[#2D6A4F] prose-blockquote:pl-4 prose-blockquote:ml-0 prose-blockquote:text-[#636E72] prose-blockquote:font-style-italic prose-li:mb-2 prose-a:text-[#2D6A4F] prose-a:underline hover:prose-a:text-[#1f4a37]"
          dangerouslySetInnerHTML={{ __html: parsedContent.html }}
        />

        {/* Author Bio */}
        <div className="bg-[#F8F4EF] p-6 rounded-lg mt-12 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
          <img
            src="https://idtvwxzbmnqjcyxquqdk.supabase.co/storage/v1/object/public/Guia%20Low%20Carb/Imagens%20Adriana/Adriana%20jaleco%20fundo%20branco.jpeg"
            alt={post.author}
            className="w-[100px] h-[100px] rounded-full object-cover shrink-0"
          />
          <div className="flex-1">
            <h4 className="text-[18px] font-semibold text-[#2D6A4F]">{post.author}</h4>
            <p className="text-[14px] text-[#636E72] mt-1">
              Nutricionista Clínica (CRN 28762) & CEO Km Zero
            </p>
            <p className="text-[14px] text-[#2D3436] mt-2 leading-[1.6]">
              Especialista em Nutrição Clínica e Proteção Patrimonial, unindo ciência rigorosa e
              cuidado humano para blindar a saúde e o futuro da sua família. Ciência que transforma.
              Amor que inspira.
            </p>
            <Button asChild className="mt-4 bg-[#2D6A4F] hover:bg-[#1f4a37]">
              <Link to="/teleconsulta">Agendar Consulta</Link>
            </Button>
          </div>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[#E0E0E0]">
            <h3 className="text-[24px] font-semibold text-[#2D6A4F] mb-6">Artigos Relacionados</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link
                  to={`/blog/${rel.slug}`}
                  key={rel.id}
                  className="group bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden hover:shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <img
                    src={rel.featured_image_url || 'https://img.usecurling.com/p/400/300?q=article'}
                    alt={rel.title}
                    className="h-[120px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="p-4 flex flex-col flex-grow">
                    <span className="text-[10px] bg-[#2D6A4F]/10 text-[#2D6A4F] px-2 py-1 rounded font-semibold uppercase self-start mb-2">
                      {rel.category}
                    </span>
                    <h4 className="font-semibold text-sm text-[#2D6A4F] line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
