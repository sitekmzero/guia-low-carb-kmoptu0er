import React, { useState } from 'react'
import {
  Sparkles,
  Bot,
  FolderSync,
  FileText,
  Search,
  Check,
  Loader2,
  RefreshCw,
  Wand2,
  ChevronDown,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { invokeGeminiAssist } from '@/services/estudioAiService'
import { toast } from '@/hooks/use-toast'

interface DriveArquivoItem {
  id: string
  nome: string
  mime_type: string
  texto_extraido: string | null
  status: string
  link_drive: string | null
}

interface EstudioAssistantProps {
  currentTitle: string
  currentContent: string
  selectedText: string
  driveFiles: DriveArquivoItem[]
  loadingDrive: boolean
  onApplyDraft: (generatedHtml: string) => void
  onReplaceSelectedText: (improvedText: string) => void
  onGenerateSeoFromTitle: () => void
  isGeneratingSeo: boolean
}

export const EstudioAssistant: React.FC<EstudioAssistantProps> = ({
  currentTitle,
  currentContent,
  selectedText,
  driveFiles,
  loadingDrive,
  onApplyDraft,
  onReplaceSelectedText,
  onGenerateSeoFromTitle,
  isGeneratingSeo,
}) => {
  const [selectedFileId, setSelectedFileId] = useState<string>('')
  const [briefingText, setBriefingText] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [improveInstruction, setImproveInstruction] = useState('')
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false)
  const [isImprovingText, setIsImprovingText] = useState(false)
  const [searchDrive, setSearchDrive] = useState('')

  // Modal para aprovar/editar sugestão da IA antes de aplicar
  const [aiSuggestionModalOpen, setAiSuggestionModalOpen] = useState(false)
  const [aiSuggestionContent, setAiSuggestionContent] = useState('')
  const [aiSuggestionTarget, setAiSuggestionTarget] = useState<'draft' | 'improve'>('draft')

  const selectedFile = driveFiles.find((f) => f.id === selectedFileId)

  // Filtra arquivos do Drive que possuem texto extraído relevante
  const filteredDriveFiles = driveFiles.filter((f) => {
    if (!searchDrive) return true
    return (
      f.nome.toLowerCase().includes(searchDrive.toLowerCase()) ||
      (f.texto_extraido && f.texto_extraido.toLowerCase().includes(searchDrive.toLowerCase()))
    )
  })

  // 1. Gerar Rascunho a partir de Drive ou Briefing
  const handleGenerateDraft = async () => {
    if (!currentTitle && !briefingText && !selectedFile) {
      toast({
        title: 'Informe dados para gerar',
        description: 'Digite um título, um briefing ou selecione um arquivo sincronizado do Drive.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsGeneratingDraft(true)
      const { data, error } = await invokeGeminiAssist({
        action: 'draft',
        title: currentTitle,
        briefing: briefingText,
        driveFileName: selectedFile?.nome,
        driveContent: selectedFile?.texto_extraido || undefined,
        userInstruction: customPrompt,
      })

      if (error) {
        throw new Error(error)
      }

      const generatedHtml = data?.text || ''
      setAiSuggestionContent(generatedHtml)
      setAiSuggestionTarget('draft')
      setAiSuggestionModalOpen(true)

      toast({
        title: 'Rascunho gerado pelo Gemini 3.7 Flash!',
        description: 'Revise a sugestão abaixo antes de aplicar ao editor.',
      })
    } catch (err: any) {
      toast({
        title: 'Erro ao gerar rascunho',
        description: err.message || 'Verifique sua conexão ou a chave GEMINI_API_KEY.',
        variant: 'destructive',
      })
    } finally {
      setIsGeneratingDraft(false)
    }
  }

  // 2. Melhorar trecho selecionado
  const handleImproveSelection = async () => {
    const textToImprove = selectedText || currentContent
    if (!textToImprove.trim()) {
      toast({
        title: 'Nenhum texto selecionado',
        description:
          'Selecione um trecho no editor ou tenha conteúdo digitado para a IA aprimorar.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsImprovingText(true)
      const { data, error } = await invokeGeminiAssist({
        action: 'improve',
        title: currentTitle,
        selectedText: textToImprove,
        userInstruction:
          improveInstruction || 'Torne mais fluido, acolhedor e com precisão científica.',
      })

      if (error) throw new Error(error)

      setAiSuggestionContent(data?.text || '')
      setAiSuggestionTarget('improve')
      setAiSuggestionModalOpen(true)
    } catch (err: any) {
      toast({
        title: 'Erro ao melhorar trecho',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setIsImprovingText(false)
    }
  }

  // Confirmação da sugestão
  const handleConfirmSuggestion = () => {
    if (aiSuggestionTarget === 'draft') {
      onApplyDraft(aiSuggestionContent)
    } else {
      onReplaceSelectedText(aiSuggestionContent)
    }
    setAiSuggestionModalOpen(false)
    toast({
      title: 'Sugestão aplicada!',
      description: 'O conteúdo foi inserido no editor para você continuar ajustando.',
    })
  }

  return (
    <div className="space-y-5 text-sm">
      {/* Cabeçalho do painel esquerdo */}
      <div className="flex items-center gap-2 pb-3 border-b border-border/70">
        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-base text-foreground leading-tight">
            Assistente IA
          </h2>
          <span className="text-xs text-muted-foreground">Gemini 3.7 Flash • Compliance CFN</span>
        </div>
      </div>

      {/* Regra de Ouro da Usuária: Botão de SEO rápido acionado após digitar o título */}
      <div className="p-3.5 bg-primary/5 rounded-xl border border-primary/20 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs text-primary uppercase tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Ação Rápida: SEO
          </span>
          <Badge
            variant="outline"
            className="text-[10px] bg-background text-primary border-primary/30"
          >
            Automático
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Sugeriu um título? Clique abaixo para preencher Meta Title, Description, Slug e Tags
          instantaneamente.
        </p>
        <Button
          type="button"
          onClick={onGenerateSeoFromTitle}
          disabled={!currentTitle.trim() || isGeneratingSeo}
          className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-9 font-medium shadow-sm"
        >
          {isGeneratingSeo ? (
            <>
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Gerando SEO pelo Gemini...
            </>
          ) : (
            <>
              <Wand2 className="w-3.5 h-3.5 mr-1.5" /> Gerar SEO a partir do Título
            </>
          )}
        </Button>
      </div>

      {/* Seção 1: Fonte Google Drive */}
      <div className="space-y-3 p-3.5 bg-card rounded-xl border shadow-sm">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-xs text-foreground flex items-center gap-1.5">
            <FolderSync className="w-4 h-4 text-emerald-600" /> Fonte do Google Drive
          </label>
          <span className="text-[11px] text-muted-foreground">{driveFiles.length} arquivos</span>
        </div>

        {/* Busca rápida nos arquivos sincronizados */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filtrar arquivos por nome..."
            value={searchDrive}
            onChange={(e) => setSearchDrive(e.target.value)}
            className="pl-8 text-xs h-8 bg-muted/30"
          />
        </div>

        <Select value={selectedFileId} onValueChange={setSelectedFileId}>
          <SelectTrigger className="text-xs h-9">
            <SelectValue placeholder="Selecione um arquivo de referência..." />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {loadingDrive ? (
              <SelectItem value="loading" disabled>
                Carregando Drive...
              </SelectItem>
            ) : filteredDriveFiles.length === 0 ? (
              <SelectItem value="none" disabled>
                Nenhum arquivo encontrado
              </SelectItem>
            ) : (
              filteredDriveFiles.slice(0, 50).map((file) => (
                <SelectItem key={file.id} value={file.id} className="text-xs">
                  <div className="truncate max-w-[240px]">
                    {file.nome} {file.texto_extraido ? '📄' : ''}
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {selectedFile && (
          <div className="p-2.5 bg-muted/40 rounded-lg text-xs space-y-1 border border-border/50">
            <div className="flex items-center justify-between font-medium">
              <span className="truncate max-w-[180px]">{selectedFile.nome}</span>
              {selectedFile.link_drive && (
                <a
                  href={selectedFile.link_drive}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:underline inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> Abrir
                </a>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {selectedFile.texto_extraido
                ? `${selectedFile.texto_extraido.length} caracteres indexados prontos para uso.`
                : 'Sem texto extraído neste arquivo.'}
            </p>
          </div>
        )}
      </div>

      {/* Seção 2: Briefing & Geração de Rascunho */}
      <div className="space-y-3 p-3.5 bg-card rounded-xl border shadow-sm">
        <label className="font-semibold text-xs text-foreground flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-primary" /> Briefing do Artigo
        </label>
        <textarea
          placeholder="Ex: Explicar o impacto da resistência insulínica no ganho de peso, com foco em mulheres 40+, citando a importância de não prescrever dietas fechadas e alertando quem usa metformina..."
          value={briefingText}
          onChange={(e) => setBriefingText(e.target.value)}
          className="w-full text-xs p-2.5 rounded-lg border bg-background min-h-[90px] focus:outline-none focus:ring-1 focus:ring-primary"
        />

        <div className="space-y-1.5">
          <label className="text-[11px] text-muted-foreground">
            Instrução adicional (opcional):
          </label>
          <Input
            placeholder="Ex: dê ênfase a receitas práticas com ovos e abacate"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="text-xs h-8"
          />
        </div>

        <Button
          type="button"
          onClick={handleGenerateDraft}
          disabled={isGeneratingDraft}
          className="w-full bg-secondary text-white hover:bg-secondary/90 text-xs h-9 font-medium shadow-sm"
        >
          {isGeneratingDraft ? (
            <>
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Escrevendo com Gemini 3.7...
            </>
          ) : (
            <>
              <Wand2 className="w-3.5 h-3.5 mr-1.5" /> Gerar Rascunho Completo
            </>
          )}
        </Button>
      </div>

      {/* Seção 3: Melhorar Trecho Selecionado */}
      <div className="space-y-3 p-3.5 bg-card rounded-xl border shadow-sm">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-xs text-foreground flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-terracotta" /> Melhorar Trecho
          </label>
          {selectedText && (
            <Badge variant="secondary" className="text-[10px]">
              {selectedText.length} carac. selecionados
            </Badge>
          )}
        </div>

        <Input
          placeholder="Como quer melhorar? Ex: torne mais empático, reduza jargão..."
          value={improveInstruction}
          onChange={(e) => setImproveInstruction(e.target.value)}
          className="text-xs h-8"
        />

        <Button
          type="button"
          variant="outline"
          onClick={handleImproveSelection}
          disabled={isImprovingText}
          className="w-full text-xs h-9 border-terracotta/40 text-terracotta hover:bg-terracotta/10"
        >
          {isImprovingText ? (
            <>
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Aprimorando...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Aprimorar Texto Selecionado
            </>
          )}
        </Button>
      </div>

      {/* Modal de Revisão da Sugestão da IA (Usuária sempre aprova/edita) */}
      <Dialog open={aiSuggestionModalOpen} onOpenChange={setAiSuggestionModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-lg font-heading text-primary flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Sugestão do Gemini 3.7 Flash — Revise antes de aplicar
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-3 my-2">
            <p className="text-xs text-muted-foreground">
              A resposta gerada pela IA é uma sugestão técnica. Você pode editar o texto abaixo
              diretamente antes de injetar no artigo:
            </p>
            <textarea
              value={aiSuggestionContent}
              onChange={(e) => setAiSuggestionContent(e.target.value)}
              className="w-full min-h-[300px] p-3 border rounded-lg text-xs font-mono bg-muted/20 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setAiSuggestionModalOpen(false)}>
              Descartar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmSuggestion}
              className="bg-primary text-white"
            >
              <Check className="w-4 h-4 mr-1.5" /> Aplicar ao Artigo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
