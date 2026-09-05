import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
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
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  FolderSync,
  RefreshCw,
  Search,
  ExternalLink,
  FileText,
  FileSpreadsheet,
  FileImage,
  FileArchive,
  File,
  Eye,
  CheckCircle2,
  Clock,
  Archive,
  FolderOpen,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Layers,
} from 'lucide-react'

export interface DriveArquivo {
  id: string
  file_id: string
  nome: string
  mime_type: string
  texto_extraido: string | null
  tamanho_bytes: number | null
  modified_time: string | null
  link_drive: string | null
  status: 'novo' | 'em_producao' | 'usado'
  created_at: string
  updated_at: string
  caminho_pasta?: string | null
}

type TabTipo = 'documentos' | 'imagens' | 'planilhas' | 'outros'

export default function AdminDrive() {
  const [arquivos, setArquivos] = useState<DriveArquivo[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<TabTipo>('documentos')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [selectedArquivo, setSelectedArquivo] = useState<DriveArquivo | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Paginação: 25 itens por página
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 25

  // Seções colapsáveis por caminho_pasta (chave = caminho_pasta, valor = boolean se está expandido)
  // Imagens colapsadas por padrão
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({})

  const fetchArquivos = async () => {
    try {
      setLoading(true)
      const { data, error } = await (supabase as any)
        .from('drive_arquivos')
        .select('*')
        .order('modified_time', { ascending: false })

      if (error) throw error
      const rows = (data as unknown as DriveArquivo[]) || []
      setArquivos(rows)
    } catch (err: any) {
      toast({
        title: 'Erro ao carregar arquivos do Drive',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArquivos()
  }, [])

  // Classificação do tipo de arquivo para as abas
  const getFileCategory = (mime: string): TabTipo => {
    const m = (mime || '').toLowerCase()
    if (m.startsWith('image/')) return 'imagens'
    if (m.includes('spreadsheet') || m.includes('excel') || m === 'text/csv') return 'planilhas'
    if (
      m.includes('pdf') ||
      m.includes('document') ||
      m.includes('text') ||
      m.includes('presentation') ||
      m.includes('rtf')
    ) {
      return 'documentos'
    }
    return 'outros'
  }

  // Contadores REAIS calculados do banco
  const countsPorTipo = useMemo(() => {
    const counts: Record<TabTipo, number> = {
      documentos: 0,
      imagens: 0,
      planilhas: 0,
      outros: 0,
    }
    for (const a of arquivos) {
      const cat = getFileCategory(a.mime_type)
      counts[cat] = (counts[cat] || 0) + 1
    }
    return counts
  }, [arquivos])

  // Resetar paginação ao trocar de aba ou busca
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, searchTerm, statusFilter])

  // Inicializa estado de expansão de pastas quando muda aba
  // Imagens colapsadas por padrão; outros expandidos por padrão
  useEffect(() => {
    const isImageTab = activeTab === 'imagens'
    const initialMap: Record<string, boolean> = {}
    for (const a of arquivos) {
      const folder = a.caminho_pasta || 'Sem pasta'
      if (!(folder in initialMap)) {
        initialMap[folder] = !isImageTab
      }
    }
    setExpandedFolders(initialMap)
  }, [activeTab, arquivos])

  const toggleFolder = (folder: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folder]: !prev[folder],
    }))
  }

  const handleUpdateStatus = async (id: string, newStatus: 'novo' | 'em_producao' | 'usado') => {
    try {
      const { error } = await (supabase as any)
        .from('drive_arquivos')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      setArquivos((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)),
      )

      if (selectedArquivo && selectedArquivo.id === id) {
        setSelectedArquivo((prev) => (prev ? { ...prev, status: newStatus } : null))
      }

      toast({
        title: 'Status atualizado',
        description: `Status alterado para "${statusLabels[newStatus]}".`,
      })
    } catch (err: any) {
      toast({
        title: 'Erro ao atualizar status',
        description: err.message,
        variant: 'destructive',
      })
    }
  }

  const statusLabels: Record<string, string> = {
    novo: 'Novo',
    em_producao: 'Em Produção',
    usado: 'Usado',
  }

  const statusBadges: Record<
    string,
    { variant: 'default' | 'secondary' | 'outline'; color: string }
  > = {
    novo: { variant: 'default', color: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
    em_producao: { variant: 'default', color: 'bg-amber-600 hover:bg-amber-700 text-white' },
    usado: {
      variant: 'secondary',
      color: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
    },
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('document') || mimeType.includes('text') || mimeType.includes('pdf')) {
      return <FileText className="w-4 h-4 text-blue-600" />
    }
    if (
      mimeType.includes('spreadsheet') ||
      mimeType.includes('excel') ||
      mimeType.includes('csv')
    ) {
      return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
    }
    if (mimeType.startsWith('image/')) {
      return <FileImage className="w-4 h-4 text-purple-600" />
    }
    if (mimeType.includes('zip') || mimeType.includes('archive')) {
      return <FileArchive className="w-4 h-4 text-amber-600" />
    }
    return <File className="w-4 h-4 text-muted-foreground" />
  }

  const formatBytes = (bytes: number | null) => {
    if (!bytes || bytes === 0) return '—'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—'
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  // Filtragem
  const filteredArquivos = useMemo(() => {
    return arquivos.filter((arq) => {
      // Filtro de aba
      const cat = getFileCategory(arq.mime_type)
      if (cat !== activeTab) return false

      // Busca por nome ou texto extraído
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase()
        const matchName = arq.nome.toLowerCase().includes(term)
        const matchText = arq.texto_extraido?.toLowerCase().includes(term)
        const matchFolder = arq.caminho_pasta?.toLowerCase().includes(term)
        if (!matchName && !matchText && !matchFolder) return false
      }

      // Status
      if (statusFilter !== 'todos' && arq.status !== statusFilter) {
        return false
      }

      return true
    })
  }, [arquivos, activeTab, searchTerm, statusFilter])

  // Agrupamento por caminho_pasta com ordenação por data (mais recentes primeiro)
  const groupedByPasta = useMemo(() => {
    const map = new Map<string, DriveArquivo[]>()
    for (const a of filteredArquivos) {
      const pasta = a.caminho_pasta || 'Sem pasta'
      const list = map.get(pasta) || []
      list.push(a)
      map.set(pasta, list)
    }

    // Ordenar itens dentro de cada grupo por data decrescente
    const result: Array<{ pasta: string; items: DriveArquivo[] }> = []
    for (const [pasta, items] of map.entries()) {
      items.sort((a, b) => {
        const tA = a.modified_time ? new Date(a.modified_time).getTime() : 0
        const tB = b.modified_time ? new Date(b.modified_time).getTime() : 0
        return tB - tA
      })
      result.push({ pasta, items })
    }

    return result
  }, [filteredArquivos])

  // Paginação plana de 25 itens por página
  const totalItems = filteredArquivos.length
  const totalPages = Math.ceil(totalItems / pageSize) || 1
  const paginatedArquivos = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredArquivos.slice(start, start + pageSize)
  }, [filteredArquivos, currentPage, pageSize])

  // Agrupa os 25 itens da página atual por pasta para exibir com seções colapsáveis
  const paginatedGrouped = useMemo(() => {
    const map = new Map<string, DriveArquivo[]>()
    for (const a of paginatedArquivos) {
      const pasta = a.caminho_pasta || 'Sem pasta'
      const list = map.get(pasta) || []
      list.push(a)
      map.set(pasta, list)
    }
    return Array.from(map.entries())
  }, [paginatedArquivos])

  // Counters globais
  const countNovos = arquivos.filter((a) => a.status === 'novo').length
  const countProducao = arquivos.filter((a) => a.status === 'em_producao').length
  const countUsados = arquivos.filter((a) => a.status === 'usado').length
  const countComTexto = arquivos.filter((a) => !!a.texto_extraido).length

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-primary flex items-center gap-2">
            <FolderSync className="w-7 h-7 text-emerald-600" /> Acervo do Google Drive
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm mt-1">
            <strong>{arquivos.length}</strong> arquivos sincronizados da pasta compartilhada{' '}
            <em>Blog LowCArb</em> ({countComTexto} prontos com texto indexado).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            className="bg-terracotta hover:bg-terracotta/90 text-white shadow-sm text-xs h-9"
          >
            <Link to="/admin/estudio">
              <Sparkles className="w-4 h-4 mr-1.5" /> Abrir Estúdio IA
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchArquivos}
            disabled={loading}
            className="text-xs h-9"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-card p-4 rounded-xl border shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground uppercase font-semibold">Total</span>
            <p className="text-xl font-bold">{arquivos.length}</p>
          </div>
        </div>

        <div className="bg-card p-4 rounded-xl border shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground uppercase font-semibold">
              Com Texto
            </span>
            <p className="text-xl font-bold text-emerald-600">{countComTexto}</p>
          </div>
        </div>

        <div className="bg-card p-4 rounded-xl border shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground uppercase font-semibold">
              Em Produção
            </span>
            <p className="text-xl font-bold text-amber-600">{countProducao}</p>
          </div>
        </div>

        <div className="bg-card p-4 rounded-xl border shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-500/10 text-slate-600 flex items-center justify-center">
            <Archive className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground uppercase font-semibold">
              Usados
            </span>
            <p className="text-xl font-bold text-slate-600">{countUsados}</p>
          </div>
        </div>
      </div>

      {/* ABAS POR TIPO COM CONTADORES REAIS DO BANCO */}
      <div className="bg-card p-4 rounded-2xl border shadow-sm space-y-4">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as TabTipo)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto p-1 gap-1 bg-muted/60">
            <TabsTrigger
              value="documentos"
              className="py-2 text-xs flex items-center justify-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Documentos</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                {countsPorTipo.documentos}
              </Badge>
            </TabsTrigger>

            <TabsTrigger
              value="imagens"
              className="py-2 text-xs flex items-center justify-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              <FileImage className="w-4 h-4 text-purple-600" />
              <span>Imagens</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                {countsPorTipo.imagens}
              </Badge>
            </TabsTrigger>

            <TabsTrigger
              value="planilhas"
              className="py-2 text-xs flex items-center justify-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Planilhas</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                {countsPorTipo.planilhas}
              </Badge>
            </TabsTrigger>

            <TabsTrigger
              value="outros"
              className="py-2 text-xs flex items-center justify-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              <FileArchive className="w-4 h-4 text-amber-600" />
              <span>Outros</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                {countsPorTipo.outros}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Barra de Filtros: Busca + Status */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pt-2">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, pasta ou texto extraído..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs h-9 bg-background"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] text-xs h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos" className="text-xs">
                  Todos
                </SelectItem>
                <SelectItem value="novo" className="text-xs">
                  Novo
                </SelectItem>
                <SelectItem value="em_producao" className="text-xs">
                  Em Produção
                </SelectItem>
                <SelectItem value="usado" className="text-xs">
                  Usado
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Indicador de visualização de imagens colapsadas */}
        {activeTab === 'imagens' && (
          <div className="p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl text-xs text-purple-900 dark:text-purple-200 flex items-center justify-between">
            <span>
              ℹ️ A aba de imagens contém <strong>{countsPorTipo.imagens}</strong> arquivos e inicia
              colapsada para melhor performance. Clique na pasta para expandir.
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const allExpanded = Object.values(expandedFolders).every(Boolean)
                const nextState: Record<string, boolean> = {}
                for (const p of Object.keys(expandedFolders)) {
                  nextState[p] = !allExpanded
                }
                setExpandedFolders(nextState)
              }}
              className="h-7 text-xs border-purple-300 hover:bg-purple-100 text-purple-900"
            >
              {Object.values(expandedFolders).every(Boolean) ? 'Colapsar Todas' : 'Expandir Todas'}
            </Button>
          </div>
        )}
      </div>

      {/* TABELA DE ARQUIVOS COM SEÇÕES COLAPSÁVEIS POR PASTA */}
      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-muted-foreground">
            <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-primary" />
            Carregando arquivos do Drive...
          </div>
        ) : filteredArquivos.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            Nenhum arquivo encontrado para esta aba ou termo de busca.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {paginatedGrouped.map(([pasta, items]) => {
              const isExpanded = expandedFolders[pasta] ?? activeTab !== 'imagens'
              return (
                <div key={pasta} className="group">
                  {/* Cabeçalho da Seção de Pasta */}
                  <button
                    type="button"
                    onClick={() => toggleFolder(pasta)}
                    className="w-full flex items-center justify-between p-3.5 bg-muted/40 hover:bg-muted/70 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-primary" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                      <FolderOpen className="w-4 h-4 text-emerald-600" />
                      <span className="font-heading font-semibold text-sm text-foreground">
                        {pasta}
                      </span>
                      <Badge variant="outline" className="text-[10px] bg-background">
                        {items.length} {items.length === 1 ? 'item' : 'itens'}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {isExpanded ? 'Clique para recolher' : 'Clique para expandir'}
                    </span>
                  </button>

                  {/* Conteúdo da Pasta (Tabela de Arquivos) */}
                  {isExpanded && (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-muted/20">
                          <TableRow>
                            <TableHead className="w-[36px]"></TableHead>
                            <TableHead className="text-xs">Nome do Arquivo</TableHead>
                            <TableHead className="text-xs">Status</TableHead>
                            <TableHead className="text-xs">Tamanho</TableHead>
                            <TableHead className="text-xs">Modificado</TableHead>
                            <TableHead className="text-xs">Texto Extraído</TableHead>
                            <TableHead className="text-right text-xs">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {items.map((arq) => (
                            <TableRow
                              key={arq.id}
                              className="hover:bg-muted/30 transition-colors text-xs"
                            >
                              <TableCell className="pl-3">{getFileIcon(arq.mime_type)}</TableCell>

                              <TableCell className="font-medium max-w-[280px]">
                                <div className="truncate" title={arq.nome}>
                                  {arq.nome}
                                </div>
                                <span className="text-[10px] text-muted-foreground truncate block">
                                  {arq.mime_type}
                                </span>
                              </TableCell>

                              <TableCell>
                                <Select
                                  value={arq.status}
                                  onValueChange={(val: 'novo' | 'em_producao' | 'usado') =>
                                    handleUpdateStatus(arq.id, val)
                                  }
                                >
                                  <SelectTrigger className="h-7 w-[120px] text-xs">
                                    <SelectValue>
                                      <Badge
                                        className={`${statusBadges[arq.status]?.color} text-[10px] font-medium`}
                                      >
                                        {statusLabels[arq.status]}
                                      </Badge>
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="novo" className="text-xs">
                                      <span className="text-emerald-600 font-medium">Novo</span>
                                    </SelectItem>
                                    <SelectItem value="em_producao" className="text-xs">
                                      <span className="text-amber-600 font-medium">
                                        Em Produção
                                      </span>
                                    </SelectItem>
                                    <SelectItem value="usado" className="text-xs">
                                      <span className="text-slate-600 font-medium">Usado</span>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>

                              <TableCell className="text-muted-foreground whitespace-nowrap">
                                {formatBytes(arq.tamanho_bytes)}
                              </TableCell>

                              <TableCell className="text-muted-foreground whitespace-nowrap">
                                {formatDate(arq.modified_time)}
                              </TableCell>

                              <TableCell className="max-w-[200px]">
                                {arq.texto_extraido ? (
                                  <div
                                    className="truncate font-mono bg-muted/60 p-1 rounded cursor-pointer hover:bg-muted text-[11px]"
                                    onClick={() => {
                                      setSelectedArquivo(arq)
                                      setIsPreviewOpen(true)
                                    }}
                                    title="Clique para ver o texto completo"
                                  >
                                    {arq.texto_extraido.slice(0, 60)}...
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground italic text-[11px]">
                                    Sem texto
                                  </span>
                                )}
                              </TableCell>

                              <TableCell className="text-right whitespace-nowrap space-x-1 pr-3">
                                {/* Botão "Criar artigo no Estúdio" nos arquivos com texto extraído */}
                                {arq.texto_extraido && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="h-7 text-xs border-terracotta/40 text-terracotta hover:bg-terracotta/10"
                                    title="Criar artigo no Estúdio IA com este arquivo"
                                  >
                                    <Link to={`/admin/estudio?fileId=${arq.id}`}>
                                      <Sparkles className="w-3.5 h-3.5 mr-1" /> Criar no Estúdio
                                    </Link>
                                  </Button>
                                )}

                                {arq.texto_extraido && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedArquivo(arq)
                                      setIsPreviewOpen(true)
                                    }}
                                    className="h-7 w-7 p-0"
                                    title="Ver texto extraído"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-primary" />
                                  </Button>
                                )}

                                {arq.link_drive && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                    className="h-7 w-7 p-0"
                                    title="Abrir no Google Drive"
                                  >
                                    <a
                                      href={arq.link_drive}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                                    </a>
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* PAGINAÇÃO 25 ITENS POR PÁGINA */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t bg-muted/20 gap-3 text-xs">
            <span className="text-muted-foreground">
              Mostrando {Math.min((currentPage - 1) * pageSize + 1, totalItems)} a{' '}
              {Math.min(currentPage * pageSize, totalItems)} de {totalItems} arquivos
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 text-xs"
              >
                Anterior
              </Button>
              <span className="px-2 font-medium">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-8 text-xs"
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Dialog do Texto Extraído */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-lg font-heading text-primary flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              {selectedArquivo?.nome}
            </DialogTitle>
          </DialogHeader>

          {selectedArquivo && (
            <div className="space-y-3 my-2 flex-1 overflow-hidden flex flex-col text-xs">
              <div className="flex flex-wrap gap-3 items-center justify-between text-muted-foreground bg-muted/50 p-2.5 rounded-lg">
                <div>
                  <strong>Pasta:</strong> {selectedArquivo.caminho_pasta || 'Raiz'}
                </div>
                <div>
                  <strong>Tamanho:</strong> {formatBytes(selectedArquivo.tamanho_bytes)}
                </div>
                <div>
                  <strong>Data:</strong> {formatDate(selectedArquivo.modified_time)}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto border rounded-lg p-3 bg-muted/20">
                <h4 className="text-[11px] uppercase font-semibold text-muted-foreground mb-2">
                  Texto Extraído (
                  {selectedArquivo.texto_extraido ? selectedArquivo.texto_extraido.length : 0}{' '}
                  caracteres)
                </h4>
                <pre className="text-xs font-sans whitespace-pre-wrap break-words leading-relaxed text-foreground select-text">
                  {selectedArquivo.texto_extraido || 'Nenhum texto disponível para este arquivo.'}
                </pre>
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-between sm:justify-between">
            {selectedArquivo && (
              <Button asChild size="sm" className="bg-terracotta hover:bg-terracotta/90 text-white">
                <Link to={`/admin/estudio?fileId=${selectedArquivo.id}`}>
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Criar Artigo no Estúdio
                </Link>
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={() => setIsPreviewOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
