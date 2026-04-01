import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { FileText, Plus, Trash2 } from 'lucide-react'

export default function AdminPosts() {
  const [posts, setPosts] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setPosts(data)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('posts').insert([{ title, category, content }])
    if (!error) {
      toast({ title: 'Post criado com sucesso' })
      setTitle('')
      setCategory('')
      setContent('')
      setIsModalOpen(false)
      fetchPosts()
    } else {
      toast({ title: 'Erro ao criar post', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este artigo?')) return

    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (!error) {
      toast({ title: 'Post excluído' })
      fetchPosts()
    }
  }

  const generateMockPosts = async () => {
    const mocks = [
      {
        title: 'Introdução ao Low Carb',
        category: 'Low Carb na Prática',
        content:
          'A dieta Low Carb não é apenas sobre cortar carboidratos, mas sobre escolher os alimentos certos. O foco deve ser em vegetais sem amido, carnes de boa qualidade, ovos e gorduras saudáveis como azeite e abacate.\n\nQuando você reduz os carboidratos, seus níveis de insulina caem, e os ácidos graxos são liberados do tecido adiposo, promovendo a queima de gordura e perda de peso sustentável sem passar fome.',
      },
      {
        title: 'Por que calorias não são todas iguais?',
        category: 'Estudos Científicos',
        content:
          'A velha máxima de que "uma caloria é uma caloria" está defasada. 100 calorias de brócolis têm um impacto metabólico e hormonal completamente diferente de 100 calorias de açúcar.\n\nEnquanto o açúcar eleva a insulina rapidamente, os vegetais fibrosos mantêm a glicemia estável. O segredo do emagrecimento não é contar calorias, mas sim modular seus hormônios através da qualidade do que você come.',
      },
      {
        title: 'Sinais ocultos da Resistência à Insulina',
        category: 'Resistência Insulínica',
        content:
          'Você sente cansaço constante após o almoço? Tem dificuldade para perder gordura abdominal, mesmo comendo pouco? Estes podem ser sinais de resistência à insulina.\n\nOutros indicadores incluem acantose nigricans (manchas escuras no pescoço e dobras), compulsão por doces e oscilações de humor. A boa notícia é que uma intervenção nutricional com redução de carboidratos refinados pode reverter este quadro.',
      },
    ]

    const { error } = await supabase.from('posts').insert(mocks)
    if (!error) {
      toast({ title: 'Artigos mock criados com sucesso!' })
      fetchPosts()
    }
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary flex items-center gap-2">
            <FileText className="w-8 h-8" />
            Blog / Artigos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os conteúdos publicados na plataforma
          </p>
        </div>

        <div className="flex gap-3">
          {posts.length === 0 && (
            <Button variant="outline" onClick={generateMockPosts}>
              Gerar 3 Artigos de Teste
            </Button>
          )}

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Criar Artigo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle className="text-2xl text-primary font-heading">
                  Novo Artigo
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-5 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Título do Artigo</label>
                    <Input
                      required
                      placeholder="Ex: Introdução ao Low Carb"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Categoria</label>
                    <select
                      required
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="" disabled>
                        Selecione a Categoria
                      </option>
                      <option value="Emagrecimento Metabólico">Emagrecimento Metabólico</option>
                      <option value="Resistência Insulínica">Resistência Insulínica</option>
                      <option value="Trauma Alimentar">Trauma Alimentar</option>
                      <option value="Low Carb na Prática">Low Carb na Prática</option>
                      <option value="Estudos Científicos">Estudos Científicos</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Conteúdo (Texto Simples)</label>
                  <Textarea
                    required
                    placeholder="Escreva o conteúdo do seu artigo aqui..."
                    className="min-h-[250px]"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-primary">
                    Publicar Artigo
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data de Publicação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium max-w-[200px] truncate">{p.title}</TableCell>
                <TableCell>
                  <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    {p.category}
                  </span>
                </TableCell>
                <TableCell>{new Date(p.created_at).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(p.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {posts.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  Nenhum artigo publicado ainda. Clique em "Gerar 3 Artigos de Teste" para popular o
                  blog.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
