import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import {
  Clock,
  Calendar,
  User,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link as LinkIcon,
  Share2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

export default function Article() {
  const { slug } = useParams()
  const [post, setPost] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scroll = `${(totalScroll / windowHeight) * 100}`
      setScrollProgress(Number(scroll))
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return
      setLoading(true)
      const { data } = await supabase.from('blog_posts').select('*').eq('slug', slug).single()

      if (data) {
        setPost(data)
        // Increment views safely using RPC or update
        supabase.rpc('increment_blog_view', { post_slug: slug }).then()

        // Fetch related
        const { data: rel } = await supabase
          .from('blog_posts')
          .select('id, title, slug, featured_image_url, category, excerpt')
          .eq('category', data.category)
          .neq('id', data.id)
          .limit(3)
        if (rel) setRelated(rel)
      }
      setLoading(false)
      window.scrollTo(0, 0)
    }
    fetchPost()
  }, [slug])

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({ title: 'Link copiado!', description: 'Compartilhe com seus amigos.' })
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando artigo...</div>
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">Artigo não encontrado.</div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Hero */}
      <section className="relative h-[300px] md:h-[500px] w-full flex items-end overflow-hidden animate-fade-in">
        <div className="absolute inset-0 bg-muted">
          {post.featured_image_url && (
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="relative container max-w-4xl px-4 md:px-8 pb-10 text-white z-10">
          <Badge className="bg-primary hover:bg-primary/90 text-white mb-4 border-none">
            {post.category}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold font-heading leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
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

      {/* Content Container */}
      <div className="container max-w-4xl px-4 md:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Article Body */}
          <article className="flex-1 prose prose-lg md:prose-xl max-w-none prose-headings:font-heading prose-headings:text-primary prose-a:text-primary prose-a:no-underline hover:prose-a:underline animate-fade-in-up">
            <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
          </article>
        </div>

        {/* Share Actions */}
        <div className="mt-12 py-6 border-y flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-semibold text-lg flex items-center gap-2">
            <Share2 className="w-5 h-5" /> Compartilhar:
          </span>
          <div className="flex gap-2">
            <Button size="icon" variant="outline" className="rounded-full" onClick={copyLink}>
              <LinkIcon className="w-4 h-4" />
            </Button>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button
                size="icon"
                variant="outline"
                className="rounded-full bg-blue-600 text-white border-none hover:bg-blue-700"
              >
                <Facebook className="w-4 h-4" />
              </Button>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button
                size="icon"
                variant="outline"
                className="rounded-full bg-sky-500 text-white border-none hover:bg-sky-600"
              >
                <Twitter className="w-4 h-4" />
              </Button>
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button
                size="icon"
                variant="outline"
                className="rounded-full bg-blue-700 text-white border-none hover:bg-blue-800"
              >
                <Linkedin className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>

        {/* Author Bio */}
        <div className="mt-12 bg-secondary/5 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start border border-secondary/10">
          <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border-4 border-white shadow-md">
            <img
              src="https://img.usecurling.com/p/200/200?q=nutritionist&seed=1"
              alt="Adriana Araújo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-primary mb-1">
              {post.author || 'Adriana Araújo'}
            </h3>
            <p className="text-sm font-medium text-secondary mb-3">
              Especialista em Nutrição e Proteção Integrada
            </p>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              Com formação em Nutrição, transformo vidas aliando saúde metabólica e planejamento
              estratégico de vida. Meu foco é entregar resultados reais baseados em evidência.
            </p>
            <Link to="/teleconsulta">
              <Button className="bg-primary hover:bg-primary/90">Agendar Teleconsulta</Button>
            </Link>
          </div>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-primary mb-6 font-heading border-b pb-4">
              Leia também
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link to={`/blog/${rel.slug}`} key={rel.id} className="group flex flex-col gap-3">
                  <div className="h-40 rounded-lg overflow-hidden bg-muted relative">
                    {rel.featured_image_url && (
                      <img
                        src={rel.featured_image_url}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                  </div>
                  <h4 className="font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
