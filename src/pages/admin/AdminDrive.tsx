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
  Info,
  FolderOpen,
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
}

export default function AdminDrive() {
  const [arquivos, setArquivos] = useState<DriveArquivo[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<any | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [mimeFilter, setMimeFilter] = useState<string>('todos')
  const [selectedArquivo, setSelectedArquivo] = useState<DriveArquivo | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const fetchArquivos = async () => {
    try {
      setLoading(true)
      const { data, error } = await (supabase as any)
        .from('drive_arquivos')
        .select('*')
        .order('modified_time', { ascending: false })

      if (error) throw error
      setArquivos((data as unknown as DriveArquivo[]) || [])
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

  const handleSyncNow = async () => {
    try {
      setSyncing(true)
      const res = await fetch('https://wfuwhozrwyqkqdovzers.supabase.co/functions/v1/sync-drive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          folderId: '0B_Wkefn8LCZxUzdna1BjX0xoeU0',
          resourceKey: '0-liYQFyvNcEqpmKVrUq6cAw',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || data.guidance || 'Falha ao sincronizar com Google Drive')
      }

      setSyncResult(data)
      toast({
        title: 'Sincronização concluída!',
        description: `${data.summary?.totalFilesFound || 0} arquivos processados (${data.summary?.created || 0} novos, ${data.summary?.updated || 0} atualizados).`,
      })
      await fetchArquivos()
    } catch (err: any) {
      toast({
        title: 'Falha na sincronização',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setSyncing(false)
    }
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
      return <FileText className="w-5 h-5 text-blue-600" />
    }
    if (
      mimeType.includes('spreadsheet') ||
      mimeType.includes('excel') ||
      mimeType.includes('csv')
    ) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
    }
    if (mimeType.startsWith('image/')) {
      return <FileImage className="w-5 h-5 text-purple-600" />
    }
    if (mimeType.includes('zip') || mimeType.includes('archive')) {
      return <FileArchive className="w-5 h-5 text-amber-600" />
    }
    return <File className="w-5 h-5 text-muted-foreground" />
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
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  // Filter logic
  const filteredArquivos = arquivos.filter((arq) => {
    const matchesSearch =
      searchTerm === '' ||
      arq.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (arq.texto_extraido && arq.texto_extraido.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === 'todos' || arq.status === statusFilter

    let matchesMime = true
    if (mimeFilter === 'docs') {
      matchesMime =
        arq.mime_type.includes('document') ||
        arq.mime_type.includes('text') ||
        arq.mime_type.includes('pdf')
    } else if (mimeFilter === 'sheets') {
      matchesMime = arq.mime_type.includes('spreadsheet') || arq.mime_type.includes('csv')
    } else if (mimeFilter === 'images') {
      matchesMime = arq.mime_type.startsWith('image/')
    }

    return matchesSearch && matchesStatus && matchesMime
  })

  // Counters
  const countNovos = arquivos.filter((a) => a.status === 'novo').length
  const countProducao = arquivos.filter((a) => a.status === 'em_producao').length
  const countUsados = arquivos.filter((a) => a.status === 'usado').length

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary flex items-center gap-2">
            <FolderSync className="w-8 h-8" /> Conteúdo do Google Drive
          </h1>
          <p className="text-muted-foreground mt-1">
            Arquivos sincronizados da pasta compartilhada <strong>Blog LowCArb</strong> com extração
            de texto
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleSyncNow}
            disabled={syncing}
            className="bg-primary text-primary-foreground flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Sincronizando...' : 'Sincronizar agora'}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-5 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground uppercase font-semibold">
              Total Arquivos
            </span>
            <p className="text-2xl font-bold">{arquivos.length}</p>
          </div>
        </div>

        <div className="bg-card p-5 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground uppercase font-semibold">Novos</span>
            <p className="text-2xl font-bold text-emerald-600">{countNovos}</p>
          </div>
        </div>

        <div className="bg-card p-5 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground uppercase font-semibold">
              Em Produção
            </span>
            <p className="text-2xl font-bold text-amber-600">{countProducao}</p>
          </div>
        </div>

        <div className="bg-card p-5 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-slate-500/10 text-slate-600 flex items-center justify-center">
            <Archive className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground uppercase font-semibold">Usados</span>
            <p className="text-2xl font-bold text-slate-600">{countUsados}</p>
          </div>
        </div>
      </div>

      {/* Sync summary banner if recently triggered */}
      {syncResult && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-start gap-3">
          <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-emerald-900 dark:text-emerald-100">
              Sincronização realizada na pasta &ldquo;{syncResult.folder?.name}&rdquo;
            </p>
            <p className="text-emerald-800 dark:text-emerald-300">
              {syncResult.summary?.totalFilesFound} arquivos escaneados em{' '}
              {syncResult.summary?.foldersScanned || 1} pastas.
              {syncResult.summary?.created > 0 &&
                ` ${syncResult.summary.created} novos adicionados.`}
              {syncResult.summary?.updated > 0 && ` ${syncResult.summary.updated} atualizados.`}
            </p>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome do arquivo ou trecho de texto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="w-36">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos status</SelectItem>
                <SelectItem value="novo">Novo</SelectItem>
                <SelectItem value="em_producao">Em Produção</SelectItem>
                <SelectItem value="usado">Usado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-36">
            <Select value={mimeFilter} onValueChange={setMimeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos tipos</SelectItem>
                <SelectItem value="docs">Textos & Docs</SelectItem>
                <SelectItem value="sheets">Planilhas</SelectItem>
                <SelectItem value="images">Imagens</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Files Table */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Nome do Arquivo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead>Modificado</TableHead>
                <TableHead>Texto Extraído</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                    Carregando arquivos do Drive...
                  </TableCell>
                </TableRow>
              ) : filteredArquivos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    Nenhum arquivo encontrado com os filtros aplicados.
                  </TableCell>
                </TableRow>
              ) : (
                filteredArquivos.map((arq) => (
                  <TableRow key={arq.id} className="hover:bg-muted/40 transition-colors">
                    <TableCell className="pl-4">{getFileIcon(arq.mime_type)}</TableCell>

                    <TableCell className="font-medium max-w-[280px]">
                      <div className="truncate" title={arq.nome}>
                        {arq.nome}
                      </div>
                      <span className="text-xs text-muted-foreground truncate block">
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
                        <SelectTrigger className="h-8 w-[130px] text-xs">
                          <SelectValue>
                            <Badge
                              className={`${statusBadges[arq.status]?.color} text-xs font-medium`}
                            >
                              {statusLabels[arq.status]}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="novo">
                            <span className="text-emerald-600 font-medium">Novo</span>
                          </SelectItem>
                          <SelectItem value="em_producao">
                            <span className="text-amber-600 font-medium">Em Produção</span>
                          </SelectItem>
                          <SelectItem value="usado">
                            <span className="text-slate-600 font-medium">Usado</span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatBytes(arq.tamanho_bytes)}
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(arq.modified_time)}
                    </TableCell>

                    <TableCell className="max-w-[220px]">
                      {arq.texto_extraido ? (
                        <div
                          className="text-xs text-muted-foreground truncate font-mono bg-muted/60 p-1.5 rounded cursor-pointer hover:bg-muted"
                          onClick={() => {
                            setSelectedArquivo(arq)
                            setIsPreviewOpen(true)
                          }}
                          title="Clique para ver o texto completo"
                        >
                          {arq.texto_extraido.slice(0, 70)}...
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          Sem texto extraído
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-right whitespace-nowrap space-x-1 pr-4">
                      {arq.texto_extraido && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedArquivo(arq)
                            setIsPreviewOpen(true)
                          }}
                          title="Ver texto extraído"
                        >
                          <Eye className="w-4 h-4 text-primary" />
                        </Button>
                      )}

                      {arq.link_drive && (
                        <Button variant="ghost" size="sm" asChild title="Abrir no Google Drive">
                          <a href={arq.link_drive} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 text-blue-500" />
                          </a>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading text-primary flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {selectedArquivo?.nome}
            </DialogTitle>
          </DialogHeader>

          {selectedArquivo && (
            <div className="space-y-4 my-2 flex-1 overflow-hidden flex flex-col">
              <div className="flex flex-wrap gap-3 items-center justify-between text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <div>
                  <strong>Tipo:</strong> {selectedArquivo.mime_type}
                </div>
                <div>
                  <strong>Tamanho:</strong> {formatBytes(selectedArquivo.tamanho_bytes)}
                </div>
                <div>
                  <strong>Data:</strong> {formatDate(selectedArquivo.modified_time)}
                </div>
                <div className="flex items-center gap-2">
                  <strong>Status:</strong>
                  <Select
                    value={selectedArquivo.status}
                    onValueChange={(val: 'novo' | 'em_producao' | 'usado') =>
                      handleUpdateStatus(selectedArquivo.id, val)
                    }
                  >
                    <SelectTrigger className="h-7 w-[120px] text-xs">
                      <SelectValue>
                        <Badge
                          className={`${statusBadges[selectedArquivo.status]?.color} text-xs font-normal`}
                        >
                          {statusLabels[selectedArquivo.status]}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="novo">Novo</SelectItem>
                      <SelectItem value="em_producao">Em Produção</SelectItem>
                      <SelectItem value="usado">Usado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-muted/20">
                <h4 className="text-xs uppercase font-semibold text-muted-foreground mb-2">
                  Texto Extraído (
                  {selectedArquivo.texto_extraido ? selectedArquivo.texto_extraido.length : 0}{' '}
                  caracteres)
                </h4>
                <pre className="text-sm font-sans whitespace-pre-wrap break-words leading-relaxed text-foreground select-text">
                  {selectedArquivo.texto_extraido || 'Nenhum texto disponível para este arquivo.'}
                </pre>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between items-center sm:justify-between">
            {selectedArquivo?.link_drive && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={selectedArquivo.link_drive}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" /> Abrir no Drive
                </a>
              </Button>
            )}
            <Button variant="secondary" onClick={() => setIsPreviewOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
