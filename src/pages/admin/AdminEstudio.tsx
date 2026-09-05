import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Sparkles,
  Save,
  Eye,
  Send,
  AlertOctagon,
  CheckCircle2,
  Clock,
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  FolderSync,
  Search,
  Wand2,
  Globe,
  ImageIcon,
  Check,
  ExternalLink,
  ShieldAlert,
  Info,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import { toast } from '@/hooks/use-toast'

import { EstudioToolbar } from './components/EstudioToolbar'
import {
  executarFiltroCompliance,
  extrairTextoPuro,
  ComplianceResult,
} from '@/services/complianceFilter'
import {
  invokeGeminiAssist,
  invokeOpenAiImage,
  fetchDailyImageUsage,
} from '@/services/estudioAiService'

interface DriveArquivoItem {
  id: string
  nome: string
  mime_type: string
  texto_extraido: string | null
  status: string
  link_drive: string | null
  caminho_pasta?: string | null
  tamanho_bytes?: number | null
}

const STEPS = [
  { id: 1, label: 'Fonte', icon: FolderSync, description: 'Drive ou Briefing' },
  { id: 2, label: 'Escrever', icon: FileText, description: 'Editor & Redação' },
  { id: 3, label: 'Capa', icon: ImageIcon, description: 'Imagem com IA' },
  { id: 4, label: 'SEO & Publicar', icon: Globe, description: 'Metadados & Publicação' },
]

