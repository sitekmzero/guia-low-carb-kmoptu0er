/**
 * Filtro Determinístico em Código (sem IA) para Compliance Editorial e Nutricional
 * Atende às exigências do Código de Ética do Nutricionista (Resolução CFN) e legislação brasileira (Lei 8.234/1991).
 * Executa na criação e a cada salvamento/edição de rascunhos ou artigos publicados.
 */

export interface TermoViolacao {
  termo: string
  motivo: string
  categoria: 'promessa_resultado' | 'titulacao' | 'prescricao' | 'outros'
  posicoes: number[]
}

export interface ComplianceResult {
  valido: boolean
  violacoes: TermoViolacao[]
  totalViolacoes: number
  temRodapeObrigatorio: boolean
  rodapeCheckTexto: string
}

/**
 * Lista de termos expressamente proibidos em código determinístico
 */
export const DICIONARIO_TERMOS_PROIBIDOS: Array<{
  padrao: RegExp
  nome: string
  motivo: string
  categoria: 'promessa_resultado' | 'titulacao' | 'prescricao' | 'outros'
}> = [
  {
    padrao: /\b(reverter|revers[aã]o|revertendo)\b/gi,
    nome: 'reverter / reversão',
    motivo:
      'Promessa enganosa de desfecho clínico. Doenças crônicas metabólicas requerem manejo contínuo.',
    categoria: 'promessa_resultado',
  },
  {
    padrao: /\b(curar|cura|curando)\b/gi,
    nome: 'cura / curar',
    motivo: 'Alegação proibida de cura para condições crônicas ou metabólicas.',
    categoria: 'promessa_resultado',
  },
  {
    padrao: /\b(garantid[oa]s?|garantindo)\b/gi,
    nome: 'garantido / garantindo',
    motivo: 'Alegação de garantia de resultado metabólico ou ponderal.',
    categoria: 'promessa_resultado',
  },
  {
    padrao: /\b(definitiv[oa]s?)\b/gi,
    nome: 'definitivo',
    motivo: 'Alegações absolutas são vedadas pelo Código de Ética.',
    categoria: 'promessa_resultado',
  },
  {
    padrao: /\b(comprovadamente)\b/gi,
    nome: 'comprovadamente',
    motivo: 'Termo absoluto sensacionalista. Prefira formulações relativas suportadas por estudos.',
    categoria: 'promessa_resultado',
  },
  {
    padrao: /\b(100%\s*(eficaz|garantido|seguro))\b/gi,
    nome: '100% eficaz / garantido',
    motivo: 'Afirmação vedada de eficácia total.',
    categoria: 'promessa_resultado',
  },
  {
    padrao: /\b(especialista)\b/gi,
    nome: 'especialista',
    motivo:
      'A autora é nutricionista clínica CRN-9 28762 com formação complementar. O termo especialista isolado é restrito a títulos de especialista registrados em conselho.',
    categoria: 'titulacao',
  },
  {
    padrao: /\b(n[aã]o\s+limite\s+as\s+por[cç][oõ]es)\b/gi,
    nome: 'não limite as porções',
    motivo: 'Prescrição geral irresponsável e perigosa para pacientes com distúrbios alimentares.',
    categoria: 'prescricao',
  },
  {
    padrao: /\b(coma\s+à\s+vontade\s+gordura|coma\s+a\s+vontade\s+gordura)\b/gi,
    nome: 'coma à vontade gordura',
    motivo: 'Incentivo desmedido sem contextualização clínica.',
    categoria: 'prescricao',
  },
  {
    padrao: /\b(emagre[çc]a\s+\d+\s*kg\s+em\s+\d+\s*(dias|semanas))\b/gi,
    nome: 'emagreça X kg em Y dias',
    motivo: 'Publicidade abusiva com promessa de perda ponderal rápida.',
    categoria: 'promessa_resultado',
  },
]

export const TEXTO_RODAPE_OBRIGATORIO_PADRAO = `Adriana Araújo — Nutricionista CRN-9 28762`

/**
 * Remove tags HTML simples para analisar apenas o texto corrido
 */
export function extrairTextoPuro(htmlOuTexto: string): string {
  if (!htmlOuTexto) return ''
  return htmlOuTexto
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Executa a análise determinística sobre título, conteúdo e resumo.
 */
export function executarFiltroCompliance(
  titulo: string,
  conteudoHtml: string,
  resumo?: string,
): ComplianceResult {
  const textoPuro = [titulo, extrairTextoPuro(conteudoHtml), resumo || ''].join(' ')
  const violacoes: TermoViolacao[] = []

  for (const item of DICIONARIO_TERMOS_PROIBIDOS) {
    const matches = [...textoPuro.matchAll(item.padrao)]
    if (matches.length > 0) {
      violacoes.push({
        termo: item.nome,
        motivo: item.motivo,
        categoria: item.categoria,
        posicoes: matches.map((m) => m.index || 0),
      })
    }
  }

  // Verifica menção à identificação profissional obrigatória no corpo do artigo
  const conteudoLower = (conteudoHtml || '').toLowerCase()
  const temCRN =
    conteudoLower.includes('crn-9 28762') ||
    conteudoLower.includes('crn 9 28762') ||
    conteudoLower.includes('28762')
  const temNome = conteudoLower.includes('adriana') && conteudoLower.includes('ara')
  const temRodapeObrigatorio = temCRN && temNome

  return {
    valido: violacoes.length === 0,
    violacoes,
    totalViolacoes: violacoes.length,
    temRodapeObrigatorio,
    rodapeCheckTexto: temRodapeObrigatorio
      ? 'Identificação profissional presente (Adriana Araújo • CRN-9 28762)'
      : 'Artigo requer rodapé do Art. 55 com "Adriana Araújo — Nutricionista CRN-9 28762"',
  }
}
