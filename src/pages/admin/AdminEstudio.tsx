import React, { useState, useEffect, useRef, useMemo } from 'react'
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
  Loader2,
  RefreshCw,
  FolderOpen,
  ArrowUpRight,
  ShieldAlert,
  Info,
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
import { EstudioAssistant } from './components/EstudioAssistant'
import { EstudioSeoAndImage } from './components/EstudioSeoAndImage'
import {
  executarFiltroCompliance,
  extrairTextoPuro,
  ComplianceResult,
} from '@/services/complianceFilter'
import { invokeGeminiAssist, fetchDailyImageUsage } from '@/services/estudioAiService'

export default function AdminEstudio() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const editPostId = searchParams.get('id')

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
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [imageIsAi, setImageIsAi] = useState(false)
  const [isPublished, setIsPublished] = useState(false)

  // Seleção no Editor (para melhoria de trecho da IA)
  const [selectedText, setSelectedText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  // Google Drive Files
  const [driveFiles, setDriveFiles] = useState<any[]>([])
  const [loadingDrive, setLoadingDrive] = useState(false)

  // Controle de Cota Diária de Imagens
  const [imageUsage, setImageUsage] = useState({
    generationsToday: 0,
    dailyLimit: 20,
    remaining: 20,
  })

  // Estados de Operação
  const [isSaving, setIsSaving] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // 1. Contagem de palavras e tempo de leitura em tempo real
  const textoPuro = useMemo(() => extrairTextoPuro(content), [content])
  const wordCount = useMemo(() => {
    if (!textoPuro.trim()) return 0
    return textoPuro.trim().split(/\s+/).length
  }, [textoPuro])

  const readingTimeMinutes = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 200))
  }, [wordCount])

  // 2. Filtro Determinístico em tempo real (sem IA)
  const complianceResult: ComplianceResult = useMemo(() => {
    return executarFiltroCompliance(title, content, excerpt)
  }, [title, content, excerpt])

  // Carrega categorias e arquivos do Drive
  useEffect(() => {
    const fetchInitial = async () => {
      setInitialLoading(true)
      try {
        // Categorias
        const { data: cats } = await supabase.from('blog_categories').select('*').order('name')
        if (cats && cats.length > 0) {
          setCategoriesList(cats)
          if (!category) setCategory(cats[0].name)
        }

        // Drive Files
        setLoadingDrive(true)
        const { data: dfs } = await (supabase as any)
          .from('drive_arquivos')
          .select('id, nome, mime_type, texto_extraido, status, link_drive')
          .order('modified_time', { ascending: false })
        if (dfs) setDriveFiles(dfs)

        // Cota de imagem
        const usage = await fetchDailyImageUsage()
        setImageUsage(usage)

        // Se está editando post existente
        if (editPostId) {
          const { data: postData, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', editPostId)
            .single()

          if (postData && !error) {
            setPostId(postData.id)
            setTitle(postData.title || '')
            setContent(postData.content || '')
            setExcerpt(postData.excerpt || '')
            setCategory(postData.category || 'Nutrição Low Carb')
            setSlug(postData.slug || '')
            setMetaTitle((postData as any).meta_title || postData.title || '')
            setMetaDescription((postData as any).meta_description || postData.excerpt || '')
            setFocusKeyword((postData as any).focus_keyword || '')
            setTags(postData.tags || ['low-carb'])
            setImageUrl(postData.featured_image_url || '')
            setImageAlt((postData as any).image_alt || '')
            setImageIsAi((postData as any).image_is_ai || false)
            setIsPublished(postData.published || false)
          }
        }
      } catch (err) {
        console.error('Erro ao inicializar Estúdio:', err)
      } finally {
        setLoadingDrive(false)
        setInitialLoading(false)
      }
    }

    fetchInitial()
  }, [editPostId])

  // Helper para gerar slug
  const generateSlug = (str: string) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }

  // 3. REGRA ESPECÍFICA DA USUÁRIA:
  // "A etapa 5 (SEO) deve ser criada pela IA assim que a usuária sugerir o título previamente"
  const handleGenerateSeoFromTitle = async () => {
    if (!title.trim()) {
      toast({
        title: 'Digite o título primeiro',
        description:
          'Informe o título do artigo no editor para a IA gerar todos os metadados de SEO.',
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
          title: 'SEO Otimizado pelo Gemini 3.7 Flash!',
          description: 'Meta Title, Description, Slug e Tags foram preenchidos com sucesso.',
        })
      } else {
        // Fallback básico
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

  // Captura de texto selecionado para melhorar com IA
  const handleSelectTextInEditor = () => {
    if (!textareaRef.current) return
    const start = textareaRef.current.selectionStart
    const end = textareaRef.current.selectionEnd
    if (start !== end) {
      const sel = textareaRef.current.value.substring(start, end)
      setSelectedText(sel)
    } else {
      setSelectedText('')
    }
  }

  // Inserção de tags pelo toolbar
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

    // Reposiciona cursor
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + tagStart.length + selected.length + tagEnd.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
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

  // Aplicar Rascunho da IA
  const handleApplyDraft = (generatedHtml: string) => {
    setContent(generatedHtml)
    if (!excerpt && generatedHtml) {
      const pure = extrairTextoPuro(generatedHtml)
      setExcerpt(pure.slice(0, 160) + '...')
    }
  }

  // Substituir trecho selecionado
  const handleReplaceSelectedText = (improvedText: string) => {
    if (!textareaRef.current || !selectedText) {
      setContent((prev) => prev + '\n' + improvedText)
      return
    }
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    const newContent =
      textarea.value.substring(0, start) + improvedText + textarea.value.substring(end)
    setContent(newContent)
    setSelectedText('')
  }

  // 4. Salvar Rascunho / Publicar
  const handleSave = async (publishTarget: boolean = false) => {
    // Se for para publicar, aplicar filtro determinístico estrito
    if (publishTarget) {
      if (!complianceResult.valido) {
        toast({
          title: 'Publicação Bloqueada!',
          description: `Existem ${complianceResult.totalViolacoes} termos proibidos pelo Código de Ética que impedem a publicação. Corrija-os primeiro.`,
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
      let savedId = postId

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
          savedId = newRow.id
          setPostId(newRow.id)
          navigate(`/admin/estudio?id=${newRow.id}`, { replace: true })
        }
      }

      setLastSavedAt(new Date())
      if (publishTarget) {
        setIsPublished(true)
        toast({
          title: '🎉 Artigo Publicado no Blog!',
          description: `O artigo "${title}" já está no ar com URL /blog/${currentSlug}.`,
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

  // 5. Autosave a cada 45 segundos como RASCUNHO (se houver alterações e título)
  useEffect(() => {
    if (!title.trim() || initialLoading) return

    const timer = setTimeout(async () => {
      try {
        setIsAutoSaving(true)
        const currentSlug = slug || generateSlug(title)
        const payload = {
          title,
          slug: currentSlug,
          category,
          content,
          excerpt,
          featured_image_url: imageUrl || null,
          reading_time_minutes: readingTimeMinutes,
          author: 'Adriana Araújo',
          tags,
          meta_title: metaTitle,
          meta_description: metaDescription,
          focus_keyword: focusKeyword,
          image_alt: imageAlt,
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
        console.warn('Falha silenciosa de autosave:', err)
      } finally {
        setIsAutoSaving(false)
      }
    }, 45000)

    return () => clearTimeout(timer)
  }, [
    title,
    content,
    excerpt,
    category,
    slug,
    metaTitle,
    metaDescription,
    focusKeyword,
    tags,
    imageUrl,
    imageAlt,
    imageIsAi,
    postId,
    initialLoading,
    readingTimeMinutes,
    complianceResult,
    navigate,
  ])

  if (initialLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mr-3" />
        <span className="text-muted-foreground font-medium">Carregando Estúdio IA...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-12 animate-fade-in">
      {/* Barra Superior de Ações & Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-card p-4 rounded-xl border shadow-sm">
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
                    <RefreshCw className="w-3 h-3 animate-spin" /> Salvando...
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

        {/* Botões de Ação */}
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
            className="text-xs h-9 bg-primary/10 text-primary hover:bg-primary/20"
          >
            <Save className="w-4 h-4 mr-1.5" /> Salvar Rascunho
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={isSaving || !complianceResult.valido}
            onClick={() => handleSave(true)}
            className={`text-xs h-9 font-medium ${
              complianceResult.valido
                ? 'bg-terracotta hover:bg-terracotta/90 text-white'
                : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
            }`}
            title={
              complianceResult.valido
                ? 'Publicar artigo no blog'
                : 'Publicação bloqueada por termos proibidos'
            }
          >
            <Send className="w-4 h-4 mr-1.5" />
            {isPublished ? 'Atualizar Publicado' : 'Publicar'}
          </Button>
        </div>
      </div>

      {/* Alerta de Violação de Compliance Determinístico (se houver) */}
      {!complianceResult.valido && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-400 dark:border-rose-800 rounded-xl space-y-2 animate-pulse">
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200 font-bold text-sm">
            <AlertOctagon className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>
              Filtro Ético: {complianceResult.totalViolacoes} termo(s) proibido(s) detectado(s) no
              texto!
            </span>
          </div>
          <p className="text-xs text-rose-700 dark:text-rose-300">
            A publicação está bloqueada pelo Código de Ética do Nutricionista e Resoluções CFN.
            Remova ou substitua os seguintes termos:
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

      {/* Alerta de Falta de Rodapé Obrigatório do Art. 55 */}
      {!complianceResult.temRodapeObrigatorio && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 rounded-xl flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Atenção:</strong> O artigo precisa conter o rodapé obrigatório com{' '}
              <em>Adriana Araújo — Nutricionista CRN-9 28762</em> para poder ser publicado.
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
            className="h-7 text-xs border-amber-400 hover:bg-amber-100 text-amber-900"
          >
            Inserir Rodapé
          </Button>
        </div>
      )}

      {/* LAYOUT EM 3 COLUNAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* COLUNA ESQUERDA (3 colunas): Assistente de Texto Gemini 3.7 + Drive + Briefing */}
        <div className="lg:col-span-3">
          <EstudioAssistant
            currentTitle={title}
            currentContent={content}
            selectedText={selectedText}
            driveFiles={driveFiles}
            loadingDrive={loadingDrive}
            onApplyDraft={handleApplyDraft}
            onReplaceSelectedText={handleReplaceSelectedText}
            onGenerateSeoFromTitle={handleGenerateSeoFromTitle}
            isGeneratingSeo={isGeneratingSeo}
          />
        </div>

        {/* COLUNA CENTRAL (6 colunas): Editor de Artigo Rich Text + Autosave */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-card rounded-xl border shadow-sm p-4 space-y-3">
            {/* Título & Categoria */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Título do Artigo <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Como a alimentação low carb melhora a sensibilidade à insulina"
                  className="font-heading font-semibold text-base h-11"
                />
              </div>

              <div className="space-y-1">
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

            {/* Resumo / Excerpt */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Resumo (Excerpt)</span>
                <span className="text-[10px] text-muted-foreground">
                  {excerpt.length} caracteres
                </span>
              </label>
              <Input
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Breve introdução que aparecerá na listagem do blog..."
                className="text-xs h-9"
              />
            </div>

            {/* Editor de Conteúdo com Toolbar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  Corpo do Artigo (HTML Estruturado)
                </label>
                <span className="text-[10px] text-muted-foreground">
                  Selecione um trecho para melhorar com o Assistente
                </span>
              </div>

              <div className="border border-border rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-primary">
                {/* Toolbar */}
                <EstudioToolbar
                  onInsertTag={handleInsertTag}
                  onInsertSnippet={handleInsertSnippet}
                />

                {/* Textarea principal */}
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onSelect={handleSelectTextInEditor}
                  onMouseUp={handleSelectTextInEditor}
                  onKeyUp={handleSelectTextInEditor}
                  placeholder="Escreva seu artigo aqui... Dica: use o botão 'Gerar Rascunho Completo' na coluna esquerda para a IA montar a estrutura a partir de um documento do Drive ou briefing."
                  className="w-full min-h-[520px] p-4 text-sm font-sans leading-relaxed bg-background focus:outline-none resize-y"
                />
              </div>
            </div>

            {/* Status Checklist Rodapé do Artigo */}
            <div className="p-3 bg-muted/40 rounded-lg text-xs space-y-2 border border-border/50">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Checklist de Conformidade &
                Publicação
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5">
                  {complianceResult.valido ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
                  )}
                  <span>Zero termos proibidos de promessa de cura</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {complianceResult.temRodapeObrigatorio ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertOctagon className="w-3.5 h-3.5 text-amber-500" />
                  )}
                  <span>Identificação Adriana Araújo (CRN-9 28762)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {title.length > 5 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertOctagon className="w-3.5 h-3.5 text-amber-500" />
                  )}
                  <span>Título preenchido ({title.length} carac.)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {wordCount >= 200 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertOctagon className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                  <span>Artigo completo ({wordCount} palavras)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA (3 colunas): SEO Google Preview + Capa OpenAI */}
        <div className="lg:col-span-3">
          <EstudioSeoAndImage
            metaTitle={metaTitle}
            setMetaTitle={setMetaTitle}
            metaDescription={metaDescription}
            setMetaDescription={setMetaDescription}
            slug={slug}
            setSlug={setSlug}
            focusKeyword={focusKeyword}
            setFocusKeyword={setFocusKeyword}
            tags={tags}
            setTags={setTags}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            imageAlt={imageAlt}
            setImageAlt={setImageAlt}
            imageIsAi={imageIsAi}
            setImageIsAi={setImageIsAi}
            currentTitle={title}
            currentContent={content}
            imageUsage={imageUsage}
            onImageGenerated={(newUsage) => setImageUsage(newUsage)}
            onGenerateSeoFromTitle={handleGenerateSeoFromTitle}
            isGeneratingSeo={isGeneratingSeo}
          />
        </div>
      </div>

      {/* Modal de Pré-visualização do Artigo Renderizado exatamente como no Blog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-card">
            <DialogTitle className="text-lg font-heading text-primary flex items-center justify-between">
              <span>Pré-visualização do Artigo no Blog</span>
              <Badge variant="outline" className="text-xs">
                Modo Preview (Não Publicado)
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background">
            {/* Header Hero Preview */}
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

            {/* Conteúdo Renderizado */}
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
    </div>
  )
}
