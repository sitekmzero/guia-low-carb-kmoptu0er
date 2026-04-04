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
import { toast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Plus, Trash2, Edit, Download, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [isCatModalOpen, setIsCatModalOpen] = useState(false)

  // Post Form State
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [published, setPublished] = useState(true)

  // Cat Form State
  const [catName, setCatName] = useState('')
  const [catColor, setCatColor] = useState('#2D6A4F')

  const fetchData = async () => {
    const [p, c] = await Promise.all([
      supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
      supabase.from('blog_categories').select('*').order('name'),
    ])
    if (p.data) setPosts(p.data)
    if (c.data) setCategories(c.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const generateSlug = (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = generateSlug(title)
    const readTime = Math.ceil(content.split(' ').length / 200)

    const payload = {
      title,
      slug,
      category,
      content,
      excerpt,
      featured_image_url: imageUrl,
      published,
      reading_time_minutes: readTime,
      author: 'Adriana Araújo',
      published_date: published ? new Date().toISOString() : null,
    }

    let error
    if (editingPostId) {
      const res = await supabase.from('blog_posts').update(payload).eq('id', editingPostId)
      error = res.error
    } else {
      const res = await supabase.from('blog_posts').insert([payload])
      error = res.error
    }

    if (!error) {
      toast({ title: 'Post salvo com sucesso!' })
      setIsPostModalOpen(false)
      resetPostForm()
      fetchData()
    } else {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    }
  }

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = generateSlug(catName)
    const { error } = await supabase
      .from('blog_categories')
      .insert([{ name: catName, slug, color: catColor }])
    if (!error) {
      toast({ title: 'Categoria criada' })
      setIsCatModalOpen(false)
      setCatName('')
      fetchData()
    }
  }

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Excluir este post?')) return
    await supabase.from('blog_posts').delete().eq('id', id)
    fetchData()
  }

  const handleDeleteCat = async (id: string) => {
    if (!window.confirm('Excluir esta categoria?')) return
    await supabase.from('blog_categories').delete().eq('id', id)
    fetchData()
  }

  const openEditPost = (post: any) => {
    setEditingPostId(post.id)
    setTitle(post.title)
    setCategory(post.category)
    setContent(post.content)
    setExcerpt(post.excerpt || '')
    setImageUrl(post.featured_image_url || '')
    setPublished(post.published)
    setIsPostModalOpen(true)
  }

  const resetPostForm = () => {
    setEditingPostId(null)
    setTitle('')
    setCategory('')
    setContent('')
    setExcerpt('')
    setImageUrl('')
    setPublished(true)
  }

  const exportToCSV = () => {
    const headers = ['Título', 'Slug', 'Categoria', 'Autor', 'Data', 'Views']
    const csvContent = [
      headers.join(','),
      ...posts.map(
        (p) =>
          `"${p.title}","${p.slug}","${p.category}","${p.author}","${new Date(p.published_date).toLocaleDateString()}","${p.views}"`,
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'blog_posts.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary flex items-center gap-2">
            <FileText className="w-8 h-8" /> Blog Manager
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie artigos, categorias e métricas de leitura
          </p>
        </div>
        <Button variant="outline" onClick={exportToCSV}>
          <Download className="w-4 h-4 mr-2" /> Exportar CSV
        </Button>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="posts">Artigos</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>

        {/* POSTS TAB */}
        <TabsContent value="posts" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Dialog
              open={isPostModalOpen}
              onOpenChange={(v) => {
                setIsPostModalOpen(v)
                if (!v) resetPostForm()
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-primary text-white">
                  <Plus className="w-4 h-4 mr-2" /> Novo Artigo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-primary font-heading">
                    {editingPostId ? 'Editar Artigo' : 'Novo Artigo'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSavePost} className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Título</label>
                      <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Categoria</label>
                      <select
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="" disabled>
                          Selecione...
                        </option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Resumo (Excerpt)</label>
                    <Input required value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">URL da Imagem de Capa</label>
                    <Input
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Conteúdo HTML</label>
                    <textarea
                      required
                      className="w-full min-h-[300px] border rounded-md p-3 text-sm font-mono"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="<h2>Subtítulo</h2><p>Texto...</p>"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="pub"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="pub" className="text-sm">
                      Publicado
                    </label>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsPostModalOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-primary">
                      Salvar Artigo
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-card rounded-xl border shadow-sm overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium max-w-[250px] truncate" title={p.title}>
                      {p.title}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {p.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      {p.published ? (
                        <span className="text-green-600 text-xs font-bold">PUBLICADO</span>
                      ) : (
                        <span className="text-orange-500 text-xs font-bold">RASCUNHO</span>
                      )}
                    </TableCell>
                    <TableCell>{p.views}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/blog/${p.slug}`} target="_blank">
                          <Eye className="w-4 h-4 text-blue-500" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openEditPost(p)}>
                        <Edit className="w-4 h-4 text-primary" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeletePost(p.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* CATEGORIES TAB */}
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Dialog open={isCatModalOpen} onOpenChange={setIsCatModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-secondary text-white">
                  <Plus className="w-4 h-4 mr-2" /> Nova Categoria
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-2xl text-primary font-heading">
                    Nova Categoria
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSaveCategory} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome da Categoria</label>
                    <Input required value={catName} onChange={(e) => setCatName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cor Hex</label>
                    <Input
                      type="color"
                      required
                      value={catColor}
                      onChange={(e) => setCatColor(e.target.value)}
                      className="h-12 w-20"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCatModalOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-primary">
                      Salvar Categoria
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-card rounded-xl border shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Cor</TableHead>
                  <TableHead>Uso (Posts)</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((c) => {
                  const count = posts.filter((p) => p.category === c.name).length
                  return (
                    <TableRow key={c.id}>
                      <TableCell className="font-bold">{c.name}</TableCell>
                      <TableCell className="text-muted-foreground">{c.slug}</TableCell>
                      <TableCell>
                        <div
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: c.color }}
                        ></div>
                      </TableCell>
                      <TableCell>{count} artigo(s)</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCat(c.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
