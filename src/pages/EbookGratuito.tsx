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
      const { error } = await supabase.from('leads_cursos').insert([
        {
          name: formData.get('name'),
          email: formData.get('email'),
          whatsapp: formData.get('whatsapp'),
        },
      ])

      if (error) throw error

      navigate('/obrigado-ebook')
    } catch (err) {
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
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary">
            Guia Low Carb para Iniciantes
          </h1>
          <p className="text-lg text-muted-foreground mb-8 font-subheading">
            Descubra os segredos da nutrição low-carb em poucas páginas e com receitas exclusivas.
          </p>

          <ul className="space-y-3 mb-8 text-foreground/80">
            <li className="flex items-center gap-2">✓ Lista de alimentos permitidos</li>
            <li className="flex items-center gap-2">✓ Receitas fáceis para o dia a dia</li>
            <li className="flex items-center gap-2">✓ A ciência explicada de forma simples</li>
          </ul>
        </div>

        <div className="w-full md:w-1/2 max-w-md animate-fade-in-up animation-delay-200">
          <div className="bg-card p-8 rounded-2xl shadow-xl border">
            <h3 className="text-2xl font-bold mb-6 text-center">Baixe Agora</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="name" required placeholder="Seu Nome" className="h-12 bg-muted/50" />
              <Input
                name="email"
                type="email"
                required
                placeholder="Seu E-mail"
                className="h-12 bg-muted/50"
              />
              <Input name="whatsapp" required placeholder="WhatsApp" className="h-12 bg-muted/50" />
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary hover:bg-[#158A68] text-white rounded-full font-bold text-lg"
              >
                {loading ? 'Processando...' : 'Baixar Agora'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
