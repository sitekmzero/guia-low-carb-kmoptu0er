import React, { useState } from 'react'
import {
  Search,
  Globe,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ImageIcon,
  Wand2,
  Loader2,
  Copy,
  Info,
  ShieldAlert,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { invokeOpenAiImage } from '@/services/estudioAiService'
import { toast } from '@/hooks/use-toast'

interface EstudioSeoAndImageProps {
  metaTitle: string
  setMetaTitle: (v: string) => void
  metaDescription: string
  setMetaDescription: (v: string) => void
  slug: string
  setSlug: (v: string) => void
  focusKeyword: string
  setFocusKeyword: (v: string) => void
  tags: string[]
  setTags: (v: string[]) => void
  imageUrl: string
  setImageUrl: (v: string) => void
  imageAlt: string
  setImageAlt: (v: string) => void
  imageIsAi: boolean
  setImageIsAi: (v: boolean) => void
  currentTitle: string
  currentContent: string
  imageUsage: {
    generationsToday: number
    dailyLimit: number
    remaining: number
  }
  onImageGenerated: (newUsage: {
    generationsToday: number
    dailyLimit: number
    remaining: number
  }) => void
  onGenerateSeoFromTitle: () => void
  isGeneratingSeo: boolean
}

export const EstudioSeoAndImage: React.FC<EstudioSeoAndImageProps> = ({
  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription,
  slug,
  setSlug,
  focusKeyword,
  setFocusKeyword,
  tags,
  setTags,
  imageUrl,
  setImageUrl,
  imageAlt,
  setImageAlt,
  imageIsAi,
  setImageIsAi,
  currentTitle,
  currentContent,
  imageUsage,
  onImageGenerated,
  onGenerateSeoFromTitle,
  isGeneratingSeo,
}) => {
  const [tagInput, setTagInput] = useState('')
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [imagePromptInput, setImagePromptInput] = useState('')

  // Indicadores de tamanho SEO
  const titleLen = metaTitle.length
  const descLen = metaDescription.length

  const getTitleStatus = () => {
    if (titleLen === 0) return { color: 'text-muted-foreground', bg: 'bg-muted', label: 'Vazio' }
    if (titleLen <= 60)
      return { color: 'text-emerald-600', bg: 'bg-emerald-500', label: 'Ideal (≤60)' }
    return { color: 'text-rose-500', bg: 'bg-rose-500', label: 'Longo (>60)' }
  }

  const getDescStatus = () => {
    if (descLen === 0) return { color: 'text-muted-foreground', bg: 'bg-muted', label: 'Vazio' }
    if (descLen <= 155)
      return { color: 'text-emerald-600', bg: 'bg-emerald-500', label: 'Ideal (≤155)' }
    return { color: 'text-rose-500', bg: 'bg-rose-500', label: 'Longo (>155)' }
  }

  const titleStatus = getTitleStatus()
  const descStatus = getDescStatus()

  // SEO Score Simples (0-100)
  const calculateSeoScore = () => {
    let score = 0
    if (metaTitle.trim().length > 10 && metaTitle.length <= 60) score += 25
    if (metaDescription.trim().length > 30 && metaDescription.length <= 155) score += 25
    if (slug.trim().length > 3) score += 15
    if (focusKeyword.trim().length > 2) {
      score += 15
      const lowerKey = focusKeyword.toLowerCase()
      if (metaTitle.toLowerCase().includes(lowerKey)) score += 10
      if (slug.toLowerCase().includes(lowerKey.replace(/\s+/g, '-'))) score += 10
    }
    return Math.min(100, score)
  }

  const seoScore = calculateSeoScore()

  // Adicionar Tag
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

  // Abertura do Modal de Confirmação de Imagem (Controle de Custo)
  const handleOpenImageModal = () => {
    const defaultPrompt =
      focusKeyword || currentTitle
        ? `Prato saudável de ${focusKeyword || currentTitle}, ingredientes frescos low carb, mesa de madeira rústica, azeite de oliva e folhas verdes`
        : 'Seleção de vegetais frescos de baixo amido, ovos caipiras e nozes em bancada de cozinha com luz suave'
    setImagePromptInput(defaultPrompt)
    setIsConfirmModalOpen(true)
  }

  // Execução da Geração de Imagem via OpenAI
  const handleConfirmGenerateImage = async () => {
    try {
      setIsGeneratingImage(true)
      const { data, error } = await invokeOpenAiImage({
        prompt: imagePromptInput,
      })

      if (error) throw new Error(error)

      if (data?.imageUrl) {
        setImageUrl(data.imageUrl)
        setImageAlt(data.altText || `Fotografia culinária de ${focusKeyword || currentTitle}`)
        setImageIsAi(true)

        onImageGenerated({
          generationsToday: data.generationsToday,
          dailyLimit: data.dailyLimit,
          remaining: data.remaining,
        })

        toast({
          title: 'Imagem gerada com sucesso!',
          description: 'A foto foi salva diretamente no Supabase Storage e associada como capa.',
        })
        setIsConfirmModalOpen(false)
      }
    } catch (err: any) {
      toast({
        title: 'Erro ao gerar imagem',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setIsGeneratingImage(false)
    }
  }

  return (
    <div className="space-y-6 text-sm">
      {/* Cabeçalho SEO & Capa */}
      <div className="flex items-center justify-between pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-base text-foreground leading-tight">
              SEO & Capa
            </h2>
            <span className="text-xs text-muted-foreground">Otimização & Imagem Editorial</span>
          </div>
        </div>

        {/* SEO Score Badge */}
        <Badge
          className={`text-xs px-2.5 py-1 ${
            seoScore >= 80
              ? 'bg-emerald-600 text-white'
              : seoScore >= 50
                ? 'bg-amber-600 text-white'
                : 'bg-muted text-muted-foreground'
          }`}
        >
          SEO Score: {seoScore}%
        </Badge>
      </div>

      {/* Botão de Preenchimento Automático por IA a partir do Título */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onGenerateSeoFromTitle}
        disabled={!currentTitle.trim() || isGeneratingSeo}
        className="w-full text-xs h-9 border-primary/40 text-primary hover:bg-primary/5"
      >
        {isGeneratingSeo ? (
          <>
            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Gerando metadados...
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Autopreencher SEO pelo Título
          </>
        )}
      </Button>

      {/* Snippet Google Preview */}
      <div className="space-y-2 p-3.5 bg-card rounded-xl border shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5" /> Pré-visualização Google
          </span>
          <span className="text-[10px] text-muted-foreground">SERP Snippet</span>
        </div>

        <div className="p-3 bg-muted/30 rounded-lg border border-border/60 text-left font-sans space-y-1">
          <div className="text-xs text-emerald-800 dark:text-emerald-400 truncate">
            https://www.guialowcarb.com.br/blog/{slug || 'url-do-artigo'}
          </div>
          <div className="text-base text-blue-700 dark:text-blue-400 hover:underline font-medium line-clamp-1 leading-snug cursor-pointer">
            {metaTitle || currentTitle || 'Título do Artigo no Google'}
          </div>
          <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {metaDescription ||
              'Aprenda com base em evidências científicas e acolhimento clínico da nutricionista Adriana Araújo (CRN-9 28762) sobre alimentação low carb...'}
          </div>
        </div>
      </div>

      {/* Campos de SEO */}
      <div className="space-y-4 p-3.5 bg-card rounded-xl border shadow-sm">
        {/* Palavra-chave foco */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold flex items-center justify-between">
            <span>Palavra-chave Foco</span>
            <span className="text-[10px] text-muted-foreground font-normal">
              Ex: resistência insulínica
            </span>
          </label>
          <Input
            value={focusKeyword}
            onChange={(e) => setFocusKeyword(e.target.value)}
            placeholder="Ex: diabetes tipo 2 e low carb"
            className="text-xs h-8"
          />
        </div>

        {/* Meta Title */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold">Meta Title</label>
            <span className={`text-[10px] font-medium ${titleStatus.color}`}>
              {titleLen}/60 ({titleStatus.label})
            </span>
          </div>
          <Input
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder="Título otimizado para o Google (máx 60)"
            className="text-xs h-8"
          />
        </div>

        {/* Meta Description */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold">Meta Description</label>
            <span className={`text-[10px] font-medium ${descStatus.color}`}>
              {descLen}/155 ({descStatus.label})
            </span>
          </div>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Resumo persuasivo para os resultados de busca (máx 155 caracteres)..."
            className="w-full text-xs p-2 rounded-lg border bg-background min-h-[70px] focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Slug */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold">Slug da URL</label>
          <div className="flex items-center rounded-md border bg-muted/20 px-2 h-8">
            <span className="text-[11px] text-muted-foreground">/blog/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="slug-do-artigo"
              className="flex-1 bg-transparent text-xs px-1 focus:outline-none"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold">Tags do Artigo</label>
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
            placeholder="Digite e aperte Enter ou vírgula..."
            className="text-xs h-8"
          />
        </div>
      </div>

      {/* Seção da Imagem de Capa */}
      <div className="space-y-3 p-3.5 bg-card rounded-xl border shadow-sm">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-xs text-foreground flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-primary" /> Imagem de Capa
          </label>
          {imageIsAi && (
            <Badge className="text-[10px] bg-terracotta text-white hover:bg-terracotta/90">
              ✨ Gerada por IA
            </Badge>
          )}
        </div>

        {/* Preview da Capa */}
        {imageUrl ? (
          <div className="space-y-2">
            <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
              <img src={imageUrl} alt={imageAlt || 'Capa'} className="w-full h-full object-cover" />
              {imageIsAi && (
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
                  Metadado: Foto IA editorial
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="truncate max-w-[200px]">{imageAlt || 'Sem texto alt'}</span>
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="text-destructive hover:underline text-[11px]"
              >
                Remover
              </button>
            </div>
          </div>
        ) : (
          <div className="aspect-video rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center p-4 text-center bg-muted/20">
            <ImageIcon className="w-8 h-8 text-muted-foreground/50 mb-1" />
            <span className="text-xs text-muted-foreground">
              Nenhuma imagem de capa selecionada
            </span>
          </div>
        )}

        {/* Controle de Custo & Botão de Geração de Imagem IA */}
        <div className="pt-2 border-t space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Cota Diária de Imagens IA:</span>
            <span className="font-semibold text-foreground">
              {imageUsage.generationsToday} / {imageUsage.dailyLimit} usados ({imageUsage.remaining}{' '}
              restantes)
            </span>
          </div>

          <Button
            type="button"
            onClick={handleOpenImageModal}
            disabled={imageUsage.remaining <= 0}
            className="w-full bg-terracotta hover:bg-terracotta/90 text-white text-xs h-9 font-medium shadow-sm"
          >
            <Wand2 className="w-3.5 h-3.5 mr-1.5" /> Gerar Imagem de Capa (IA)
          </Button>

          {/* URL Manual Fallback */}
          <div className="pt-1">
            <Input
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value)
                setImageIsAi(false)
              }}
              placeholder="Ou cole uma URL externa (https://...)"
              className="text-xs h-7"
            />
          </div>

          {/* Texto Alt da imagem */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] text-muted-foreground font-medium">
                Texto Alt (Acessibilidade & SEO)
              </label>
              <span className="text-[10px] text-muted-foreground">{imageAlt.length}/125</span>
            </div>
            <Input
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value.slice(0, 125))}
              placeholder="Ex: Tigela de salada com abacate e nozes"
              className="text-xs h-7"
            />
          </div>
        </div>
      </div>

      {/* Modal de Confirmação & Controle de Custo (OpenAI DALL-E / GPT-Image-2) */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-heading text-primary flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-terracotta" />
              Confirmar Geração de Imagem IA
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 my-2 text-sm">
            <div className="p-3 bg-muted/40 rounded-lg border text-xs space-y-1.5 text-muted-foreground">
              <div className="flex items-center justify-between font-semibold text-foreground">
                <span>Controle de Custo</span>
                <span>
                  Restam {imageUsage.remaining} de {imageUsage.dailyLimit} hoje
                </span>
              </div>
              <p>
                A imagem será renderizada em alta definição (16:9 editorial) pelo modelo OpenAI e
                enviada diretamente ao bucket seguro do Supabase Storage.
              </p>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <strong className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" /> Política Editorial Estrita:
              </strong>
              <p>
                Apenas ingredientes, pratos e cenas culinárias. É proibido gerar pessoas, consultas
                ou comparações de emagrecimento (antes/depois). A paleta de cores seguirá o padrão
                da marca (#0F5132, #3D6B4F, #A8C3A0, #FAF6EF, #C65D3B).
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Prompt do Prato / Ingredientes:</label>
              <textarea
                value={imagePromptInput}
                onChange={(e) => setImagePromptInput(e.target.value)}
                rows={3}
                className="w-full text-xs p-2.5 rounded-lg border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Ex: Salmão grelhado com aspargos e azeite..."
              />
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={isGeneratingImage}
              onClick={() => setIsConfirmModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmGenerateImage}
              disabled={isGeneratingImage || !imagePromptInput.trim()}
              className="bg-terracotta hover:bg-terracotta/90 text-white font-medium"
            >
              {isGeneratingImage ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Renderizando & Salvando...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" /> Confirmar & Gerar (1 crédito)
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