export default function AdminEstudio() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const editPostId = searchParams.get('id')
  const initialFileId = searchParams.get('fileId')

  // Passo ativo (1 a 4)
  const [currentStep, setCurrentStep] = useState<number>(1)

  // Estado do Artigo
  const [postId, setPostId] = useState<string | null>(editPostId)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('Nutrição Low Carb')
  const [categoriesList, setCategoriesList] = useState<any[]>([])
  const [slug, setSlug] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [focusKeyword, setFocusKeyword] = useState('')
  const [tags, setTags] = useState<string[]>(['low-carb', 'saude-metabolica'])
  const [tagInput, setTagInput] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [imageIsAi, setImageIsAi] = useState(false)
  const [isPublished, setIsPublished] = useState(false)

  // Passo 1: Fonte
  const [driveFiles, setDriveFiles] = useState<DriveArquivoItem[]>([])
  const [loadingDrive, setLoadingDrive] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState<string>(initialFileId || '')
  const [showAllDriveFiles, setShowAllDriveFiles] = useState(false)
  const [searchDrive, setSearchDrive] = useState('')
  const [briefingText, setBriefingText] = useState('')
  const [customDraftPrompt, setCustomDraftPrompt] = useState('')
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false)

  // Passo 2: Editor & Melhoria
  const [selectedText, setSelectedText] = useState('')
  const [improveInstruction, setImproveInstruction] = useState('')
  const [isImprovingText, setIsImprovingText] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  // Passo 3: Imagem IA
  const [imagePromptInput, setImagePromptInput] = useState('')
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [imageErrorMessage, setImageErrorMessage] = useState<string | null>(null)
  const [imageUsage, setImageUsage] = useState({
    generationsToday: 0,
    dailyLimit: 20,
    remaining: 20,
  })

  // Passo 4: SEO
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false)

  // Operação global
  const [isSaving, setIsSaving] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // Modal para aprovar/editar sugestão da IA antes de aplicar
  const [aiSuggestionModalOpen, setAiSuggestionModalOpen] = useState(false)
  const [aiSuggestionContent, setAiSuggestionContent] = useState('')
  const [aiSuggestionTarget, setAiSuggestionTarget] = useState<'draft' | 'improve'>('draft')

  // Métricas do texto
  const textoPuro = useMemo(() => extrairTextoPuro(content), [content])
  const wordCount = useMemo(() => {
    if (!textoPuro.trim()) return 0
    return textoPuro.trim().split(/\s+/).length
  }, [textoPuro])

  const readingTimeMinutes = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 200))
  }, [wordCount])

  // Compliance determinístico
  const complianceResult: ComplianceResult = useMemo(() => {
    return executarFiltroCompliance(title, content, excerpt)
  }, [title, content, excerpt])

  // Arquivo selecionado no Drive
  const selectedDriveFile = useMemo(() => {
    return driveFiles.find((f) => f.id === selectedFileId)
  }, [driveFiles, selectedFileId])

  // Helper de slug
  const generateSlug = (str: string) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }

  // Carregamento inicial de dados
  useEffect(() => {
    let isMounted = true

    const fetchInitial = async () => {
      setInitialLoading(true)
      try {
        // Categorias
        const { data: cats } = await supabase.from('blog_categories').select('*').order('name')
        if (isMounted && cats && cats.length > 0) {
          setCategoriesList(cats)
          if (!category) setCategory(cats[0].name)
        }

        // Arquivos do Drive (com caminho_pasta)
        setLoadingDrive(true)
        const { data: dfs } = await (supabase as any)
          .from('drive_arquivos')
          .select(
            'id, nome, mime_type, texto_extraido, status, link_drive, caminho_pasta, tamanho_bytes',
          )
          .order('modified_time', { ascending: false })

        if (isMounted && dfs) {
          setDriveFiles(dfs)
        }

        // Cota de imagem
        const usage = await fetchDailyImageUsage()
        if (isMounted) setImageUsage(usage)

        // Carrega rascunho / post existente se houver editPostId
        if (editPostId) {
          const { data: postData, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', editPostId)
            .single()

          if (isMounted && postData && !error) {
            setPostId(postData.id)
            setTitle(postData.title || '')
            setContent(postData.content || '')
            setExcerpt(postData.excerpt || '')
            setCategory(postData.category || 'Nutrição Low Carb')
            setSlug(postData.slug || '')
            setMetaTitle((postData as any).meta_title || postData.title || '')
            setMetaDescription((postData as any).meta_description || postData.excerpt || '')
            setFocusKeyword((postData as any).focus_keyword || '')
            setTags(postData.tags && postData.tags.length > 0 ? postData.tags : ['low-carb'])
            setImageUrl(postData.featured_image_url || '')
            setImageAlt((postData as any).image_alt || '')
            setImageIsAi((postData as any).image_is_ai || false)
            setIsPublished(postData.published || false)

            // ⭐ ATALHO ANTI-FRICÇÃO:
            // Ao abrir um rascunho existente, o Estúdio abre DIRETO no passo relevante:
            // se já tem capa e SEO completo -> Passo 4
            // se já tem texto mas não tem capa -> Passo 3
            // se já tem texto -> Passo 2
            const hasText = !!(postData.content && postData.content.trim().length > 40)
            const hasImage = !!postData.featured_image_url
            const hasSeo = !!((postData as any).meta_title && (postData as any).meta_description)

            if (hasText && hasImage && hasSeo) {
              setCurrentStep(4)
            } else if (hasText && !hasImage) {
              setCurrentStep(3)
            } else if (hasText && hasImage && !hasSeo) {
              setCurrentStep(4)
            } else if (hasText) {
              setCurrentStep(2)
            } else {
              setCurrentStep(1)
            }
          }
        } else if (initialFileId) {
          // Se veio do Drive com arquivo pré-selecionado, mantém passo 1
          setSelectedFileId(initialFileId)
          setCurrentStep(1)
        }
      } catch (err) {
        console.error('Erro ao inicializar Estúdio:', err)
      } finally {
        if (isMounted) {
          setLoadingDrive(false)
          setInitialLoading(false)
        }
      }
    }

    fetchInitial()

    return () => {
      isMounted = false
    }
  }, [editPostId, initialFileId])

  // Filtragem e agrupamento de arquivos do Drive (Passo 1)
  const filteredDriveFiles = useMemo(() => {
    return driveFiles.filter((file) => {
      // Por padrão, só os que têm texto_extraido
      if (!showAllDriveFiles && !file.texto_extraido) return false

      if (!searchDrive.trim()) return true
      const term = searchDrive.toLowerCase()
      const matchName = file.nome?.toLowerCase().includes(term)
      const matchFolder = file.caminho_pasta?.toLowerCase().includes(term)
      const matchText = file.texto_extraido?.toLowerCase().includes(term)
      return matchName || matchFolder || matchText
    })
  }, [driveFiles, showAllDriveFiles, searchDrive])

  const groupedDriveFiles = useMemo(() => {
    const map = new Map<string, DriveArquivoItem[]>()
    for (const f of filteredDriveFiles) {
      const pasta = f.caminho_pasta || 'Sem pasta'
      const list = map.get(pasta) || []
      list.push(f)
      map.set(pasta, list)
    }
    return Array.from(map.entries())
  }, [filteredDriveFiles])

  // Quantidade de arquivos com texto
  const totalComTexto = useMemo(() => {
    return driveFiles.filter((f) => !!f.texto_extraido).length
  }, [driveFiles])

  // Autosave compartilhado
  const saveDraftSilently = useCallback(async () => {
    if (!title.trim()) return
    try {
      setIsAutoSaving(true)
      const currentSlug = slug || generateSlug(title)
      const payload = {
        title,
        slug: currentSlug,
        category,
        content,
        excerpt: excerpt || extrairTextoPuro(content).slice(0, 160),
        featured_image_url: imageUrl || null,
        reading_time_minutes: readingTimeMinutes,
        author: 'Adriana Araújo',
        tags: tags.length > 0 ? tags : ['low-carb'],
        meta_title: metaTitle || title.slice(0, 60),
        meta_description: metaDescription || excerpt.slice(0, 155),
        focus_keyword: focusKeyword || null,
        image_alt: imageAlt || null,
        image_is_ai: imageIsAi,
        compliance_passed: complianceResult.valido && complianceResult.temRodapeObrigatorio,
        updated_at: new Date().toISOString(),
      }

      if (postId) {
        await (supabase as any).from('blog_posts').update(payload).eq('id', postId)
      } else {
        const { data } = await (supabase as any)
          .from('blog_posts')
          .insert([{ ...payload, published: false }])
          .select('id')
          .single()
        if (data?.id) {
          setPostId(data.id)
          navigate(`/admin/estudio?id=${data.id}`, { replace: true })
        }
      }
      setLastSavedAt(new Date())
    } catch (err) {
      console.warn('Falha silenciosa no autosave:', err)
    } finally {
      setIsAutoSaving(false)
    }
  }, [
    title,
    slug,
    category,
    content,
    excerpt,
    imageUrl,
    readingTimeMinutes,
    tags,
    metaTitle,
    metaDescription,
    focusKeyword,
    imageAlt,
    imageIsAi,
    complianceResult,
    postId,
    navigate,
  ])

  // Autosave a cada 40 segundos em TODOS os passos
  useEffect(() => {
    if (!title.trim() || initialLoading) return
    const timer = setTimeout(() => {
      saveDraftSilently()
    }, 40000)
    return () => clearTimeout(timer)
  }, [
    title,
    content,
    excerpt,
    slug,
    imageUrl,
    metaTitle,
    metaDescription,
    tags,
    initialLoading,
    saveDraftSilently,
  ])

  // Salvar rascunho manualmente ou Publicar
  const handleSave = async (publishTarget: boolean = false) => {
    if (publishTarget) {
      if (!complianceResult.valido) {
        toast({
          title: 'Publicação Bloqueada!',
          description: `Existem ${complianceResult.totalViolacoes} termos proibidos pelo Código de Ética que impedem a publicação. Corrija-os antes de publicar.`,
          variant: 'destructive',
        })
        return
      }

      if (!complianceResult.temRodapeObrigatorio) {
        toast({
          title: 'Rodapé do Art. 55 Obrigatório!',
          description:
            'O artigo deve conter a assinatura com "Adriana Araújo — Nutricionista CRN-9 28762" antes de ser publicado.',
          variant: 'destructive',
        })
        return
      }
    }

    if (!title.trim()) {
      toast({
        title: 'Título obrigatório',
        description: 'Informe um título antes de salvar.',
        variant: 'destructive',
      })
      return
    }

    const currentSlug = slug || generateSlug(title)

    const payload = {
      title,
      slug: currentSlug,
      category,
      content,
      excerpt: excerpt || extrairTextoPuro(content).slice(0, 160),
      featured_image_url: imageUrl || null,
      published: publishTarget ? true : isPublished,
      reading_time_minutes: readingTimeMinutes,
      author: 'Adriana Araújo',
      tags: tags.length > 0 ? tags : ['low-carb'],
      meta_title: metaTitle || title.slice(0, 60),
      meta_description: metaDescription || excerpt.slice(0, 155),
      focus_keyword: focusKeyword || null,
      image_alt: imageAlt || null,
      image_is_ai: imageIsAi,
      compliance_passed: complianceResult.valido && complianceResult.temRodapeObrigatorio,
      updated_at: new Date().toISOString(),
      ...(publishTarget ? { published_date: new Date().toISOString() } : {}),
    }

    try {
      setIsSaving(true)
      if (postId) {
        const { error } = await (supabase as any)
          .from('blog_posts')
          .update(payload)
          .eq('id', postId)
        if (error) throw error
      } else {
        const { data: newRow, error } = await (supabase as any)
          .from('blog_posts')
          .insert([payload])
          .select('id')
          .single()
        if (error) throw error
        if (newRow?.id) {
          setPostId(newRow.id)
          navigate(`/admin/estudio?id=${newRow.id}`, { replace: true })
        }
      }

      setLastSavedAt(new Date())
      if (publishTarget) {
        setIsPublished(true)
        toast({
          title: '🎉 Artigo Publicado no Blog!',
          description: `O artigo "${title}" está no ar em /blog/${currentSlug}.`,
        })
      } else {
        toast({
          title: 'Rascunho salvo',
          description: `Salvo com sucesso às ${new Date().toLocaleTimeString()}.`,
        })
      }
    } catch (err: any) {
      toast({
        title: 'Erro ao salvar artigo',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // PASSO 1: Ação de Gerar Rascunho com IA (gemini-assist draft)
  const handleGenerateDraft = async () => {
    if (!title.trim() && !briefingText.trim() && !selectedDriveFile) {
      toast({
        title: 'Dados insuficientes',
        description: 'Digite um título, um briefing ou selecione um arquivo do Drive.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsGeneratingDraft(true)
      const { data, error } = await invokeGeminiAssist({
        action: 'draft',
        title: title || selectedDriveFile?.nome?.replace(/\.[^/.]+$/, ''),
        briefing: briefingText,
        driveFileName: selectedDriveFile?.nome,
        driveContent: selectedDriveFile?.texto_extraido || undefined,
        userInstruction: customDraftPrompt,
      })

      if (error) throw new Error(error)

      const draftHtml = data?.text || ''

      // Se o usuário ainda não tiver título, define a partir do Drive ou briefing
      if (!title.trim()) {
        const suggestedTitle =
          selectedDriveFile?.nome?.replace(/\.[^/.]+$/, '') || 'Artigo Low Carb & Saúde Metabólica'
        setTitle(suggestedTitle)
      }

      setAiSuggestionContent(draftHtml)
      setAiSuggestionTarget('draft')
      setAiSuggestionModalOpen(true)

      toast({
        title: 'Rascunho gerado pela IA!',
        description: 'Revise o conteúdo antes de enviá-lo ao editor.',
      })
    } catch (err: any) {
      toast({
        title: 'Falha ao gerar rascunho',
        description: err.message || 'Verifique sua conexão.',
        variant: 'destructive',
      })
    } finally {
      setIsGeneratingDraft(false)
    }
  }

  // PASSO 2: Editor Textarea Helpers
  const handleSelectTextInEditor = () => {
    if (!textareaRef.current) return
    const start = textareaRef.current.selectionStart
    const end = textareaRef.current.selectionEnd
    if (start !== end) {
      setSelectedText(textareaRef.current.value.substring(start, end))
    } else {
      setSelectedText('')
    }
  }

  const handleInsertTag = (tagStart: string, tagEnd: string = '', placeholder: string = '') => {
    if (!textareaRef.current) return
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = textarea.value.substring(start, end) || placeholder

    const newContent =
      textarea.value.substring(0, start) +
      tagStart +
      selected +
      tagEnd +
      textarea.value.substring(end)

    setContent(newContent)
    setTimeout(() => {
      textarea.focus()
      const newPos = start + tagStart.length + selected.length + tagEnd.length
      textarea.setSelectionRange(newPos, newPos)
    }, 50)
  }

  const handleInsertSnippet = (snippet: string) => {
    if (!textareaRef.current) {
      setContent((prev) => prev + '\n' + snippet)
      return
    }
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newContent =
      textarea.value.substring(0, start) + '\n' + snippet + '\n' + textarea.value.substring(end)
    setContent(newContent)
    setTimeout(() => {
      textarea.focus()
    }, 50)
  }

  const handleImproveSelection = async () => {
    const textToImprove = selectedText || content
    if (!textToImprove.trim()) {
      toast({
        title: 'Nenhum texto para melhorar',
        description: 'Selecione um trecho no editor ou tenha conteúdo digitado.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsImprovingText(true)
      const { data, error } = await invokeGeminiAssist({
        action: 'improve',
        title,
        selectedText: textToImprove,
        userInstruction:
          improveInstruction || 'Torne mais fluido, acolhedor e com rigor científico.',
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

  const handleApplyAiSuggestion = () => {
    if (aiSuggestionTarget === 'draft') {
      setContent(aiSuggestionContent)
      if (!excerpt && aiSuggestionContent) {
        setExcerpt(extrairTextoPuro(aiSuggestionContent).slice(0, 160) + '...')
      }
      setAiSuggestionModalOpen(false)
      // Avança suavemente para o Passo 2
      setCurrentStep(2)
      toast({
        title: 'Rascunho inserido!',
        description: 'Você avançou para o Passo 2: Escrever e revisar.',
      })
    } else {
      if (textareaRef.current && selectedText) {
        const start = textareaRef.current.selectionStart
        const end = textareaRef.current.selectionEnd
        const newContent =
          textareaRef.current.value.substring(0, start) +
          aiSuggestionContent +
          textareaRef.current.value.substring(end)
        setContent(newContent)
        setSelectedText('')
      } else {
        setContent(aiSuggestionContent)
      }
      setAiSuggestionModalOpen(false)
      toast({ title: 'Trecho atualizado!' })
    }
  }

  // PASSO 3: Geração de Capa com IA (openai-image)
  const handleGenerateAiImage = async () => {
    setImageErrorMessage(null)
    const promptToUse =
      imagePromptInput.trim() ||
      (focusKeyword || title
        ? `Prato saudável e elegante de ${focusKeyword || title}, ingredientes frescos low carb, iluminação natural suave, estilo fotografia culinária profissional, sem pessoas`
        : 'Prato culinário low carb com folhas verdes, azeite de oliva e ingredientes frescos em mesa rústica, alta definição')

    try {
      setIsGeneratingImage(true)
      const { data, error } = await invokeOpenAiImage({ prompt: promptToUse })

      if (error) {
        // Detecção de falta de créditos na OpenAI
        if (
          error.toLowerCase().includes('no credits remaining') ||
          error.toLowerCase().includes('insufficient_quota') ||
          error.toLowerCase().includes('billing')
        ) {
          setImageErrorMessage(
            'A conta OpenAI está sem créditos no momento ("You have no credits remaining"). Não é um bug do sistema: adicione saldo na plataforma OpenAI para liberar novas gerações.',
          )
        } else {
          setImageErrorMessage(error)
        }
        throw new Error(error)
      }

      if (data?.imageUrl) {
        setImageUrl(data.imageUrl)
        setImageAlt(data.altText || `Fotografia culinária de ${focusKeyword || title}`)
        setImageIsAi(true)
        setImageUsage({
          generationsToday: data.generationsToday,
          dailyLimit: data.dailyLimit,
          remaining: data.remaining,
        })
        setImageErrorMessage(null)
        toast({
          title: 'Capa gerada com sucesso!',
          description: 'A imagem foi salva no Storage e definida como capa do artigo.',
        })
      }
    } catch (err: any) {
      toast({
        title: 'Erro na geração de imagem',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setIsGeneratingImage(false)
    }
  }

  // PASSO 4: SEO a partir do Título (gemini-assist seo)
  const handleGenerateSeoFromTitle = async () => {
    if (!title.trim()) {
      toast({
        title: 'Digite o título primeiro',
        description: 'Informe o título do artigo para a IA gerar os metadados de SEO.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsGeneratingSeo(true)
      const { data, error } = await invokeGeminiAssist({
        action: 'seo',
        title,
        content: content || excerpt,
      })

      if (error) throw new Error(error)

      if (data?.json) {
        const json = data.json
        if (json.meta_title) setMetaTitle(json.meta_title)
        if (json.meta_description) setMetaDescription(json.meta_description)
        if (json.focus_keyword) setFocusKeyword(json.focus_keyword)
        if (json.slug) setSlug(json.slug)
        if (Array.isArray(json.tags) && json.tags.length > 0) setTags(json.tags)
        if (json.image_alt_suggestion && !imageAlt) setImageAlt(json.image_alt_suggestion)

        toast({
          title: 'SEO Preenchido pela IA!',
          description: 'Meta Title, Meta Description, Slug e Tags foram gerados.',
        })
      } else {
        if (!slug) setSlug(generateSlug(title))
        if (!metaTitle) setMetaTitle(title.slice(0, 60))
        if (!metaDescription) setMetaDescription(excerpt.slice(0, 155))
      }
    } catch (err: any) {
      toast({
        title: 'Falha ao gerar SEO',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setIsGeneratingSeo(false)
    }
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const clean = tagInput.trim().replace(/^,|,$/g, '')
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean])
        setTagInput('')
      }
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  if (initialLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mr-3" />
        <span className="text-muted-foreground font-medium">Carregando Estúdio IA...</span>
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-16 animate-fade-in">
      {/* BARRA SUPERIOR: NAVEGAÇÃO, STATUS E AÇÕES */}
      <div className="bg-card p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/blog" className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4 mr-1" /> Blog
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-heading text-primary flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-terracotta" /> Estúdio IA
              </h1>
              {isPublished ? (
                <Badge className="bg-emerald-600 text-white text-xs">Publicado</Badge>
              ) : (
                <Badge variant="outline" className="text-amber-600 border-amber-300 text-xs">
                  Rascunho
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              <span>{wordCount} palavras</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {readingTimeMinutes} min de leitura
              </span>
              <span>•</span>
              <span>
                {isAutoSaving ? (
                  <span className="text-primary flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Salvando rascunho...
                  </span>
                ) : lastSavedAt ? (
                  `Salvo às ${lastSavedAt.toLocaleTimeString()}`
                ) : (
                  'Não salvo'
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Botões Globais */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreviewOpen(true)}
            className="text-xs h-9"
          >
            <Eye className="w-4 h-4 mr-1.5" /> Visualizar
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isSaving}
            onClick={() => handleSave(false)}
            className="text-xs h-9 bg-primary/10 text-primary hover:bg-primary/20 font-medium"
          >
            <Save className="w-4 h-4 mr-1.5" /> Salvar Rascunho
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={isSaving || !complianceResult.valido}
            onClick={() => handleSave(true)}
            className={`text-xs h-9 font-medium shadow-sm ${
              complianceResult.valido
                ? 'bg-terracotta hover:bg-terracotta/90 text-white'
                : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
            }`}
            title={
              complianceResult.valido
                ? 'Publicar artigo'
                : 'Publicação bloqueada por termos proibidos'
            }
          >
            <Send className="w-4 h-4 mr-1.5" />
            {isPublished ? 'Atualizar Publicado' : 'Publicar'}
          </Button>
        </div>
      </div>

      {/* BARRA DE PROGRESSO EM 4 PASSOS */}
      <div className="bg-card p-3 rounded-2xl border shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {STEPS.map((step) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all text-left border ${
                  isActive
                    ? 'bg-primary/10 border-primary shadow-xs'
                    : isCompleted
                      ? 'bg-muted/40 border-emerald-500/30 hover:bg-muted/70'
                      : 'border-transparent hover:bg-muted/40 text-muted-foreground'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Passo {step.id}
                    </span>
                  </div>
                  <p
                    className={`font-heading font-bold text-sm truncate ${
                      isActive ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ALERTA DE COMPLIANCE DETERMINÍSTICO (COMPACTA) */}
      {!complianceResult.valido && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-400 dark:border-rose-800 rounded-xl space-y-2 animate-pulse">
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200 font-bold text-sm">
            <AlertOctagon className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>
              Filtro Ético CFN: {complianceResult.totalViolacoes} termo(s) proibido(s) detectado(s)!
            </span>
          </div>
          <p className="text-xs text-rose-700 dark:text-rose-300">
            A publicação está bloqueada pelo Código de Ética do Nutricionista e Resoluções CFN.
            Remova ou substitua:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {complianceResult.violacoes.map((v, i) => (
              <div
                key={i}
                className="bg-white dark:bg-rose-900/60 border border-rose-300 dark:border-rose-700 px-2.5 py-1 rounded-md text-xs"
              >
                <strong className="text-rose-700 dark:text-rose-200">
                  &ldquo;{v.termo}&rdquo;
                </strong>{' '}
                — <span className="text-muted-foreground text-[11px]">{v.motivo}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALERTA DE RODAPÉ OBRIGATÓRIO (ART. 55) */}
      {!complianceResult.temRodapeObrigatorio && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Atenção:</strong> O artigo precisa conter o rodapé do Art. 55 com{' '}
              <em>Adriana Araújo — Nutricionista CRN-9 28762</em> para ser publicado.
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              handleInsertSnippet(
                `<div class="not-prose mt-12 p-6 rounded-2xl bg-muted/40 border border-primary/20 shadow-sm text-sm space-y-2 text-foreground/80">\n  <p class="font-semibold text-primary">ℹ️ Nota de Esclarecimento e Responsabilidade Técnica</p>\n  <p class="leading-relaxed">Este conteúdo tem caráter estritamente educativo e informativo, não configurando diagnóstico, prescrição dietética individualizada ou recomendação terapêutica específica. Para adequação de conduta, consulte sempre um nutricionista habilitado.</p>\n  <p class="text-xs text-muted-foreground pt-1 border-t border-border/50">Responsável Técnica: <strong>Adriana Araújo</strong> • Nutricionista Clínica • <strong>CRN-9 28762</strong>.</p>\n</div>`,
              )
            }
            className="h-7 text-xs border-amber-400 hover:bg-amber-100 text-amber-900 shrink-0"
          >
            Inserir Rodapé Agora
          </Button>
        </div>
      )}

      {/* ========================================================
          PASSO 1: FONTE (Drive ou Briefing)
         ======================================================== */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-heading font-bold text-primary flex items-center gap-2">
                <FolderSync className="w-5 h-5 text-emerald-600" /> Passo 1: Escolha a Fonte do
                Artigo
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Selecione um arquivo sincronizado do acervo do Drive com texto extraído ou informe
                um briefing personalizado.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Lado Esquerdo: Acervo do Google Drive */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">Arquivos do Google Drive</span>
                    <Badge variant="secondary" className="text-xs">
                      {showAllDriveFiles ? driveFiles.length : totalComTexto} disponíveis
                    </Badge>
                  </div>
                  {/* Toggle para mostrar todos os arquivos */}
                  <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showAllDriveFiles}
                      onChange={(e) => setShowAllDriveFiles(e.target.checked)}
                      className="rounded border-border"
                    />
                    <span>Mostrar todos ({driveFiles.length})</span>
                  </label>
                </div>

                {/* Campo de Busca */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar nos arquivos por nome, pasta ou conteúdo..."
                    value={searchDrive}
                    onChange={(e) => setSearchDrive(e.target.value)}
                    className="pl-9 text-xs h-10"
                  />
                </div>

                {/* Lista Agrupada por caminho_pasta */}
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {loadingDrive ? (
                    <div className="text-center py-10 text-muted-foreground">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                      Carregando arquivos do Drive...
                    </div>
                  ) : groupedDriveFiles.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-xl">
                      Nenhum arquivo encontrado com os filtros atuais.
                    </div>
                  ) : (
                    groupedDriveFiles.map(([pasta, files]) => (
                      <div key={pasta} className="border rounded-xl overflow-hidden bg-background">
                        <div className="bg-muted/40 px-3 py-2 text-xs font-semibold text-foreground flex items-center justify-between">
                          <span className="truncate">{pasta}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {files.length} arquivo(s)
                          </span>
                        </div>
                        <div className="divide-y">
                          {files.map((file) => {
                            const isSelected = selectedFileId === file.id
                            return (
                              <div
                                key={file.id}
                                onClick={() => setSelectedFileId(file.id)}
                                className={`p-3 text-xs flex items-start justify-between gap-3 cursor-pointer transition-colors ${
                                  isSelected
                                    ? 'bg-primary/10 border-l-4 border-primary'
                                    : 'hover:bg-muted/30'
                                }`}
                              >
                                <div className="space-y-1 min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-foreground truncate">
                                      {file.nome}
                                    </span>
                                    {file.texto_extraido && (
                                      <Badge
                                        variant="outline"
                                        className="text-[10px] text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300"
                                      >
                                        Texto OK ({file.texto_extraido.length} carac.)
                                      </Badge>
                                    )}
                                  </div>
                                  {file.texto_extraido ? (
                                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                                      {file.texto_extraido.slice(0, 140)}...
                                    </p>
                                  ) : (
                                    <p className="text-[11px] text-muted-foreground italic">
                                      Sem texto extraído
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  {file.link_drive && (
                                    <a
                                      href={file.link_drive}
                                      target="_blank"
                                      rel="noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-muted-foreground hover:text-foreground p-1"
                                      title="Abrir no Google Drive"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                  <input
                                    type="radio"
                                    name="driveFileSelect"
                                    checked={isSelected}
                                    onChange={() => setSelectedFileId(file.id)}
                                    className="cursor-pointer"
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Lado Direito: Briefing digitado & Ação IA */}
              <div className="lg:col-span-5 space-y-4 bg-muted/20 p-4 rounded-xl border">
                <div>
                  <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-terracotta" /> Alternativa: Briefing Digitado
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Caso não queira usar um arquivo do Drive, digite as instruções e ideias para o
                    artigo.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Título Sugerido (opcional)
                  </label>
                  <Input
                    placeholder="Ex: Como a alimentação intuitiva potencializa a adesão low carb"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-xs h-9 bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Briefing do Conteúdo
                  </label>
                  <textarea
                    placeholder="Ex: Descreva a relação de honrar a fome biológica, evitar compulsões e como a densidade nutricional da comida de verdade melhora o bem-estar metabólico..."
                    value={briefingText}
                    onChange={(e) => setBriefingText(e.target.value)}
                    rows={4}
                    className="w-full text-xs p-2.5 rounded-lg border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Instrução de Estilo / Enfoque (opcional)
                  </label>
                  <Input
                    placeholder="Ex: Tom acolhedor, base em ciência, sem sensacionalismo"
                    value={customDraftPrompt}
                    onChange={(e) => setCustomDraftPrompt(e.target.value)}
                    className="text-xs h-8 bg-background"
                  />
                </div>

                {selectedDriveFile && (
                  <div className="p-2.5 bg-primary/10 rounded-lg text-xs border border-primary/20 space-y-1">
                    <span className="font-semibold text-primary block">
                      Arquivo Selecionado do Drive:
                    </span>
                    <p className="truncate text-foreground font-medium">{selectedDriveFile.nome}</p>
                    <span className="text-[10px] text-muted-foreground">
                      {selectedDriveFile.texto_extraido
                        ? `${selectedDriveFile.texto_extraido.length} caracteres de texto servirão de base para a IA.`
                        : 'Atenção: este arquivo não contém texto extraído.'}
                    </span>
                  </div>
                )}

                <Button
                  type="button"
                  onClick={handleGenerateDraft}
                  disabled={isGeneratingDraft}
                  className="w-full bg-terracotta hover:bg-terracotta/90 text-white font-medium text-xs h-10 shadow-sm"
                >
                  {isGeneratingDraft ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Escrevendo com IA...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" /> Gerar Rascunho com IA (Gemini)
                    </>
                  )}
                </Button>

                <div className="pt-2 border-t flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Ou avance direto para escrever:</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep(2)}
                    className="text-primary font-medium text-xs"
                  >
                    Ir para Escrever <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          PASSO 2: ESCREVER (Editor Rich Text & Redação)
         ======================================================== */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
              <div>
                <h2 className="text-xl font-heading font-bold text-primary flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> Passo 2: Escrever e Estruturar o
                  Artigo
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Edite o título e o corpo HTML com foco em qualidade editorial e respeito aos
                  limites éticos do CFN.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-lg">
                <span>
                  <strong>{wordCount}</strong> palavras
                </span>
                <span>•</span>
                <span>
                  <strong>{readingTimeMinutes}</strong> min de leitura
                </span>
              </div>
            </div>

            {/* Título & Categoria */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Título do Artigo <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Alimentação Intuitiva e Low Carb: Uma Abordagem Integrativa"
                  className="font-heading font-semibold text-base h-11"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Categoria</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-11 text-xs">
                    <SelectValue placeholder="Selecione categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesList.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name} className="text-xs">
                        {cat.name}
                      </SelectItem>
                    ))}
                    {categoriesList.length === 0 && (
                      <SelectItem value="Nutrição Low Carb">Nutrição Low Carb</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Resumo Excerpt */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  Resumo (Excerpt para listagem)
                </label>
                <span className="text-[10px] text-muted-foreground">
                  {excerpt.length} caracteres
                </span>
              </div>
              <Input
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Breve introdução que aparecerá nos cards da página inicial do blog..."
                className="text-xs h-9"
              />
            </div>

            {/* Editor com Toolbar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  Corpo do Artigo (HTML)
                </label>
                <span className="text-[10px] text-muted-foreground">
                  Selecione um trecho para aprimorar com IA abaixo
                </span>
              </div>

              <div className="border border-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20">
                <EstudioToolbar
                  onInsertTag={handleInsertTag}
                  onInsertSnippet={handleInsertSnippet}
                />
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onSelect={handleSelectTextInEditor}
                  onMouseUp={handleSelectTextInEditor}
                  onKeyUp={handleSelectTextInEditor}
                  placeholder="Escreva seu artigo aqui..."
                  className="w-full min-h-[460px] p-4 text-sm font-sans leading-relaxed bg-background focus:outline-none resize-y"
                />
              </div>
            </div>

            {/* Bloco discreto para melhorar trecho selecionado */}
            <div className="p-3.5 bg-muted/30 rounded-xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-terracotta" />
                  <span className="font-semibold text-foreground">Melhorar com IA (Gemini)</span>
                  {selectedText && (
                    <Badge variant="secondary" className="text-[10px]">
                      {selectedText.length} carac. selecionados
                    </Badge>
                  )}
                </div>
                <Input
                  value={improveInstruction}
                  onChange={(e) => setImproveInstruction(e.target.value)}
                  placeholder="Instrução: torne mais fluido, clareie termos técnicos, ajuste tom..."
                  className="h-8 text-xs bg-background"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleImproveSelection}
                disabled={isImprovingText}
                className="h-8 text-xs shrink-0 border-terracotta/40 text-terracotta hover:bg-terracotta/10"
              >
                {isImprovingText ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> Melhorando...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5 mr-1" /> Aprimorar Trecho
                  </>
                )}
              </Button>
            </div>

            {/* Navegação entre passos */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setCurrentStep(1)}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Voltar para Fonte
              </Button>
              <Button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="bg-primary hover:bg-primary/90 text-white"
                size="sm"
              >
                Avançar para Capa <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          PASSO 3: CAPA (Imagem com IA em destaque no topo)
         ======================================================== */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-heading font-bold text-primary flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-terracotta" /> Passo 3: Imagem de Capa do Artigo
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Gere uma fotografia culinária editorial via IA (OpenAI GPT-Image-2) ou forneça uma
                imagem própria.
              </p>
            </div>

            {/* ⭐ BLOCO DE IMAGEM IA EM DESTAQUE NO TOPO DO PASSO */}
            <div className="p-5 bg-gradient-to-br from-terracotta/5 via-muted/30 to-background rounded-2xl border-2 border-terracotta/30 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-terracotta/10 text-terracotta flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-foreground">
                      Gerador de Imagem de Capa (IA)
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Fotografia culinária em 16:9 de alto padrão salva no Supabase Storage
                    </p>
                  </div>
                </div>

                {/* Cota do Dia Visível */}
                <div className="bg-background px-3 py-1.5 rounded-lg border text-xs flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-muted-foreground">Cota de hoje:</span>
                  <span className="font-bold text-foreground">
                    {imageUsage.generationsToday} / {imageUsage.dailyLimit} usados
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] text-terracotta border-terracotta/30"
                  >
                    {imageUsage.remaining} restantes
                  </Badge>
                </div>
              </div>

              {/* Mensagem Clara de Créditos OpenAI */}
              {imageErrorMessage && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5">
                  <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong>Aviso sobre o serviço de imagens:</strong>
                    <p>{imageErrorMessage}</p>
                  </div>
                </div>
              )}

              {/* Preview Grande da Capa */}
              <div className="relative aspect-[21/9] sm:aspect-[21/9] rounded-xl overflow-hidden border bg-muted/60 flex items-center justify-center">
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt={imageAlt || title || 'Capa do Artigo'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2.5 py-1 rounded backdrop-blur-sm">
                      {imageIsAi ? '✨ Imagem gerada por IA' : 'Imagem personalizada'}
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <ImageIcon className="w-12 h-12 text-muted-foreground/40 mx-auto" />
                    <p className="font-medium text-sm text-muted-foreground">
                      Nenhuma imagem de capa selecionada ainda
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      Clique no botão abaixo para gerar uma imagem fotográfica com base no tema do
                      artigo.
                    </p>
                  </div>
                )}
              </div>

              {/* Prompt Customizável e Botão Principal */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                    <span>Prompt da Foto / Ingredientes:</span>
                    <span className="text-[10px] text-muted-foreground">
                      Sem pessoas ou prescrições clínicas
                    </span>
                  </label>
                  <Input
                    placeholder="Ex: Tigela de salada com abacate, azeite, nozes e ovos cozidos em mesa rústica..."
                    value={imagePromptInput}
                    onChange={(e) => setImagePromptInput(e.target.value)}
                    className="text-xs h-10 bg-background"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    onClick={handleGenerateAiImage}
                    disabled={isGeneratingImage || imageUsage.remaining <= 0}
                    className="flex-1 bg-terracotta hover:bg-terracotta/90 text-white font-medium text-xs h-10 shadow-sm"
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Renderizando foto com
                        OpenAI...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" /> Gerar Imagem de Capa (IA)
                      </>
                    )}
                  </Button>

                  {imageUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setImageUrl('')
                        setImageIsAi(false)
                      }}
                      className="text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                    >
                      Remover Capa
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Alternativa: URL Externa e Texto Alt */}
            <div className="p-4 bg-muted/20 rounded-xl border space-y-3 text-xs">
              <span className="font-semibold text-foreground block">
                Opções adicionais de imagem:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-muted-foreground">Ou cole uma URL externa:</label>
                  <Input
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value)
                      setImageIsAi(false)
                    }}
                    placeholder="https://..."
                    className="text-xs h-8 bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted-foreground">Texto Alt (Acessibilidade & SEO):</label>
                  <Input
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Ex: Foto de café da manhã com ovos mexidos e abacate"
                    className="text-xs h-8 bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Navegação entre passos */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setCurrentStep(2)}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Voltar para Escrever
              </Button>
              <Button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="bg-primary hover:bg-primary/90 text-white"
                size="sm"
              >
                Avançar para SEO & Publicar <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          PASSO 4: SEO & PUBLICAR (Metadados, Preview Google e Checklist)
         ======================================================== */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
              <div>
                <h2 className="text-xl font-heading font-bold text-primary flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-600" /> Passo 4: SEO & Publicação
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Revise metadados de busca, checklist de conformidade e publique o artigo.
                </p>
              </div>

              {/* Botão de Autopreencher SEO pelo Título */}
              <Button
                type="button"
                onClick={handleGenerateSeoFromTitle}
                disabled={!title.trim() || isGeneratingSeo}
                className="bg-primary hover:bg-primary/90 text-white text-xs h-9 font-medium shadow-sm"
              >
                {isGeneratingSeo ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Gerando SEO com IA...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5 mr-1.5" /> Gerar SEO a partir do Título
                  </>
                )}
              </Button>
            </div>

            {/* Preview do Snippet do Google */}
            <div className="space-y-2 p-4 bg-muted/20 rounded-xl border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" /> Pré-visualização no Google
                </span>
                <span className="text-[10px] text-muted-foreground">SERP Snippet</span>
              </div>
              <div className="p-4 bg-background rounded-lg border text-left font-sans space-y-1">
                <div className="text-xs text-emerald-800 dark:text-emerald-400 truncate">
                  https://www.guialowcarb.com.br/blog/
                  {slug || generateSlug(title) || 'url-do-artigo'}
                </div>
                <div className="text-base text-blue-700 dark:text-blue-400 hover:underline font-medium line-clamp-1 leading-snug cursor-pointer">
                  {metaTitle || title || 'Título do Artigo no Google'}
                </div>
                <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {metaDescription ||
                    excerpt ||
                    'Artigo de nutrição clínica e saúde metabólica por Adriana Araújo — Nutricionista CRN-9 28762...'}
                </div>
              </div>
            </div>

            {/* Campos de SEO com Contadores 60 e 155 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Meta Title (60) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold">Meta Title</label>
                  <span
                    className={`text-[10px] font-medium ${
                      metaTitle.length <= 60 && metaTitle.length > 0
                        ? 'text-emerald-600'
                        : metaTitle.length > 60
                          ? 'text-rose-500'
                          : 'text-muted-foreground'
                    }`}
                  >
                    {metaTitle.length} / 60{' '}
                    {metaTitle.length <= 60 && metaTitle.length > 0 ? '(Ideal)' : ''}
                  </span>
                </div>
                <Input
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Título otimizado para os motores de busca (máx 60 caracteres)"
                  className="text-xs h-9"
                />
              </div>

              {/* Palavra-chave foco */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Palavra-chave Foco</label>
                <Input
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  placeholder="Ex: alimentação intuitiva, sensibilidade à insulina"
                  className="text-xs h-9"
                />
              </div>

              {/* Meta Description (155) */}
              <div className="md:col-span-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold">Meta Description</label>
                  <span
                    className={`text-[10px] font-medium ${
                      metaDescription.length <= 155 && metaDescription.length > 0
                        ? 'text-emerald-600'
                        : metaDescription.length > 155
                          ? 'text-rose-500'
                          : 'text-muted-foreground'
                    }`}
                  >
                    {metaDescription.length} / 155{' '}
                    {metaDescription.length <= 155 && metaDescription.length > 0 ? '(Ideal)' : ''}
                  </span>
                </div>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={2}
                  placeholder="Descrição persuasiva para os resultados de busca (máx 155 caracteres)..."
                  className="w-full text-xs p-2.5 rounded-lg border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Slug Editável */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Slug da URL</label>
                <div className="flex items-center rounded-md border bg-muted/20 px-2.5 h-9">
                  <span className="text-xs text-muted-foreground">/blog/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) =>
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                    }
                    placeholder="slug-do-artigo"
                    className="flex-1 bg-transparent text-xs px-1 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Tags</label>
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {tags.map((t) => (
                    <Badge
                      key={t}
                      variant="secondary"
                      className="text-xs pr-1 py-0.5 flex items-center gap-1"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="hover:text-destructive text-muted-foreground text-[10px] px-1"
                      >
                        ✕
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Digite a tag e aperte Enter..."
                  className="text-xs h-8"
                />
              </div>
            </div>

            {/* Checklist Final de Publicação */}
            <div className="p-4 bg-muted/40 rounded-xl border text-xs space-y-3">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Checklist Final de Publicação
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-2">
                  {complianceResult.valido ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertOctagon className="w-4 h-4 text-rose-500" />
                  )}
                  <span>Compliance Ético: zero promessas proibidas</span>
                </div>

                <div className="flex items-center gap-2">
                  {complianceResult.temRodapeObrigatorio ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertOctagon className="w-4 h-4 text-amber-500" />
                  )}
                  <span>Rodapé Art. 55 com Adriana Araújo (CRN-9 28762)</span>
                </div>

                <div className="flex items-center gap-2">
                  {title.length > 5 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertOctagon className="w-4 h-4 text-amber-500" />
                  )}
                  <span>Título preenchido</span>
                </div>

                <div className="flex items-center gap-2">
                  {imageUrl ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertOctagon className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span>Imagem de capa definida</span>
                </div>
              </div>
            </div>

            {/* Ações Finais: Salvar Rascunho / Visualizar / Publicar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setCurrentStep(3)}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Voltar para Capa
              </Button>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewOpen(true)}
                  className="text-xs h-9"
                >
                  <Eye className="w-4 h-4 mr-1.5" /> Visualizar
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={isSaving}
                  onClick={() => handleSave(false)}
                  className="text-xs h-9"
                >
                  <Save className="w-4 h-4 mr-1.5" /> Salvar Rascunho
                </Button>

                <Button
                  type="button"
                  size="sm"
                  disabled={isSaving || !complianceResult.valido}
                  onClick={() => handleSave(true)}
                  className={`text-xs h-9 font-medium shadow-sm ${
                    complianceResult.valido
                      ? 'bg-terracotta hover:bg-terracotta/90 text-white'
                      : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
                  }`}
                >
                  <Send className="w-4 h-4 mr-1.5" />
                  {isPublished ? 'Atualizar Publicado' : 'Publicar Agora'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE PRÉ-VISUALIZAÇÃO (Artigo Completo) */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-card">
            <DialogTitle className="text-lg font-heading text-primary flex items-center justify-between">
              <span>Pré-visualização do Artigo no Blog</span>
              <Badge variant="outline" className="text-xs">
                Modo Preview
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background">
            <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[21/9]">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={imageAlt || title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-heading text-xl">
                  {title || 'Sem imagem de capa'}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
                <Badge className="bg-primary text-white w-fit mb-2">{category}</Badge>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">
                  {title || 'Título do Artigo'}
                </h1>
                <div className="flex items-center gap-4 text-xs text-white/80 mt-2">
                  <span>Adriana Araújo • CRN-9 28762</span>
                  <span>{new Date().toLocaleDateString('pt-BR')}</span>
                  <span>{readingTimeMinutes} min de leitura</span>
                </div>
              </div>
            </div>

            <article className="prose prose-emerald max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: content || '<p>Sem conteúdo ainda.</p>' }} />
            </article>
          </div>

          <DialogFooter className="p-4 border-t bg-card flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {wordCount} palavras • {readingTimeMinutes} min de leitura
            </span>
            <Button variant="secondary" onClick={() => setPreviewOpen(false)}>
              Fechar Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL DE REVISÃO DA SUGESTÃO DA IA */}
      <Dialog open={aiSuggestionModalOpen} onOpenChange={setAiSuggestionModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-lg font-heading text-primary flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-terracotta" />
              Sugestão Gerada pela IA — Revise antes de aplicar
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-3 my-2">
            <p className="text-xs text-muted-foreground">
              Você pode editar o texto diretamente nesta janela antes de inseri-lo no editor:
            </p>
            <textarea
              value={aiSuggestionContent}
              onChange={(e) => setAiSuggestionContent(e.target.value)}
              className="w-full h-80 p-3 text-xs font-mono rounded-lg border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setAiSuggestionModalOpen(false)}>
              Descartar
            </Button>
            <Button
              type="button"
              onClick={handleApplyAiSuggestion}
              className="bg-primary hover:bg-primary/90 text-white font-medium"
            >
              <Check className="w-4 h-4 mr-1.5" /> Aplicar e Avançar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
