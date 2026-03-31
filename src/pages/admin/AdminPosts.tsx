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

export default function AdminPosts() {
  const [posts, setPosts] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')

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
      toast({ title: 'Post criado' })
      setTitle('')
      setCategory('')
      setContent('')
      fetchPosts()
    }
  }

  const handleDelete = async (id: string) => {
    await supabase.from('posts').delete().eq('id', id)
    fetchPosts()
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold font-heading text-primary">Blog / Posts</h1>

      <form onSubmit={handleCreate} className="bg-card p-6 rounded-xl border space-y-4">
        <h2 className="font-bold mb-4">Novo Post</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input
            required
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            required
            placeholder="Categoria"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <Textarea
          required
          placeholder="Conteúdo"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button type="submit" className="bg-primary">
          Publicar
        </Button>
      </form>

      <div className="bg-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.title}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(p.id)}>
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
