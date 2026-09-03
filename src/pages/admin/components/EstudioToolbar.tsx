import React from 'react'
import {
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link2,
  Image as ImageIcon,
  Code,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EstudioToolbarProps {
  onInsertTag: (tagStart: string, tagEnd?: string, placeholder?: string) => void
  onInsertSnippet: (snippet: string) => void
  disabled?: boolean
}

export const EstudioToolbar: React.FC<EstudioToolbarProps> = ({
  onInsertTag,
  onInsertSnippet,
  disabled = false,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5 p-2 bg-muted/50 border-b border-border/70 rounded-t-lg">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={() => onInsertTag('<h2>', '</h2>', 'Subtítulo H2')}
        className="h-8 px-2 text-xs font-semibold text-primary hover:bg-primary/10"
        title="Título H2"
      >
        <Heading2 className="w-4 h-4 mr-1" /> H2
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={() => onInsertTag('<h3>', '</h3>', 'Seção H3')}
        className="h-8 px-2 text-xs font-semibold text-primary hover:bg-primary/10"
        title="Título H3"
      >
        <Heading3 className="w-4 h-4 mr-1" /> H3
      </Button>

      <div className="w-[1px] h-5 bg-border mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={() => onInsertTag('<strong>', '</strong>', 'texto em destaque')}
        className="h-8 w-8 p-0"
        title="Negrito"
      >
        <Bold className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={() => onInsertTag('<em>', '</em>', 'texto itálico')}
        className="h-8 w-8 p-0"
        title="Itálico"
      >
        <Italic className="w-4 h-4" />
      </Button>

      <div className="w-[1px] h-5 bg-border mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={() =>
          onInsertSnippet(
            '<ul>\n  <li>Primeiro item da lista</li>\n  <li>Segundo item com orientação clara</li>\n  <li>Terceiro item prático</li>\n</ul>',
          )
        }
        className="h-8 w-8 p-0"
        title="Lista com marcadores"
      >
        <List className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={() =>
          onInsertSnippet(
            '<ol>\n  <li>Passo 1: planeje as refeições da semana</li>\n  <li>Passo 2: priorize proteínas e vegetais de baixo amido</li>\n  <li>Passo 3: mantenha a hidratação constante</li>\n</ol>',
          )
        }
        className="h-8 w-8 p-0"
        title="Lista numerada"
      >
        <ListOrdered className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={() =>
          onInsertTag(
            '<blockquote class="border-l-4 border-primary pl-4 py-2 italic text-muted-foreground my-4">',
            '</blockquote>',
            'Citação ou ponto de destaque clínico...',
          )
        }
        className="h-8 w-8 p-0"
        title="Citação"
      >
        <Quote className="w-4 h-4" />
      </Button>

      <div className="w-[1px] h-5 bg-border mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={() => {
          const url = prompt('Digite o endereço da URL:')
          if (url) {
            onInsertTag(
              `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary underline">`,
              '</a>',
              'texto do link',
            )
          }
        }}
        className="h-8 w-8 p-0"
        title="Inserir Link"
      >
        <Link2 className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={() => {
          const imgUrl = prompt('URL da imagem:')
          const alt = prompt('Texto alternativo (alt):')
          if (imgUrl) {
            onInsertSnippet(
              `<figure class="my-6">\n  <img src="${imgUrl}" alt="${alt || 'Ilustração do artigo'}" class="w-full rounded-xl shadow-md" />\n  <figcaption class="text-xs text-center text-muted-foreground mt-2">${alt || ''}</figcaption>\n</figure>`,
            )
          }
        }}
        className="h-8 w-8 p-0"
        title="Inserir Imagem HTML"
      >
        <ImageIcon className="w-4 h-4" />
      </Button>

      <div className="w-[1px] h-5 bg-border mx-1" />

      {/* Caixa de Advertência Médica Padronizada */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() =>
          onInsertSnippet(
            `<div class="p-4 my-6 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-sm space-y-1.5">\n  <strong class="text-amber-900 dark:text-amber-200 flex items-center gap-1.5">⚠️ Alerta de Segurança e Ajuste Medicamentoso:</strong>\n  <p class="text-amber-800 dark:text-amber-300">Pessoas em uso de medicações para diabetes (insulina, sulfonilureias) ou pressão arterial devem comunicar seu médico e nutricionista antes de alterar o consumo de carboidratos, devido ao risco real de hipoglicemia rápida.</p>\n</div>`,
          )
        }
        className="h-8 text-xs font-medium text-amber-800 border-amber-300 hover:bg-amber-100 dark:text-amber-300"
        title="Inserir Advertência de Hipoglicemia"
      >
        ⚠️ Alerta Hipoglicemia
      </Button>

      {/* Inserir Rodapé Obrigatório Art. 55 */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() =>
          onInsertSnippet(
            `<div class="not-prose mt-12 p-6 rounded-2xl bg-muted/40 border border-primary/20 shadow-sm text-sm space-y-2 text-foreground/80">\n  <p class="font-semibold text-primary">ℹ️ Nota de Esclarecimento e Responsabilidade Técnica</p>\n  <p class="leading-relaxed">Este conteúdo tem caráter estritamente educativo e informativo, não configurando diagnóstico, prescrição dietética individualizada ou recomendação terapêutica específica. Para adequação de conduta, consulte sempre um nutricionista habilitado.</p>\n  <p class="text-xs text-muted-foreground pt-1 border-t border-border/50">Responsável Técnica: <strong>Adriana Araújo</strong> • Nutricionista Clínica • <strong>CRN-9 28762</strong>.</p>\n</div>`,
          )
        }
        className="h-8 text-xs font-medium text-primary border-primary/30 hover:bg-primary/10"
        title="Inserir Rodapé Obrigatório da Nutricionista (Art. 55)"
      >
        <Sparkles className="w-3.5 h-3.5 mr-1" /> Rodapé Art. 55
      </Button>
    </div>
  )
}
