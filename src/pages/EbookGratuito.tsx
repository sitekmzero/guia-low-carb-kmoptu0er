import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'

export default function EbookGratuito() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.target as HTMLFormElement)

    try {
      // 1. Rastreamento Analytics/GTM (DataLayer Push)
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        ;(window as any).dataLayer.push({
          event: 'lead_ebook_gratuito',
          email: formData.get('email'),
        })
      }

      // 2. Inserir Lead no Supabase
      const { error } = await supabase.from('leads').insert([
        {
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          phone: formData.get('whatsapp') as string,
          product_type: 'E-book Grátis',
          lead_source: 'ebook-free',
        },
      ])

      if (error) throw error

      // 3. Gerar URL assinada para o material (se existir no bucket)
      const { data } = await supabase.storage
        .from('materiais')
        .createSignedUrl('ebooks-gratuitos/ebook-gratuito.pdf', 3600) // Válido por 1 hora

      toast({ title: 'Sucesso!', description: 'Seu acesso foi liberado.' })

      if (data?.signedUrl) {
        // Se encontrou o arquivo, redireciona para download e depois para obrigado
        window.open(data.signedUrl, '_blank')
        navigate('/obrigado-ebook')
      } else {
        // Se não houver arquivo ainda, vai direto para obrigado
        navigate('/obrigado-ebook')
      }
    } catch (err) {
      console.error(err)
      toast({ title: 'Erro', description: 'Tente novamente.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center bg-muted/30">
      <div className="container mx-auto px-4 py-16 max-w-[1200px] flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2 animate-fade-in-up">
          <span className="bg-secondary/20 text-secondary font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-4 inline-block">
            Material Gratuito
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary leading-tight">
            Guia Low Carb para Iniciantes
          </h1>
          <p className="text-lg text-muted-foreground mb-8 font-subheading leading-relaxed">
            Descubra os segredos da nutrição low-carb em 20 páginas de puro conteúdo aplicável,
            incluindo as melhores receitas e a quebra dos maiores mitos sobre alimentação.
          </p>

          <ul className="space-y-4 mb-8 text-foreground/80">
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                ✓
              </div>
              <span>Lista completa de alimentos permitidos</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                ✓
              </div>
              <span>Receitas fáceis para o dia a dia</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                ✓
              </div>
              <span>A ciência do metabolismo explicada de forma simples</span>
            </li>
          </ul>
        </div>

        <div className="w-full md:w-1/2 max-w-md animate-fade-in-up animation-delay-200">
          <div className="bg-card p-8 rounded-2xl shadow-xl border border-primary/10">
            <h3 className="text-2xl font-bold mb-6 text-center font-heading">Baixe Agora</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="name"
                required
                placeholder="Seu Nome Completo"
                className="h-12 bg-muted/50 border-border/50"
              />
              <Input
                name="email"
                type="email"
                required
                placeholder="Seu melhor E-mail"
                className="h-12 bg-muted/50 border-border/50"
              />
              <Input
                name="whatsapp"
                required
                placeholder="WhatsApp (com DDD)"
                className="h-12 bg-muted/50 border-border/50"
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 mt-2 bg-primary hover:bg-[#158A68] text-white rounded-xl font-bold text-lg shadow-md transition-transform hover:-translate-y-0.5"
              >
                {loading ? 'Processando e liberando...' : 'Quero meu E-book Grátis'}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                Seus dados estão seguros. Não enviamos spam.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
