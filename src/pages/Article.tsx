import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Calendar, User, ArrowLeft } from 'lucide-react'

export default function Article() {
  const { slug } = useParams()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPost() {
      const { data } = await supabase.from('posts').select('*').eq('id', slug).single()
      if (data) setPost(data)
      setLoading(false)
    }
    if (slug) fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-32 text-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Artigo não encontrado</h2>
        <Link to="/blog">
          <Button>Voltar para o Blog</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-[800px] animate-fade-in min-h-screen">
      <Link
        to="/blog"
        className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar para os Artigos
      </Link>

      <div className="mb-10">
        <span className="inline-block bg-primary/10 text-primary font-bold px-3 py-1 rounded uppercase tracking-wider text-xs mb-6">
          {post.category}
        </span>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground leading-tight mb-6">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y border-border/50 py-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>
              Por <strong>{post.author || 'Adriana Araújo'}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Publicado em {new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>

      <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none text-foreground/90 leading-relaxed font-sans prose-headings:font-heading prose-headings:text-primary prose-a:text-secondary prose-strong:text-foreground">
        {post.content.split('\n').map((paragraph: string, index: number) => (
          <p key={index} className="mb-6">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-6 bg-muted/20 p-8 rounded-2xl">
        <div>
          <h4 className="font-bold text-lg mb-2">Gostou do conteúdo?</h4>
          <p className="text-muted-foreground text-sm">
            Aprofunde seu conhecimento baixando nosso material exclusivo.
          </p>
        </div>
        <Link to="/ebook-gratuito">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 rounded-full whitespace-nowrap"
          >
            Baixar E-book Gratuito
          </Button>
        </Link>
      </div>
    </div>
  )
}
