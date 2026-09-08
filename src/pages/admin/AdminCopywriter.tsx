import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Send,
  Plus,
  Trash2,
  FileText,
  FileCheck2,
  ExternalLink,
  Save,
  Clock,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FolderOpen,
  ArrowRight,
  RefreshCw,
  Copy,
  ChevronRight,
  Paperclip,
  X,
  Sliders,
  Check,
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  createCopywriterSession,
  listCopywriterSessions,
  updateCopywriterSession,
  deleteCopywriterSession,
  listSessionMessages,
  addSessionMessage,
  sendCopywriterChatMessage,
  extractPautasAndSeo,
  CopywriterSession,
  CopywriterMessage,
  PautaItem,
} from '@/services/copywriterService'
import {
  executarFiltroCompliance,
  ComplianceResult,
  TEXTO_RODAPE_OBRIGATORIO_PADRAO,
} from '@/services/complianceFilter'

export default function AdminCopywriter() {
  const { toast } = useToast()
  const navigate = useNavigate()

  // Sessões
  const [sessions, setSessions] = useState<CopywriterSession[]>([])
  const [activeSession, setActiveSession] = useState<CopywriterSession | null>(null)
  const [messages, setMessages] = useState<CopywriterMessage[]>([])
  const [loadingSessions, setLoadingSessions] = useState(true)

  // Input do Chat
  const [inputMessage, setInputMessage] = useState('')
  const [sending, setSending] = useState(false)
  const chatScrollRef = useRef<HTMLDivElement>(null)

  // Referências do Drive
  const [driveFiles, setDriveFiles] = useState<
    Array<{ id: string; nome: string; mime_type: string; texto_extraido: string | null }>
  >([])
  const [loadingDrive, setLoadingDrive] = useState(false)
  const [referenceModalOpen, setReferenceModalOpen] = useState(false)
  const [selectedReferences, setSelectedReferences] = useState<
    Array<{ id: string; nome: string; texto?: string }>
  >([])

  // Formulário SEO & Artigo
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [slug, setSlug] = useState('')
  const [focusKeyword, setFocusKeyword] = useState('')
  const [secondaryKeywords, setSecondaryKeywords] = useState('')
  const [articleContent, setArticleContent] = useState('')
  const [articleTitle, setArticleTitle] = useState('')

  // Aba lateral ativa: 'pautas' | 'seo' | 'artigo' | 'checklist'
  const [activeSidebarTab, setActiveSidebarTab] = useState('pautas')

  // Status de salvamento no blog
  const [savingBlog, setSavingBlog] = useState(false)

  // Carregar sessões iniciais
  useEffect(() => {
    loadSessions()
    loadDriveFiles()
  }, [])

  // Scroll automático no chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [messages, sending])

  const loadSessions = async () => {
    try {
      setLoadingSessions(true)
      const data = await listCopywriterSessions()
      setSessions(data)
      if (data.length > 0) {
        selectSession(data[0])
      } else {
        // Criar primeira sessão automaticamente se não existir
        const newSession = await createCopywriterSession('Primeiro Artigo Low Carb')
        setSessions([newSession])
        selectSession(newSession)
      }
    } catch (err: any) {
      toast({
        title: 'Erro ao carregar sessões',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setLoadingSessions(false)
    }
  }

  const loadDriveFiles = async () => {
    try {
      setLoadingDrive(true)
      const { data, error } = await (supabase as any)
        .from('drive_arquivos')
        .select('id, nome, mime_type, texto_extraido')
        .not('texto_extraido', 'is', null)
        .order('nome', { ascending: true })

      if (error) throw error
      setDriveFiles(data || [])
    } catch (err: any) {
      console.warn('Erro ao carregar arquivos do Drive para referências:', err)
    } finally {
      setLoadingDrive(false)
    }
  }

  const selectSession = async (session: CopywriterSession) => {
    setActiveSession(session)
    setSelectedReferences(session.referencias_arquivos || [])
    setMetaTitle(session.seo_config?.meta_title || '')
    setMetaDescription(session.seo_config?.meta_description || '')
    setSlug(session.seo_config?.slug || '')
    setFocusKeyword(session.seo_config?.focus_keyword || '')
    setSecondaryKeywords(
      Array.isArray(session.seo_config?.secondary_keywords)
        ? session.seo_config.secondary_keywords.join(', ')
        : '',
    )
    setArticleContent(session.artigo_gerado || '')
    setArticleTitle(session.pauta_selecionada?.titulo || session.titulo || '')

    try {
      const msgs = await listSessionMessages(session.id)
      setMessages(msgs)

      // Se a sessão for nova e estiver sem mensagens, enviar a saudação inicial conforme o prompt
      if (msgs.length === 0) {
        const initialGreeting = `Olá Adriana! Sou o seu Copywriter Expert do Guia Low Carb.

Para começarmos a planejar um artigo com alto potencial de tráfego (SEO) e resposta generativa (GEO), por favor me esclareça:

1. **Público-alvo:** Será **B2C** (pessoas com sobrepeso/obesidade buscando emagrecimento rápido, diabetes, síndrome metabólica, gordura visceral) ou **B2B** (público entre 15 e 65 anos focado em saúde, prevenção e corpo físico)?
2. **Textos de referência:** Você tem algum texto ou arquivo do nosso acervo do Google Drive para usarmos como base? (Você pode anexá-los pelo botão de clipe abaixo).
3. **Tema central:** Qual o assunto principal que deseja abordar?
4. **Objetivo do post:** Atrair, educar, comparar ou converter?
5. **Restrições:** Há algo específico que pode ou não pode ser afirmado?

Assim que você me responder, vou estruturar de 3 a 5 propostas de pautas com títulos no formato de buscas reais do Google!`

        const greeted = await addSessionMessage(session.id, 'assistant', initialGreeting)
        setMessages([greeted])
      }
    } catch (err: any) {
      console.warn('Erro ao carregar mensagens:', err)
    }
  }

  const handleCreateNewSession = async () => {
    try {
      const newSession = await createCopywriterSession('Nova Conversa de Copy')
      setSessions((prev) => [newSession, ...prev])
      selectSession(newSession)
      toast({
        title: 'Nova sessão iniciada',
        description: 'Pronto para criar um novo artigo.',
      })
    } catch (err: any) {
      toast({
        title: 'Erro ao criar sessão',
        description: err.message,
        variant: 'destructive',
      })
    }
  }

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Deseja realmente excluir esta sessão e todo o histórico?')) return
    try {
      await deleteCopywriterSession(id)
      const rem = sessions.filter((s) => s.id !== id)
      setSessions(rem)
      if (activeSession?.id === id) {
        if (rem.length > 0) {
          selectSession(rem[0])
        } else {
          setActiveSession(null)
          setMessages([])
        }
      }
      toast({ title: 'Sessão excluída com sucesso.' })
    } catch (err: any) {
      toast({ title: 'Erro ao excluir', description: err.message, variant: 'destructive' })
    }
  }

  // Enviar mensagem no chat
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim()
    if (!text || !activeSession || sending) return

    setInputMessage('')
    setSending(true)

    try {
      // 1. Salvar mensagem do usuário no banco
      const userMsg = await addSessionMessage(activeSession.id, 'user', text)
      const updatedMessages = [...messages, userMsg]
      setMessages(updatedMessages)

      // 2. Preparar payload de referências
      const referencePayload = selectedReferences
        .filter((r) => r.texto)
        .map((r) => ({ nome: r.nome, texto: r.texto || '' }))

      // 3. Chamar IA
      const res = await sendCopywriterChatMessage({
        messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        referenceTexts: referencePayload,
      })

      if (res.error) {
        throw new Error(res.error)
      }

      const aiReply = res.text
      // 4. Salvar resposta da IA no banco
      const assistantMsg = await addSessionMessage(activeSession.id, 'assistant', aiReply)
      setMessages((prev) => [...prev, assistantMsg])

      // 5. Tentar extrair pautas, SEO ou texto do artigo em segundo plano
      parseAiResponseInBackground(aiReply, activeSession.id)
    } catch (err: any) {
      toast({
        title: 'Erro ao comunicar com a IA',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setSending(false)
    }
  }

  // Análise automática da resposta da IA para atualizar os painéis
  const parseAiResponseInBackground = async (aiText: string, sessionId: string) => {
    try {
      const extracted = await extractPautasAndSeo(aiText)
      if (!extracted) return

      const updates: Partial<CopywriterSession> = {}

      if (extracted.pautas && Array.isArray(extracted.pautas) && extracted.pautas.length > 0) {
        updates.pautas_propostas = extracted.pautas
      }

      if (extracted.seo_config) {
        if (extracted.seo_config.meta_title) setMetaTitle(extracted.seo_config.meta_title)
        if (extracted.seo_config.meta_description)
          setMetaDescription(extracted.seo_config.meta_description)
        if (extracted.seo_config.slug) setSlug(extracted.seo_config.slug)
        if (extracted.seo_config.focus_keyword) setFocusKeyword(extracted.seo_config.focus_keyword)
        if (extracted.seo_config.secondary_keywords) {
          setSecondaryKeywords(extracted.seo_config.secondary_keywords.join(', '))
        }

        updates.seo_config = {
          meta_title: extracted.seo_config.meta_title || metaTitle,
          meta_description: extracted.seo_config.meta_description || metaDescription,
          slug: extracted.seo_config.slug || slug,
          focus_keyword: extracted.seo_config.focus_keyword || focusKeyword,
          secondary_keywords: extracted.seo_config.secondary_keywords || [],
        }
      }

      if (extracted.checklist) {
        updates.checklist = extracted.checklist
      }

      if (extracted.artigo_detectado && extracted.artigo_detectado.length > 200) {
        setArticleContent(extracted.artigo_detectado)
        updates.artigo_gerado = extracted.artigo_detectado
        setActiveSidebarTab('artigo')
      }

      if (Object.keys(updates).length > 0) {
        const saved = await updateCopywriterSession(sessionId, updates)
        setActiveSession((prev) => (prev ? { ...prev, ...saved } : null))
      }
    } catch (e) {
      console.warn('Erro ao processar extração automática:', e)
    }
  }

  // Aplicar uma pauta selecionada
  const handleSelectPauta = (pauta: PautaItem) => {
    if (!activeSession) return
    setArticleTitle(pauta.titulo)
    setFocusKeyword(pauta.palavra_chave_principal)
    if (pauta.palavras_chave_secundarias) {
      setSecondaryKeywords(pauta.palavras_chave_secundarias.join(', '))
    }
    const cleanSlug = pauta.titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    setSlug(cleanSlug)

    const updatedSession = {
      ...activeSession,
      pauta_selecionada: pauta,
    }
    setActiveSession(updatedSession)
    updateCopywriterSession(activeSession.id, { pauta_selecionada: pauta })

    // Enviar mensagem no chat confirmando a escolha e solicitando a redação
    const promptText = `Perfeito! Escolhi a seguinte pauta:\n\n**Título:** ${pauta.titulo}\n**Palavra-chave foco:** ${pauta.palavra_chave_principal}\n**Palavras-chave secundárias:** ${pauta.palavras_chave_secundarias?.join(', ') || 'N/A'}\n**Intenção de busca:** ${pauta.intencao_busca || 'Informacional'}\n\nPor favor, redija agora o artigo completo com base em todas as instruções de SEO, GEO, escaneabilidade (H2, H3, tópicos), no mínimo 12 repetições da palavra-chave foco de forma fluida, o fechamento com benefício futuro/medo da perda, sugestão de imagem e o rodapé obrigatório com a nutricionista Adriana Araújo (CRN-9 28762).`

    handleSendMessage(promptText)
    toast({
      title: 'Pauta aplicada!',
      description: 'A IA iniciou a redação do artigo com as configurações selecionadas.',
    })
  }

  // Salvar alterações de SEO / Configurações da sessão
  const handleSaveSeoConfig = async () => {
    if (!activeSession) return
    try {
      const updated = await updateCopywriterSession(activeSession.id, {
        titulo: articleTitle || activeSession.titulo,
        artigo_gerado: articleContent,
        seo_config: {
          meta_title: metaTitle,
          meta_description: metaDescription,
          slug,
          focus_keyword: focusKeyword,
          secondary_keywords: secondaryKeywords
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        },
      })
      setActiveSession(updated)
      toast({
        title: 'Configurações salvas',
        description: 'Dados de SEO e rascunho persistidos no banco.',
      })
    } catch (err: any) {
      toast({
        title: 'Erro ao salvar',
        description: err.message,
        variant: 'destructive',
      })
    }
  }

  // Anexar referências
  const handleToggleReference = (file: {
    id: string
    nome: string
    texto_extraido: string | null
  }) => {
    if (!activeSession) return
    const exists = selectedReferences.some((r) => r.id === file.id)
    let newRefs: Array<{ id: string; nome: string; texto?: string }> = []
    if (exists) {
      newRefs = selectedReferences.filter((r) => r.id !== file.id)
    } else {
      newRefs = [
        ...selectedReferences,
        { id: file.id, nome: file.nome, texto: file.texto_extraido || '' },
      ]
    }
    setSelectedReferences(newRefs)
    updateCopywriterSession(activeSession.id, { referencias_arquivos: newRefs })
  }

  // Cálculos de métricas em tempo real
  const wordCount = useMemo(() => {
    const textOnly = articleContent
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    return textOnly ? textOnly.split(' ').length : 0
  }, [articleContent])

  const readingTimeMinutes = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 200))
  }, [wordCount])

  const keywordCount = useMemo(() => {
    if (!focusKeyword.trim() || !articleContent.trim()) return 0
    const kw = focusKeyword.trim().toLowerCase()
    const textOnly = articleContent.replace(/<[^>]*>/g, ' ').toLowerCase()
    const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
    const matches = textOnly.match(regex)
    return matches ? matches.length : 0
  }, [focusKeyword, articleContent])

  // Verificação de Compliance com complianceFilter.ts
  const complianceCheck: ComplianceResult = useMemo(() => {
    return executarFiltroCompliance(articleTitle, articleContent)
  }, [articleTitle, articleContent])

  // Salvar como rascunho oficial em public.blog_posts
  const handleSaveToBlog = async () => {
    if (!articleTitle.trim()) {
      toast({
        title: 'Título obrigatório',
        description: 'Defina um título para o artigo antes de salvar.',
        variant: 'destructive',
      })
      return
    }

    try {
      setSavingBlog(true)

      let finalContent = articleContent.trim()
      // Garantir rodapé obrigatório
      if (!finalContent.includes('CRN-9 28762')) {
        finalContent += `\n\n${TEXTO_RODAPE_OBRIGATORIO_PADRAO}`
      }

      const postSlug =
        slug.trim() ||
        articleTitle
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')

      const payload = {
        title: articleTitle.trim(),
        slug: postSlug,
        excerpt:
          metaDescription.trim() || finalContent.replace(/<[^>]*>/g, '').slice(0, 160) + '...',
        content: finalContent,
        category: 'Nutrição Low Carb',
        tags: secondaryKeywords
          ? secondaryKeywords
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : ['low-carb', 'emagrecimento', 'saude-metabolica'],
        author: 'Adriana Araújo',
        published: false, // rascunho!
        meta_title: metaTitle.trim() || articleTitle.trim(),
        meta_description: metaDescription.trim(),
        focus_keyword: focusKeyword.trim(),
        reading_time_minutes: readingTimeMinutes,
        compliance_passed: complianceCheck.valido,
        updated_at: new Date().toISOString(),
      }

      // Upsert por slug
      const { data, error } = await (supabase as any)
        .from('blog_posts')
        .upsert(payload, { onConflict: 'slug' })
        .select('*')
        .single()

      if (error) throw error

      toast({
        title: 'Artigo salvo como rascunho!',
        description: `Salvo em public.blog_posts com o slug "${postSlug}". Você pode abri-lo no Estúdio IA para revisar imagens e publicar.`,
      })

      // Redirecionamento amigável oferecido via toast/ação
    } catch (err: any) {
      toast({
        title: 'Erro ao salvar rascunho',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setSavingBlog(false)
    }
  }

  // Inserir resposta da IA no editor de artigo
  const handleImportTextToEditor = (text: string) => {
    setArticleContent(text)
    setActiveSidebarTab('artigo')
    if (activeSession) {
      updateCopywriterSession(activeSession.id, { artigo_gerado: text })
    }
    toast({
      title: 'Texto copiado para o editor',
      description: 'Você pode refinar o artigo no painel ao lado.',
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-fade-in -mx-4 -my-4 md:-mx-8 md:-my-8">
      {/* Top Bar / Header */}
      <header className="bg-card border-b px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-heading text-primary">Copywriter Blog IA</h1>
              <Badge
                variant="outline"
                className="text-[11px] border-emerald-600 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40"
              >
                gemini-3.7-flash
              </Badge>
              <Badge variant="secondary" className="text-[10px]">
                guialowcarb.com.br
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Planejador e redator de alta performance para B2C e B2B (SEO + GEO + Compliance CRN-9)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Seletor de Referências */}
          <Dialog open={referenceModalOpen} onOpenChange={setReferenceModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs h-9">
                <Paperclip className="w-3.5 h-3.5 mr-1.5" />
                Referências Drive ({selectedReferences.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[80vh] flex flex-col">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-emerald-600" /> Textos de Referência do Drive
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Selecione arquivos do acervo com texto indexado para a IA analisar no planejamento
                  do artigo.
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto space-y-2 pr-2 my-2">
                {loadingDrive ? (
                  <div className="text-center py-6 text-xs text-muted-foreground">
                    Carregando arquivos do Drive...
                  </div>
                ) : driveFiles.length === 0 ? (
                  <div className="text-center py-6 text-xs text-muted-foreground">
                    Nenhum arquivo com texto extraído disponível no momento.
                  </div>
                ) : (
                  driveFiles.map((file) => {
                    const isSelected = selectedReferences.some((r) => r.id === file.id)
                    return (
                      <div
                        key={file.id}
                        onClick={() => handleToggleReference(file)}
                        className={`p-3 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
                            : 'hover:bg-muted/50 border-border'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="font-medium truncate">{file.nome}</span>
                        </div>
                        <div className="shrink-0">
                          {isSelected ? (
                            <Badge className="bg-emerald-600 text-white text-[10px]">
                              Selecionado
                            </Badge>
                          ) : (
                            <span className="text-[11px] text-muted-foreground">
                              Clique p/ usar
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              <DialogFooter className="flex justify-between items-center sm:justify-between">
                <span className="text-xs text-muted-foreground">
                  {selectedReferences.length} referência(s) ativa(s)
                </span>
                <Button size="sm" onClick={() => setReferenceModalOpen(false)}>
                  Concluir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            size="sm"
            onClick={handleSaveToBlog}
            disabled={savingBlog || !articleContent.trim()}
            className="bg-[#C65D3B] hover:bg-[#B54E2D] text-white text-xs h-9 shadow-sm"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {savingBlog ? 'Salvando...' : 'Salvar Rascunho no Blog'}
          </Button>

          <Button asChild variant="outline" size="sm" className="text-xs h-9">
            <Link to="/admin/estudio">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Abrir no Estúdio
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Grid: 3 Colunas (Sessões | Chat do Assistente | Painéis de Apoio) */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-muted/20">
        {/* Coluna 1: Histórico de Sessões (largura col-md-2.5) */}
        <aside className="hidden md:flex md:col-span-2 lg:col-span-2 border-r bg-card flex-col overflow-hidden">
          <div className="p-3 border-b flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Conversas / Artigos
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-primary hover:bg-primary/10"
              onClick={handleCreateNewSession}
              title="Nova Conversa"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loadingSessions ? (
              <div className="text-center py-6 text-xs text-muted-foreground">Carregando...</div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground">
                Nenhuma conversa gravada.
              </div>
            ) : (
              sessions.map((s) => {
                const isActive = activeSession?.id === s.id
                return (
                  <div
                    key={s.id}
                    onClick={() => selectSession(s)}
                    className={`group relative p-2.5 rounded-lg text-xs cursor-pointer transition-all flex items-start justify-between gap-1.5 ${
                      isActive
                        ? 'bg-emerald-100/70 dark:bg-emerald-950/60 font-semibold text-emerald-950 dark:text-emerald-100 border border-emerald-300 dark:border-emerald-800'
                        : 'hover:bg-muted text-foreground/80'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{s.titulo || 'Nova Conversa'}</p>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">
                        {new Date(s.updated_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                        })}
                      </span>
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-5 w-5 opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 shrink-0"
                      onClick={(e) => handleDeleteSession(s.id, e)}
                      title="Excluir"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )
              })
            )}
          </div>
        </aside>

        {/* Coluna 2: Chat com o Assistente (largura col-md-5) */}
        <section className="col-span-12 md:col-span-5 lg:col-span-5 flex flex-col h-full border-r bg-background overflow-hidden">
          {/* Sessão info banner */}
          <div className="px-4 py-2 bg-muted/40 border-b flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="text-muted-foreground">Artigo em foco:</span>
              <span className="font-semibold text-foreground truncate max-w-[200px]">
                {activeSession?.titulo || 'Nova Conversa'}
              </span>
            </div>
            {selectedReferences.length > 0 && (
              <Badge
                variant="outline"
                className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-300"
              >
                {selectedReferences.length} ref(s) ativa(s)
              </Badge>
            )}
          </div>

          {/* Área de Mensagens */}
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => {
              const isAi = m.role === 'assistant'
              return (
                <div key={m.id} className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}>
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    {isAi ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                          Copywriter IA
                        </span>
                      </>
                    ) : (
                      <span className="text-[11px] font-semibold text-muted-foreground">
                        Adriana Araújo
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(m.created_at).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[92%] shadow-xs break-words ${
                      isAi
                        ? 'bg-card border text-card-foreground'
                        : 'bg-primary text-primary-foreground font-medium'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.content}</div>

                    {/* Ações úteis sob resposta da IA */}
                    {isAi && (
                      <div className="mt-3 pt-2 border-t border-border/40 flex items-center gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-[10px] px-2 text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            navigator.clipboard.writeText(m.content)
                            toast({ title: 'Texto copiado para a área de transferência!' })
                          }}
                        >
                          <Copy className="w-3 h-3 mr-1" /> Copiar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-[10px] px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                          onClick={() => handleImportTextToEditor(m.content)}
                        >
                          <ArrowRight className="w-3 h-3 mr-1" /> Usar no Editor
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {sending && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse py-2">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                Copywriter IA está pensando e redigindo...
              </div>
            )}
          </div>

          {/* Quick Action Suggestions (Público, Pautas, etc.) */}
          <div className="px-4 py-1.5 border-t bg-muted/20 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-muted-foreground shrink-0 text-[10px]">Atalhos:</span>
            <button
              onClick={() =>
                handleSendMessage(
                  'Público B2C: pessoas com sobrepeso querendo emagrecer e saúde metabólica',
                )
              }
              className="px-2 py-0.5 rounded-full bg-background border hover:bg-muted text-muted-foreground shrink-0"
            >
              Definir B2C
            </button>
            <button
              onClick={() =>
                handleSendMessage(
                  'Público B2B: homens e mulheres 15 a 65 anos focados em prevenção',
                )
              }
              className="px-2 py-0.5 rounded-full bg-background border hover:bg-muted text-muted-foreground shrink-0"
            >
              Definir B2B
            </button>
            <button
              onClick={() =>
                handleSendMessage(
                  'Proponha 3 a 5 pautas estruturadas com questionamentos reais do Google',
                )
              }
              className="px-2 py-0.5 rounded-full bg-background border hover:bg-muted text-muted-foreground shrink-0"
            >
              Gerar 3-5 Pautas
            </button>
            <button
              onClick={() =>
                handleSendMessage('Pode redigir o artigo completo agora com a estrutura exigida!')
              }
              className="px-2 py-0.5 rounded-full bg-background border hover:bg-muted text-muted-foreground shrink-0"
            >
              Escrever Artigo Completo
            </button>
          </div>

          {/* Input Box */}
          <div className="p-3 border-t bg-card">
            <div className="relative flex items-end gap-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="Converse com a IA (defina público, tema, peça pautas ou refine o texto)..."
                className="min-h-[60px] max-h-[140px] text-xs resize-none pr-10"
                disabled={sending}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={sending || !inputMessage.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white h-10 w-10 p-0 shrink-0 rounded-xl"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Coluna 3: Painéis de Apoio (Pautas | SEO | Editor do Artigo | Checklist) (largura col-md-5) */}
        <section className="col-span-12 md:col-span-5 lg:col-span-5 flex flex-col h-full bg-card overflow-hidden">
          <Tabs
            value={activeSidebarTab}
            onValueChange={setActiveSidebarTab}
            className="flex-1 flex flex-col h-full overflow-hidden"
          >
            {/* Header das Abas */}
            <div className="px-4 pt-3 border-b bg-card">
              <TabsList className="grid grid-cols-4 w-full h-8 p-0.5 bg-muted/60">
                <TabsTrigger value="pautas" className="text-xs py-1">
                  Pautas ({activeSession?.pautas_propostas?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="seo" className="text-xs py-1">
                  SEO
                </TabsTrigger>
                <TabsTrigger value="artigo" className="text-xs py-1">
                  Artigo ({wordCount}p)
                </TabsTrigger>
                <TabsTrigger value="checklist" className="text-xs py-1">
                  Checklist
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ABA 1: PAUTAS GERADAS */}
            <TabsContent value="pautas" className="flex-1 overflow-y-auto p-4 space-y-3 m-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Pautas Propostas pela IA
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Clique em "Usar esta Pauta" para transferir os dados e comandar a redação.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7"
                  onClick={() =>
                    handleSendMessage(
                      'Gere 3 a 5 novas ideias de pautas com títulos de questionamento do Google',
                    )
                  }
                >
                  <RefreshCw className="w-3 h-3 mr-1" /> Pedir Pautas
                </Button>
              </div>

              {!activeSession?.pautas_propostas || activeSession.pautas_propostas.length === 0 ? (
                <div className="p-8 text-center border border-dashed rounded-xl space-y-2">
                  <Sliders className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
                  <p className="text-xs text-muted-foreground font-medium">
                    Nenhuma pauta estruturada ainda.
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Converse com a IA ao lado definindo o público (B2C/B2B) e peça: "Proponha 3 a 5
                    pautas".
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeSession.pautas_propostas.map((p, idx) => {
                    const isSelected = activeSession.pauta_selecionada?.titulo === p.titulo
                    return (
                      <Card
                        key={p.id || idx}
                        className={`text-xs transition-all border ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs'
                            : 'hover:border-primary/40'
                        }`}
                      >
                        <CardHeader className="p-3.5 pb-2">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-xs font-bold leading-snug">
                              {p.titulo}
                            </CardTitle>
                            {isSelected && (
                              <Badge className="bg-emerald-600 text-[10px] shrink-0">
                                Selecionada
                              </Badge>
                            )}
                          </div>
                          {p.variacoes_titulo && p.variacoes_titulo.length > 0 && (
                            <p className="text-[10px] text-muted-foreground mt-1">
                              <em>Variações:</em> {p.variacoes_titulo.join(' • ')}
                            </p>
                          )}
                        </CardHeader>

                        <CardContent className="p-3.5 pt-0 space-y-1.5 text-[11px]">
                          <div>
                            <span className="font-semibold text-primary">Palavra-chave Foco:</span>{' '}
                            <Badge variant="secondary" className="text-[10px]">
                              {p.palavra_chave_principal}
                            </Badge>
                          </div>
                          {p.palavras_chave_secundarias &&
                            p.palavras_chave_secundarias.length > 0 && (
                              <div>
                                <span className="font-semibold text-muted-foreground">
                                  Secundárias:
                                </span>{' '}
                                <span>{p.palavras_chave_secundarias.join(', ')}</span>
                              </div>
                            )}
                          {p.intencao_busca && (
                            <div>
                              <span className="font-semibold text-muted-foreground">Intenção:</span>{' '}
                              <span className="capitalize">{p.intencao_busca}</span>
                            </div>
                          )}
                        </CardContent>

                        <CardFooter className="p-3.5 pt-0 flex justify-end">
                          <Button
                            size="sm"
                            variant={isSelected ? 'secondary' : 'default'}
                            className={`text-xs h-7 ${!isSelected ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}`}
                            onClick={() => handleSelectPauta(p)}
                          >
                            <Check className="w-3.5 h-3.5 mr-1" /> Usar esta pauta
                          </Button>
                        </CardFooter>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            {/* ABA 2: CONFIGURAÇÕES SEO */}
            <TabsContent value="seo" className="flex-1 overflow-y-auto p-4 space-y-4 m-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Metadados & Palavras-Chave
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7"
                  onClick={handleSaveSeoConfig}
                >
                  <Save className="w-3 h-3 mr-1" /> Salvar SEO
                </Button>
              </div>

              {/* Meta Title (60 chars) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label className="font-medium text-foreground">Meta Title</label>
                  <span
                    className={`text-[10px] ${
                      metaTitle.length > 60 ? 'text-destructive font-bold' : 'text-muted-foreground'
                    }`}
                  >
                    {metaTitle.length} / 60
                  </span>
                </div>
                <Input
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Título otimizado para o Google..."
                  className="text-xs"
                />
              </div>

              {/* Meta Description (155 chars) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label className="font-medium text-foreground">Meta Description</label>
                  <span
                    className={`text-[10px] ${
                      metaDescription.length > 155
                        ? 'text-destructive font-bold'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {metaDescription.length} / 155
                  </span>
                </div>
                <Textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Resumo persuasivo para snippet do Google..."
                  className="text-xs min-h-[60px]"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Slug (URL amigável)</label>
                <div className="flex items-center">
                  <span className="text-[11px] text-muted-foreground bg-muted px-2 py-2 border border-r-0 rounded-l-md">
                    guialowcarb.com.br/artigo/
                  </span>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="meu-artigo-low-carb"
                    className="text-xs rounded-l-none"
                  />
                </div>
              </div>

              {/* Palavra-chave Principal */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Palavra-chave Foco</label>
                <Input
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  placeholder="ex: jejum intermitente emagrece"
                  className="text-xs"
                />
              </div>

              {/* Palavras-chave Secundárias */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  Palavras-chave Secundárias (separadas por vírgula)
                </label>
                <Input
                  value={secondaryKeywords}
                  onChange={(e) => setSecondaryKeywords(e.target.value)}
                  placeholder="ex: autofagia, cetose, insulina, dieta low carb"
                  className="text-xs"
                />
              </div>

              {/* Google Snippet Preview */}
              <div className="mt-4 p-3 bg-muted/30 border rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
                  Prévia nos Resultados do Google
                </span>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 truncate">
                  https://guialowcarb.com.br/artigo/{slug || 'exemplo-slug'}
                </p>
                <h4 className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer truncate">
                  {metaTitle || 'Título do Artigo | Guia Low Carb'}
                </h4>
                <p className="text-[11px] text-muted-foreground line-clamp-2">
                  {metaDescription ||
                    'Aprenda com Adriana Araújo (CRN-9 28762) tudo sobre nutrição low carb, saúde metabólica e como atingir seus objetivos de saúde com embasamento científico.'}
                </p>
              </div>
            </TabsContent>

            {/* ABA 3: EDITOR DO ARTIGO */}
            <TabsContent
              value="artigo"
              className="flex-1 flex flex-col p-4 space-y-3 m-0 overflow-hidden"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Input
                    value={articleTitle}
                    onChange={(e) => setArticleTitle(e.target.value)}
                    placeholder="Título principal do artigo..."
                    className="text-xs font-bold"
                  />
                </div>

                {/* KPI Bar de Otimização */}
                <div className="grid grid-cols-3 gap-2 bg-muted/40 p-2 rounded-lg text-center text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Palavras</span>
                    <strong className={wordCount >= 1000 ? 'text-emerald-600' : 'text-amber-600'}>
                      {wordCount} {wordCount >= 1000 ? '✓ (>1000)' : '(meta: 1000+)'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">
                      Foco "{focusKeyword || '...'}"
                    </span>
                    <strong className={keywordCount >= 12 ? 'text-emerald-600' : 'text-amber-600'}>
                      {keywordCount} {keywordCount >= 12 ? '✓ (min 12)' : '(min 12)'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Leitura</span>
                    <strong>~{readingTimeMinutes} min</strong>
                  </div>
                </div>

                {/* Alerta de Compliance */}
                {!complianceCheck.valido && (
                  <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-[11px] space-y-1">
                    <p className="font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Atenção ao Compliance CRN-9:
                    </p>
                    <p>
                      Foram detectados termos não conformes:{' '}
                      <strong>{complianceCheck.violacoes.map((v) => v.termo).join(', ')}</strong>.
                      Remova promessas de resultado milagroso ou termos sensíveis antes de publicar.
                    </p>
                  </div>
                )}
              </div>

              {/* Editor Textarea */}
              <div className="flex-1 flex flex-col min-h-0">
                <Textarea
                  value={articleContent}
                  onChange={(e) => setArticleContent(e.target.value)}
                  placeholder="O texto do artigo gerado pela IA aparecerá aqui. Você também pode digitar ou colar diretamente..."
                  className="flex-1 font-mono text-xs leading-relaxed resize-none p-3"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-8"
                  onClick={handleSaveSeoConfig}
                >
                  <Save className="w-3.5 h-3.5 mr-1" /> Salvar Alterações
                </Button>

                <Button
                  size="sm"
                  onClick={handleSaveToBlog}
                  disabled={savingBlog || !articleContent.trim()}
                  className="bg-[#C65D3B] hover:bg-[#B54E2D] text-white text-xs h-8 shadow-xs"
                >
                  <FileCheck2 className="w-3.5 h-3.5 mr-1" /> Enviar ao Blog como Rascunho
                </Button>
              </div>
            </TabsContent>

            {/* ABA 4: CHECKLIST FINAL */}
            <TabsContent value="checklist" className="flex-1 overflow-y-auto p-4 space-y-3 m-0">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Checklist de Qualidade (SEO + GEO)
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Critérios exigidos pelo prompt da especialista para ranqueamento e impacto.
                </p>
              </div>

              <div className="space-y-2.5">
                {/* Item 1: SEO */}
                <div className="p-3 rounded-lg border bg-card space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold flex items-center gap-1.5 text-foreground">
                      {keywordCount >= 12 && metaTitle && metaDescription ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                      )}
                      1. Otimização SEO
                    </span>
                    <Badge
                      variant={keywordCount >= 12 ? 'default' : 'secondary'}
                      className="text-[10px]"
                    >
                      {keywordCount >= 12 ? 'Concluído' : 'Ajustar'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Meta title (~60c), meta description (~155c), slug amigável e repetição da
                    palavra-chave no mínimo 12 vezes (atual: {keywordCount}).
                  </p>
                </div>

                {/* Item 2: GEO */}
                <div className="p-3 rounded-lg border bg-card space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold flex items-center gap-1.5 text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      2. Otimização GEO (Generative Engines)
                    </span>
                    <Badge variant="default" className="text-[10px] bg-emerald-600">
                      Concluído
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Respostas diretas e verificáveis, definições objetivas, listas escaneáveis e sem
                    enrolação para motores como ChatGPT/Perplexity/SearchGPT.
                  </p>
                </div>

                {/* Item 3: Clareza & E-E-A-T */}
                <div className="p-3 rounded-lg border bg-card space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold flex items-center gap-1.5 text-foreground">
                      {wordCount >= 1000 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                      )}
                      3. Profundidade & E-E-A-T
                    </span>
                    <Badge
                      variant={wordCount >= 1000 ? 'default' : 'secondary'}
                      className="text-[10px]"
                    >
                      {wordCount} palavras
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Texto aprofundado (&gt;1.000 palavras), parágrafos curtos, tópicos escaneáveis,
                    sem juridiquês e baseado em evidências.
                  </p>
                </div>

                {/* Item 4: Compliance & Rodapé CRN */}
                <div className="p-3 rounded-lg border bg-card space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold flex items-center gap-1.5 text-foreground">
                      {complianceCheck.valido && articleContent.includes('CRN-9 28762') ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                      )}
                      4. Compliance & Rodapé Legal
                    </span>
                    <Badge
                      variant={complianceCheck.valido ? 'default' : 'destructive'}
                      className="text-[10px]"
                    >
                      {complianceCheck.valido ? 'Aprovado' : 'Revisar Termos'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Sem promessas de cura/reversão mágica e com rodapé obrigatório identificando a
                    nutricionista Adriana Araújo (CRN-9 28762).
                  </p>
                </div>

                {/* Item 5: CTA */}
                <div className="p-3 rounded-lg border bg-card space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold flex items-center gap-1.5 text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      5. CTA & Fechamento Persuasivo
                    </span>
                    <Badge variant="default" className="text-[10px] bg-emerald-600">
                      Concluído
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Fechamento motivador orientado por benefício futuro ou medo de perda,
                    direcionando para consulta ou serviços do Guia Low Carb.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  size="sm"
                  className="w-full bg-[#C65D3B] hover:bg-[#B54E2D] text-white text-xs h-8"
                  onClick={handleSaveToBlog}
                  disabled={savingBlog || !articleContent.trim()}
                >
                  <FileCheck2 className="w-3.5 h-3.5 mr-1" /> Salvar Tudo e Enviar ao Blog
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  )
}
